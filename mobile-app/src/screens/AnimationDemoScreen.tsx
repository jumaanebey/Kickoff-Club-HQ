import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AnimatedButton, AnimatedCoinCollect, AnimatedBuildingUpgrade } from '../components/animations';

/**
 * Demo screen showing all FarmVille-style animations
 * Remove this file in production - it's just for testing animations
 */
export default function AnimationDemoScreen() {
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [coinCount, setCoinCount] = useState(0);

  const handleCollectCoins = () => {
    setShowCoinAnimation(true);
  };

  const handleUpgradeBuilding = () => {
    setIsUpgrading(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Animation Demo</Text>
      <Text style={styles.subtitle}>Test all FarmVille-style animations</Text>

      {/* Coin Counter */}
      <View style={styles.coinCounter}>
        <Text style={styles.coinText}>💰 Coins: {coinCount}</Text>
      </View>

      {/* Animated Button Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Animated Buttons</Text>
        <Text style={styles.description}>
          Press these buttons to feel the haptic feedback and bounce animation
        </Text>

        <AnimatedButton
          onPress={() => console.log('Primary button pressed')}
          style={styles.primaryButton}
        >
          <Text style={styles.buttonText}>Primary Button</Text>
        </AnimatedButton>

        <AnimatedButton
          onPress={() => console.log('Secondary button pressed')}
          hapticFeedback={false}
          style={styles.secondaryButton}
        >
          <Text style={styles.buttonTextDark}>Secondary (No Haptic)</Text>
        </AnimatedButton>
      </View>

      {/* Coin Collection Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Coin Collection</Text>
        <Text style={styles.description}>
          Watch coins fly to the counter with a parabolic arc
        </Text>

        <AnimatedButton
          onPress={handleCollectCoins}
          style={styles.collectButton}
        >
          <Text style={styles.buttonText}>Collect 50 Coins</Text>
        </AnimatedButton>

        {showCoinAnimation && (
          <AnimatedCoinCollect
            amount={50}
            startX={100}
            startY={400}
            onComplete={() => {
              setShowCoinAnimation(false);
              setCoinCount((prev) => prev + 50);
            }}
          />
        )}
      </View>

      {/* Building Upgrade Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Building Upgrade</Text>
        <Text style={styles.description}>
          Flash, scale, and crossfade between building levels
        </Text>

        <AnimatedButton
          onPress={handleUpgradeBuilding}
          disabled={isUpgrading}
          style={[styles.upgradeButton, isUpgrading && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>
            {isUpgrading ? 'Upgrading...' : 'Upgrade Practice Field'}
          </Text>
        </AnimatedButton>

        <View style={styles.buildingContainer}>
          {isUpgrading ? (
            <AnimatedBuildingUpgrade
              buildingType="practice_field"
              fromLevel={1}
              toLevel={2}
              onComplete={() => setIsUpgrading(false)}
            />
          ) : (
            <View style={styles.buildingPlaceholder}>
              <Text style={styles.placeholderText}>Building Preview</Text>
              <Text style={styles.placeholderSubtext}>
                (Will show building image once upgraded)
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Animation Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Animation Tips</Text>
        <Text style={styles.tip}>
          • Use animations on user interactions (taps, swipes)
        </Text>
        <Text style={styles.tip}>
          • Keep animations under 500ms for responsiveness
        </Text>
        <Text style={styles.tip}>
          • Pair animations with haptics for tactile feedback
        </Text>
        <Text style={styles.tip}>
          • Test on real devices, not just simulators
        </Text>
        <Text style={styles.tip}>
          • Use spring animations for natural, organic feel
        </Text>
      </View>

      {/* Implementation Guide */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 Next Steps</Text>
        <Text style={styles.implementation}>
          1. Read ANIMATION_EXAMPLES.md for detailed usage
        </Text>
        <Text style={styles.implementation}>
          2. Replace placeholder images with real assets from Antigravity
        </Text>
        <Text style={styles.implementation}>
          3. Add animations to HQ screen (building collection)
        </Text>
        <Text style={styles.implementation}>
          4. Add animations to Squad screen (training completion)
        </Text>
        <Text style={styles.implementation}>
          5. Add animations to Match screen (score updates)
        </Text>
        <Text style={styles.implementation}>
          6. Add animations to Missions screen (completion bursts)
        </Text>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  coinCounter: {
    backgroundColor: '#1e293b',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  coinText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  section: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  collectButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
  },
  buildingContainer: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  buildingPlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderSubtext: {
    color: '#475569',
    fontSize: 12,
    marginTop: 4,
  },
  tip: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  implementation: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
});
