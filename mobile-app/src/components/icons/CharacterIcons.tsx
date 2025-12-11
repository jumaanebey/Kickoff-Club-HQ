import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, ClipPath, Ellipse, Text } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface IconProps {
    size?: number;
    style?: any;
}

// Global Definitions for Character Gradients
const CharacterDefs = () => (
    <Defs>
        {/* Skin Tone Gradient */}
        <LinearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFCCBC" />
            <Stop offset="1" stopColor="#D84315" stopOpacity="0.3" />
        </LinearGradient>

        {/* Shiny Helmet Gradient */}
        <LinearGradient id="helmetShiny" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0.2" stopColor={COLORS.primaryLight} />
            <Stop offset="0.5" stopColor={COLORS.primary} />
            <Stop offset="0.9" stopColor={COLORS.primaryDark} />
        </LinearGradient>

        {/* Visor Reflection */}
        <LinearGradient id="visorGlass" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#81D4FA" stopOpacity="0.9" />
            <Stop offset="0.5" stopColor="#29B6F6" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#0288D1" stopOpacity="0.9" />
        </LinearGradient>

        {/* Cloth/Jersey Gradient */}
        <LinearGradient id="jersey" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.primary} />
            <Stop offset="1" stopColor={COLORS.primaryDark} />
        </LinearGradient>

        {/* Drop Shadow */}
        <LinearGradient id="dropShadow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#000" stopOpacity="0" />
        </LinearGradient>
    </Defs>
);

export const QuarterbackIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
        <CharacterDefs />

        {/* Shadow */}
        <Ellipse cx="32" cy="58" rx="20" ry="4" fill="#000" opacity="0.2" />

        {/* Back Arm (Throwing) */}
        <Path d="M38 28 L48 20" stroke="#FFAB91" strokeWidth="4" strokeLinecap="round" />
        <Circle cx="48" cy="20" r="3" fill="#FFAB91" />

        {/* Body (Jersey) */}
        <Rect x="24" y="28" width="16" height="20" rx="4" fill="url(#jersey)" />
        <Path d="M28 28 V48 M36 28 V48" stroke={COLORS.primaryDark} strokeWidth="0.5" opacity="0.5" />

        {/* Number 1 */}
        <Path d="M31 32 H33 V42 H31" stroke="white" strokeWidth="2" />

        {/* Head/Helmet */}
        <Circle cx="32" cy="20" r="10" fill="url(#helmetShiny)" />
        <Path d="M32 20 L40 22 L38 28 Z" fill="url(#visorGlass)" opacity="0.8" /> {/* Side Visor */}
        <Rect x="30" y="24" width="8" height="4" rx="1" fill="#333" /> {/* Facemask side */}

        {/* Front Arm (Pointing) */}
        <Path d="M24 30 L16 34" stroke="#FFAB91" strokeWidth="4" strokeLinecap="round" />

        {/* Legs */}
        <Path d="M28 48 L26 58" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <Path d="M36 48 L40 56" stroke="white" strokeWidth="4" strokeLinecap="round" />
        {/* Shoes */}
        <Path d="M24 58 L28 58" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        <Path d="M38 56 L42 56" stroke="#333" strokeWidth="3" strokeLinecap="round" />

        {/* The Ball (In hand ready to throw) */}
        <Ellipse cx="50" cy="18" rx="4" ry="6" fill="brown" transform="rotate(30, 50, 18)" />
        <Path d="M48 18 L52 18" stroke="white" strokeWidth="0.5" transform="rotate(30, 50, 18)" />
    </Svg>
);

export const LinebackerIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
        <CharacterDefs />

        {/* Shadow */}
        <Ellipse cx="32" cy="58" rx="24" ry="4" fill="#000" opacity="0.2" />

        {/* Massive Shoulder Pads - Underlayer */}
        <Rect x="16" y="22" width="32" height="10" rx="4" fill="#5D4037" />

        {/* Body (Jersey) - Wide */}
        <Rect x="20" y="28" width="24" height="20" rx="4" fill="url(#jersey)" />
        {/* Number 52 */}
        <Path d="M26 34 H30 V38 H26 V42 H30" stroke="white" strokeWidth="1.5" fill="none" />
        <Path d="M34 34 H38 V38 H34 V42 H38" stroke="white" strokeWidth="1.5" fill="none" />

        {/* Arms (Thick) */}
        <Path d="M18 26 L12 40" stroke="#FFAB91" strokeWidth="6" strokeLinecap="round" />
        <Path d="M46 26 L52 40" stroke="#FFAB91" strokeWidth="6" strokeLinecap="round" />

        {/* Gloves/Hands */}
        <Circle cx="12" cy="42" r="3" fill="#333" />
        <Circle cx="52" cy="42" r="3" fill="#333" />

        {/* Head/Helmet */}
        <Circle cx="32" cy="18" r="9" fill="url(#helmetShiny)" />
        <Rect x="26" y="16" width="12" height="6" fill="#333" rx="2" /> {/* Visor */}
        <Path d="M27 22 H37 M29 24 H35" stroke="#DDD" strokeWidth="1" /> {/* Grille */}

        {/* Legs (Stance) */}
        <Path d="M26 48 L22 58" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <Path d="M38 48 L42 58" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </Svg>
);

export const ReceiverIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
        <CharacterDefs />

        {/* Shadow - Displaced for jump */}
        <Ellipse cx="32" cy="60" rx="14" ry="3" fill="#000" opacity="0.15" />

        {/* Jumping Offset Group */}
        <G transform="translate(0, -4)">
            {/* Arms Reaching Up */}
            <Path d="M26 28 L20 16" stroke="#FFAB91" strokeWidth="3.5" strokeLinecap="round" />
            <Path d="M38 28 L44 14" stroke="#FFAB91" strokeWidth="3.5" strokeLinecap="round" />

            {/* Gloves */}
            <Circle cx="20" cy="15" r="2.5" fill="#FFF" />
            <Circle cx="44" cy="13" r="2.5" fill="#FFF" />

            {/* Body (Slim) */}
            <Rect x="26" y="28" width="12" height="18" rx="3" fill="url(#jersey)" />
            {/* Number 80 */}
            <Text x="32" y="42" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">88</Text>

            {/* Head/Helmet */}
            <Circle cx="32" cy="24" r="8" fill="url(#helmetShiny)" />
            <Rect x="29" y="22" width="6" height="4" fill="#333" /> {/* Visor */}

            {/* Legs (One knee up) */}
            <Path d="M28 46 L26 56" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            <Path d="M36 46 L40 50 L38 56" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const CoachIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
        <CharacterDefs />

        {/* Shadow */}
        <Ellipse cx="32" cy="69" rx="22" ry="4" fill="#000" opacity="0.2" />

        {/* Body (Polo Shirt) - White/Cream */}
        <Path d="M22 30 H42 V50 H22 Z" fill="#FFF8E1" stroke={COLORS.border} strokeWidth="1" />
        <Path d="M32 30 V40" stroke={COLORS.border} strokeWidth="1" /> {/* Placket */}

        {/* Arms (Crossed?) */}
        <Path d="M22 34 L18 44" stroke="#FFAB91" strokeWidth="4" strokeLinecap="round" />
        <Path d="M42 34 L46 44" stroke="#FFAB91" strokeWidth="4" strokeLinecap="round" />

        {/* Clipboard */}
        <Rect x="42" y="38" width="14" height="18" fill="brown" transform="rotate(-15, 42, 38)" />
        <Rect x="43" y="39" width="10" height="14" fill="white" transform="rotate(-15, 43, 39)" />

        {/* Head */}
        <Circle cx="32" cy="22" r="9" fill="#FFAB91" />
        <Rect x="27" y="20" width="10" height="3" fill="#333" /> {/* Sunglasses */}

        {/* Cap */}
        <Path d="M22 16 H42 V20 H22 Z" fill={COLORS.primaryDark} />
        <Path d="M22 20 H46" stroke={COLORS.primaryDark} strokeWidth="2" strokeLinecap="round" /> {/* Brim */}

        {/* Headset Mic */}
        <Path d="M32 22 L24 26" stroke="#333" strokeWidth="1" />
        <Circle cx="24" cy="26" r="1.5" fill="#333" />

        {/* Legs (Khakis) */}
        <Path d="M26 50 L26 60" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
        <Path d="M38 50 L38 60" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
    </Svg>
);

export const RunningBackIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
        <CharacterDefs />

        {/* Speed Lines */}
        <Path d="M10 40 H20 M8 46 H16" stroke={COLORS.accent} strokeWidth="2" opacity="0.6" strokeLinecap="round" />

        {/* Leaning Body */}
        <G transform="rotate(15, 32, 32)">
            {/* Body */}
            <Rect x="24" y="26" width="16" height="18" rx="4" fill="url(#jersey)" />

            {/* Ball Tucked High */}
            <Ellipse cx="40" cy="32" rx="5" ry="7" fill="brown" transform="rotate(-15, 40, 32)" />
            <Path d="M39 30 L41 34" stroke="white" strokeWidth="0.5" transform="rotate(-15, 40, 32)" />

            {/* Arms - Protecting Ball */}
            <Path d="M36 28 L40 36 L34 40" stroke="#FFAB91" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M28 28 L24 36" stroke="#FFAB91" strokeWidth="4" strokeLinecap="round" />

            {/* Head */}
            <Circle cx="32" cy="18" r="9" fill="url(#helmetShiny)" />
            <Rect x="32" y="16" width="8" height="4" fill="#333" rx="1" /> {/* Visor Side */}

            {/* Legs - Driving */}
            <Path d="M28 44 L24 54" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
            <Path d="M36 44 L42 50 L40 56" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </G>
    </Svg>
);

export const LinemanIcon: React.FC<IconProps> = ({ size = 64, style }) => (
    <Svg width={size} height={size} viewBox="0 0 64 64" style={style}>
        <CharacterDefs />

        {/* Shadow */}
        <Ellipse cx="32" cy="58" rx="26" ry="4" fill="#000" opacity="0.2" />

        {/* Crouch Transformation */}
        <G transform="translate(0, 4)">
            {/* Huge Shoulder Pads */}
            <Rect x="14" y="24" width="36" height="10" rx="3" fill="#5D4037" />

            {/* Body Block */}
            <Rect x="18" y="30" width="28" height="16" rx="4" fill="url(#jersey)" />

            {/* Head Down */}
            <Circle cx="32" cy="22" r="9" fill={COLORS.primaryDark} />
            <Rect x="26" y="22" width="12" height="6" fill="#AAA" rx="1" /> {/* Cage */}
            <Path d="M28 24 H36 M30 26 H34" stroke="#333" strokeWidth="0.5" />

            {/* Arms Planted */}
            <Path d="M16 28 L14 44" stroke="#FFAB91" strokeWidth="5" strokeLinecap="round" />
            <Path d="M48 28 L50 44" stroke="#FFAB91" strokeWidth="5" strokeLinecap="round" />

            {/* Hands/Knuckles on ground */}
            <Circle cx="13" cy="46" r="3" fill="#333" />
            <Circle cx="51" cy="46" r="3" fill="#333" />

            {/* Legs Wide */}
            <Path d="M22 46 L18 54" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <Path d="M42 46 L46 54" stroke="white" strokeWidth="5" strokeLinecap="round" />
        </G>
    </Svg>
);
