import React from 'react';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G, Ellipse, Filter, FeGaussianBlur, FeMerge, FeMergeNode, FeComposite } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface IconProps {
    size?: number;
    style?: any;
}

// ------------------------------------------------------------------
// COINS: Premium 3D Style
// ------------------------------------------------------------------
export const CoinIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="goldRim" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#F9D423" />
                    <Stop offset="1" stopColor="#B38B06" />
                </LinearGradient>
                <LinearGradient id="goldFace" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFEF97" />
                    <Stop offset="0.5" stopColor="#F5C400" />
                    <Stop offset="1" stopColor="#Dfa300" />
                </LinearGradient>
                <Filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <FeGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <FeMerge>
                        <FeMergeNode in="blur" />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
                <Filter id="innerGlow">
                    <FeGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
                    <FeComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                    <FeComposite in="shadowDiff" in2="SourceAlpha" operator="in" />
                </Filter>
            </Defs>

            {/* Shadow Group */}
            <G transform="translate(0, 2)" opacity="0.3">
                <Ellipse cx="32" cy="48" rx="20" ry="8" fill="#000" filter="url(#dropShadow)" />
            </G>

            {/* Edge/Thickness */}
            <Path
                d="M12 32 C12 40 21 46 32 46 C43 46 52 40 52 32 V38 C52 46 43 52 32 52 C21 52 12 46 12 38 Z"
                fill="url(#goldRim)"
            />

            {/* Main Face Container */}
            <G transform="translate(0, 0)">
                {/* Outer Ring */}
                <Circle cx="32" cy="32" r="20" fill="#E6B800" stroke="#B8860B" strokeWidth="1" />

                {/* Main Face Gradient */}
                <Circle cx="32" cy="32" r="18" fill="url(#goldFace)" />

                {/* Inner Bevel/Highlight */}
                <Circle cx="32" cy="32" r="16" stroke="#FFF" strokeWidth="1" opacity="0.4" />

                {/* Shiny Specular Highlight */}
                <Ellipse cx="24" cy="24" rx="6" ry="3" fill="#FFF" opacity="0.7" transform="rotate(-45 24 24)" />

                {/* Symbol */}
                <Path
                    d="M32 24 V40 M28 26 H34 M28 38 H34 M28 28 C28 24 36 24 36 28 C36 32 28 32 28 36 C28 40 36 40 36 36"
                    stroke="#Dfa300" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
                <Path
                    d="M32 24 V40 M28 26 H34 M28 38 H34 M28 28 C28 24 36 24 36 28 C36 32 28 32 28 36 C28 40 36 40 36 36"
                    stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
            </G>
        </Svg>
    );
};

// ------------------------------------------------------------------
// ENERGY: Premium 3D Style
// ------------------------------------------------------------------
export const EnergyIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="boltBody" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFFACD" />
                    <Stop offset="1" stopColor="#FFD700" />
                </LinearGradient>
                <LinearGradient id="boltBorder" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#FFD700" />
                    <Stop offset="1" stopColor="#DAA520" />
                </LinearGradient>
                <Filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <FeGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <FeMerge>
                        <FeMergeNode in="blur" />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
            </Defs>

            {/* Background Glow */}
            <Circle cx="32" cy="32" r="28" fill="#FFF8E7" stroke="#FFE66D" strokeWidth="2" opacity="0.6" />

            {/* Bolt Shadow */}
            <Path
                d="M36 14 L22 36 H32 L28 50 L46 26 H32 L36 14 Z"
                fill="#000" opacity="0.2" transform="translate(2, 2)"
            />

            {/* Main Bolt */}
            <G filter="url(#energyGlow)">
                <Path
                    d="M36 12 L20 34 H32 L26 52 L44 28 H30 L36 12 Z"
                    fill="url(#boltBody)"
                    stroke="url(#boltBorder)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </G>

            {/* Specular Highlight */}
            <Path d="M34 16 L24 34 H28 L27 38 L38 24 H30 L34 16 Z" fill="#FFF" opacity="0.4" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// KNOWLEDGE POINTS (KP): Premium 3D Book
// ------------------------------------------------------------------
export const KPIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="bookBlue" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#88D8F5" />
                    <Stop offset="1" stopColor="#2980B9" />
                </LinearGradient>
                <LinearGradient id="pages" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#FFF" />
                    <Stop offset="1" stopColor="#EEE" />
                </LinearGradient>
            </Defs>

            {/* Shadow */}
            <Rect x="14" y="16" width="38" height="34" rx="3" fill="#000" opacity="0.2" transform="translate(2, 2)" />

            {/* Back Cover */}
            <Path d="M12 48 L52 48 C54 48 56 46 56 44 L56 16 C56 14 54 12 52 12 L16 12" stroke="#2980B9" strokeWidth="3" fill="none" />

            {/* Pages Block */}
            <Path d="M14 16 L50 16 C52 16 52 18 50 18 L14 18 Z" fill="#FFF" />
            <Rect x="14" y="15" width="36" height="30" fill="url(#pages)" />

            {/* Front Cover */}
            <Rect x="11" y="13" width="40" height="32" rx="4" fill="url(#bookBlue)" stroke="#2980B9" strokeWidth="1" />

            {/* Cover Decoration */}
            <Circle cx="31" cy="29" r="6" fill="#FFF" opacity="0.3" />
            <Path d="M31 25 L31 33 M27 29 L35 29" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

            {/* Spine Shine */}
            <Rect x="12" y="14" width="4" height="30" fill="#FFF" opacity="0.2" rx="1" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// XP: Premium 3D Star
// ------------------------------------------------------------------
export const XPIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="starBody" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#D2B4DE" />
                    <Stop offset="1" stopColor="#8E44AD" />
                </LinearGradient>
                <LinearGradient id="starRim" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#E8DAEF" />
                    <Stop offset="1" stopColor="#6C3483" />
                </LinearGradient>
            </Defs>

            {/* Shadow */}
            <Path
                d="M32 8 L38 24 L56 24 L42 36 L48 52 L32 42 L16 52 L22 36 L8 24 L26 24 Z"
                fill="#000" opacity="0.2" transform="translate(0, 3)"
            />

            {/* Main Star */}
            <Path
                d="M32 8 L38 24 L56 24 L42 36 L48 52 L32 42 L16 52 L22 36 L8 24 L26 24 Z"
                fill="url(#starBody)"
                stroke="url(#starRim)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Bevel Effect (Top Half) */}
            <Path
                d="M32 8 L38 24 L56 24 L42 36 C42 30 32 30 22 36 L8 24 L26 24 Z"
                fill="#FFF" opacity="0.2"
            />

            {/* Face */}
            <G opacity="0.9">
                <Circle cx="26" cy="30" r="2.5" fill="#3E2723" />
                <Circle cx="38" cy="30" r="2.5" fill="#3E2723" />
                <Path d="M28 36 Q32 40 36 36" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Cheeks */}
                <Circle cx="24" cy="33" r="1.5" fill="#E91E63" opacity="0.4" />
                <Circle cx="40" cy="33" r="1.5" fill="#E91E63" opacity="0.4" />
            </G>
        </Svg>
    );
};
