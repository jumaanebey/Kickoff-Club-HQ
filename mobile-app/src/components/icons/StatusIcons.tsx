import React from 'react';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, G, Filter, FeGaussianBlur, FeMerge, FeMergeNode, FeComposite } from 'react-native-svg';

interface IconProps {
    size?: number;
    style?: any;
}

// ------------------------------------------------------------------
// TRAINING: Premier Sweat Drop (3D Water)
// ------------------------------------------------------------------
export const TrainingIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#A8E6CF" />
                    <Stop offset="0.5" stopColor="#5DADE2" />
                    <Stop offset="1" stopColor="#2E86C1" />
                </LinearGradient>
                <Filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <FeGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <FeMerge>
                        <FeMergeNode />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
            </Defs>

            {/* Shadow */}
            <Path
                d="M32 10 Q16 34 16 44 A16 16 0 0 0 48 44 Q48 34 32 10"
                fill="#000" opacity="0.2" transform="translate(2, 3)"
            />

            {/* Main Drop */}
            <Path
                d="M32 8 Q16 32 16 42 A16 16 0 0 0 48 42 Q48 32 32 8"
                fill="url(#waterGrad)"
                stroke="#3498DB"
                strokeWidth="1"
            />

            {/* 3D Highlight/Refraction */}
            <Path
                d="M24 38 Q24 48 32 48 Q40 48 40 38"
                stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none"
            />

            {/* Specular Highlight */}
            <Path
                d="M36 18 Q42 28 42 36"
                stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none"
            />
            <Circle cx="28" cy="24" r="2" fill="#FFF" opacity="0.8" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// READY: Premium Checkmark
// ------------------------------------------------------------------
export const ReadyIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="readyGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#A8E6CF" />
                    <Stop offset="1" stopColor="#27AE60" />
                </LinearGradient>
                <Filter id="readyGlow">
                    <FeGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <FeMerge>
                        <FeMergeNode in="blur" />
                        <FeMergeNode in="SourceGraphic" />
                    </FeMerge>
                </Filter>
            </Defs>

            {/* Shadow */}
            <Circle cx="32" cy="32" r="28" fill="#000" opacity="0.15" transform="translate(0, 4)" />

            {/* Badge Body */}
            <Circle cx="32" cy="32" r="28" fill="url(#readyGrad)" stroke="#2ECC71" strokeWidth="1" />

            {/* Inner Ring Highlight */}
            <Circle cx="32" cy="32" r="26" stroke="#FFF" strokeWidth="2" opacity="0.2" />

            {/* 3D Checkmark */}
            <Path
                d="M18 32 L28 42 L46 22"
                stroke="#000"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.1"
                transform="translate(2, 2)"
            />
            <Path
                d="M18 32 L28 42 L46 22"
                stroke="#FFF"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#readyGlow)"
            />

            {/* Sparkles */}
            <Path d="M48 16 L50 12 L52 16 L56 18 L52 20 L50 24 L48 20 L44 18 Z" fill="#FFF" />
            <Circle cx="16" cy="46" r="2" fill="#FFF" opacity="0.6" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// LOCKED: Premium Padlock
// ------------------------------------------------------------------
export const LockedIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="lockBody" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#F5B7B1" />
                    <Stop offset="1" stopColor="#E74C3C" />
                </LinearGradient>
                <LinearGradient id="shackleMetal" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#BDC3C7" />
                    <Stop offset="0.5" stopColor="#FFF" />
                    <Stop offset="1" stopColor="#7F8C8D" />
                </LinearGradient>
            </Defs>

            {/* Shackle Shadow */}
            <Path
                d="M20 28 V18 A12 12 0 0 1 44 18 V28"
                stroke="#000" strokeWidth="6" opacity="0.2" strokeLinecap="round" transform="translate(0, 3)"
            />

            {/* Shackle */}
            <Path
                d="M20 28 V18 A12 12 0 0 1 44 18 V28"
                fill="none"
                stroke="url(#shackleMetal)"
                strokeWidth="6"
                strokeLinecap="round"
            />

            {/* Body Shadow */}
            <Rect x="14" y="28" width="36" height="28" rx="6" fill="#000" opacity="0.2" transform="translate(0, 4)" />

            {/* Body */}
            <Rect x="14" y="28" width="36" height="28" rx="6" fill="url(#lockBody)" stroke="#C0392B" strokeWidth="1" />

            {/* Highlight */}
            <Path d="M18 32 H46" stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

            {/* Keyhole */}
            <Circle cx="32" cy="40" r="4" fill="#5D1414" />
            <Path d="M32 40 L36 50 H28 L32 40" fill="#5D1414" />
        </Svg>
    );
};

// ------------------------------------------------------------------
// COMPLETE: Premium Trophy
// ------------------------------------------------------------------
export const CompleteIcon: React.FC<IconProps> = ({ size = 32, style }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
            <Defs>
                <LinearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFD700" />
                    <Stop offset="0.5" stopColor="#F1C40F" />
                    <Stop offset="1" stopColor="#B388FF" />
                </LinearGradient>
            </Defs>

            {/* Shadow */}
            <Path
                d="M16 16 H48 L44 36 C44 44 32 48 32 48 C32 48 20 44 20 36 L16 16 Z"
                fill="#000" opacity="0.2" transform="translate(0, 4)"
            />

            {/* Handles */}
            <Path d="M16 20 C8 20 8 32 16 32" stroke="#DAA520" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M48 20 C56 20 56 32 48 32" stroke="#DAA520" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Cup Body */}
            <Path d="M16 16 H48 L44 36 C44 44 32 48 32 48 C32 48 20 44 20 36 L16 16 Z" fill="url(#trophyGold)" />

            {/* Reflections */}
            <Path d="M22 16 L24 38 M42 16 L40 38" stroke="#FFF" strokeWidth="2" opacity="0.3" />

            {/* Base */}
            <Rect x="24" y="52" width="16" height="4" fill="#5D4037" rx="1" />
            <Path d="M32 48 V52" stroke="#DAA520" strokeWidth="4" />

            {/* Confetti */}
            <Rect x="10" y="8" width="4" height="4" fill="#F8A5A5" transform="rotate(20 12 10)" />
            <Rect x="50" y="10" width="4" height="4" fill="#A8E6CF" transform="rotate(-15 52 12)" />
            <Circle cx="32" cy="6" r="2" fill="#88D8F5" />
        </Svg>
    );
};

