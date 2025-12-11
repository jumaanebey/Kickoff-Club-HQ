import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, ClipPath, Ellipse } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface IconProps {
    size?: number;
    style?: any;
}

// Helper for consistent cozy shadows
const CozyShadow = () => (
    <Defs>
        <LinearGradient id="characterGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={COLORS.primary} stopOpacity="1" />
            <Stop offset="1" stopColor={COLORS.primaryDark} stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="skinGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFDFB9" stopOpacity="1" />
            <Stop offset="1" stopColor="#E6C298" stopOpacity="1" />
        </LinearGradient>
    </Defs>
);

export const QuarterbackIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        {/* Background Circle */}
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Helmet */}
        <Path
            d="M180 120 C180 80 220 50 256 50 C292 50 332 80 332 120 V160 H180 V120 Z"
            fill={COLORS.primary}
            stroke={COLORS.primaryDark}
            strokeWidth="10"
        />
        <Rect x="200" y="140" width="112" height="20" fill="#333" rx="5" /> { /* Visor */}

        {/* Body - Throwing Pose */}
        <Path d="M220 180 H292 V320 H220 Z" fill={COLORS.primary} />

        {/* Arm holding ball (Cocked back) */}
        <Path d="M300 200 L360 160" stroke={COLORS.secondary} strokeWidth="30" strokeLinecap="round" />
        <Circle cx="370" cy="150" r="30" fill="#8B4513" /> {/* The Ball */}

        {/* Arm extending forward */}
        <Path d="M210 200 L150 220" stroke={COLORS.secondary} strokeWidth="30" strokeLinecap="round" />

        {/* Legs */}
        <Path d="M230 320 L230 440" stroke={COLORS.text} strokeWidth="35" strokeLinecap="round" />
        <Path d="M280 320 L280 440" stroke={COLORS.text} strokeWidth="35" strokeLinecap="round" />
    </Svg>
);

export const LinebackerIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Bulky Shoulder Pads */}
        <Path d="M150 180 Q256 140 362 180 L350 240 H162 Z" fill={COLORS.secondary} />

        {/* Helmet */}
        <Circle cx="256" cy="120" r="50" fill={COLORS.primary} />

        {/* Body */}
        <Rect x="180" y="240" width="152" height="120" fill={COLORS.primary} rx="20" />

        {/* Defensive Stance Arms */}
        <Path d="M160 200 L120 280" stroke="#E6C298" strokeWidth="40" strokeLinecap="round" />
        <Path d="M352 200 L392 280" stroke="#E6C298" strokeWidth="40" strokeLinecap="round" />
    </Svg>
);

export const ReceiverIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Dynamic Running Pose */}
        <G transform="rotate(-15, 256, 256)">
            {/* Helmet */}
            <Circle cx="280" cy="100" r="45" fill={COLORS.accent} />

            {/* Slim Body */}
            <Path d="M240 160 H320 V300 H240 Z" fill={COLORS.primary} />

            {/* Arms Reaching Up */}
            <Path d="M320 180 L380 120" stroke="#E6C298" strokeWidth="25" strokeLinecap="round" />
            <Path d="M240 180 L180 140" stroke="#E6C298" strokeWidth="25" strokeLinecap="round" />

            {/* Running Legs */}
            <Path d="M260 300 L240 400" stroke={COLORS.text} strokeWidth="30" strokeLinecap="round" />
            <Path d="M300 300 L340 360 L360 400" stroke={COLORS.text} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const CoachIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Cap */}
        <Path d="M200 100 H312 V140 H200 Z" fill={COLORS.primaryDark} />
        <Path d="M312 140 H360" stroke={COLORS.primaryDark} strokeWidth="15" strokeLinecap="round" /> {/* Brim */}

        {/* Head */}
        <Circle cx="256" cy="160" r="50" fill="#E6C298" />
        <Rect x="220" y="150" width="70" height="10" fill="#333" /> {/* Sunglasses */}
        <Path d="M200 160 L200 190 H220" stroke="#333" strokeWidth="5" fill="none" /> {/* Headset Mic */}

        {/* Body */}
        <Path d="M180 220 H332 V360 H180 Z" fill={COLORS.white} /> {/* Polo Shirt */}
        <Path d="M256 220 V300" stroke={COLORS.border} strokeWidth="2" /> {/* Shirt placket */}

        {/* Clipboard */}
        <Rect x="280" y="280" width="80" height="100" fill="#D2691E" transform="rotate(-10, 280, 280)" />
        <Rect x="290" y="290" width="60" height="80" fill="#FFF" transform="rotate(-10, 290, 290)" />
    </Svg>
);

export const RunningBackIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Dynamic Running Pose */}
        <G transform="rotate(10, 256, 256)">
            {/* Helmet */}
            <Circle cx="280" cy="120" r="45" fill={COLORS.accent} />
            <Rect x="260" y="110" width="40" height="50" rx="10" fill="#333" opacity="0.3" transform="rotate(10 280 135)" /> {/* Visor */}

            {/* Body */}
            <Path d="M220 170 H340 V320 H220 Z" fill={COLORS.primary} />

            {/* Ball tucked high and tight */}
            <Ellipse cx="350" cy="220" rx="25" ry="40" fill="#8B4513" transform="rotate(20 350 220)" />
            <Path d="M360 210 L340 230" stroke="#FFF" strokeWidth="2" />

            {/* Arm covering ball */}
            <Path d="M300 180 L360 240 L340 280" stroke="#E6C298" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M260 180 L200 240" stroke="#E6C298" strokeWidth="30" strokeLinecap="round" />

            {/* Legs Driving */}
            <Path d="M260 320 L240 400" stroke={COLORS.text} strokeWidth="35" strokeLinecap="round" />
            <Path d="M300 320 L360 380 L320 440" stroke={COLORS.text} strokeWidth="35" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const LinemanIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
        <CozyShadow />
        <Circle cx="256" cy="256" r="240" fill={COLORS.backgroundLight} />

        {/* Low Center of Gravity Stance */}
        <G transform="translate(0, 50)">
            {/* Massive Shoulder Pads */}
            <Rect x="136" y="160" width="240" height="80" rx="20" fill={COLORS.secondary} />

            {/* Helmet (Head down) */}
            <Circle cx="256" cy="160" r="60" fill={COLORS.primaryDark} />
            <Rect x="226" y="160" width="60" height="10" fill="#DDD" /> {/* Facemask bar */}
            <Rect x="236" y="140" width="40" height="40" fill="none" stroke="#DDD" strokeWidth="5" /> {/* Facemask cage */}

            {/* Body */}
            <Rect x="156" y="240" width="200" height="150" fill={COLORS.primary} rx="20" />

            {/* Arms planted/ready */}
            <Path d="M150 200 L120 300" stroke="#E6C298" strokeWidth="50" strokeLinecap="round" />
            <Path d="M362 200 L392 300" stroke="#E6C298" strokeWidth="50" strokeLinecap="round" />

            {/* Legs Wide */}
            <Path d="M180 390 L140 460" stroke={COLORS.text} strokeWidth="45" strokeLinecap="round" />
            <Path d="M332 390 L372 460" stroke={COLORS.text} strokeWidth="45" strokeLinecap="round" />
        </G>
    </Svg>
);
