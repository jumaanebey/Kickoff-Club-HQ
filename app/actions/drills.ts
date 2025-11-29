'use server'

import { createServerClient } from '@/database/supabase/server'
import { revalidatePath } from 'next/cache'

export interface DrillSlot {
    id?: string
    slot_index: number
    drill_type?: string
    start_time?: string
    end_time?: string
    status?: 'active' | 'completed'
    is_reward_claimed?: boolean
}

export const DRILL_TYPES = {
    speed_ladder: { name: 'Speed Ladder', duration: 60, xp: 10, coins: 5, icon: 'Zap' }, // 1 min
    bench_press: { name: 'Bench Press', duration: 300, xp: 50, coins: 25, icon: 'Dumbbell' }, // 5 mins
    film_study: { name: 'Film Study', duration: 900, xp: 150, coins: 75, icon: 'Video' }, // 15 mins
};

export async function getUserDrills() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Not authenticated" }

    const { data: drills } = await supabase
        .from('user_drills')
        .select('*')
        .eq('user_id', user.id)
        .order('slot_index', { ascending: true })

    // Merge with empty slots (0-8)
    const slots: DrillSlot[] = Array.from({ length: 9 }).map((_, i) => {
        const existing = drills?.find(d => d.slot_index === i)
        if (existing) return existing
        return { slot_index: i }
    })

    return { success: true, data: slots }
}

export async function startDrill(slotIndex: number, drillType: keyof typeof DRILL_TYPES) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Not authenticated" }

    const drillConfig = DRILL_TYPES[drillType];
    if (!drillConfig) return { success: false, error: "Invalid drill type" }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + drillConfig.duration * 1000);

    // Upsert to handle restarting a slot if needed (though UI should prevent it)
    const { error } = await supabase
        .from('user_drills')
        .upsert({
            user_id: user.id,
            slot_index: slotIndex,
            drill_type: drillType,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            status: 'active',
            is_reward_claimed: false
        }, { onConflict: 'user_id, slot_index' })

    if (error) {
        console.error("Start drill error:", error)
        return { success: false, error: "Failed to start drill" }
    }

    // Trigger mission update for "Train Units" (drills count as training)
    try {
        const { updateMissionProgress } = await import('./missions');
        await updateMissionProgress(user.id, 'train_unit', 1);
    } catch (e) {
        console.error("Mission update failed", e);
    }

    revalidatePath('/hq')
    return { success: true }
}

export async function collectDrillReward(slotIndex: number) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Not authenticated" }

    // 1. Get Drill
    const { data: drill } = await supabase
        .from('user_drills')
        .select('*')
        .eq('user_id', user.id)
        .eq('slot_index', slotIndex)
        .single()

    if (!drill) return { success: false, error: "Drill not found" }

    // Check if completed
    if (new Date() < new Date(drill.end_time)) return { success: false, error: "Drill not finished yet" }

    const drillConfig = DRILL_TYPES[drill.drill_type as keyof typeof DRILL_TYPES];

    // 2. Award Rewards
    const { data: hq } = await supabase.from('user_hq').select('coins, xp').eq('user_id', user.id).single()

    if (hq) {
        await supabase.from('user_hq').update({
            coins: (hq.coins || 0) + drillConfig.coins,
            xp: (hq.xp || 0) + drillConfig.xp
        }).eq('user_id', user.id)
    }

    // 3. Clear Slot (Delete the row)
    // Alternatively, we could mark as claimed and keep history, but for "FarmVille" slots, clearing is usually better
    const { error: deleteError } = await supabase
        .from('user_drills')
        .delete()
        .eq('id', drill.id)

    if (deleteError) return { success: false, error: "Failed to clear slot" }

    revalidatePath('/hq')
    return { success: true, rewards: { coins: drillConfig.coins, xp: drillConfig.xp } }
}
