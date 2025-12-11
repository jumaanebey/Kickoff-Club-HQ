// SVG Assets - Transformed into React components via react-native-svg-transformer
import { SvgProps } from 'react-native-svg';
import React from 'react';

// Resource Icons
import CoinsIcon from '../../assets/svg/icons/resources/coins.svg';
import EnergyIcon from '../../assets/svg/icons/resources/energy.svg';
import KnowledgeIcon from '../../assets/svg/icons/resources/knowledge.svg';
import XpIcon from '../../assets/svg/icons/resources/xp.svg';

// Action Icons
import TrainIcon from '../../assets/svg/icons/actions/train.svg';
import UpgradeIcon from '../../assets/svg/icons/actions/upgrade.svg';
import PlayMatchIcon from '../../assets/svg/icons/actions/play-match.svg';
import CollectIcon from '../../assets/svg/icons/actions/collect.svg';
import SpeedUpIcon from '../../assets/svg/icons/actions/speed-up.svg';

// Status Icons
import TrainingIcon from '../../assets/svg/icons/status/training.svg';
import ReadyIcon from '../../assets/svg/icons/status/ready.svg';
import LockedIcon from '../../assets/svg/icons/status/locked.svg';
import CompleteIcon from '../../assets/svg/icons/status/complete.svg';

// Unit Assets (Chibi Players)
import Quarterback from '../../assets/svg/units/quarterback.svg';
import RunningBack from '../../assets/svg/units/running-back.svg';
import WideReceiver from '../../assets/svg/units/wide-receiver.svg';
import Lineman from '../../assets/svg/units/lineman.svg';
import Kicker from '../../assets/svg/units/kicker.svg';

// Background Assets
import FieldGrass from '../../assets/svg/backgrounds/field-grass.svg';
import SkyGradient from '../../assets/svg/backgrounds/sky-gradient.svg';
import StadiumCrowd from '../../assets/svg/backgrounds/stadium-crowd.svg';
import MenuPattern from '../../assets/svg/backgrounds/menu-pattern.svg';

// Navigation Icons
import HomeIcon from '../../assets/svg/navigation/home.svg';
import TeamIcon from '../../assets/svg/navigation/team.svg';
import ShopIcon from '../../assets/svg/navigation/shop.svg';
import ProfileIcon from '../../assets/svg/navigation/profile.svg';
import SettingsIcon from '../../assets/svg/navigation/settings.svg';
import LeaderboardIcon from '../../assets/svg/navigation/leaderboard.svg';
import MailIcon from '../../assets/svg/navigation/mail.svg';
import CalendarIcon from '../../assets/svg/navigation/calendar.svg';

// UI Elements
import ButtonPrimary from '../../assets/svg/ui/button-primary.svg';
import ButtonSecondary from '../../assets/svg/ui/button-secondary.svg';
import ButtonGold from '../../assets/svg/ui/button-gold.svg';
import ButtonDisabled from '../../assets/svg/ui/button-disabled.svg';
import PanelBasic from '../../assets/svg/ui/panel-basic.svg';
import PanelDark from '../../assets/svg/ui/panel-dark.svg';
import FrameSquare from '../../assets/svg/ui/frame-square.svg';
import FramePortrait from '../../assets/svg/ui/frame-portrait.svg';
import ModalBg from '../../assets/svg/ui/modal-bg.svg';
import StarFilled from '../../assets/svg/ui/star-filled.svg';
import StarEmpty from '../../assets/svg/ui/star-empty.svg';
import CloseButton from '../../assets/svg/ui/close-button.svg';
import AddButton from '../../assets/svg/ui/add-button.svg';
import InfoButton from '../../assets/svg/ui/info-button.svg';
import Tooltip from '../../assets/svg/ui/tooltip.svg';
import ProgressBarBg from '../../assets/svg/ui/progress-bar-bg.svg';
import ProgressBarFillGreen from '../../assets/svg/ui/progress-bar-fill-green.svg';
import ProgressBarFillGold from '../../assets/svg/ui/progress-bar-fill-gold.svg';
import ProgressBarFillRed from '../../assets/svg/ui/progress-bar-fill-red.svg';

// Currency Assets
import CoinGold from '../../assets/svg/currency/coin-gold.svg';
import CoinSilver from '../../assets/svg/currency/coin-silver.svg';
import CoinBronze from '../../assets/svg/currency/coin-bronze.svg';
import PremiumGem from '../../assets/svg/currency/premium-gem.svg';
import TicketGold from '../../assets/svg/currency/ticket-gold.svg';

// Reward Assets
import ChestGold from '../../assets/svg/rewards/chest-gold.svg';
import ChestSilver from '../../assets/svg/rewards/chest-silver.svg';
import ChestBronze from '../../assets/svg/rewards/chest-bronze.svg';
import GemRed from '../../assets/svg/rewards/gem-red.svg';
import GemBlue from '../../assets/svg/rewards/gem-blue.svg';
import GemGreen from '../../assets/svg/rewards/gem-green.svg';
import BoostSpeed from '../../assets/svg/rewards/boost-speed.svg';
import BoostPower from '../../assets/svg/rewards/boost-power.svg';
import BoostDefense from '../../assets/svg/rewards/boost-defense.svg';
import Ticket from '../../assets/svg/rewards/ticket.svg';

// Badge Assets
import BadgeRookie from '../../assets/svg/badges/rookie.svg';
import BadgeVeteran from '../../assets/svg/badges/veteran.svg';
import BadgeChampion from '../../assets/svg/badges/champion.svg';
import BadgeLegend from '../../assets/svg/badges/legend.svg';

// League Assets
import BronzeLeague from '../../assets/svg/leagues/bronze-league.svg';
import SilverLeague from '../../assets/svg/leagues/silver-league.svg';
import GoldLeague from '../../assets/svg/leagues/gold-league.svg';
import PlatinumLeague from '../../assets/svg/leagues/platinum-league.svg';
import DiamondLeague from '../../assets/svg/leagues/diamond-league.svg';
import MastersLeague from '../../assets/svg/leagues/masters-league.svg';

// Match Assets
import Touchdown from '../../assets/svg/match/touchdown.svg';
import FieldGoal from '../../assets/svg/match/field-goal.svg';
import Fumble from '../../assets/svg/match/fumble.svg';
import Interception from '../../assets/svg/match/interception.svg';
import Scoreboard from '../../assets/svg/match/scoreboard.svg';
import Timer from '../../assets/svg/match/timer.svg';
import DownMarker from '../../assets/svg/match/down-marker.svg';
import YardsToGo from '../../assets/svg/match/yards-to-go.svg';

// Stats Icons
import StatSpeed from '../../assets/svg/stats/speed.svg';
import StatStrength from '../../assets/svg/stats/strength.svg';
import StatAgility from '../../assets/svg/stats/agility.svg';
import StatStamina from '../../assets/svg/stats/stamina.svg';
import StatAccuracy from '../../assets/svg/stats/accuracy.svg';
import StatAwareness from '../../assets/svg/stats/awareness.svg';

// Weather Icons
import WeatherSunny from '../../assets/svg/weather/sunny.svg';
import WeatherCloudy from '../../assets/svg/weather/cloudy.svg';
import WeatherRainy from '../../assets/svg/weather/rainy.svg';
import WeatherSnowy from '../../assets/svg/weather/snowy.svg';
import WeatherNight from '../../assets/svg/weather/night.svg';

// Social Icons
import SocialChat from '../../assets/svg/social/chat.svg';
import SocialFriends from '../../assets/svg/social/friends.svg';
import SocialGuild from '../../assets/svg/social/guild.svg';
import SocialInvite from '../../assets/svg/social/invite.svg';
import SocialShare from '../../assets/svg/social/share.svg';
import SocialVersus from '../../assets/svg/social/versus.svg';

// Notification Icons
import NotificationBell from '../../assets/svg/notifications/bell.svg';
import NotificationAlert from '../../assets/svg/notifications/alert.svg';
import NotificationEnergyFull from '../../assets/svg/notifications/energy-full.svg';
import NotificationMatchReady from '../../assets/svg/notifications/match-ready.svg';
import NotificationNewMessage from '../../assets/svg/notifications/new-message.svg';
import NotificationRewardReady from '../../assets/svg/notifications/reward-ready.svg';

// Shop Assets
import CoinPackSmall from '../../assets/svg/shop/coin-pack-small.svg';
import CoinPackMedium from '../../assets/svg/shop/coin-pack-medium.svg';
import CoinPackLarge from '../../assets/svg/shop/coin-pack-large.svg';
import EnergyPack from '../../assets/svg/shop/energy-pack.svg';
import StarterBundle from '../../assets/svg/shop/starter-bundle.svg';
import VipPass from '../../assets/svg/shop/vip-pass.svg';
import LimitedOffer from '../../assets/svg/shop/limited-offer.svg';
import SaleTag from '../../assets/svg/shop/sale-tag.svg';

// Tutorial Assets
import CoachMascot from '../../assets/svg/tutorial/coach-mascot.svg';
import SpeechBubble from '../../assets/svg/tutorial/speech-bubble.svg';
import TapFinger from '../../assets/svg/tutorial/tap-finger.svg';
import SwipeArrow from '../../assets/svg/tutorial/swipe-arrow.svg';
import HighlightCircle from '../../assets/svg/tutorial/highlight-circle.svg';
import StepIndicator from '../../assets/svg/tutorial/step-indicator.svg';

// Decoration Assets
import Goalpost from '../../assets/svg/decorations/goalpost.svg';
import Bench from '../../assets/svg/decorations/bench.svg';
import Cone from '../../assets/svg/decorations/cone.svg';
import Football from '../../assets/svg/decorations/football.svg';
import Tree1 from '../../assets/svg/decorations/tree-1.svg';
import Tree2 from '../../assets/svg/decorations/tree-2.svg';
import Bush from '../../assets/svg/decorations/bush.svg';
import Fence from '../../assets/svg/decorations/fence.svg';
import FlagTeam from '../../assets/svg/decorations/flag-team.svg';
import WaterCooler from '../../assets/svg/decorations/water-cooler.svg';

// Equipment Assets
import HelmetBasic from '../../assets/svg/equipment/helmet-basic.svg';
import HelmetPro from '../../assets/svg/equipment/helmet-pro.svg';
import JerseyHome from '../../assets/svg/equipment/jersey-home.svg';
import JerseyAway from '../../assets/svg/equipment/jersey-away.svg';
import Cleats from '../../assets/svg/equipment/cleats.svg';
import Gloves from '../../assets/svg/equipment/gloves.svg';

// Formation Assets
import OffenseSpread from '../../assets/svg/formations/offense-spread.svg';
import OffenseIForm from '../../assets/svg/formations/offense-i-form.svg';
import Defense43 from '../../assets/svg/formations/defense-4-3.svg';
import Defense34 from '../../assets/svg/formations/defense-3-4.svg';
import SpecialTeams from '../../assets/svg/formations/special-teams.svg';

// Emote Assets
import EmoteHappy from '../../assets/svg/emotes/happy.svg';
import EmoteSad from '../../assets/svg/emotes/sad.svg';
import EmoteAngry from '../../assets/svg/emotes/angry.svg';
import EmoteExcited from '../../assets/svg/emotes/excited.svg';
import EmoteCool from '../../assets/svg/emotes/cool.svg';
import EmoteThinking from '../../assets/svg/emotes/thinking.svg';

// Type definition for SVG components
type SvgComponent = React.FC<SvgProps>;

// Export grouped by category
export const ResourceIcons = {
  coins: CoinsIcon,
  energy: EnergyIcon,
  knowledge: KnowledgeIcon,
  xp: XpIcon,
} as const;

export const ActionIcons = {
  train: TrainIcon,
  upgrade: UpgradeIcon,
  playMatch: PlayMatchIcon,
  collect: CollectIcon,
  speedUp: SpeedUpIcon,
} as const;

export const StatusIcons = {
  training: TrainingIcon,
  ready: ReadyIcon,
  locked: LockedIcon,
  complete: CompleteIcon,
} as const;

export const UnitAssets = {
  quarterback: Quarterback,
  runningBack: RunningBack,
  wideReceiver: WideReceiver,
  lineman: Lineman,
  kicker: Kicker,
} as const;

export const BackgroundAssets = {
  fieldGrass: FieldGrass,
  skyGradient: SkyGradient,
  stadiumCrowd: StadiumCrowd,
  menuPattern: MenuPattern,
} as const;

export const NavigationIcons = {
  home: HomeIcon,
  team: TeamIcon,
  shop: ShopIcon,
  profile: ProfileIcon,
  settings: SettingsIcon,
  leaderboard: LeaderboardIcon,
  mail: MailIcon,
  calendar: CalendarIcon,
} as const;

export const UIAssets = {
  buttonPrimary: ButtonPrimary,
  buttonSecondary: ButtonSecondary,
  buttonGold: ButtonGold,
  buttonDisabled: ButtonDisabled,
  panelBasic: PanelBasic,
  panelDark: PanelDark,
  frameSquare: FrameSquare,
  framePortrait: FramePortrait,
  modalBg: ModalBg,
  starFilled: StarFilled,
  starEmpty: StarEmpty,
  closeButton: CloseButton,
  addButton: AddButton,
  infoButton: InfoButton,
  tooltip: Tooltip,
  progressBarBg: ProgressBarBg,
  progressBarFillGreen: ProgressBarFillGreen,
  progressBarFillGold: ProgressBarFillGold,
  progressBarFillRed: ProgressBarFillRed,
} as const;

export const CurrencyAssets = {
  coinGold: CoinGold,
  coinSilver: CoinSilver,
  coinBronze: CoinBronze,
  premiumGem: PremiumGem,
  ticketGold: TicketGold,
} as const;

export const RewardAssets = {
  chestGold: ChestGold,
  chestSilver: ChestSilver,
  chestBronze: ChestBronze,
  gemRed: GemRed,
  gemBlue: GemBlue,
  gemGreen: GemGreen,
  boostSpeed: BoostSpeed,
  boostPower: BoostPower,
  boostDefense: BoostDefense,
  ticket: Ticket,
} as const;

export const BadgeAssets = {
  rookie: BadgeRookie,
  veteran: BadgeVeteran,
  champion: BadgeChampion,
  legend: BadgeLegend,
} as const;

export const LeagueAssets = {
  bronze: BronzeLeague,
  silver: SilverLeague,
  gold: GoldLeague,
  platinum: PlatinumLeague,
  diamond: DiamondLeague,
  masters: MastersLeague,
} as const;

export const MatchAssets = {
  touchdown: Touchdown,
  fieldGoal: FieldGoal,
  fumble: Fumble,
  interception: Interception,
  scoreboard: Scoreboard,
  timer: Timer,
  downMarker: DownMarker,
  yardsToGo: YardsToGo,
} as const;

export const StatIcons = {
  speed: StatSpeed,
  strength: StatStrength,
  agility: StatAgility,
  stamina: StatStamina,
  accuracy: StatAccuracy,
  awareness: StatAwareness,
} as const;

export const WeatherIcons = {
  sunny: WeatherSunny,
  cloudy: WeatherCloudy,
  rainy: WeatherRainy,
  snowy: WeatherSnowy,
  night: WeatherNight,
} as const;

export const SocialIcons = {
  chat: SocialChat,
  friends: SocialFriends,
  guild: SocialGuild,
  invite: SocialInvite,
  share: SocialShare,
  versus: SocialVersus,
} as const;

export const NotificationIcons = {
  bell: NotificationBell,
  alert: NotificationAlert,
  energyFull: NotificationEnergyFull,
  matchReady: NotificationMatchReady,
  newMessage: NotificationNewMessage,
  rewardReady: NotificationRewardReady,
} as const;

export const ShopAssets = {
  coinPackSmall: CoinPackSmall,
  coinPackMedium: CoinPackMedium,
  coinPackLarge: CoinPackLarge,
  energyPack: EnergyPack,
  starterBundle: StarterBundle,
  vipPass: VipPass,
  limitedOffer: LimitedOffer,
  saleTag: SaleTag,
} as const;

export const TutorialAssets = {
  coachMascot: CoachMascot,
  speechBubble: SpeechBubble,
  tapFinger: TapFinger,
  swipeArrow: SwipeArrow,
  highlightCircle: HighlightCircle,
  stepIndicator: StepIndicator,
} as const;

export const DecorationAssets = {
  goalpost: Goalpost,
  bench: Bench,
  cone: Cone,
  football: Football,
  tree1: Tree1,
  tree2: Tree2,
  bush: Bush,
  fence: Fence,
  flagTeam: FlagTeam,
  waterCooler: WaterCooler,
} as const;

export const EquipmentAssets = {
  helmetBasic: HelmetBasic,
  helmetPro: HelmetPro,
  jerseyHome: JerseyHome,
  jerseyAway: JerseyAway,
  cleats: Cleats,
  gloves: Gloves,
} as const;

export const FormationAssets = {
  offenseSpread: OffenseSpread,
  offenseIForm: OffenseIForm,
  defense43: Defense43,
  defense34: Defense34,
  specialTeams: SpecialTeams,
} as const;

export const EmoteAssets = {
  happy: EmoteHappy,
  sad: EmoteSad,
  angry: EmoteAngry,
  excited: EmoteExcited,
  cool: EmoteCool,
  thinking: EmoteThinking,
} as const;

// Individual exports for direct imports
export {
  // Resources
  CoinsIcon,
  EnergyIcon,
  KnowledgeIcon,
  XpIcon,
  // Actions
  TrainIcon,
  UpgradeIcon,
  PlayMatchIcon,
  CollectIcon,
  SpeedUpIcon,
  // Status
  TrainingIcon,
  ReadyIcon,
  LockedIcon,
  CompleteIcon,
  // Units
  Quarterback,
  RunningBack,
  WideReceiver,
  Lineman,
  Kicker,
  // Backgrounds
  FieldGrass,
  SkyGradient,
  StadiumCrowd,
  MenuPattern,
  // Navigation
  HomeIcon,
  TeamIcon,
  ShopIcon,
  ProfileIcon,
  SettingsIcon,
  LeaderboardIcon,
  MailIcon,
  CalendarIcon,
  // UI
  ButtonPrimary,
  ButtonSecondary,
  ButtonGold,
  ButtonDisabled,
  PanelBasic,
  PanelDark,
  FrameSquare,
  FramePortrait,
  ModalBg,
  StarFilled,
  StarEmpty,
  CloseButton,
  AddButton,
  InfoButton,
  Tooltip,
  ProgressBarBg,
  ProgressBarFillGreen,
  ProgressBarFillGold,
  ProgressBarFillRed,
  // Currency
  CoinGold,
  CoinSilver,
  CoinBronze,
  PremiumGem,
  TicketGold,
  // Rewards
  ChestGold,
  ChestSilver,
  ChestBronze,
  GemRed,
  GemBlue,
  GemGreen,
  BoostSpeed,
  BoostPower,
  BoostDefense,
  Ticket,
  // Badges
  BadgeRookie,
  BadgeVeteran,
  BadgeChampion,
  BadgeLegend,
  // Leagues
  BronzeLeague,
  SilverLeague,
  GoldLeague,
  PlatinumLeague,
  DiamondLeague,
  MastersLeague,
  // Match
  Touchdown,
  FieldGoal,
  Fumble,
  Interception,
  Scoreboard,
  Timer,
  DownMarker,
  YardsToGo,
  // Stats
  StatSpeed,
  StatStrength,
  StatAgility,
  StatStamina,
  StatAccuracy,
  StatAwareness,
  // Weather
  WeatherSunny,
  WeatherCloudy,
  WeatherRainy,
  WeatherSnowy,
  WeatherNight,
  // Social
  SocialChat,
  SocialFriends,
  SocialGuild,
  SocialInvite,
  SocialShare,
  SocialVersus,
  // Notifications
  NotificationBell,
  NotificationAlert,
  NotificationEnergyFull,
  NotificationMatchReady,
  NotificationNewMessage,
  NotificationRewardReady,
  // Shop
  CoinPackSmall,
  CoinPackMedium,
  CoinPackLarge,
  EnergyPack,
  StarterBundle,
  VipPass,
  LimitedOffer,
  SaleTag,
  // Tutorial
  CoachMascot,
  SpeechBubble,
  TapFinger,
  SwipeArrow,
  HighlightCircle,
  StepIndicator,
  // Decorations
  Goalpost,
  Bench,
  Cone,
  Football,
  Tree1,
  Tree2,
  Bush,
  Fence,
  FlagTeam,
  WaterCooler,
  // Equipment
  HelmetBasic,
  HelmetPro,
  JerseyHome,
  JerseyAway,
  Cleats,
  Gloves,
  // Formations
  OffenseSpread,
  OffenseIForm,
  Defense43,
  Defense34,
  SpecialTeams,
  // Emotes
  EmoteHappy,
  EmoteSad,
  EmoteAngry,
  EmoteExcited,
  EmoteCool,
  EmoteThinking,
};

// Master export
export const SVGAssets = {
  resources: ResourceIcons,
  actions: ActionIcons,
  status: StatusIcons,
  units: UnitAssets,
  backgrounds: BackgroundAssets,
  navigation: NavigationIcons,
  ui: UIAssets,
  currency: CurrencyAssets,
  rewards: RewardAssets,
  badges: BadgeAssets,
  leagues: LeagueAssets,
  match: MatchAssets,
  stats: StatIcons,
  weather: WeatherIcons,
  social: SocialIcons,
  notifications: NotificationIcons,
  shop: ShopAssets,
  tutorial: TutorialAssets,
  decorations: DecorationAssets,
  equipment: EquipmentAssets,
  formations: FormationAssets,
  emotes: EmoteAssets,
} as const;

export default SVGAssets;
