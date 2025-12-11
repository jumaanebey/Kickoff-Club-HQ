import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Define screen center for fallbacks
const CENTER_X = width / 2;
const CENTER_Y = height / 2;

export interface TutorialStep {
  id: string;
  title: string;
  message: string;
  position?: { x: number; y: number }; // Specific coordinates for highlight
  highlightTarget?: string; // Building ID or UI element ID to highlight logic
  action?: 'tap' | 'collect' | 'upgrade' | 'next'; // Required action to proceed
  order: number;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Kickoff Club HQ!',
    message: 'This is your new home base. Build and upgrade facilities to grow your football empire!',
    position: { x: CENTER_X, y: CENTER_Y },
    action: 'next',
    order: 1,
  },
  {
    id: 'field_intro',
    title: 'Your Field',
    message: 'This empty field is full of potential. You can construct buildings like Stadiums and Practice Fields here.',
    position: { x: CENTER_X, y: height * 0.4 }, // Roughly field center
    action: 'next',
    order: 2,
  },
  {
    id: 'tap_building',
    title: 'Inspect Facilities',
    message: 'Tap on any building to see its details, production status, and upgrade options.',
    highlightTarget: 'film-room-1', // Assuming starter building ID or type
    action: 'tap',
    order: 3,
  },
  {
    id: 'collect_resources',
    title: 'Collect Resources',
    message: 'Your buildings produce Coins and Knowledge Points over time. Tap the icons when they appear to collect them!',
    action: 'collect',
    order: 4,
  },
  {
    id: 'upgrade_building',
    title: 'Upgrade for Growth',
    message: 'Spend your earned Coins to upgrade buildings. Higher levels produce resources faster and unlock new features.',
    action: 'upgrade',
    order: 5,
  },
  {
    id: 'xp_and_levels',
    title: 'Level Up',
    message: 'Everything you do earns XP. Level up your HQ to unlock new building types like the Locker Room and Stadium!',
    position: { x: 40, y: 60 }, // Approximate top-left XP bar position
    action: 'next',
    order: 6,
  },
  {
    id: 'start_journey',
    title: 'Ready for Kickoff?',
    message: 'Build your empire and become a football legend! Good luck, Coach.',
    position: { x: CENTER_X, y: CENTER_Y },
    action: 'next',
    order: 7,
  },
];
