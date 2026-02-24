// Blitz Rush achievements — client-side definitions
// These map to rows in the `achievements` table via achievement_type slug

export type AchievementCategory =
  | 'score'
  | 'distance'
  | 'coins'
  | 'near_miss'
  | 'fever'
  | 'education'
  | 'streak'
  | 'special'

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface AchievementDef {
  id: string          // Matches achievement_type slug in DB
  name: string
  description: string
  icon: string        // Emoji icon for display
  category: AchievementCategory
  rarity: AchievementRarity
  xpReward: number
  /** The threshold value that must be met (e.g. score of 500) */
  threshold: number
  /** Human-readable hint for how to unlock */
  hint: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ===== SCORE =====
  { id: 'blitz_rookie', name: 'Blitz Rookie', description: 'Score 500 points', icon: '🏈', category: 'score', rarity: 'common', xpReward: 25, threshold: 500, hint: 'Keep dodging obstacles to rack up points' },
  { id: 'blitz_starter', name: 'Blitz Starter', description: 'Score 1,000 points', icon: '🏈', category: 'score', rarity: 'common', xpReward: 50, threshold: 1000, hint: 'Chain near misses to boost your score multiplier' },
  { id: 'blitz_pro', name: 'Blitz Pro', description: 'Score 2,500 points', icon: '🔥', category: 'score', rarity: 'rare', xpReward: 100, threshold: 2500, hint: 'Activate Fever Mode for massive score boosts' },
  { id: 'blitz_allstar', name: 'Blitz All-Star', description: 'Score 5,000 points', icon: '⭐', category: 'score', rarity: 'rare', xpReward: 200, threshold: 5000, hint: 'Master lane switching and combo chains' },
  { id: 'blitz_mvp', name: 'Blitz MVP', description: 'Score 10,000 points', icon: '🏆', category: 'score', rarity: 'epic', xpReward: 400, threshold: 10000, hint: 'Consistent near-miss chains are key to high scores' },
  { id: 'blitz_legend', name: 'Blitz Legend', description: 'Score 25,000 points', icon: '👑', category: 'score', rarity: 'epic', xpReward: 750, threshold: 25000, hint: 'Only the best of the best reach this level' },
  { id: 'blitz_goat', name: 'The GOAT', description: 'Score 50,000 points', icon: '🐐', category: 'score', rarity: 'legendary', xpReward: 1500, threshold: 50000, hint: 'Achieve perfection across an entire run' },

  // ===== DISTANCE =====
  { id: 'first_100m', name: 'First Hundred', description: 'Run 100 meters', icon: '👟', category: 'distance', rarity: 'common', xpReward: 25, threshold: 100, hint: 'Just keep running!' },
  { id: 'quarter_mile', name: 'Quarter Mile', description: 'Run 400 meters', icon: '🏃', category: 'distance', rarity: 'common', xpReward: 50, threshold: 400, hint: 'Stay focused as the speed picks up' },
  { id: 'half_mile', name: 'Half Mile', description: 'Run 800 meters', icon: '🏃‍♂️', category: 'distance', rarity: 'rare', xpReward: 100, threshold: 800, hint: 'Speed increases — stay sharp with lane switches' },
  { id: 'miler', name: 'The Miler', description: 'Run 1,600 meters', icon: '🥇', category: 'distance', rarity: 'epic', xpReward: 300, threshold: 1600, hint: 'Use shields wisely to survive the hardest sections' },
  { id: 'marathon_man', name: 'Marathon Runner', description: 'Run 3,000 meters', icon: '🏅', category: 'distance', rarity: 'legendary', xpReward: 1000, threshold: 3000, hint: 'An incredible feat of endurance and skill' },

  // ===== COINS =====
  { id: 'coin_starter', name: 'Pocket Change', description: 'Collect 50 coins in one run', icon: '🪙', category: 'coins', rarity: 'common', xpReward: 25, threshold: 50, hint: 'Follow coin trails for easy pickups' },
  { id: 'coin_collector', name: 'Coin Collector', description: 'Collect 100 coins in one run', icon: '💰', category: 'coins', rarity: 'common', xpReward: 50, threshold: 100, hint: 'Magnet power-up grabs nearby coins automatically' },
  { id: 'coin_hoarder', name: 'Coin Hoarder', description: 'Collect 250 coins in one run', icon: '🤑', category: 'coins', rarity: 'rare', xpReward: 150, threshold: 250, hint: 'Chain magnets and pick up every trail' },
  { id: 'midas_touch', name: 'Midas Touch', description: 'Collect 500 coins in one run', icon: '✨', category: 'coins', rarity: 'epic', xpReward: 400, threshold: 500, hint: 'Fever mode doubles all coin values' },

  // ===== NEAR MISS =====
  { id: 'close_call', name: 'Close Call', description: 'Chain 3 near misses', icon: '😅', category: 'near_miss', rarity: 'common', xpReward: 25, threshold: 3, hint: 'Dodge obstacles at the last possible moment' },
  { id: 'daredevil', name: 'Daredevil', description: 'Chain 5 near misses', icon: '😤', category: 'near_miss', rarity: 'common', xpReward: 50, threshold: 5, hint: 'Switch lanes right as obstacles pass you' },
  { id: 'untouchable', name: 'Untouchable', description: 'Chain 7 near misses', icon: '💨', category: 'near_miss', rarity: 'rare', xpReward: 150, threshold: 7, hint: 'Near misses build faster when obstacles are dense' },
  { id: 'ghost', name: 'Ghost Mode', description: 'Chain 10 near misses', icon: '👻', category: 'near_miss', rarity: 'epic', xpReward: 400, threshold: 10, hint: 'Thread through the tightest gaps imaginable' },
  { id: 'phantom', name: 'The Phantom', description: 'Chain 15 near misses', icon: '🌀', category: 'near_miss', rarity: 'legendary', xpReward: 1000, threshold: 15, hint: 'Only achievable at maximum speed — legendary status' },

  // ===== FEVER =====
  { id: 'first_fever', name: 'First Fever', description: 'Activate Fever Mode', icon: '🔥', category: 'fever', rarity: 'common', xpReward: 25, threshold: 1, hint: 'Fill the fever meter by chaining near misses' },
  { id: 'fever_streak', name: 'Fever Streak', description: 'Activate Fever Mode 3 times in one run', icon: '🔥', category: 'fever', rarity: 'rare', xpReward: 150, threshold: 3, hint: 'Keep chaining near misses after fever ends' },
  { id: 'fever_master', name: 'Fever Master', description: 'Activate Fever Mode 5 times in one run', icon: '💥', category: 'fever', rarity: 'epic', xpReward: 400, threshold: 5, hint: 'Sustained near-miss play activates fever repeatedly' },

  // ===== EDUCATION =====
  { id: 'trivia_beginner', name: 'Trivia Beginner', description: 'Answer 5 trivia questions correctly', icon: '📚', category: 'education', rarity: 'common', xpReward: 50, threshold: 5, hint: 'Answer the quiz after each game' },
  { id: 'trivia_scholar', name: 'Trivia Scholar', description: 'Answer 25 trivia questions correctly', icon: '🎓', category: 'education', rarity: 'rare', xpReward: 200, threshold: 25, hint: 'Keep playing and learning between runs' },
  { id: 'trivia_master', name: 'Trivia Master', description: 'Answer 50 trivia questions correctly', icon: '🧠', category: 'education', rarity: 'epic', xpReward: 500, threshold: 50, hint: 'You\'re becoming a true football expert' },
  { id: 'term_explorer', name: 'Term Explorer', description: 'Discover 25 football terms', icon: '📖', category: 'education', rarity: 'common', xpReward: 50, threshold: 25, hint: 'Dodge defenders to learn football positions' },
  { id: 'term_collector', name: 'Term Collector', description: 'Discover 50 football terms', icon: '📕', category: 'education', rarity: 'rare', xpReward: 200, threshold: 50, hint: 'Keep playing to see different labels on obstacles' },
  { id: 'football_encyclopedia', name: 'Football Encyclopedia', description: 'Discover 100 football terms', icon: '📗', category: 'education', rarity: 'epic', xpReward: 500, threshold: 100, hint: 'Master the complete football dictionary' },

  // ===== STREAK =====
  { id: 'streak_3', name: 'Hat Trick', description: 'Play 3 days in a row', icon: '🔥', category: 'streak', rarity: 'common', xpReward: 75, threshold: 3, hint: 'Come back tomorrow to keep your streak alive' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Play 7 days in a row', icon: '📅', category: 'streak', rarity: 'rare', xpReward: 200, threshold: 7, hint: 'A full week of dedication — impressive!' },
  { id: 'streak_14', name: 'Two Week Terror', description: 'Play 14 days in a row', icon: '💪', category: 'streak', rarity: 'epic', xpReward: 500, threshold: 14, hint: 'Two weeks of consistent play' },
  { id: 'streak_30', name: 'Monthly Monster', description: 'Play 30 days in a row', icon: '🏆', category: 'streak', rarity: 'legendary', xpReward: 1500, threshold: 30, hint: 'A full month — you\'re a true champion' },

  // ===== SPECIAL =====
  { id: 'first_game', name: 'Welcome to the Field', description: 'Play your first game', icon: '🎉', category: 'special', rarity: 'common', xpReward: 25, threshold: 1, hint: 'Just tap play!' },
  { id: 'first_share', name: 'Spread the Word', description: 'Share your score for the first time', icon: '📣', category: 'special', rarity: 'common', xpReward: 50, threshold: 1, hint: 'Use the share button on the game over screen' },
  { id: 'daily_challenge_complete', name: 'Challenge Accepted', description: 'Complete a daily challenge', icon: '🎯', category: 'special', rarity: 'common', xpReward: 50, threshold: 1, hint: 'Check the daily challenge on the start screen' },
  { id: 'ten_games', name: 'Regular Player', description: 'Play 10 games total', icon: '🏟️', category: 'special', rarity: 'common', xpReward: 75, threshold: 10, hint: 'Keep coming back for more!' },
  { id: 'fifty_games', name: 'Dedicated Fan', description: 'Play 50 games total', icon: '🏟️', category: 'special', rarity: 'rare', xpReward: 250, threshold: 50, hint: 'A true Blitz Rush enthusiast' },
  { id: 'hundred_games', name: 'Blitz Rush Addict', description: 'Play 100 games total', icon: '🏟️', category: 'special', rarity: 'epic', xpReward: 750, threshold: 100, hint: 'You really can\'t stop playing, can you?' },
]

// Helpers
export function getAchievementsByCategory(category: AchievementCategory): AchievementDef[] {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export const ACHIEVEMENT_CATEGORIES: { key: AchievementCategory; label: string; icon: string }[] = [
  { key: 'score', label: 'Score', icon: '🏆' },
  { key: 'distance', label: 'Distance', icon: '🏃' },
  { key: 'coins', label: 'Coins', icon: '🪙' },
  { key: 'near_miss', label: 'Near Miss', icon: '💨' },
  { key: 'fever', label: 'Fever', icon: '🔥' },
  { key: 'education', label: 'Education', icon: '📚' },
  { key: 'streak', label: 'Streak', icon: '📅' },
  { key: 'special', label: 'Special', icon: '⭐' },
]

export const RARITY_COLORS: Record<AchievementRarity, { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' },
  rare: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  epic: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  legendary: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
}

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length
