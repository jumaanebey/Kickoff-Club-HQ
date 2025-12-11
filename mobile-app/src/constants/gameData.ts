export const LEVEL_UNLOCKS: Record<number, Array<{ type: 'building' | 'feature' | 'reward'; name: string; icon: string; description: string }>> = {
    2: [
        { type: 'building', name: 'Practice Field', icon: 'football-ball', description: 'Train your team with drills' },
        { type: 'reward', name: '1000 Coins', icon: 'coins', description: 'Bonus for reaching Level 2' },
    ],
    3: [
        { type: 'building', name: 'Stadium', icon: 'trophy', description: 'Host matches and earn big rewards' },
        { type: 'feature', name: 'Daily Missions', icon: 'clipboard-list', description: 'Complete tasks for XP' },
    ],
    4: [
        { type: 'building', name: 'Gym', icon: 'dumbbell', description: 'Improve player stats' },
        { type: 'reward', name: '50 KP', icon: 'brain', description: 'Knowledge Points bonus' },
    ],
    5: [
        { type: 'building', name: 'Draft Room', icon: 'users', description: 'Scout and sign new players' },
        { type: 'feature', name: 'Leagues', icon: 'sitemap', description: 'Compete against other players' },
    ],
};
