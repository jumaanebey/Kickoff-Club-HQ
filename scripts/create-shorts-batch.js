const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

const VIDEO_DIR = '/Users/jumaanebey/Downloads/kickoff-videos-clean';
const SHORTS_DIR = '/Users/jumaanebey/Downloads/kickoff-shorts';
const CONVERT_SCRIPT = path.join(__dirname, 'convert-to-shorts.sh');

// Define clips to extract from each video
// Each video can generate multiple Shorts
const SHORTS_CONFIG = {
  'how-downs-work': [
    { start: 0, duration: 45, name: 'downs-intro', title: 'What are DOWNS in Football? ⬇️ #Shorts' },
    { start: 90, duration: 50, name: 'first-down-explained', title: 'How to Get a FIRST DOWN 🏈 #Shorts' },
  ],
  'field-layout-basics': [
    { start: 0, duration: 45, name: 'field-zones', title: 'Football Field ZONES Explained 🏟️ #Shorts' },
    { start: 60, duration: 40, name: 'yard-lines', title: 'What Do Yard Lines Mean? #Shorts' },
  ],
  'scoring-touchdowns': [
    { start: 0, duration: 50, name: 'touchdown-rules', title: 'How to Score a TOUCHDOWN 🔥 #Shorts' },
    { start: 80, duration: 45, name: 'endzone-explained', title: 'What is the END ZONE? #Shorts' },
  ],
  'defensive-positions': [
    { start: 0, duration: 45, name: 'defense-intro', title: 'NFL Defense POSITIONS Explained 🛡️ #Shorts' },
    { start: 120, duration: 50, name: 'defensive-line', title: 'What Does the D-LINE Do? #Shorts' },
  ],
  'offensive-positions': [
    { start: 0, duration: 45, name: 'offense-intro', title: 'Football OFFENSE Positions ⚡ #Shorts' },
    { start: 90, duration: 50, name: 'receivers-explained', title: 'Wide Receiver vs Tight End #Shorts' },
  ],
  'quarterback-101': [
    { start: 0, duration: 50, name: 'qb-role', title: 'What Does the QB Actually Do? 🎯 #Shorts' },
    { start: 120, duration: 45, name: 'qb-reads', title: 'How QBs Read Defenses 🧠 #Shorts' },
  ],
  'understanding-penalties': [
    { start: 0, duration: 45, name: 'common-penalties', title: 'Most Common NFL PENALTIES 🚩 #Shorts' },
    { start: 100, duration: 50, name: 'false-start', title: 'False Start vs Offsides #Shorts' },
  ],
  'special-teams-basics': [
    { start: 0, duration: 45, name: 'special-teams-intro', title: 'What is SPECIAL TEAMS? 🦶 #Shorts' },
  ],
  'timeouts-and-clock': [
    { start: 0, duration: 50, name: 'clock-management', title: 'NFL Clock Management 101 ⏱️ #Shorts' },
  ],
  'nfl-seasons-playoffs': [
    { start: 0, duration: 45, name: 'playoff-format', title: 'How NFL Playoffs Work 🏆 #Shorts' },
    { start: 150, duration: 50, name: 'super-bowl-path', title: 'Path to the Super Bowl #Shorts' },
  ],
};

async function createAllShorts() {
  console.log('🎬 Creating YouTube Shorts from existing videos\\n');
  console.log(`   Source: ${VIDEO_DIR}`);
  console.log(`   Output: ${SHORTS_DIR}\\n`);

  // Create output directory
  await fs.mkdir(SHORTS_DIR, { recursive: true });

  const results = [];
  let totalShorts = 0;

  for (const [videoSlug, clips] of Object.entries(SHORTS_CONFIG)) {
    const inputVideo = path.join(VIDEO_DIR, `${videoSlug}.mp4`);

    // Check if source video exists
    try {
      await fs.access(inputVideo);
    } catch (error) {
      console.log(`⚠️  Skipping ${videoSlug} (video not found)\\n`);
      continue;
    }

    console.log(`══════════════════════════════════════════════════════`);
    console.log(`📹 Processing: ${videoSlug}`);
    console.log(`   Creating ${clips.length} Short(s)...\\n`);

    for (const clip of clips) {
      totalShorts++;
      console.log(`   ${totalShorts}. ${clip.title}`);
      console.log(`      Extracting ${clip.start}s - ${clip.start + clip.duration}s`);

      try {
        const { stdout, stderr } = await execAsync(
          `bash "${CONVERT_SCRIPT}" "${inputVideo}" "${clip.name}" ${clip.start} ${clip.duration}`
        );

        console.log(`      ✅ Created: ${clip.name}.mp4\\n`);

        results.push({
          videoSlug,
          shortName: clip.name,
          title: clip.title,
          file: `${clip.name}.mp4`,
          success: true,
        });
      } catch (error) {
        console.error(`      ❌ Failed: ${error.message}\\n`);
        results.push({
          videoSlug,
          shortName: clip.name,
          title: clip.title,
          success: false,
          error: error.message,
        });
      }
    }

    console.log('');
  }

  console.log(`══════════════════════════════════════════════════════`);
  console.log(`\\n📊 SUMMARY\\n`);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Created: ${successful.length} Shorts`);
  console.log(`❌ Failed: ${failed.length} Shorts\\n`);

  if (successful.length > 0) {
    console.log(`📁 Location: ${SHORTS_DIR}\\n`);
    console.log(`📋 Created Shorts:`);
    successful.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title}`);
      console.log(`      File: ${s.file}`);
    });
  }

  // Save metadata for upload script
  const metadata = {};
  successful.forEach(s => {
    metadata[s.shortName] = {
      title: s.title,
      description: `${s.title}\\n\\nLearn football basics at KickoffClubHQ.com 🏈\\n\\n#FootballShorts #NFL #LearnFootball #FootballForBeginners`,
      tags: ['shorts', 'nfl', 'football', 'football basics', 'learn football', 'football explained'],
      category: '27', // Education
      privacy: 'public',
    };
  });

  const metadataPath = path.join(SHORTS_DIR, 'shorts-metadata.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\\n💾 Metadata saved: ${metadataPath}`);
  console.log(`\\n📤 Next step: Upload to YouTube`);
  console.log(`   node scripts/upload-shorts.js\\n`);
}

createAllShorts().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
