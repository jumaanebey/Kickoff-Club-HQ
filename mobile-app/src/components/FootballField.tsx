import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface FootballFieldProps {
  width: number;
  height: number;
}

export default function FootballField({ width, height }: FootballFieldProps) {
  // Field colors - Sunny Day Style using Theme
  // Using slightly lighter/warmer greens than standard theme for that "sunny" feel
  const grassLight = '#C5E1A5'; // Lighter Lime
  const grassDark = COLORS.secondaryLight; // Minty Green
  const lineColor = 'rgba(255, 255, 255, 0.9)';
  const lineWidth = 2;

  // Calculate yard line spacing
  const yardLineSpacing = height / 12; // 10 yard lines + 2 end zones

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          {/* Gradient for grass effect - Vertical gradient for depth */}
          <LinearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={grassLight} stopOpacity="1" />
            <Stop offset="50%" stopColor={grassDark} stopOpacity="1" />
            <Stop offset="100%" stopColor={grassLight} stopOpacity="1" />
          </LinearGradient>

          {/* Subtle overlay for sun glare */}
          <LinearGradient id="sunGlare" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Field background */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#grassGradient)" />

        {/* Horizontal stripes for grass pattern */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Rect
            key={`stripe-${i}`}
            x="0"
            y={i * (height / 3)}
            width={width}
            height={height / 6}
            fill={i % 2 === 0 ? grassLight : grassDark}
            opacity="0.4"
          />
        ))}

        {/* Sun Glare Overlay */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#sunGlare)" />

        {/* Sidelines */}
        <Line
          x1="40"
          y1="40"
          x2="40"
          y2={height - 40}
          stroke={lineColor}
          strokeWidth={lineWidth * 2}
        />
        <Line
          x1={width - 40}
          y1="40"
          x2={width - 40}
          y2={height - 40}
          stroke={lineColor}
          strokeWidth={lineWidth * 2}
        />

        {/* End zone lines */}
        <Line
          x1="40"
          y1="40"
          x2={width - 40}
          y2="40"
          stroke={lineColor}
          strokeWidth={lineWidth * 2}
        />
        <Line
          x1="40"
          y1={height - 40}
          x2={width - 40}
          y2={height - 40}
          stroke={lineColor}
          strokeWidth={lineWidth * 2}
        />

        {/* Yard lines */}
        {Array.from({ length: 11 }).map((_, i) => {
          const y = 40 + yardLineSpacing * (i + 1);
          const isFiftyYardLine = i === 5;

          return (
            <Line
              key={`yard-${i}`}
              x1="40"
              y1={y}
              x2={width - 40}
              y2={y}
              stroke={lineColor}
              strokeWidth={isFiftyYardLine ? lineWidth * 1.5 : lineWidth}
              opacity={isFiftyYardLine ? 1 : 0.7}
            />
          );
        })}

        {/* Hash marks on each yard line */}
        {Array.from({ length: 11 }).map((_, i) => {
          const y = 40 + yardLineSpacing * (i + 1);
          const hashLength = 15;

          return (
            <React.Fragment key={`hash-${i}`}>
              {/* Left hash marks */}
              <Line
                x1={width * 0.35}
                y1={y - hashLength}
                x2={width * 0.35}
                y2={y + hashLength}
                stroke={lineColor}
                strokeWidth={lineWidth}
                opacity="0.6"
              />
              {/* Right hash marks */}
              <Line
                x1={width * 0.65}
                y1={y - hashLength}
                x2={width * 0.65}
                y2={y + hashLength}
                stroke={lineColor}
                strokeWidth={lineWidth}
                opacity="0.6"
              />
            </React.Fragment>
          );
        })}

        {/* 50 yard line center circle */}
        <Circle
          cx={width / 2}
          cy={height / 2}
          r="30"
          stroke={lineColor}
          strokeWidth={lineWidth}
          fill="none"
          opacity="0.8"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
