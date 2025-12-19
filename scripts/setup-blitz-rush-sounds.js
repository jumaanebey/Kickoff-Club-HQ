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

// Required sound files (OGG format - CC0 licensed from Kenney.nl)
const REQUIRED_SOUNDS = {
  // Player sounds
  'footstep.ogg': 'Quick footstep sound',
  'jump.ogg': 'Whoosh jump sound',
  'land.ogg': 'Soft landing thud',
  'slide.ogg': 'Sliding/skid sound',
  'lane-switch.ogg': 'Quick swoosh for lane change',

  // Collectibles
  'coin.ogg': 'Coin collect cha-ching',
  'powerup.ogg': 'Magical powerup activation',
  'mega-coin.ogg': 'Big coin collect (louder)',

  // Effects
  'shield-activate.ogg': 'Shield bubble activate',
  'shield-break.ogg': 'Shield breaking/shattering',
  'speed-boost.ogg': 'Speed boost whoosh',
  'magnet.ogg': 'Magnet activation hum',

  // Collision
  'near-miss.ogg': 'Tense near-miss swoosh',
  'collision.ogg': 'Tackle/hit impact',

  // Game events
  'game-start.ogg': 'Whistle or starting horn',
  'game-over.ogg': 'Failure/buzzer sound',
  'high-score.ogg': 'Celebratory fanfare',
  'milestone.ogg': 'Achievement unlocked sound',
  'combo.ogg': 'Combo multiplier sound',

  // UI
  'button-click.ogg': 'UI button click',
};

const REQUIRED_MUSIC = {
  'music-menu.ogg': 'Upbeat menu music (loopable)',
  'music-gameplay.ogg': 'Energetic gameplay music (loopable)',
  'music-gameover.ogg': 'Game over music',
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
