import { ImageSourcePropType } from 'react-native';

type BuildingType = 'stadium' | 'practice-field' | 'film-room' | 'weight-room' | 'headquarters';

const buildingAssets: Record<BuildingType, Record<number, ImageSourcePropType>> = {
  'stadium': {
    1: require('../../assets/buildings/stadium/level-1.png'),
    2: require('../../assets/buildings/stadium/level-2.png'),
    3: require('../../assets/buildings/stadium/level-3.png'),
    4: require('../../assets/buildings/stadium/level-4.png'),
    5: require('../../assets/buildings/stadium/level-5.png'),
  },
  'practice-field': {
    1: require('../../assets/buildings/practice-field/level-1.png'),
    2: require('../../assets/buildings/practice-field/level-2.png'),
    3: require('../../assets/buildings/practice-field/level-3.png'),
    4: require('../../assets/buildings/practice-field/level-4.png'),
    5: require('../../assets/buildings/practice-field/level-5.png'),
  },
  'film-room': {
    1: require('../../assets/buildings/film-room/level-1.png'),
    2: require('../../assets/buildings/film-room/level-2.png'),
    3: require('../../assets/buildings/film-room/level-3.png'),
    4: require('../../assets/buildings/film-room/level-4.png'),
    5: require('../../assets/buildings/film-room/level-5.png'),
  },
  'weight-room': {
    1: require('../../assets/buildings/weight-room/level-1.png'),
    2: require('../../assets/buildings/weight-room/level-2.png'),
    3: require('../../assets/buildings/weight-room/level-3.png'),
    4: require('../../assets/buildings/weight-room/level-4.png'),
    5: require('../../assets/buildings/weight-room/level-5.png'),
  },
  'headquarters': {
    1: require('../../assets/buildings/headquarters/level-1.png'),
    2: require('../../assets/buildings/headquarters/level-2.png'),
    3: require('../../assets/buildings/headquarters/level-3.png'),
    4: require('../../assets/buildings/headquarters/level-4.png'),
    5: require('../../assets/buildings/headquarters/level-5.png'),
  },
};

export function getBuildingAsset(
  buildingType: BuildingType,
  level: number
): ImageSourcePropType {
  const typeAssets = buildingAssets[buildingType];
  if (!typeAssets) {
    return buildingAssets['stadium'][1];
  }
  const clampedLevel = Math.max(1, Math.min(5, level));
  return typeAssets[clampedLevel] || typeAssets[1];
}

export function hasBuildingAsset(buildingType: string, level: number): boolean {
  return buildingType in buildingAssets && level >= 1 && level <= 5;
}
