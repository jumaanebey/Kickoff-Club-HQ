'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/database/supabase/server'

export async function getHqData() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Try to fetch existing HQ
    let { data: hq, error } = await supabase
        .from('user_hq')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code === 'PGRST116') {
        // Not found, create default
        const { data: newHq, error: createError } = await supabase
            .from('user_hq')
            .insert({
                user_id: user.id,
                stadium_level: 1,
                film_room_level: 1,
                weight_room_level: 1,
                practice_field_level: 1,
                headquarters_level: 1,
                medical_center_level: 1,
                scouting_office_level: 1,
                coins: 2500, // Starting bonus
                xp: 0,
                energy: 100, // Full energy
                last_energy_update: new Date().toISOString(),
                units: {
                    ol: { count: 5, level: 1, status: 'idle' },
                    qb: { count: 1, level: 1, status: 'idle' },
                    rb: { count: 2, level: 1, status: 'idle' },
                    wr: { count: 3, level: 1, status: 'idle' },
                    te: { count: 1, level: 1, status: 'idle' },
                    dl: { count: 4, level: 1, status: 'idle' },
                    lb: { count: 3, level: 1, status: 'idle' },
                    db: { count: 4, level: 1, status: 'idle' },
                    k: { count: 1, level: 1, status: 'idle' },
                    p: { count: 1, level: 1, status: 'idle' }
                },
                decor_slots: [] // Initialize as empty array
            })
            .select()
            .single()

        if (createError) {
            console.error('Error creating HQ:', createError)
            return null
        }
        hq = newHq
    } else if (error) {
        console.error('Error fetching HQ:', error)
        return null
    }

    return hq
}

export async function upgradeBuilding(buildingKey: string, cost: number) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Fetch current state to verify coins
    const { data: hq, error: fetchError } = await supabase
        .from('user_hq')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (fetchError || !hq) {
        return { success: false, error: 'HQ not found' }
    }

    if ((hq.coins || 0) < cost) {
        return { success: false, error: 'Insufficient coins' }
    }

    // Determine the column to update
    const columnMap: Record<string, string> = {
        stadium: 'stadium_level',
        film_room: 'film_room_level',
        weight_room: 'weight_room_level',
        practice_field: 'practice_field_level',
        headquarters: 'headquarters_level',
        medical_center: 'medical_center_level',
        scouting_office: 'scouting_office_level'
    }

    const column = columnMap[buildingKey]
    if (!column) {
        return { success: false, error: 'Invalid building type' }
    }

    const currentLevel = hq[column]
    if (currentLevel >= 5) {
        return { success: false, error: 'Already max level' }
    }

    // Perform update
    const { error: updateError } = await supabase
        .from('user_hq')
        .update({
            [column]: currentLevel + 1,
            coins: (hq.coins || 0) - cost
        })
        .eq('user_id', user.id)

    if (updateError) {
        console.error('Update error:', updateError)
        return { success: false, error: 'Update failed' }
    }

    revalidatePath('/hq')
    return { success: true }
}

export async function purchaseDecor(decorId: string, cost: number) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: hq } = await supabase
        .from('user_hq')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!hq) return { success: false, error: 'HQ not found' }
    if ((hq.coins || 0) < cost) return { success: false, error: 'Insufficient coins' }

    // Check if already owned
    // Handle case where decor_slots might be null or not an array
    let currentDecor: string[] = []
    if (Array.isArray(hq.decor_slots)) {
        currentDecor = hq.decor_slots.map(String)
    }

    if (currentDecor.includes(decorId)) {
        return { success: false, error: 'Already owned' }
    }

    const newDecor = [...currentDecor, decorId]

    const { error } = await supabase
        .from('user_hq')
        .update({
            coins: (hq.coins || 0) - cost,
            decor_slots: newDecor
        })
        .eq('user_id', user.id)

    if (error) {
        console.error('Purchase decor error:', error)
        return { success: false, error: 'Purchase failed' }
    }

    revalidatePath('/hq')
    return { success: true }
}

export async function trainUnit(unitKey: string, cost: number) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }

    const { data: hq } = await supabase
        .from('user_hq')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!hq) return { success: false, error: 'HQ not found' }
    if ((hq.coins || 0) < cost) return { success: false, error: 'Insufficient coins' }

    const units = hq.units as Record<string, any>
    const unit = units[unitKey]

    if (!unit) return { success: false, error: 'Unit not found' }
    if (unit.status === 'training') return { success: false, error: 'Unit already training' }

    // Update unit state
    const updatedUnits = {
        ...units,
        [unitKey]: {
            ...unit,
            level: unit.level + 1,
            status: 'idle' // For now, instant training. Later: 'training' with a timer.
        }
    }

    const { error } = await supabase
        .from('user_hq')
        .update({
            coins: (hq.coins || 0) - cost,
            units: updatedUnits
        })
        .eq('user_id', user.id)

    if (error) {
        console.error('Train unit error:', error)
        return { success: false, error: 'Training failed' }
    }

    revalidatePath('/hq')
    return { success: true }
}
