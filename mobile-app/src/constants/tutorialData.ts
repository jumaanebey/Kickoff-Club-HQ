export interface TutorialStep {
    id: string;
    targetId?: string; // ID of the element to highlight
    text: string;
    position?: 'top' | 'bottom' | 'center';
    requireAction?: boolean; // If true, user must perform an action (e.g. tap button) to proceed
}

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        text: 'Welcome to Kickoff Club HQ! This is your base of operations.',
        position: 'center',
    },
    {
        id: 'resources',
        targetId: 'resource_bar',
        text: 'Here you can see your Coins, XP, and Energy. You need these to build and upgrade.',
        position: 'bottom',
    },
    {
        id: 'stadium',
        targetId: 'building_stadium',
        text: 'This is your Stadium. Upgrade it to increase your fan base and match income.',
        position: 'bottom',
    },
    {
        id: 'practice_field',
        targetId: 'building_practice_field',
        text: 'The Practice Field is where you train your team. Tap it to start drills.',
        position: 'top',
    },
    {
        id: 'missions',
        targetId: 'missions_button',
        text: 'Check your Daily Missions here to earn extra rewards!',
        position: 'top',
    },
    {
        id: 'finish',
        text: 'You are ready to lead your team to victory! Good luck, Coach!',
        position: 'center',
    },
];
