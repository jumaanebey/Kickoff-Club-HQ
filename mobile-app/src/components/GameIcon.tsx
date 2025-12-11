import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import {
    CoinIcon, EnergyIcon, KPIcon, XPIcon,
    TrainIcon, UpgradeIcon, PlayIcon, CollectIcon, SpeedUpIcon,
    TrainingIcon, ReadyIcon, LockedIcon, CompleteIcon,
    StadiumIcon, PracticeFieldIcon, FilmRoomIcon,
    StadiumLevel2Icon, PracticeFieldLevel2Icon, FilmRoomLevel2Icon,
    QuarterbackIcon, LinebackerIcon, ReceiverIcon, CoachIcon, RunningBackIcon, LinemanIcon,
    DraftRoomIcon, ConcessionIcon, LockerRoomIcon, LeagueIcon, MissionsIcon,
    HeadquartersIcon, WeightRoomIcon, HeadquartersLevel2Icon, WeightRoomLevel2Icon,
    FirstUpgradeIcon, MasterBuilderIcon, EmpireBuilderIcon
} from './icons';

export type GameIconType =
    | 'coins' | 'energy' | 'kp' | 'xp'
    | 'train' | 'upgrade' | 'play' | 'collect' | 'speed_up'
    | 'training_status' | 'ready' | 'locked' | 'complete'
    | 'stadium' | 'practice-field' | 'film-room' | 'headquarters' | 'weight-room'
    | 'football-ball' | 'whistle' | 'arrow-up' | 'gift' | 'clock' // Legacy mappings
    | 'check' | 'lock' | 'trophy'; // Legacy mappings

interface GameIconProps {
    name: GameIconType | string;
    size?: number;
    style?: any;
}

export const GameIcon: React.FC<GameIconProps> = ({ name, size = 24, style }) => {
    switch (name.toLowerCase()) {
        // Resources
        case 'coins':
        case 'coin':
            return <CoinIcon size={size} style={style} />;
        case 'energy':
        case 'bolt':
            return <EnergyIcon size={size} style={style} />;
        case 'kp':
        case 'book':
        case 'brain':
            return <KPIcon size={size} style={style} />;
        case 'xp':
        case 'star':
        case 'gem':
            return <XPIcon size={size} style={style} />;

        // Actions
        case 'train':
        case 'whistle':
            return <TrainIcon size={size} style={style} />;
        case 'upgrade':
        case 'arrow-up':
        case 'hammer':
            return <UpgradeIcon size={size} style={style} />;
        case 'play':
        case 'football-ball':
            return <PlayIcon size={size} style={style} />;
        case 'collect':
        case 'gift':
            return <CollectIcon size={size} style={style} />;
        case 'speed_up':
        case 'speedup':
        case 'clock':
        case 'stopwatch':
            return <SpeedUpIcon size={size} style={style} />;

        // Status
        case 'training_status':
        case 'sweat':
            return <TrainingIcon size={size} style={style} />;
        case 'ready':
        case 'check':
            return <ReadyIcon size={size} style={style} />;
        case 'locked':
        case 'lock':
            return <LockedIcon size={size} style={style} />;
        case 'complete':
        case 'trophy':
            return <CompleteIcon size={size} style={style} />;

        // Buildings
        case 'stadium':
            return <StadiumIcon size={size} style={style} />;
        case 'stadium-2':
            return <StadiumLevel2Icon size={size} style={style} />;
        case 'practice-field':
        case 'practice':
        case 'football': // Override generic football for practice field if needed
            return <PracticeFieldIcon size={size} style={style} />;
        case 'practice-field-2':
            return <PracticeFieldLevel2Icon size={size} style={style} />;
        case 'film-room':
        case 'film':
            return <FilmRoomIcon size={size} style={style} />;
        case 'film-room-2':
            return <FilmRoomLevel2Icon size={size} style={style} />;
        case 'headquarters':
        case 'hq':
        case 'cabin':
            return <HeadquartersIcon size={size} style={style} />;
        case 'headquarters-2':
            return <HeadquartersLevel2Icon size={size} style={style} />;
        case 'weight-room':
        case 'gym':
        case 'dumbbell': // Legacy override
            return <WeightRoomIcon size={size} style={style} />;
        case 'weight-room-2':
            return <WeightRoomLevel2Icon size={size} style={style} />;

        // Characters
        case 'qb': return <QuarterbackIcon size={size} style={style} />;
        case 'lb': return <LinebackerIcon size={size} style={style} />;
        case 'wr': return <ReceiverIcon size={size} style={style} />;
        case 'rb': return <RunningBackIcon size={size} style={style} />;
        case 'lineman': return <LinemanIcon size={size} style={style} />;
        case 'coach': return <CoachIcon size={size} style={style} />;

        // Misc & Features
        case 'draft-room':
        case 'people':
        case 'users':
            return <DraftRoomIcon size={size} style={style} />;
        case 'concession':
        case 'cart':
            return <ConcessionIcon size={size} style={style} />;
        case 'locker-room':
        case 'shirt':
            return <LockerRoomIcon size={size} style={style} />;
        case 'leagues':
        case 'sitemap':
            return <LeagueIcon size={size} style={style} />;
        case 'missions':
        case 'clipboard-list':
            return <MissionsIcon size={size} style={style} />;

        // Achievements (New)
        case 'achievement-first-upgrade':
        case 'crane':
            return <FirstUpgradeIcon size={size} style={style} />;
        case 'achievement-master-builder':
        case 'castle':
            return <MasterBuilderIcon size={size} style={style} />;
        case 'achievement-empire-builder':
        case 'globe':
            return <EmpireBuilderIcon size={size} style={style} />;

        default:
            // Fallback to FontAwesome for any icons we haven't custom designed yet
            return <FontAwesome5 name={name} size={size} color={style?.color || "#fff"} style={style} />;
    }
};
