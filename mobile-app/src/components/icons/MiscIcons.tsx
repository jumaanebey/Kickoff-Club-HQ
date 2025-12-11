import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
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
        <LinearGradient id="silverGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E0E0E0" stopOpacity="1" />
            <Stop offset="1" stopColor="#B0B0B0" stopOpacity="1" />
        </LinearGradient>
    </Defs>
);

export const DraftRoomIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Podium Base */}
        <Path d="M128 400 L156 250 H356 L384 400 Z" fill={COLORS.primaryDark} />
        <Rect x="120" y="400" width="272" height="40" fill={COLORS.primary} rx="10" />

        {/* Podium Top */}
        <Rect x="140" y="220" width="232" height="30" fill={COLORS.primary} rx="5" />

        {/* Microphone */}
        <Rect x="250" y="160" width="12" height="60" fill="#666" />
        <Circle cx="256" cy="150" r="25" fill="#333" stroke="#666" strokeWidth="4" />
        <Path d="M256 150 M236 170 Q256 190 276 170" stroke="#666" strokeWidth="4" fill="none" />

        {/* Decorative Star */}
        <Path d="M256 280 L265 305 H290 L270 320 L278 345 L256 330 L234 345 L242 320 L222 305 H247 Z" fill="#FFD700" />
    </Svg>
);

export const ConcessionIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Cart Body */}
        <Rect x="156" y="250" width="200" height="120" fill={COLORS.white} rx="10" />
        <Path d="M156 280 H356 V350 H156 Z" fill={COLORS.error} /> {/* Stripe */}

        {/* Wheels */}
        <Circle cx="180" cy="370" r="30" fill="#333" />
        <Circle cx="332" cy="370" r="30" fill="#333" />

        {/* Awning (Striped) */}
        <Path d="M140 250 L120 150 H392 L372 250 Z" fill={COLORS.error} />
        <Path d="M180 250 L170 150 H210 L220 250 Z" fill={COLORS.white} />
        <Path d="M260 250 L250 150 H290 L300 250 Z" fill={COLORS.white} />
        <Path d="M340 250 L330 150 H370 L380 250 Z" fill={COLORS.white} />

        {/* Hotdog on top */}
        <Rect x="216" y="120" width="80" height="30" fill="#F4A460" rx="15" /> {/* Bun */}
        <Rect x="226" y="125" width="60" height="20" fill="#CC0000" rx="10" /> {/* Meat */}
        <Path d="M236 125 Q246 145 256 125 T276 125" stroke="#FFD700" strokeWidth="4" fill="none" /> {/* Mustard */}
    </Svg>
);

export const LockerRoomIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Lockers */}
        <Rect x="136" y="100" width="80" height="280" fill={COLORS.secondary} rx="5" />
        <Rect x="216" y="100" width="80" height="280" fill={COLORS.secondaryDark} rx="5" />
        <Rect x="296" y="100" width="80" height="280" fill={COLORS.secondary} rx="5" />

        {/* Vents */}
        <Rect x="156" y="130" width="40" height="5" fill={COLORS.white} opacity="0.5" />
        <Rect x="156" y="140" width="40" height="5" fill={COLORS.white} opacity="0.5" />
        <Rect x="156" y="150" width="40" height="5" fill={COLORS.white} opacity="0.5" />

        <Rect x="236" y="130" width="40" height="5" fill={COLORS.white} opacity="0.5" />
        <Rect x="236" y="140" width="40" height="5" fill={COLORS.white} opacity="0.5" />
        <Rect x="236" y="150" width="40" height="5" fill={COLORS.white} opacity="0.5" />

        <Rect x="316" y="130" width="40" height="5" fill={COLORS.white} opacity="0.5" />
        <Rect x="316" y="140" width="40" height="5" fill={COLORS.white} opacity="0.5" />
        <Rect x="316" y="150" width="40" height="5" fill={COLORS.white} opacity="0.5" />

        {/* Jersey hanging in middle locker */}
        <Path d="M236 180 H276 L286 200 V260 H226 V200 Z" fill={COLORS.primary} />
        <TextWrapper x="256" y="235" text="10" fontSize="20" color="#FFF" />

        {/* Bench */}
        <Rect x="116" y="380" width="280" height="40" fill="#8B4513" rx="5" />
        <Rect x="136" y="420" width="20" height="40" fill="#5C3317" />
        <Rect x="356" y="420" width="20" height="40" fill="#5C3317" />
    </Svg>
);

export const LeagueIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Shield Shape */}
        <Path
            d="M256 60 L120 120 V250 Q120 380 256 460 Q392 380 392 250 V120 Z"
            fill="url(#goldGradient)"
            stroke="#DAA520"
            strokeWidth="10"
        />

        {/* Inner Shield */}
        <Path
            d="M256 90 L150 140 V240 Q150 340 256 420 Q362 340 362 240 V140 Z"
            fill={COLORS.primary}
        />

        {/* Star */}
        <Path
            d="M256 160 L275 220 H335 L285 260 L305 320 L256 280 L207 320 L227 260 L177 220 H237 Z"
            fill="#FFF"
        />
    </Svg>
);

export const MissionsIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Clipboard Board */}
        <Rect x="136" y="80" width="240" height="352" fill="#8B4513" rx="10" />
        <Rect x="156" y="100" width="200" height="312" fill="#FFF" rx="5" />

        {/* Clip (Metal) */}
        <Rect x="180" y="60" width="152" height="60" fill="url(#silverGradient)" rx="10" />
        <Circle cx="256" cy="70" r="15" fill="#333" /> {/* Hole */}

        {/* Lines/Tasks */}
        <Rect x="200" y="150" width="130" height="10" fill="#EEE" rx="5" />
        <Rect x="176" y="150" width="15" height="15" fill={COLORS.success} rx="3" /> {/* Checkbox */}
        <Path d="M178 158 L182 162 L188 154" stroke="#FFF" strokeWidth="3" fill="none" /> {/* Check */}

        <Rect x="200" y="190" width="130" height="10" fill="#EEE" rx="5" />
        <Rect x="176" y="190" width="15" height="15" fill={COLORS.success} rx="3" />
        <Path d="M178 198 L182 202 L188 194" stroke="#FFF" strokeWidth="3" fill="none" />

        <Rect x="200" y="230" width="130" height="10" fill="#EEE" rx="5" />
        <Rect x="176" y="230" width="15" height="15" fill="#DDD" rx="3" /> {/* Empty Checkbox */}

        <Rect x="200" y="270" width="130" height="10" fill="#EEE" rx="5" />
        <Rect x="176" y="270" width="15" height="15" fill="#DDD" rx="3" />
    </Svg>
);

// Helper for text (if needed, simplified to avoided direct Text import from RN)
// But wait, react-native-svg supports Text. Let's use it sparingly.
const TextWrapper = ({ x, y, text, fontSize, color }: any) => (
    // SVGs text support can be tricky with fonts, keeping it simple or using paths is safer.
    // For now, let's just use shapes or skip text to keep it purely graphical if possible.
    // I'll skip the text inside SVG to avoid potential font linking issues and keep it illustrative.
    <G />
);
