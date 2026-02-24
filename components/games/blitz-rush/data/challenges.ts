// Expanded challenge templates for Blitz Rush
// Used both client-side (for display) and referenced by the API route

export interface ChallengeTemplate {
  type: string
  title: string
  description: string
  /** Multiple difficulty tiers — index chosen by date seed */
  targets: number[]
  rewards: number[]
  /** XP reward multiplier (base XP = reward_coins / 2) */
  xpMultiplier: number
  icon: string
}

export const DAILY_CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // Original 6
  { type: 'score', title: 'Score Blitz', description: 'Score {target} points in a single run', targets: [500, 1000, 2000, 3000, 5000], rewards: [50, 100, 150, 200, 300], xpMultiplier: 1, icon: '🏆' },
  { type: 'distance', title: 'Distance Runner', description: 'Run {target} meters in a single run', targets: [100, 200, 400, 600, 1000], rewards: [50, 100, 150, 200, 300], xpMultiplier: 1, icon: '🏃' },
  { type: 'coins', title: 'Coin Collector', description: 'Collect {target} coins in a single run', targets: [20, 40, 60, 80, 100], rewards: [50, 100, 150, 200, 300], xpMultiplier: 1, icon: '🪙' },
  { type: 'near_miss_chain', title: 'Near Miss Master', description: 'Chain {target} near misses in a single run', targets: [3, 5, 7, 10, 15], rewards: [75, 125, 200, 300, 500], xpMultiplier: 1.5, icon: '💨' },
  { type: 'combo', title: 'Combo King', description: 'Reach a {target}x combo in a single run', targets: [5, 10, 15, 20, 25], rewards: [50, 100, 175, 250, 400], xpMultiplier: 1, icon: '🔗' },
  { type: 'fever_activations', title: 'Fever Frenzy', description: 'Activate Fever Mode {target} time(s) in a single run', targets: [1, 2, 3, 4, 5], rewards: [75, 150, 225, 350, 500], xpMultiplier: 1.5, icon: '🔥' },

  // New additions
  { type: 'powerups', title: 'Power Play', description: 'Collect {target} power-ups in a single run', targets: [2, 3, 5, 7, 10], rewards: [50, 75, 125, 200, 300], xpMultiplier: 1, icon: '⚡' },
  { type: 'no_hit_distance', title: 'Untouched', description: 'Run {target}m without hitting an obstacle', targets: [50, 100, 200, 350, 500], rewards: [75, 125, 200, 300, 500], xpMultiplier: 1.5, icon: '🛡️' },
  { type: 'coins_no_magnet', title: 'Manual Labor', description: 'Collect {target} coins without using a magnet', targets: [15, 30, 50, 75, 100], rewards: [50, 100, 175, 275, 400], xpMultiplier: 1, icon: '🤲' },
  { type: 'speed_survive', title: 'Speed Demon', description: 'Survive {target} seconds at max speed', targets: [5, 10, 15, 20, 30], rewards: [75, 125, 200, 300, 500], xpMultiplier: 1.5, icon: '💨' },
  { type: 'triple_fever', title: 'Triple Threat', description: 'Activate Fever Mode 3 times total across runs today', targets: [3, 3, 3, 3, 3], rewards: [100, 100, 100, 100, 100], xpMultiplier: 2, icon: '🔥' },
  { type: 'cumulative_score', title: 'Day\'s Work', description: 'Score {target} total points across all runs today', targets: [1000, 2000, 5000, 8000, 15000], rewards: [75, 125, 200, 350, 500], xpMultiplier: 1, icon: '📊' },
  { type: 'games_played', title: 'Warm Up', description: 'Play {target} games today', targets: [3, 5, 7, 10, 15], rewards: [50, 75, 100, 150, 250], xpMultiplier: 1, icon: '🎮' },
  { type: 'quiz_correct', title: 'Brain Game', description: 'Answer {target} trivia questions correctly today', targets: [1, 2, 3, 5, 7], rewards: [50, 100, 150, 250, 400], xpMultiplier: 1.5, icon: '🧠' },
  { type: 'terms_discovered', title: 'Word Hunter', description: 'Discover {target} new football terms today', targets: [2, 3, 5, 7, 10], rewards: [50, 75, 125, 200, 300], xpMultiplier: 1.5, icon: '📖' },
]

// Weekly challenges (harder, better rewards)
export const WEEKLY_CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  { type: 'weekly_score', title: 'Weekly Grind', description: 'Score {target} total points this week', targets: [5000, 10000, 20000, 35000, 50000], rewards: [200, 400, 750, 1000, 1500], xpMultiplier: 2, icon: '📅' },
  { type: 'weekly_games', title: 'Dedicated Player', description: 'Play {target} games this week', targets: [10, 20, 30, 40, 50], rewards: [150, 300, 500, 750, 1000], xpMultiplier: 2, icon: '🏟️' },
  { type: 'weekly_trivia', title: 'Weekly Scholar', description: 'Answer {target} trivia questions correctly this week', targets: [5, 10, 15, 20, 30], rewards: [150, 300, 500, 750, 1000], xpMultiplier: 2, icon: '🎓' },
  { type: 'weekly_streak', title: 'Perfect Week', description: 'Play every day for {target} days this week', targets: [3, 4, 5, 6, 7], rewards: [150, 250, 400, 600, 1000], xpMultiplier: 2.5, icon: '🔥' },
]

export function getChallengeXP(template: ChallengeTemplate, difficultyIndex: number): number {
  const baseXP = Math.floor(template.rewards[difficultyIndex] / 2)
  return Math.floor(baseXP * template.xpMultiplier)
}
