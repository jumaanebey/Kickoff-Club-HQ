import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/database/supabase'
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit'

const GAME_ID = 'blitz-rush-3d'

// Anti-cheat: sanity check score/distance ratio
function isScorePlausible(score: number, distance: number, coins: number): boolean {
  if (score < 0 || distance < 0 || coins < 0) return false
  if (score > 1_000_000) return false
  if (distance > 0 && score / distance > 200) return false // Max ~200 score per meter
  if (coins > distance * 5) return false // Max ~5 coins per meter
  return true
}

// POST: Submit a score
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(`blitz-rush-score:${ip}`, { windowMs: 60000, maxRequests: 10 })
    if (!rateCheck.success) return rateLimitResponse(rateCheck)

    const body = await request.json()
    const { score, coins, distance } = body

    if (typeof score !== 'number' || typeof distance !== 'number') {
      return NextResponse.json({ error: 'Invalid score data' }, { status: 400 })
    }

    if (!isScorePlausible(score, distance, coins || 0)) {
      return NextResponse.json({ error: 'Score rejected' }, { status: 400 })
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Anonymous — just acknowledge, score saved client-side only
      return NextResponse.json({ success: true, rank: null, saved: false })
    }

    // Insert score
    const { error: insertError } = await supabase
      .from('game_scores')
      .insert({
        user_id: user.id,
        game_id: GAME_ID,
        score: Math.floor(score),
        played_at: new Date().toISOString(),
      } as any)

    if (insertError) {
      console.error('Score insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
    }

    // Get rank
    const { count } = await supabase
      .from('game_scores')
      .select('id', { count: 'exact', head: true })
      .eq('game_id', GAME_ID)
      .gt('score', Math.floor(score))

    return NextResponse.json({
      success: true,
      rank: (count ?? 0) + 1,
      saved: true,
    })
  } catch (error) {
    console.error('Score submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET: Fetch leaderboard
export async function GET(request: NextRequest) {
  const ip = getClientIP(request)
  const rateCheck = checkRateLimit(`blitz-rush-score:${ip}`, { windowMs: 60000, maxRequests: 30 })
  if (!rateCheck.success) return rateLimitResponse(rateCheck)

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'alltime' // daily | weekly | alltime
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    let query = supabase
      .from('game_scores')
      .select('id, user_id, score, played_at')
      .eq('game_id', GAME_ID)
      .order('score', { ascending: false })
      .limit(limit)

    // Date filter for period
    if (period === 'daily') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('played_at', today.toISOString())
    } else if (period === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      query = query.gte('played_at', weekAgo.toISOString())
    }

    const { data: scores, error } = await query

    if (error) {
      console.error('Leaderboard fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    // Cast scores to usable type
    const typedScores = (scores || []) as Array<{ id: string; user_id: string; score: number; played_at: string }>

    // Get unique user IDs for profile lookup
    const userIdSet = new Set<string>()
    typedScores.forEach(s => userIdSet.add(s.user_id))
    const userIds: string[] = []
    userIdSet.forEach(id => userIds.push(id))

    let profiles: Record<string, { display_name?: string; avatar_url?: string }> = {}
    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', userIds)

      if (profileData) {
        for (const p of profileData) {
          const profile = p as any
          profiles[profile.id] = {
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
          }
        }
      }
    }

    // Build leaderboard entries
    const leaderboard = typedScores.map((s, i) => ({
      rank: i + 1,
      score: s.score,
      playedAt: s.played_at,
      userId: s.user_id,
      displayName: profiles[s.user_id]?.display_name || 'Anonymous',
      avatarUrl: profiles[s.user_id]?.avatar_url || null,
    }))

    // Get current user rank if authenticated
    let myRank: number | null = null
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const myBest = leaderboard.find(e => e.userId === user.id)
      if (myBest) {
        myRank = myBest.rank
      } else {
        // Count how many scores are above user's best
        let bestQuery = supabase
          .from('game_scores')
          .select('score')
          .eq('game_id', GAME_ID)
          .eq('user_id', user.id)
          .order('score', { ascending: false })
          .limit(1)

        if (period === 'daily') {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          bestQuery = bestQuery.gte('played_at', today.toISOString())
        } else if (period === 'weekly') {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          weekAgo.setHours(0, 0, 0, 0)
          bestQuery = bestQuery.gte('played_at', weekAgo.toISOString())
        }

        const { data: myBestData } = await bestQuery
        if (myBestData && myBestData.length > 0) {
          const { count } = await supabase
            .from('game_scores')
            .select('id', { count: 'exact', head: true })
            .eq('game_id', GAME_ID)
            .gt('score', (myBestData[0] as any).score)
          myRank = (count ?? 0) + 1
        }
      }
    }

    return NextResponse.json(
      { leaderboard, myRank, period },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
