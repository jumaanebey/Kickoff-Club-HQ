import React from 'react';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Ellipse, G } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface IconProps {
    size?: number;
    style?: any;
    color?: string;
}

// Common Gradients Definition Component
const BuildingGradients = () => (
    <Defs>
        {/* Stadium Gradients */}
        <LinearGradient id="bleacherWood" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#D7CCC8" />
            <Stop offset="0.5" stopColor="#A1887F" />
            <Stop offset="1" stopColor="#8D6E63" />
        </LinearGradient>
        <LinearGradient id="fieldGrass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#AED581" />
            <Stop offset="1" stopColor="#7CB342" />
        </LinearGradient>

        {/* Practice Field Gradients */}
        <LinearGradient id="coneOrange" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFCC80" />
            <Stop offset="1" stopColor="#FF9800" />
        </LinearGradient>

        {/* Film Room Gradients */}
        <LinearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#E1F5FE" />
            <Stop offset="1" stopColor="#B3E5FC" />
        </LinearGradient>
        <LinearGradient id="projectorCase" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#90A4AE" />
            <Stop offset="1" stopColor="#607D8B" />
        </LinearGradient>

        {/* Headquarters Gradients */}
        <LinearGradient id="buildingGlass" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E3F2FD" />
            <Stop offset="0.5" stopColor="#BBDEFB" />
            <Stop offset="1" stopColor="#90CAF9" />
        </LinearGradient>
        <LinearGradient id="buildingWall" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#F5F5F5" />
            <Stop offset="1" stopColor="#E0E0E0" />
        </LinearGradient>

        {/* Weight Room Gradients */}
        <LinearGradient id="weightMetal" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#B0BEC5" />
            <Stop offset="0.5" stopColor="#78909C" />
            <Stop offset="1" stopColor="#546E7A" />
        </LinearGradient>
        <LinearGradient id="redPlate" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#EF5350" />
            <Stop offset="1" stopColor="#C62828" />
        </LinearGradient>
    </Defs>
);

// Level 1 Stadium: Wooden Bleachers / Small Field
export const StadiumIcon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="56" rx="28" ry="6" fill="#000" opacity="0.2" />

            {/* Oval Base/Wall */}
            <Ellipse cx="32" cy="40" rx="30" ry="20" fill="#E0E0E0" />
            <Ellipse cx="32" cy="38" rx="28" ry="18" fill="#CFD8DC" />

            {/* Field */}
            <Rect x="14" y="24" width="36" height="28" rx="4" fill="url(#fieldGrass)" />

            {/* Field Lines */}
            <Path d="M32 24 L32 52" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
            <Circle cx="32" cy="38" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

            {/* Bleachers (Top Left) - 3D Effect */}
            <Path d="M4 30 L14 24 L14 36 L4 38 Z" fill="url(#bleacherWood)" />
            <Path d="M4 30 L14 24" stroke="#8D6E63" strokeWidth="1" />
            {/* Bleachers (Top Right) - 3D Effect */}
            <Path d="M60 30 L50 24 L50 36 L60 38 Z" fill="url(#bleacherWood)" />
            <Path d="M60 30 L50 24" stroke="#8D6E63" strokeWidth="1" />

            {/* Flags */}
            <Path d="M14 24 L14 16 L22 19 L14 22" fill={COLORS.primary} />
            <Path d="M50 24 L50 16 L42 19 L50 22" fill={COLORS.primary} />

            {/* Crowd Dots (Micro-detail) */}
            <Circle cx="8" cy="32" r="1.5" fill={COLORS.primaryDark} opacity="0.7" />
            <Circle cx="10" cy="34" r="1.5" fill={COLORS.secondary} opacity="0.7" />
            <Circle cx="56" cy="32" r="1.5" fill={COLORS.primaryDark} opacity="0.7" />
            <Circle cx="54" cy="34" r="1.5" fill={COLORS.secondary} opacity="0.7" />
        </Svg>
    );
};

// Level 2 Stadium: Concrete Bleachers / Larger Base
export const StadiumLevel2Icon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />
            <Defs>
                <LinearGradient id="concrete" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#ECEFF1" />
                    <Stop offset="1" stopColor="#B0BEC5" />
                </LinearGradient>
            </Defs>

            {/* Shadow */}
            <Ellipse cx="32" cy="56" rx="30" ry="8" fill="#000" opacity="0.2" />

            {/* Oval Base - Concrete */}
            <Ellipse cx="32" cy="40" rx="32" ry="22" fill="#CFD8DC" stroke="#90A4AE" strokeWidth="1" />

            {/* Field */}
            <Rect x="12" y="24" width="40" height="30" rx="4" fill="url(#fieldGrass)" />

            {/* Field Lines (More detailed) */}
            <Path d="M32 24 L32 54" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
            <Circle cx="32" cy="39" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
            {/* End zones */}
            <Rect x="12" y="24" width="6" height="30" fill="rgba(255,255,255,0.2)" />
            <Rect x="46" y="24" width="6" height="30" fill="rgba(255,255,255,0.2)" />

            {/* Bleachers (Tiered - Left) */}
            <Path d="M2 32 L12 22 L12 38 L2 42 Z" fill="url(#concrete)" />
            <Path d="M4 30 L12 24" stroke="#90A4AE" strokeWidth="1" />
            <Path d="M0 26 L10 18 L10 22 L0 30 Z" fill="#90A4AE" /> {/* Upper tier */}

            {/* Bleachers (Tiered - Right) */}
            <Path d="M62 32 L52 22 L52 38 L62 42 Z" fill="url(#concrete)" />
            <Path d="M60 30 L52 24" stroke="#90A4AE" strokeWidth="1" />
            <Path d="M64 26 L54 18 L54 22 L64 30 Z" fill="#90A4AE" /> {/* Upper tier */}

            {/* Flag Poles (Dual) */}
            <Path d="M12 22 L12 12" stroke="#546E7A" strokeWidth="1.5" />
            <Path d="M52 22 L52 12" stroke="#546E7A" strokeWidth="1.5" />
            {/* Flags */}
            <Path d="M12 12 L20 15 L12 18" fill={COLORS.primary} />
            <Path d="M52 12 L44 15 L52 18" fill={COLORS.primary} />

            {/* Scoreboard Hint */}
            <Rect x="26" y="10" width="12" height="6" fill="#333" rx="1" />
            <Path d="M30 16 V24" stroke="#555" strokeWidth="1" />
            <Circle cx="32" cy="13" r="1.5" fill="#F00" />
        </Svg>
    );
};

// Level 2 Practice Field: More Equipment, Better Turf
export const PracticeFieldLevel2Icon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="54" rx="28" ry="6" fill="#000" opacity="0.2" />

            {/* Field Base (Professional Turf) */}
            <Rect x="2" y="18" width="60" height="38" rx="8" fill="url(#fieldGrass)" stroke="#fff" strokeWidth="1" />

            {/* Yard Lines */}
            <Path d="M12 18 V56 M22 18 V56 M32 18 V56 M42 18 V56 M52 18 V56" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

            {/* Tire Drill Station (Bottom Left) */}
            <Circle cx="10" cy="48" r="3" fill="#333" stroke="#111" strokeWidth="1" />
            <Circle cx="16" cy="48" r="3" fill="#333" stroke="#111" strokeWidth="1" />
            <Circle cx="13" cy="43" r="3" fill="#333" stroke="#111" strokeWidth="1" />

            {/* Blocking Sled (Top Right) */}
            <Rect x="44" y="24" width="14" height="6" fill="#1565C0" rx="2" />
            <Path d="M46 30 L44 36 M56 30 L58 36" stroke="#424242" strokeWidth="2" />

            {/* Cones (Drill Pattern) */}
            <Path d="M28 32 L31 26 L34 32 Z" fill="url(#coneOrange)" />
            <Path d="M36 40 L39 34 L42 40 Z" fill="url(#coneOrange)" />
            <Path d="M20 40 L23 34 L26 40 Z" fill="url(#coneOrange)" />

            {/* Ball Bag */}
            <Path d="M50 48 Q55 48 55 42 L50 40 L45 42 Q45 48 50 48" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="1" />
            <Circle cx="50" cy="42" r="2" fill="#6D4C41" /> {/* Ball peeking out */}
        </Svg>
    );
};

// Level 2 Film Room: Cinema seating, Surround Sound
export const FilmRoomLevel2Icon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Floor (Carpeted) */}
            <Rect x="6" y="36" width="52" height="20" rx="4" fill="#3E2723" />

            {/* Screen Frame (Wide) */}
            <Rect x="8" y="8" width="48" height="28" rx="2" fill="#263238" />
            {/* Screen Content - Tactical Map */}
            <Rect x="10" y="10" width="44" height="24" fill="url(#screenGlow)" />
            <Path d="M15 22 L25 15 M35 15 L45 22" stroke="#0277BD" strokeWidth="1.5" strokeDasharray="2 2" />
            <Circle cx="25" cy="15" r="2" fill="#D32F2F" />
            <Circle cx="35" cy="15" r="2" fill="#D32F2F" />

            {/* Speakers */}
            <Rect x="2" y="12" width="4" height="12" fill="#000" />
            <Rect x="58" y="12" width="4" height="12" fill="#000" />

            {/* Seating Rows */}
            <Path d="M12 44 H52" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
            <Path d="M10 52 H54" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />

            {/* Projector Ceiling */}
            <Rect x="28" y="4" width="8" height="4" fill="#455A64" />
        </Svg>
    );
};

// Level 2 HQ: 2-Story Modern Office
export const HeadquartersLevel2Icon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="58" rx="28" ry="6" fill="#000" opacity="0.2" />

            {/* Ground Floor */}
            <Rect x="12" y="28" width="40" height="28" fill="url(#buildingWall)" />
            <Rect x="16" y="32" width="10" height="12" fill="url(#buildingGlass)" />
            <Rect x="38" y="32" width="10" height="12" fill="url(#buildingGlass)" />

            {/* Entrance */}
            <Rect x="26" y="42" width="12" height="14" fill="#37474F" />
            <Path d="M32 42 V56" stroke="#546E7A" strokeWidth="1" />

            {/* Second Floor (Cantilevered) */}
            <Rect x="8" y="12" width="48" height="16" rx="2" fill="#CFD8DC" />
            <Rect x="12" y="14" width="40" height="12" fill="url(#buildingGlass)" />
            {/* Window Frames */}
            <Path d="M22 14 V26 M32 14 V26 M42 14 V26" stroke="#fff" strokeWidth="0.5" opacity="0.6" />

            {/* Roof Decoration */}
            <Rect x="20" y="8" width="24" height="4" fill="#455A64" />
            <Path d="M32 4 V8" stroke="#90A4AE" strokeWidth="2" />

            {/* Bushes */}
            <Circle cx="8" cy="56" r="5" fill="#2E7D32" />
            <Circle cx="16" cy="58" r="4" fill="#388E3C" />
            <Circle cx="48" cy="58" r="4" fill="#388E3C" />
            <Circle cx="56" cy="56" r="5" fill="#2E7D32" />
        </Svg>
    );
};

// Level 2 Weight Room: Multi-station Gym
export const WeightRoomLevel2Icon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Floor */}
            <Rect x="4" y="40" width="56" height="16" fill="#424242" rx="2" />

            {/* Squat Rack (Left) */}
            <Path d="M12 20 V50 M20 20 V50" stroke="#B0BEC5" strokeWidth="2" />
            <Path d="M12 24 H20" stroke="#B0BEC5" strokeWidth="2" />
            <Rect x="10" y="22" width="12" height="2" fill="#90A4AE" /> {/* Pullup bar */}

            {/* Lat Pulldown Machine (Right) */}
            <Rect x="44" y="18" width="4" height="32" fill="#546E7A" />
            <Path d="M46 18 L54 24" stroke="#000" strokeWidth="1" />
            <Rect x="50" y="24" width="10" height="2" fill="#CFD8DC" /> {/* Bar */}

            {/* Bench Press (Center) */}
            <Rect x="26" y="42" width="16" height="6" fill="#37474F" rx="2" />
            <Path d="M26 36 V46 M42 36 V46" stroke="#90A4AE" strokeWidth="2" />
            <Rect x="22" y="32" width="24" height="4" fill="#B0BEC5" rx="2" /> {/* The bar */}
            <Circle cx="22" cy="34" r="3" fill="#D32F2F" /> {/* Plate */}
            <Circle cx="46" cy="34" r="3" fill="#D32F2F" /> {/* Plate */}

            {/* Mirror on wall */}
            <Rect x="24" y="12" width="20" height="20" fill="#E1F5FE" opacity="0.6" stroke="#B3E5FC" strokeWidth="1" />
            <Path d="M24 32 L44 12" stroke="#FFF" strokeWidth="1" opacity="0.4" />
        </Svg>
    );
};

// Practice Field: Cones and Tackling Dummy
export const PracticeFieldIcon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="54" rx="26" ry="6" fill="#000" opacity="0.2" />

            {/* Field Base */}
            <Rect x="4" y="20" width="56" height="36" rx="8" fill="url(#fieldGrass)" />

            {/* 3D Depth for base */}
            <Path d="M4 56 L60 56 L60 58 L4 58 Z" fill="#558B2F" opacity="0.5" />

            {/* Hash Marks */}
            <Path d="M10 28 H54 M10 38 H54 M10 48 H54" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="4 4" />

            {/* Cone 1 (Front Left) */}
            <Path d="M12 48 L17 38 L22 48 Z" fill="url(#coneOrange)" />
            <Ellipse cx="17" cy="48" rx="5" ry="2" fill="#E65100" opacity="0.3" /> {/* shadow */}

            {/* Cone 2 (Back Middle) */}
            <Path d="M28 38 L33 28 L38 38 Z" fill="url(#coneOrange)" />
            <Ellipse cx="33" cy="38" rx="5" ry="2" fill="#E65100" opacity="0.3" />

            {/* Tackling Dummy (Right) */}
            <Rect x="44" y="24" width="12" height="24" rx="4" fill={COLORS.primary} stroke={COLORS.primaryDark} strokeWidth="1" />
            <Rect x="44" y="28" width="12" height="4" fill={COLORS.primaryLight} opacity="0.5" />
            {/* Dummy Base */}
            <Path d="M50 48 L50 52 M46 52 L54 52" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />

            {/* Scattered Ball */}
            <Circle cx="24" cy="50" r="3" fill="#795548" />
            <Path d="M22 50 L26 50" stroke="#FFF" strokeWidth="1" />
        </Svg>
    );
};

// Film Room: Projector Screen & Reels
export const FilmRoomIcon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="56" rx="26" ry="6" fill="#000" opacity="0.2" />

            {/* Screen Frame */}
            <Rect x="10" y="10" width="44" height="32" rx="2" fill="#455A64" />
            {/* Screen Content */}
            <Rect x="12" y="12" width="40" height="28" fill="url(#screenGlow)" />
            {/* Play Button on Screen */}
            <Path d="M28 20 L40 26 L28 32 Z" fill="#0288D1" opacity="0.6" />

            {/* Screen Stand Legs */}
            <Path d="M14 42 L10 52 M50 42 L54 52" stroke="#455A64" strokeWidth="3" strokeLinecap="round" />

            {/* Projector Table */}
            <Rect x="20" y="48" width="24" height="6" fill="#8D6E63" rx="1" />

            {/* Projector Body */}
            <Rect x="24" y="42" width="16" height="8" rx="2" fill="url(#projectorCase)" />
            <Circle cx="32" cy="46" r="3" fill="#81D4FA" />
            {/* Light Beam */}
            <Path d="M32 46 L16 38 L48 38 Z" fill="url(#screenGlow)" opacity="0.2" />

            {/* Film Reels (Decoration) */}
            <G transform="translate(48, 48)">
                <Circle cx="0" cy="0" r="6" fill="#37474F" />
                <Circle cx="0" cy="0" r="2" fill="#CFD8DC" />
                <Circle cx="0" cy="0" r="4" stroke="#CFD8DC" strokeWidth="1" strokeDasharray="2 2" />
            </G>
        </Svg>
    );
};

// Headquarters: Modern Glass Building
export const HeadquartersIcon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="58" rx="24" ry="6" fill="#000" opacity="0.2" />

            {/* Main Building Body */}
            <Rect x="16" y="16" width="32" height="40" rx="2" fill="url(#buildingWall)" />

            {/* Roof Overhang */}
            <Path d="M12 16 L52 16 L48 12 L16 12 Z" fill="#546E7A" />

            {/* Glass Facade - Windows */}
            <Rect x="20" y="20" width="24" height="24" rx="1" fill="url(#buildingGlass)" />

            {/* Window Grid */}
            <Path d="M20 32 H44 M32 20 V44" stroke="#FFF" strokeWidth="1" opacity="0.5" />

            {/* Doorway */}
            <Rect x="26" y="48" width="12" height="8" fill="#37474F" />
            <Path d="M32 48 V56" stroke="#546E7A" strokeWidth="1" />

            {/* Entrance Steps */}
            <Path d="M22 56 H42 L44 60 H20 Z" fill="#BDBDBD" />

            {/* Flag Pole */}
            <Path d="M16 16 V8" stroke="#78909C" strokeWidth="2" />
            <Path d="M16 8 L24 11 L16 14" fill={COLORS.primary} />

            {/* Foliage/Bushes */}
            <Circle cx="14" cy="56" r="4" fill="#43A047" />
            <Circle cx="50" cy="56" r="4" fill="#43A047" />
        </Svg>
    );
};

// Weight Room: Dumbbell and Bench
export const WeightRoomIcon: React.FC<IconProps> = ({ size = 64, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
            <BuildingGradients />

            {/* Shadow */}
            <Ellipse cx="32" cy="56" rx="28" ry="6" fill="#000" opacity="0.2" />

            {/* Floor Mat */}
            <Rect x="8" y="44" width="48" height="12" rx="2" fill="#424242" />
            <Path d="M8 44 H56" stroke="#616161" strokeWidth="1" />

            {/* Weight Bench */}
            <Rect x="20" y="32" width="24" height="6" rx="2" fill="#37474F" /> {/* Bench Pad */}
            <Path d="M24 38 L22 48 M40 38 L42 48" stroke="#BDBDBD" strokeWidth="3" strokeLinecap="round" /> {/* Legs */}

            {/* Barbell on Rack */}
            {/* Stand */}
            <Path d="M16 24 V44 M48 24 V44" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
            {/* Hooks */}
            <Path d="M14 28 H18 M46 28 H50" stroke="#78909C" strokeWidth="3" />

            {/* The Bar */}
            <Rect x="10" y="22" width="44" height="4" rx="2" fill="#90A4AE" />

            {/* Weight Plates (Red - Heavy!) */}
            <Rect x="12" y="16" width="4" height="16" rx="1" fill="url(#redPlate)" />
            <Rect x="48" y="16" width="4" height="16" rx="1" fill="url(#redPlate)" />

            {/* Dumbbell on Floor */}
            <G transform="translate(42, 50)">
                <Rect x="0" y="0" width="12" height="4" rx="1" fill="#78909C" />
                <Rect x="0" y="-2" width="2" height="8" rx="1" fill="#546E7A" />
                <Rect x="10" y="-2" width="2" height="8" rx="1" fill="#546E7A" />
            </G>
        </Svg>
    );
};
