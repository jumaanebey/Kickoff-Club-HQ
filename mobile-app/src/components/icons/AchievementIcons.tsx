import React from 'react';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Ellipse, G } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface IconProps {
    size?: number;
    style?: any;
}

// Helper for consistent cozy shadows
const CozyShadow = () => (
    <Defs>
        <LinearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFD700" stopOpacity="1" />
            <Stop offset="1" stopColor="#DAA520" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="oceanGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#4FC3F7" />
            <Stop offset="1" stopColor="#0288D1" />
        </LinearGradient>
        <LinearGradient id="landGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#AED581" />
            <Stop offset="1" stopColor="#689F38" />
        </LinearGradient>
        <LinearGradient id="stoneGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#CFD8DC" />
            <Stop offset="1" stopColor="#90A4AE" />
        </LinearGradient>
    </Defs>
);

export const FirstUpgradeIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Crane Tower */}
        <Rect x="200" y="150" width="40" height="250" fill="#F57F17" />
        {/* Crane Cross-bracing */}
        <Path d="M200 150 L240 200 M240 150 L200 200" stroke="#FFB74D" strokeWidth="4" />
        <Path d="M200 200 L240 250 M240 200 L200 250" stroke="#FFB74D" strokeWidth="4" />
        <Path d="M200 250 L240 300 M240 250 L200 300" stroke="#FFB74D" strokeWidth="4" />
        <Path d="M200 300 L240 350 M240 300 L200 350" stroke="#FFB74D" strokeWidth="4" />
        <Path d="M200 350 L240 400 M240 350 L200 400" stroke="#FFB74D" strokeWidth="4" />

        {/* Crane Cab */}
        <Rect x="180" y="100" width="80" height="60" fill="#F57F17" rx="5" />
        <Rect x="190" y="110" width="60" height="30" fill="#E1F5FE" rx="2" /> {/* Window */}

        {/* Jib (Arm) */}
        <Rect x="220" y="110" width="200" height="20" fill="#FBC02D" />
        <Path d="M220 110 L420 110" stroke="#F57F17" strokeWidth="2" strokeDasharray="10 10" />

        {/* Cable */}
        <Path d="M400 130 V250" stroke="#333" strokeWidth="4" />

        {/* Hook/Block */}
        <Rect x="380" y="250" width="40" height="40" fill="#5D4037" rx="4" />
        <Rect x="385" y="255" width="30" height="30" fill="#8D6E63" rx="2" />

        {/* Counterweight */}
        <Rect x="100" y="110" width="80" height="40" fill="#5D4037" rx="5" />
    </Svg>
);

export const MasterBuilderIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Main Tower Body */}
        <Rect x="186" y="150" width="140" height="200" fill="url(#stoneGradient)" />

        {/* Battlements */}
        <Rect x="176" y="130" width="20" height="40" fill="#90A4AE" rx="2" />
        <Rect x="216" y="130" width="20" height="30" fill="#90A4AE" rx="2" />
        <Rect x="256" y="130" width="20" height="40" fill="#90A4AE" rx="2" />
        <Rect x="296" y="130" width="20" height="30" fill="#90A4AE" rx="2" />
        <Rect x="336" y="130" width="20" height="40" fill="#90A4AE" rx="2" />

        {/* Gate */}
        <Circle cx="256" cy="350" r="50" fill="#5D4037" />
        <Rect x="206" y="350" width="100" height="60" fill="#5D4037" />
        <Path d="M206 350 V410 H306 V350" stroke="#3E2723" strokeWidth="5" />

        {/* Portcullis (Grid) */}
        <Path d="M226 310 V400 M246 300 V400 M266 300 V400 M286 310 V400" stroke="#3E2723" strokeWidth="4" />
        <Path d="M206 340 H306 M206 360 H306 M206 380 H306" stroke="#3E2723" strokeWidth="4" />

        {/* Flag */}
        <Path d="M256 130 V60" stroke="#5D4037" strokeWidth="4" />
        <Path d="M256 60 L320 80 L256 100 V60 Z" fill={COLORS.error} />

        {/* Decorations */}
        <Rect x="200" y="200" width="20" height="40" fill="#546E7A" rx="10" />
        <Rect x="292" y="200" width="20" height="40" fill="#546E7A" rx="10" />
    </Svg>
);

export const EmpireBuilderIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Globe Ocean */}
        <Circle cx="256" cy="256" r="160" fill="url(#oceanGradient)" />

        {/* Globe Reflection */}
        <Path d="M200 120 Q350 120 380 280" stroke="#FFF" strokeWidth="20" strokeLinecap="round" opacity="0.2" fill="none" />

        {/* Land Masses (Simplified Green Blobs) */}
        <Path d="M180 200 Q220 150 260 200 T340 220 Q300 280 240 260 T180 200 Z" fill="url(#landGradient)" />
        <Path d="M280 300 Q320 280 360 320 T300 380 Q260 360 280 300 Z" fill="url(#landGradient)" />

        {/* Orbit Ring */}
        <Ellipse cx="256" cy="256" rx="200" ry="60" fill="none" stroke="#FFD700" strokeWidth="10" transform="rotate(-30 256 256)" opacity="0.6" />

        {/* Building Markers (Small Houses) */}
        {/* Marker 1 */}
        <G transform="translate(260, 180) scale(0.6)">
            <Rect x="0" y="10" width="20" height="20" fill={COLORS.error} />
            <Path d="M-5 10 L10 -5 L25 10 Z" fill={COLORS.error} />
        </G>
        {/* Marker 2 */}
        <G transform="translate(300, 320) scale(0.6)">
            <Rect x="0" y="10" width="20" height="20" fill={COLORS.error} />
            <Path d="M-5 10 L10 -5 L25 10 Z" fill={COLORS.error} />
        </G>
        {/* Marker 3 */}
        <G transform="translate(180, 240) scale(0.6)">
            <Rect x="0" y="10" width="20" height="20" fill={COLORS.error} />
            <Path d="M-5 10 L10 -5 L25 10 Z" fill={COLORS.error} />
        </G>
    </Svg>
);
