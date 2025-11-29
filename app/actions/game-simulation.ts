'use server'

import { createServerClient } from '@/database/supabase/server'
import { revalidatePath } from 'next/cache'

interface MatchResult {
    won: boolean
    userScore: number
    opponentScore: number
    rewards: {
        coins: number
        xp: number
    }
    matchLog: string[]
}

export async function simulateMatch(): Promise<{ success: boolean; data?: MatchResult; error?: string }> {
    const supabase = await createServerClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Not authenticated" }

    // 2. Get HQ Data (Buildings & Units)
    const { data: hq, error: hqError } = await supabase
        .from('user_hq')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (hqError || !hq) return { success: false, error: "HQ not found" }

    // 3. Check Energy
    const currentEnergy = hq.energy || 100 // Default to 100 if null
    const MATCH_COST = 10

    if (currentEnergy < MATCH_COST) {
        return { success: false, error: "Not enough energy! Rest at the Medical Center." }
    }

    // 4. Calculate Team Rating (OVR)
    // Base rating from building levels
    const stadiumPower = (hq.stadium_level || 1) * 2
    const practicePower = (hq.practice_field_level || 1) * 5
    const weightRoomPower = (hq.weight_room_level || 1) * 3

    // Unit Power Calculation
    const units = (hq.units as any) || {};

    // Helper to safely get level
    const getLvl = (key: string) => units[key]?.level || 1;

    // Offense: QB is weighted heavily (x3), Skill positions (x2), OL (x2)
    const qbPower = getLvl('qb') * 30;
    const skillPower = (getLvl('rb') + getLvl('wr') + getLvl('te')) * 20 / 3; // Average of skills
    const olPower = getLvl('ol') * 20;

    const offensePower = qbPower + skillPower + olPower + practicePower;

    // Defense: DL (x2), LB (x2), DB (x2)
    const dlPower = getLvl('dl') * 20;
    const lbPower = getLvl('lb') * 20;
    const dbPower = getLvl('db') * 20;

    const defensePower = dlPower + lbPower + dbPower + weightRoomPower;

    // Special Teams: K + P
    const kPower = getLvl('k') * 15;
    const pPower = getLvl('p') * 10;

    const specialPower = kPower + pPower + stadiumPower;

    const userOvr = Math.floor((offensePower + defensePower + specialPower) / 30); // Normalize to roughly 0-100 scale based on weights

    // 5. Generate Opponent
    // Opponent is randomized based on user's OVR
    // Variance increases with level
    const variance = Math.max(5, Math.floor(userOvr * 0.1));
    const opponentOvr = userOvr + (Math.floor(Math.random() * (variance * 2)) - variance);

    // 6. Simulate Match (Weighted Auto-Battler)
    // We simulate 4 quarters
    let userScore = 0;
    let opponentScore = 0;
    const matchLog: string[] = [`Kickoff! Team OVR: ${userOvr} vs ${opponentOvr}`];

    for (let q = 1; q <= 4; q++) {
        // Quarter Logic
        // Offense vs Defense check
        const userOffenseRoll = Math.random() * offensePower;
        const oppDefenseRoll = Math.random() * (opponentOvr * 0.4); // Approx defense portion

        const oppOffenseRoll = Math.random() * (opponentOvr * 0.4);
        const userDefenseRoll = Math.random() * defensePower;

        // User Scoring Opportunity
        if (userOffenseRoll > oppDefenseRoll) {
            const points = Math.random() > 0.7 ? 7 : 3; // TD or FG
            userScore += points;
            matchLog.push(`Q${q}: You scored a ${points === 7 ? "Touchdown" : "Field Goal"}!`);
        }

        // Opponent Scoring Opportunity
        if (oppOffenseRoll > userDefenseRoll) {
            const points = Math.random() > 0.7 ? 7 : 3;
            opponentScore += points;
            matchLog.push(`Q${q}: Opponent scored a ${points === 7 ? "Touchdown" : "Field Goal"}.`);
        }
    }

    const won = userScore > opponentScore;
    if (userScore === opponentScore) {
        // Overtime - Coin flip for now
        if (specialPower > (opponentOvr * 0.2)) {
            userScore += 3;
            matchLog.push("OT: Your Special Teams won the game with a Field Goal!");
        } else {
            opponentScore += 3;
            matchLog.push("OT: Opponent won in Overtime.");
        }
    }

    const finalWon = userScore > opponentScore;

    // 7. Calculate Rewards
    // Base rewards + Performance bonus
    const coinsReward = finalWon ? (100 + (userScore * 2)) : (25 + userScore);
    const xpReward = finalWon ? (50 + (userScore)) : (10 + Math.floor(userScore / 2));

    // 8. Update Database
    const { error: updateError } = await supabase
        .from('user_hq')
        .update({
            coins: (hq.coins || 0) + coinsReward,
            xp: (hq.xp || 0) + xpReward,
            energy: currentEnergy - MATCH_COST,
        })
        .eq('user_id', user.id)

    if (updateError) return { success: false, error: "Failed to save match results" }

    // 9. Update Mission Progress
    // We use a try-catch to ensure mission updates don't fail the match result
    try {
        const { updateMissionProgress } = await import('./missions');
        await updateMissionProgress(user.id, 'play_match', 1);
        if (coinsReward > 0) {
            await updateMissionProgress(user.id, 'earn_coins', coinsReward);
        }
    } catch (e) {
        console.error("Failed to update missions:", e);
    }

    revalidatePath('/hq')

    return {
        success: true,
        data: {
            won: finalWon,
            userScore,
            opponentScore,
            rewards: {
                coins: coinsReward,
                xp: xpReward
            },
            matchLog
        }
    }
}
