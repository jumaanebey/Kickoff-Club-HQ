// Asset Manager - Building and Game Assets
// All visual assets are loaded from the /assets directory
// Using Antigravity PNG assets (isometric cozy style)

import { ImageSourcePropType } from 'react-native';

// Import SVG assets for re-export
import {
  ResourceIcons,
  ActionIcons,
  StatusIcons,
  UnitAssets,
  BackgroundAssets,
  SVGAssets,
  CoinsIcon,
  EnergyIcon,
  KnowledgeIcon,
  XpIcon,
  TrainIcon,
  UpgradeIcon,
  PlayMatchIcon,
  CollectIcon,
  SpeedUpIcon,
  TrainingIcon,
  ReadyIcon,
  LockedIcon,
  CompleteIcon,
  Quarterback,
  RunningBack,
  WideReceiver,
  Lineman,
  Kicker,
  FieldGrass,
  SkyGradient,
  StadiumCrowd,
  MenuPattern,
} from './svgAssets';

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDING ASSETS - Antigravity PNG (Levels 1, 3, 5 available)
// Levels 2, 4 pending from Antigravity - using fallbacks
// ═══════════════════════════════════════════════════════════════════════════════

const FilmRoomAssets = {
  1: require('../../assets/buildings/film-room/level-1.png'),
  2: require('../../assets/buildings/film-room/level-1.png'),
  3: require('../../assets/buildings/film-room/level-3.png'),
  4: require('../../assets/buildings/film-room/level-3.png'),
  5: require('../../assets/buildings/film-room/level-5.png'),
};

const PracticeFieldAssets = {
  1: require('../../assets/buildings/practice-field/level-1.png'),
  2: require('../../assets/buildings/practice-field/level-1.png'),
  3: require('../../assets/buildings/practice-field/level-3.png'),
  4: require('../../assets/buildings/practice-field/level-3.png'),
  5: require('../../assets/buildings/practice-field/level-5.png'),
};

const StadiumAssets = {
  1: require('../../assets/buildings/stadium/level-1.png'),
  2: require('../../assets/buildings/stadium/level-1.png'),
  3: require('../../assets/buildings/stadium/level-3.png'),
  4: require('../../assets/buildings/stadium/level-3.png'),
  5: require('../../assets/buildings/stadium/level-3.png'),
};

const HeadquartersAssets = {
  1: require('../../assets/buildings/headquarters/level-1.png'),
  2: require('../../assets/buildings/headquarters/level-1.png'),
  3: require('../../assets/buildings/headquarters/level-3.png'),
  4: require('../../assets/buildings/headquarters/level-3.png'),
  5: require('../../assets/buildings/headquarters/level-5.png'),
};

const WeightRoomAssets = {
  1: require('../../assets/buildings/weight-room/level-1.png'),
  2: require('../../assets/buildings/weight-room/level-1.png'),
  3: require('../../assets/buildings/weight-room/level-3.png'),
  4: require('../../assets/buildings/weight-room/level-3.png'),
  5: require('../../assets/buildings/weight-room/level-5.png'),
};

export const BuildingAssets = {
  'film-room': FilmRoomAssets,
  'practice-field': PracticeFieldAssets,
  stadium: StadiumAssets,
  headquarters: HeadquartersAssets,
  'weight-room': WeightRoomAssets,
  'coach-office': HeadquartersAssets,
  'equipment-room': WeightRoomAssets,
  'training-facility': PracticeFieldAssets,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// UNIT ASSETS - Antigravity PNG
// ═══════════════════════════════════════════════════════════════════════════════

export const UnitPNGAssets = {
  secondary: {
    idle: require('../../assets/images/units/secondary-idle.png'),
    training: require('../../assets/images/units/secondary-training.png'),
    ready: require('../../assets/images/units/secondary-ready.png'),
  },
  specialTeams: {
    idle: require('../../assets/images/units/special-teams-idle.png'),
    training: require('../../assets/images/units/special-teams-training.png'),
    ready: require('../../assets/images/units/special-teams-ready.png'),
  },
  quarterback: {
    idle: require('../../assets/images/units/secondary-idle.png'),
    training: require('../../assets/images/units/secondary-training.png'),
    ready: require('../../assets/images/units/secondary-ready.png'),
  },
  runningBack: {
    idle: require('../../assets/images/units/secondary-idle.png'),
    training: require('../../assets/images/units/secondary-training.png'),
    ready: require('../../assets/images/units/secondary-ready.png'),
  },
  wideReceiver: {
    idle: require('../../assets/images/units/secondary-idle.png'),
    training: require('../../assets/images/units/secondary-training.png'),
    ready: require('../../assets/images/units/secondary-ready.png'),
  },
  lineman: {
    idle: require('../../assets/images/units/secondary-idle.png'),
    training: require('../../assets/images/units/secondary-training.png'),
    ready: require('../../assets/images/units/secondary-ready.png'),
  },
  kicker: {
    idle: require('../../assets/images/units/special-teams-idle.png'),
    training: require('../../assets/images/units/special-teams-training.png'),
    ready: require('../../assets/images/units/special-teams-ready.png'),
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATION ASSETS - Antigravity PNG
// ═══════════════════════════════════════════════════════════════════════════════

export const DecorationAssets = {
  clubFountain: require('../../assets/images/decorations/club-fountain.png'),
  merchStand: require('../../assets/images/decorations/merch-stand.png'),
  parkingLot: require('../../assets/images/decorations/parking-lot.png'),
  statueLegends: require('../../assets/images/decorations/statue-legends.png'),
  tailgateTent: require('../../assets/images/decorations/tailgate-tent.png'),
  teamBus: require('../../assets/images/decorations/team-bus.png'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ICON ASSETS - Antigravity PNG
// ═══════════════════════════════════════════════════════════════════════════════

export const IconPNGAssets = {
  coins: require('../../assets/images/icons/coins.png'),
  energy: require('../../assets/images/icons/energy.png'),
  xp: require('../../assets/images/icons/xp.png'),
  level: require('../../assets/images/icons/level.png'),
  ranks: {
    bronze: require('../../assets/images/icons/rank-bronze.png'),
    silver: require('../../assets/images/icons/rank-silver.png'),
    gold: require('../../assets/images/icons/rank-gold.png'),
    platinum: require('../../assets/images/icons/rank-platinum.png'),
    diamond: require('../../assets/images/icons/rank-diamond.png'),
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// RE-EXPORT SVG ASSETS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  ResourceIcons,
  ActionIcons,
  StatusIcons,
  UnitAssets,
  BackgroundAssets,
  SVGAssets,
  CoinsIcon,
  EnergyIcon,
  KnowledgeIcon,
  XpIcon,
  TrainIcon,
  UpgradeIcon,
  PlayMatchIcon,
  CollectIcon,
  SpeedUpIcon,
  TrainingIcon,
  ReadyIcon,
  LockedIcon,
  CompleteIcon,
  Quarterback,
  RunningBack,
  WideReceiver,
  Lineman,
  Kicker,
  FieldGrass,
  SkyGradient,
  StadiumCrowd,
  MenuPattern,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const getBuildingAsset = (
  buildingType: string,
  level: number
): ImageSourcePropType => {
  const building = BuildingAssets[buildingType as keyof typeof BuildingAssets];
  if (!building) {
    console.warn(`Building type "${buildingType}" not found`);
    return BuildingAssets.headquarters[1];
  }
  const clampedLevel = Math.max(1, Math.min(5, level)) as 1 | 2 | 3 | 4 | 5;
  return building[clampedLevel];
};

export const getUnitPNGAsset = (
  unitType: string,
  state: 'idle' | 'training' | 'ready'
): ImageSourcePropType => {
  const unit = UnitPNGAssets[unitType as keyof typeof UnitPNGAssets];
  if (!unit) {
    console.warn(`Unit type "${unitType}" not found`);
    return UnitPNGAssets.secondary[state];
  }
  return unit[state];
};

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const Assets = {
  buildings: BuildingAssets,
  units: UnitPNGAssets,
  decorations: DecorationAssets,
  icons: IconPNGAssets,
  svg: {
    resources: ResourceIcons,
    actions: ActionIcons,
    status: StatusIcons,
    units: UnitAssets,
    backgrounds: BackgroundAssets,
  },
} as const;

export default Assets;
