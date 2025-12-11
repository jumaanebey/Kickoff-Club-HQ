import React from 'react';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G, Filter, FeGaussianBlur, FeMerge, FeMergeNode, FeComposite } from 'react-native-svg';

interface IconProps {
    size?: number;
    style?: any;
    color?: string;
}

// ------------------------------------------------------------------
// TRAIN: Premium Whistle
// ------------------------------------------------------------------
export const TrainIcon: React.FC<IconProps> = ({ size = 32, style, color = "#FF9A9E" }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="whistleGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FECFEF" />
                    <Stop offset="1" stopColor="#FF9A9E" />
                </LinearGradient>
                <Filter id="whistleShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <FeGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <FeMerge>
                        <FeMergeNode in="blur" />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
            </Defs>

            {/* Shadow */}
            <Path
                d="M16 26 A16 16 0 1 1 32 42 L48 42 L48 26 L32 26"
                fill="#000" opacity="0.2" transform="translate(2, 3)"
            />

            {/* Body */}
            <Path
                d="M16 24 A16 16 0 1 1 32 40 L48 40 L48 24 L32 24"
                fill="url(#whistleGrad)"
                stroke="#FF6B6B"
                strokeWidth="1.5"
                filter="url(#whistleShadow)"
            />

            {/* Specular */}
            <Path d="M12 24 C12 16 20 16 20 24" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.4" />

            {/* Mouthpiece */}
            <Path d="M48 28 L56 28 L56 36 L48 36" fill="#666" stroke="#444" strokeWidth="2" />

            {/* Air Lines (Cute) */}
            <Path d="M8 26 Q4 26 4 22" stroke="#FF9A9E" strokeWidth="2" strokeLinecap="round" />
            <Path d="M6 32 Q2 32 2 36" stroke="#FF9A9E" strokeWidth="2" strokeLinecap="round" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// UPGRADE: Premium Sparkle Arrow
// ------------------------------------------------------------------
export const UpgradeIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="arrowGrad" x1="32" y1="10" x2="32" y2="54">
                    <Stop offset="0" stopColor="#A8E6CF" />
                    <Stop offset="1" stopColor="#2ECC71" />
                </LinearGradient>
                <Filter id="arrowGlow">
                    <FeGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                    <FeMerge>
                        <FeMergeNode in="blur" />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
            </Defs>

            {/* Shadow */}
            <Path
                d="M32 8 L54 30 H42 V56 H22 V30 H10 L32 8 Z"
                fill="#000" opacity="0.2" transform="translate(0, 3)"
            />

            {/* Main Arrow */}
            <Path
                d="M32 8 L54 30 H42 V56 H22 V30 H10 L32 8 Z"
                fill="url(#arrowGrad)"
                stroke="#27AE60"
                strokeWidth="2"
                strokeLinejoin="round"
                filter="url(#arrowGlow)"
            />

            {/* Shine */}
            <Path d="M32 14 L40 24 H36 V48 H28 V24 H24 L32 14" fill="#FFF" opacity="0.3" />

            {/* Sparkles */}
            <Path d="M50 10 L52 14 L56 16 L52 18 L50 22 L48 18 L44 16 L48 14 Z" fill="#FFD700" />
            <Path d="M14 40 L16 44 L20 46 L16 48 L14 52 L12 48 L8 46 L12 44 Z" fill="#FFD700" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// PLAY MATCH: Premium Football
// ------------------------------------------------------------------
export const PlayIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="ballGrad" x1="10" y1="10" x2="54" y2="54">
                    <Stop offset="0" stopColor="#A0522D" />
                    <Stop offset="1" stopColor="#5D2906" />
                </LinearGradient>
                <Filter id="ballShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <FeGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <FeMerge>
                        <FeMergeNode />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
            </Defs>

            {/* Shadow */}
            <Path
                d="M8 32 C8 12 24 4 32 4 C40 4 56 12 56 32 C56 52 40 60 32 60 C24 60 8 52 8 32 Z"
                fill="#000" opacity="0.2" transform="translate(2, 3)"
            />

            {/* Ball */}
            <Path
                d="M8 32 C8 12 24 4 32 4 C40 4 56 12 56 32 C56 52 40 60 32 60 C24 60 8 52 8 32 Z"
                fill="url(#ballGrad)"
                stroke="#3e1c02"
                strokeWidth="2"
            />

            {/* 3D Highlight */}
            <Path
                d="M12 32 C12 18 24 8 32 8 C38 8 48 12 52 24"
                stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.2" fill="none"
            />

            {/* Laces */}
            <G transform="rotate(0 32 32)">
                <Path d="M24 24 L24 40" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                <Path d="M40 24 L40 40" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
                <Path d="M22 28 H42 M22 36 H42 M22 32 H42" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
            </G>

            {/* Cute Face */}
            <Circle cx="26" cy="20" r="2.5" fill="#FFF" />
            <Circle cx="38" cy="20" r="2.5" fill="#FFF" />
            <Path d="M30 48 Q32 50 34 48" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// COLLECT: Premium Gift Box
// ------------------------------------------------------------------
export const CollectIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="boxBody" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#FFCBA4" />
                    <Stop offset="1" stopColor="#E67E22" />
                </LinearGradient>
                <LinearGradient id="lidBody" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#F8A5A5" />
                    <Stop offset="1" stopColor="#C0392B" />
                </LinearGradient>
            </Defs>

            {/* Shadow */}
            <Rect x="12" y="24" width="40" height="32" rx="4" fill="#000" opacity="0.2" transform="translate(0, 4)" />

            {/* Box Body */}
            <Rect x="12" y="24" width="40" height="32" rx="4" fill="url(#boxBody)" stroke="#D35400" strokeWidth="1" />

            {/* Box Ribbon */}
            <Rect x="28" y="24" width="8" height="32" fill="#F1C40F" opacity="0.8" />

            {/* Lid Shadow */}
            <Rect x="8" y="16" width="48" height="4" fill="#000" opacity="0.2" transform="translate(0, 10)" />

            {/* Lid */}
            <Rect x="8" y="14" width="48" height="14" rx="3" fill="url(#lidBody)" stroke="#922B21" strokeWidth="1" />

            {/* Ribbon Knot (3D) */}
            <Path d="M32 18 C32 8 20 8 20 18" stroke="#F1C40F" strokeWidth="5" fill="none" strokeLinecap="round" />
            <Path d="M32 18 C32 8 44 8 44 18" stroke="#F1C40F" strokeWidth="5" fill="none" strokeLinecap="round" />
            <Circle cx="32" cy="18" r="4" fill="#F39C12" stroke="#FFF" strokeWidth="1" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// SPEED UP: Premium Clock
// ------------------------------------------------------------------
export const SpeedUpIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="clockFace" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#FFF" />
                    <Stop offset="1" stopColor="#ECF0F1" />
                </LinearGradient>
                <LinearGradient id="clockRim" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#BDC3C7" />
                    <Stop offset="1" stopColor="#7F8C8D" />
                </LinearGradient>
            </Defs>

            {/* Shadow */}
            <Circle cx="32" cy="32" r="24" fill="#000" opacity="0.2" transform="translate(0, 4)" />

            {/* Wings (Behind) */}
            <Path d="M8 32 Q0 24 8 12" stroke="#88D8F5" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M56 32 Q64 24 56 12" stroke="#88D8F5" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M8 32 Q0 24 8 12" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />

            {/* Rim */}
            <Circle cx="32" cy="32" r="24" fill="url(#clockRim)" />

            {/* Face */}
            <Circle cx="32" cy="32" r="20" fill="url(#clockFace)" stroke="#BDC3C7" strokeWidth="1" />

            {/* Ticks */}
            <Path d="M32 16 V18 M32 46 V48 M48 32 H46 M16 32 H18" stroke="#95A5A6" strokeWidth="2" />

            {/* Hands */}
            <G transform="rotate(45 32 32)">
                <Path d="M32 32 L32 18" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <Path d="M32 32 L40 32" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <Circle cx="32" cy="32" r="2" fill="#E74C3C" />
            </G>

            {/* Glass Reflection */}
            <Path d="M18 20 Q32 10 46 20 C42 24 22 24 18 20" fill="#FFF" opacity="0.3" />
        </Svg>
    );
};
