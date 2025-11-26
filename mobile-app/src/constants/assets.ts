// Asset Manager - Centralized asset imports
// This file maps all visual assets for easy access throughout the app

import { ImageSourcePropType } from 'react-native';

// Training Unit Assets
export const UnitAssets = {
  offensive_line: {
    idle: require('../../assets/units/offensive-line/idle@2x.png'),
    training: require('../../assets/units/offensive-line/training@2x.png'),
    ready: require('../../assets/units/offensive-line/ready@2x.png'),
  },
  skill_positions: {
    idle: require('../../assets/units/skill-positions/idle@2x.png'),
    training: require('../../assets/units/skill-positions/training@2x.png'),
    ready: require('../../assets/units/skill-positions/ready@2x.png'),
  },
  defensive_line: {
    idle: require('../../assets/units/defensive-line/idle@2x.png'),
    training: require('../../assets/units/defensive-line/training@2x.png'),
    ready: require('../../assets/units/defensive-line/ready@2x.png'),
  },
  secondary: {
    idle: require('../../assets/units/secondary/idle@2x.png'),
    training: require('../../assets/units/secondary/training@2x.png'),
    ready: require('../../assets/units/secondary/ready@2x.png'),
  },
  special_teams: {
    idle: require('../../assets/units/special-teams/idle@2x.png'),
    training: require('../../assets/units/special-teams/training@2x.png'),
    ready: require('../../assets/units/special-teams/ready@2x.png'),
  },
};

// Resource Icons
export const ResourceIcons = {
  coins: require('../../assets/icons/resources/coins@2x.png'),
  energy: require('../../assets/icons/resources/energy@2x.png'),
  knowledge_points: require('../../assets/icons/resources/knowledge-points@2x.png'),
  xp: require('../../assets/icons/resources/xp@2x.png'),
};

// Action Icons
export const ActionIcons = {
  train: require('../../assets/icons/actions/train@2x.png'),
  upgrade: require('../../assets/icons/actions/upgrade@2x.png'),
  play_match: require('../../assets/icons/actions/play-match@2x.png'),
  collect: require('../../assets/icons/actions/collect@2x.png'),
  speed_up: require('../../assets/icons/actions/speed-up@2x.png'),
};

// Status Icons
export const StatusIcons = {
  training: require('../../assets/icons/status/training@2x.png'),
  ready: require('../../assets/icons/status/ready@2x.png'),
  locked: require('../../assets/icons/status/locked@2x.png'),
  complete: require('../../assets/icons/status/complete@2x.png'),
};

// Building Assets
export const BuildingAssets = {
  practice_field: {
    level_1: require('../../assets/buildings/practice-field/level-1@2x.png'),
    level_2: require('../../assets/buildings/practice-field/level-2@2x.png'),
    level_3: require('../../assets/buildings/practice-field/level-3@2x.png'),
    level_4: require('../../assets/buildings/practice-field/level-4@2x.png'),
    level_5: require('../../assets/buildings/practice-field/level-5@2x.png'),
  },
  film_room: {
    level_1: require('../../assets/buildings/film-room/level-1@2x.png'),
    level_2: require('../../assets/buildings/film-room/level-2@2x.png'),
    level_3: require('../../assets/buildings/film-room/level-3@2x.png'),
    level_4: require('../../assets/buildings/film-room/level-4@2x.png'),
    level_5: require('../../assets/buildings/film-room/level-5@2x.png'),
  },
  weight_room: {
    level_1: require('../../assets/buildings/weight-room/level-1@2x.png'),
    level_2: require('../../assets/buildings/weight-room/level-2@2x.png'),
    level_3: require('../../assets/buildings/weight-room/level-3@2x.png'),
    level_4: require('../../assets/buildings/weight-room/level-4@2x.png'),
    level_5: require('../../assets/buildings/weight-room/level-5@2x.png'),
  },
  stadium: {
    level_1: require('../../assets/buildings/stadium/level-1@2x.png'),
    level_2: require('../../assets/buildings/stadium/level-2@2x.png'),
    level_3: require('../../assets/buildings/stadium/level-3@2x.png'),
    level_4: require('../../assets/buildings/stadium/level-4@2x.png'),
    level_5: require('../../assets/buildings/stadium/level-5@2x.png'),
  },
  headquarters: {
    level_1: require('../../assets/buildings/headquarters/level-1@2x.png'),
    level_2: require('../../assets/buildings/headquarters/level-2@2x.png'),
    level_3: require('../../assets/buildings/headquarters/level-3@2x.png'),
    level_4: require('../../assets/buildings/headquarters/level-4@2x.png'),
    level_5: require('../../assets/buildings/headquarters/level-5@2x.png'),
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
