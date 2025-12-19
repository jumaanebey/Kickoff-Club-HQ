#!/usr/bin/env node
/**
 * Blitz Rush Sound Setup Script
 *
 * This script helps set up placeholder sounds for the game.
 * Run with: node scripts/setup-blitz-rush-sounds.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SOUNDS_DIR = path.join(__dirname, '../public/sounds/blitz-rush');

// Required sound files
const REQUIRED_SOUNDS = {
  // Player sounds
  'footstep.mp3': 'Quick footstep sound',
  'jump.mp3': 'Whoosh jump sound',
  'land.mp3': 'Soft landing thud',
  'slide.mp3': 'Sliding/skid sound',
  'lane-switch.mp3': 'Quick swoosh for lane change',

  // Collectibles
  'coin.mp3': 'Coin collect cha-ching',
  'powerup.mp3': 'Magical powerup activation',
  'mega-coin.mp3': 'Big coin collect (louder)',

  // Effects
  'shield-activate.mp3': 'Shield bubble activate',
  'shield-break.mp3': 'Shield breaking/shattering',
  'speed-boost.mp3': 'Speed boost whoosh',
  'magnet.mp3': 'Magnet activation hum',

  // Collision
  'near-miss.mp3': 'Tense near-miss swoosh',
  'collision.mp3': 'Tackle/hit impact',

  // Game events
  'game-start.mp3': 'Whistle or starting horn',
  'game-over.mp3': 'Failure/buzzer sound',
  'high-score.mp3': 'Celebratory fanfare',
  'milestone.mp3': 'Achievement unlocked sound',
  'combo.mp3': 'Combo multiplier sound',

  // UI
  'button-click.mp3': 'UI button click',

  // Ambience
  'crowd-ambience.mp3': 'Stadium crowd background (loopable)',
};

const REQUIRED_MUSIC = {
  'music-menu.mp3': 'Upbeat menu music (loopable)',
  'music-gameplay.mp3': 'Energetic gameplay music (loopable)',
  'music-gameover.mp3': 'Game over music',
};

// Free sound sources
const FREE_SOUND_SOURCES = {
  'Freesound.org': 'https://freesound.org/search/?q=game+sound',
  'Mixkit': 'https://mixkit.co/free-sound-effects/game/',
  'Pixabay': 'https://pixabay.com/sound-effects/',
  'Zapsplat': 'https://www.zapsplat.com/sound-effect-categories/',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function checkExistingSounds() {
  const existing = [];
  const missing = [];

  const allSounds = { ...REQUIRED_SOUNDS, ...REQUIRED_MUSIC };

  for (const [filename, description] of Object.entries(allSounds)) {
    const filepath = path.join(SOUNDS_DIR, filename);
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 1000) { // More than 1KB = probably a real sound
        existing.push(filename);
      } else {
        missing.push({ filename, description });
      }
    } else {
      missing.push({ filename, description });
    }
  }

  return { existing, missing };
}

function createPlaceholderFile(filename) {
  // Create a minimal valid MP3 file (silent)
  // This is the smallest valid MP3 frame - essentially silence
  const silentMp3 = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);

  const filepath = path.join(SOUNDS_DIR, filename);
  fs.writeFileSync(filepath, silentMp3);
}

function main() {
  console.log('\n🎵 Blitz Rush Sound Setup\n');
  console.log('=' .repeat(50));

  ensureDir(SOUNDS_DIR);

  const { existing, missing } = checkExistingSounds();

  console.log(`\n✅ Found ${existing.length} existing sound files`);
  console.log(`❌ Missing ${missing.length} sound files\n`);

  if (missing.length > 0) {
    console.log('Missing sounds:\n');
    missing.forEach(({ filename, description }) => {
      console.log(`  - ${filename}`);
      console.log(`    ${description}\n`);
    });

    console.log('\n📥 Creating placeholder files...\n');
    missing.forEach(({ filename }) => {
      createPlaceholderFile(filename);
      console.log(`  Created: ${filename}`);
    });

    console.log('\n' + '=' .repeat(50));
    console.log('\n🎯 Next Steps:\n');
    console.log('Replace placeholder files with real sounds from:');
    Object.entries(FREE_SOUND_SOURCES).forEach(([name, url]) => {
      console.log(`  • ${name}: ${url}`);
    });

    console.log('\n💡 Tips:');
    console.log('  • Keep sounds short (0.2-1.5 seconds for SFX)');
    console.log('  • Use MP3 format, 44.1kHz, mono');
    console.log('  • Normalize volume levels');
    console.log('  • Music should be loopable\n');
  } else {
    console.log('✅ All sound files are present!\n');
  }
}

main();
