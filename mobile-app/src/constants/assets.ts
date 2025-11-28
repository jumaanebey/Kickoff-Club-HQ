// Asset Manager - Centralized asset imports
// This file maps all visual assets for easy access throughout the app
// NOTE: Most assets are commented out until Antigravity delivers the graphics

import { ImageSourcePropType } from 'react-native';

// Training Unit Assets (PENDING - Waiting for Antigravity delivery)
export const UnitAssets = {
  offensive_line: {
    idle: null as any,
    training: null as any,
    ready: null as any,
  },
  skill_positions: {
    idle: null as any,
    training: null as any,
    ready: null as any,
  },
  defensive_line: {
    idle: null as any,
    training: null as any,
    ready: null as any,
  },
  secondary: {
    idle: null as any,
    training: null as any,
    ready: null as any,
  },
  special_teams: {
    idle: null as any,
    training: null as any,
    ready: null as any,
  },
};

// Resource Icons (PENDING - Waiting for Antigravity delivery)
export const ResourceIcons = {
  coins: null as any,
  energy: null as any,
  knowledge_points: null as any,
  xp: null as any,
};

// Action Icons (PENDING - Waiting for Antigravity delivery)
export const ActionIcons = {
  train: null as any,
  upgrade: null as any,
  play_match: null as any,
  collect: null as any,
  speed_up: null as any,
};

// Status Icons (PENDING - Waiting for Antigravity delivery)
export const StatusIcons = {
  training: null as any,
  ready: null as any,
  locked: null as any,
  complete: null as any,
};

// Building Assets (PENDING - Waiting for Antigravity delivery)
export const BuildingAssets = {
  practice_field: {
    level_1: null as any,
    level_2: null as any,
    level_3: null as any,
    level_4: null as any,
    level_5: null as any,
  },
  film_room: {
    level_1: null as any,
    level_2: null as any,
    level_3: null as any,
    level_4: null as any,
    level_5: null as any,
  },
  weight_room: {
    level_1: null as any,
    level_2: null as any,
    level_3: null as any,
    level_4: null as any,
    level_5: null as any,
  },
  stadium: {
    level_1: require('../../assets/buildings/stadium/building-stadium-level-1@2x.png'),
    level_2: null as any, // Placeholder - waiting for Antigravity
    level_3: null as any, // Placeholder - waiting for Antigravity
    level_4: null as any, // Placeholder - waiting for Antigravity
    level_5: require('../../assets/buildings/stadium/building-stadium-level-5@2x.png'),
  },
  headquarters: {
    level_1: null as any,
    level_2: null as any,
    level_3: null as any,
    level_4: null as any,
    level_5: null as any,
  },
};

// Background Images
export const BackgroundAssets = {
  hq_overview: require('../../assets/backgrounds/hq-overview@3x.png'),
  practice_field: require('../../assets/backgrounds/practice-field@3x.png'),
  match_day: require('../../assets/backgrounds/match-day@3x.png'),
  match_night: require('../../assets/backgrounds/match-night@3x.png'),
  menu: require('../../assets/backgrounds/menu@3x.png'),
};

// Helper function to get unit asset by state
export const getUnitAsset = (
  unitType: 'offensive_line' | 'skill_positions' | 'defensive_line' | 'secondary' | 'special_teams',
  state: 'idle' | 'training' | 'ready'
): ImageSourcePropType => {
  return UnitAssets[unitType][state];
};

// Helper function to get building asset by level
export const getBuildingAsset = (
  buildingType: 'practice_field' | 'film_room' | 'weight_room' | 'stadium' | 'headquarters',
  level: number
): ImageSourcePropType => {
  const levelKey = `level_${Math.min(level, 5)}` as 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5';
  return BuildingAssets[buildingType][levelKey];
};

// Export all assets as a single object for easy access
export const Assets = {
  units: UnitAssets,
  resources: ResourceIcons,
  actions: ActionIcons,
  status: StatusIcons,
  buildings: BuildingAssets,
  backgrounds: BackgroundAssets,
};

export default Assets;
