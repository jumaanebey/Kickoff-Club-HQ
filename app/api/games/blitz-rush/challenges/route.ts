import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit'

// Challenge templates — deterministic by date seed
const CHALLENGE_TEMPLATES = [
  { type: 'score', title: 'Score Blitz', description: 'Score {target} points in a single run', targets: [500, 1000, 2000, 3000, 5000], rewards: [50, 100, 150, 200, 300] },
  { type: 'distance', title: 'Distance Runner', description: 'Run {target} meters in a single run', targets: [100, 200, 400, 600, 1000], rewards: [50, 100, 150, 200, 300] },
  { type: 'coins', title: 'Coin Collector', description: 'Collect {target} coins in a single run', targets: [20, 40, 60, 80, 100], rewards: [50, 100, 150, 200, 300] },
  { type: 'near_miss_chain', title: 'Near Miss Master', description: 'Chain {target} near misses in a single run', targets: [3, 5, 7, 10, 15], rewards: [75, 125, 200, 300, 500] },
  { type: 'combo', title: 'Combo King', description: 'Reach a {target}x combo in a single run', targets: [5, 10, 15, 20, 25], rewards: [50, 100, 175, 250, 400] },
  { type: 'fever_activations', title: 'Fever Frenzy', description: 'Activate Fever Mode {target} time(s) in a single run', targets: [1, 2, 3, 4, 5], rewards: [75, 150, 225, 350, 500] },
]

// Deterministic daily challenge from date
function getDailyChallengeTemplate(date: Date) {
  const dateStr = date.toISOString().split('T')[0]
  // Simple hash from date string
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0
  }
  hash = Math.abs(hash)

  const templateIndex = hash % CHALLENGE_TEMPLATES.length
  const template = CHALLENGE_TEMPLATES[templateIndex]

  // Pick difficulty based on day of week (harder on weekends)
  const dayOfWeek = date.getDay()
  const difficultyIndex = dayOfWeek === 0 || dayOfWeek === 6
    ? Math.min(3, (hash >> 8) % template.targets.length) // Weekend: harder
    : Math.min(2, (hash >> 8) % template.targets.length) // Weekday: easier

  const target = template.targets[difficultyIndex]
  const reward = template.rewards[difficultyIndex]

  return {
    challenge_date: dateStr,
    challenge_type: template.type,
    title: template.title,
    description: template.description.replace('{target}', String(target)),
    target_value: target,
    reward_coins: reward,
  }
}

// GET: Get today's daily challenge
export async function GET(request: NextRequest) {
  const ip = getClientIP(request)
  const rateCheck = checkRateLimit(`blitz-rush-challenge:${ip}`, { windowMs: 60000, maxRequests: 30 })
  if (!rateCheck.success) return rateLimitResponse(rateCheck)

  try {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]

    // Try to fetch from DB first
    const { data: existing } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('challenge_date', dateStr)
      .limit(1)

    let challenge
    if (existing && existing.length > 0) {
      challenge = existing[0]
    } else {
      // Generate and insert
      const template = getDailyChallengeTemplate(today)
      const { data: inserted, error } = await supabase
        .from('daily_challenges')
        .insert(template as any)
        .select()

      if (error) {
        // May already exist from another request — try fetching again
        const { data: retry } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('challenge_date', dateStr)
          .limit(1)

        challenge = retry?.[0] || template
      } else {
        challenge = inserted?.[0] || template
      }
    }

    // Get user's progress if authenticated
    let userProgress = null
    const { data: { user } } = await supabase.auth.getUser()
    if (user && challenge && (challenge as any).id) {
      const { data: completion } = await supabase
        .from('user_challenge_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', (challenge as any).id)
        .limit(1)

      userProgress = completion?.[0] || { progress: 0, completed: false, reward_claimed: false }
    }

    return NextResponse.json(
      { challenge, userProgress },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Challenge fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Update challenge progress or claim reward
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(`blitz-rush-challenge:${ip}`, { windowMs: 60000, maxRequests: 20 })
    if (!rateCheck.success) return rateLimitResponse(rateCheck)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId, progress, claimReward } = body

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID required' }, { status: 400 })
    }

    // Fetch the challenge
    const { data: challenge } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('id', challengeId)
      .limit(1)

    if (!challenge || challenge.length === 0) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const ch = challenge[0] as any

    if (claimReward) {
      // Claim reward
      const { data: completion } = await supabase
        .from('user_challenge_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .limit(1)

      const comp = completion?.[0] as any
      if (!comp || !comp.completed || comp.reward_claimed) {
        return NextResponse.json({ error: 'Cannot claim reward' }, { status: 400 })
      }

      // Mark reward as claimed
      await (supabase
        .from('user_challenge_completions') as any)
        .update({ reward_claimed: true })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)

      return NextResponse.json({ success: true, coinsAwarded: ch.reward_coins })
    }

    // Update progress
    if (typeof progress !== 'number' || progress < 0) {
      return NextResponse.json({ error: 'Invalid progress' }, { status: 400 })
    }

    const completed = progress >= ch.target_value

    await supabase
      .from('user_challenge_completions')
      .upsert({
        user_id: user.id,
        challenge_id: challengeId,
        progress: Math.min(progress, ch.target_value),
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      } as any, { onConflict: 'user_id,challenge_id' })

    return NextResponse.json({ success: true, completed, progress: Math.min(progress, ch.target_value) })
  } catch (error) {
    console.error('Challenge update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
