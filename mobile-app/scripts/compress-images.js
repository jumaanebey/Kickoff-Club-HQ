const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../assets/images');
const OUTPUT_DIR = path.join(__dirname, '../assets/images-optimized');

const categories = ['buildings', 'icons', 'units', 'decorations'];

async function compressImages() {
  console.log('🖼️  Compressing Antigravity PNG assets...\n');

  let totalOriginal = 0;
  let totalCompressed = 0;
  let fileCount = 0;

  for (const category of categories) {
    const inputDir = path.join(IMAGES_DIR, category);
    const outputDir = path.join(OUTPUT_DIR, category);

    if (!fs.existsSync(inputDir)) {
      console.log(`⚠️  Skipping ${category} - directory not found`);
      continue;
    }

    // Create output directory
    fs.mkdirSync(outputDir, { recursive: true });

    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));
    console.log(`📁 ${category}: ${files.length} files`);

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);

      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      totalOriginal += originalSize;

      try {
        // Compress with sharp - resize to max 512px for mobile, quality 80
        await sharp(inputPath)
          .resize(512, 512, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .png({
            quality: 80,
            compressionLevel: 9,
            palette: true
          })
          .toFile(outputPath);

        const compressedStats = fs.statSync(outputPath);
        const compressedSize = compressedStats.size;
        totalCompressed += compressedSize;
        fileCount++;

        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        const originalKB = (originalSize / 1024).toFixed(0);
        const compressedKB = (compressedSize / 1024).toFixed(0);

        console.log(`   ✅ ${file}: ${originalKB}KB → ${compressedKB}KB (${savings}% smaller)`);
      } catch (err) {
        console.log(`   ❌ ${file}: ${err.message}`);
      }
    }
    console.log('');
  }

  const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(2);
  const totalCompressedMB = (totalCompressed / 1024 / 1024).toFixed(2);
  const totalSavings = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);

  console.log('═══════════════════════════════════════════');
  console.log(`📊 TOTAL: ${fileCount} files compressed`);
  console.log(`   Original:   ${totalOriginalMB} MB`);
  console.log(`   Compressed: ${totalCompressedMB} MB`);
  console.log(`   Savings:    ${totalSavings}%`);
  console.log('═══════════════════════════════════════════');
  console.log(`\n✨ Optimized images saved to: assets/images-optimized/`);
}

compressImages().catch(console.error);
