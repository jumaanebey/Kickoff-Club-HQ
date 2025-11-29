// Asset Manager - Building and Game Assets
// All visual assets are loaded from the /assets directory

import { ImageSourcePropType } from 'react-native';

// Building Assets - Organized by type and level
export const BuildingAssets = {
  'film-room': {
    1: require('../../assets/buildings/film-room/level-1.png'),
    2: require('../../assets/buildings/film-room/level-2.png'),
    3: require('../../assets/buildings/film-room/level-3.png'),
    4: require('../../assets/buildings/film-room/level-4.png'),
    5: require('../../assets/buildings/film-room/level-5.png'),
  },
  'practice-field': {
    1: require('../../assets/buildings/practice-field/level-1.png'),
    2: require('../../assets/buildings/practice-field/level-2.png'),
    3: require('../../assets/buildings/practice-field/level-3.png'),
    4: require('../../assets/buildings/practice-field/level-4.png'),
    5: require('../../assets/buildings/practice-field/level-5.png'),
  },
  stadium: {
    1: require('../../assets/buildings/stadium/level-1.png'),
    2: require('../../assets/buildings/stadium/level-2.png'),
    3: require('../../assets/buildings/stadium/level-3.png'),
    4: require('../../assets/buildings/stadium/level-4.png'),
    5: require('../../assets/buildings/stadium/level-5.png'),
  },
  headquarters: {
    1: require('../../assets/buildings/headquarters/level-1.png'),
    2: require('../../assets/buildings/headquarters/level-2.png'),
    3: require('../../assets/buildings/headquarters/level-3.png'),
    4: require('../../assets/buildings/headquarters/level-4.png'),
    5: require('../../assets/buildings/headquarters/level-5.png'),
  },
  'weight-room': {
    1: require('../../assets/buildings/weight-room/level-1.png'),
    2: require('../../assets/buildings/weight-room/level-2.png'),
    3: require('../../assets/buildings/weight-room/level-3.png'),
    4: require('../../assets/buildings/weight-room/level-4.png'),
    5: require('../../assets/buildings/weight-room/level-5.png'),
  },
};

// Placeholder exports for future use
export const UnitAssets = {};
export const ResourceIcons = {};
export const ActionIcons = {};
export const StatusIcons = {};
export const BackgroundAssets = {};

// Helper function to get unit asset by state
export const getUnitAsset = (
  unitType: string,
  state: string
): ImageSourcePropType | null => {
  return null;
};

// Helper function to get building asset by level
export const getBuildingAsset = (
  buildingType: string,
  level: number
): ImageSourcePropType => {
  const building = BuildingAssets[buildingType as keyof typeof BuildingAssets];
  if (!building) {
    // Return a fallback or throw error
    console.warn(`Building type "${buildingType}" not found in assets`);
    return require('../../assets/icon.png'); // Fallback to app icon
  }

  const levelAsset = building[level as keyof typeof building];
  if (!levelAsset) {
    console.warn(`Level ${level} not found for building "${buildingType}"`);
    return building[1]; // Fallback to level 1
  }

  return levelAsset;
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
