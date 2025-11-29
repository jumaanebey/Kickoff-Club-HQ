'use server'

import { createServerClient } from '@/database/supabase/server'
import { revalidatePath } from 'next/cache'

export interface DailyMission {
    id: string
    type: 'play_match' | 'train_unit' | 'complete_lesson' | 'earn_coins'
    description: string
    target_count: number
    current_progress: number
    reward_coins: number
    reward_xp: number
    is_claimed: boolean
    expires_at: string
}

const MISSION_TYPES = [
    { type: 'play_match', desc: 'Play Matches', min: 1, max: 3, coinPerUnit: 100, xpPerUnit: 50 },
    { type: 'train_unit', desc: 'Train Units', min: 1, max: 5, coinPerUnit: 50, xpPerUnit: 25 },
    { type: 'earn_coins', desc: 'Earn Coins from Matches', min: 500, max: 2000, coinPerUnit: 0.1, xpPerUnit: 0.05 }, // Special handling
]

export async function getDailyMissions() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Not authenticated" }

    // 1. Check for existing active missions
    const now = new Date().toISOString()
    const { data: existingMissions } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', now)
        .order('is_claimed', { ascending: true })

    if (existingMissions && existingMissions.length > 0) {
        return { success: true, data: existingMissions as DailyMission[] }
    }

    // 2. Generate new missions if none exist
    // Set expiration to next midnight
    const tomorrow = new Date()
    tomorrow.setHours(24, 0, 0, 0)

    const newMissions = []

    // Generate 3 random missions
    for (let i = 0; i < 3; i++) {
        const template = MISSION_TYPES[i % MISSION_TYPES.length] // Ensure variety
        const target = Math.floor(Math.random() * (template.max - template.min + 1)) + template.min

        // Round 'earn_coins' to nearest 100
        const finalTarget = template.type === 'earn_coins' ? Math.ceil(target / 100) * 100 : target

        const rewardCoins = Math.floor(finalTarget * template.coinPerUnit)
        const rewardXp = Math.floor(finalTarget * template.xpPerUnit)

        newMissions.push({
            user_id: user.id,
            type: template.type,
            description: `${template.desc}`,
            target_count: finalTarget,
            current_progress: 0,
            reward_coins: rewardCoins,
            reward_xp: rewardXp,
            expires_at: tomorrow.toISOString()
        })
    }

    const { data: createdMissions, error } = await supabase
        .from('daily_missions')
        .insert(newMissions)
        .select()

    if (error) {
        console.error("Error creating missions:", error)
        return { success: false, error: "Failed to generate missions" }
    }

    return { success: true, data: createdMissions as DailyMission[] }
}

export async function claimMissionReward(missionId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: "Not authenticated" }

    // 1. Get Mission
    const { data: mission, error: fetchError } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('id', missionId)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !mission) return { success: false, error: "Mission not found" }
    if (mission.is_claimed) return { success: false, error: "Already claimed" }
    if (mission.current_progress < mission.target_count) return { success: false, error: "Mission not complete" }

    // 2. Update Mission Status
    const { error: updateMissionError } = await supabase
        .from('daily_missions')
        .update({ is_claimed: true })
        .eq('id', missionId)

    if (updateMissionError) return { success: false, error: "Failed to update mission" }

    // 3. Award Rewards
    // Fetch current HQ stats first to ensure atomic-like update (or use RPC if available, but simple update is fine for now)
    const { data: hq } = await supabase.from('user_hq').select('coins, xp').eq('user_id', user.id).single()

    if (hq) {
        await supabase.from('user_hq').update({
            coins: (hq.coins || 0) + mission.reward_coins,
            xp: (hq.xp || 0) + mission.reward_xp
        }).eq('user_id', user.id)
    }

    revalidatePath('/dashboard')
    revalidatePath('/hq')

    return { success: true, rewards: { coins: mission.reward_coins, xp: mission.reward_xp } }
}

// Helper to update progress (to be called from other actions)
export async function updateMissionProgress(userId: string, type: string, amount: number = 1) {
    const supabase = await createServerClient()

    // Find active missions of this type
    const now = new Date().toISOString()
    const { data: missions } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .eq('is_claimed', false)
        .gt('expires_at', now)

    if (!missions || missions.length === 0) return

    for (const mission of missions) {
        const newProgress = Math.min(mission.current_progress + amount, mission.target_count)
        if (newProgress !== mission.current_progress) {
            await supabase
                .from('daily_missions')
                .update({ current_progress: newProgress })
                .eq('id', mission.id)
        }
    }
}
