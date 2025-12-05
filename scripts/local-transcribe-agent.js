/**
 * Local AI Transcription Agent
 *
 * This agent runs Whisper AI locally on your machine to transcribe podcasts.
 * No API key required - uses Transformers.js to run the model locally.
 *
 * Usage: node scripts/local-transcribe-agent.js [episode_number]
 *
 * First run will download the Whisper model (~150MB).
 * Transcription runs entirely on your local machine.
 */

const { createClient } = require('@supabase/supabase-js');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

require('dotenv').config({ path: '.env.local' });

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize R2 client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Directories
const TEMP_DIR = path.join(__dirname, '../temp');
const CACHE_DIR = path.join(__dirname, '../.cache/transformers');

// Ensure directories exist
[TEMP_DIR, CACHE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set cache directory for transformers
process.env.TRANSFORMERS_CACHE = CACHE_DIR;

let pipeline = null;
let transcriber = null;

/**
 * Initialize the Whisper pipeline (loads model on first use)
 */
async function initializeWhisper() {
  if (transcriber) return transcriber;

  console.log('\n🤖 Initializing Local AI Agent...');
  console.log('   Loading Whisper model (this may take a minute on first run)...\n');

  // Dynamic import for ES module
  const { pipeline: createPipeline } = await import('@xenova/transformers');
  pipeline = createPipeline;

  // Use whisper-tiny for speed (~5x faster than small)
  // Options: whisper-tiny (fastest), whisper-base, whisper-small (most accurate)
  const modelName = process.env.WHISPER_MODEL || 'Xenova/whisper-tiny';
  console.log(`   Using model: ${modelName}`);

  transcriber = await pipeline('automatic-speech-recognition', modelName, {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: true,
  });

  console.log('   ✅ Whisper model loaded successfully!\n');
  return transcriber;
}

/**
 * Download a file from URL to local path
 */
async function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, localPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize) {
          const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
          process.stdout.write(`\r   Downloading: ${percent}%`);
        }
      });

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('\r   Downloaded: 100%     ');
        resolve(localPath);
      });
    }).on('error', (err) => {
      fs.unlink(localPath, () => {});
      reject(err);
    });
  });
}

/**
 * Get signed URL for R2 audio file
 */
async function getAudioUrl(audioPath) {
  if (audioPath.startsWith('http')) {
    return audioPath;
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'kickoff-club',
    Key: audioPath,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/**
 * Convert audio to WAV format (required for Whisper)
 */
async function convertToWav(inputPath) {
  const wavPath = inputPath.replace(/\.[^.]+$/, '.wav');

  // Check if ffmpeg is available
  try {
    execSync('which ffmpeg', { stdio: 'ignore' });
  } catch {
    console.log('   ⚠️  ffmpeg not found. Installing via Homebrew...');
    try {
      execSync('brew install ffmpeg', { stdio: 'inherit' });
    } catch (e) {
      throw new Error('Please install ffmpeg: brew install ffmpeg');
    }
  }

  console.log('   Converting audio to WAV format...');
  execSync(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -y "${wavPath}" 2>/dev/null`);

  return wavPath;
}

/**
 * Read WAV file and extract raw audio samples for Node.js
 */
function readWavFile(wavPath) {
  const buffer = fs.readFileSync(wavPath);

  // Parse WAV header
  const numChannels = buffer.readUInt16LE(22);
  const sampleRate = buffer.readUInt32LE(24);
  const bitsPerSample = buffer.readUInt16LE(34);

  // Find data chunk
  let dataStart = 44; // Standard WAV header size
  for (let i = 12; i < buffer.length - 8; i++) {
    if (buffer.toString('ascii', i, i + 4) === 'data') {
      dataStart = i + 8;
      break;
    }
  }

  // Read samples
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor((buffer.length - dataStart) / (bytesPerSample * numChannels));
  const audioData = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const offset = dataStart + i * bytesPerSample * numChannels;
    // Read as 16-bit signed integer and normalize to [-1, 1]
    const sample = buffer.readInt16LE(offset);
    audioData[i] = sample / 32768;
  }

  return { audioData, sampleRate };
}

/**
 * Transcribe audio using local Whisper model
 */
async function transcribeAudio(audioPath) {
  const whisper = await initializeWhisper();

  console.log('   🎧 Transcribing audio (this may take a few minutes)...');
  console.log('   Reading WAV file...');

  // Read raw audio data from WAV file
  const { audioData, sampleRate } = readWavFile(audioPath);
  console.log(`   Audio loaded: ${audioData.length} samples at ${sampleRate}Hz`);

  const result = await whisper(audioData, {
    return_timestamps: 'word',
    chunk_length_s: 30,
    stride_length_s: 5,
    sampling_rate: sampleRate,
  });

  return result;
}

/**
 * Convert Whisper result to VTT format
 */
function convertToVTT(result) {
  let vtt = 'WEBVTT\n\n';

  if (result.chunks && result.chunks.length > 0) {
    // Group words into sentences (roughly 5-8 words per caption)
    let currentCaption = { start: null, end: null, text: [] };
    const captions = [];

    result.chunks.forEach((chunk, i) => {
      if (currentCaption.start === null) {
        currentCaption.start = chunk.timestamp[0];
      }

      currentCaption.text.push(chunk.text.trim());
      currentCaption.end = chunk.timestamp[1];

      // Create new caption every ~6 words or at sentence endings
      const text = currentCaption.text.join(' ');
      const isSentenceEnd = /[.!?]$/.test(text);
      const isLongEnough = currentCaption.text.length >= 6;

      if (isSentenceEnd || isLongEnough || i === result.chunks.length - 1) {
        if (currentCaption.text.length > 0) {
          captions.push({
            start: currentCaption.start,
            end: currentCaption.end,
            text: text.trim(),
          });
        }
        currentCaption = { start: null, end: null, text: [] };
      }
    });

    captions.forEach((caption) => {
      const startTime = formatVTTTime(caption.start || 0);
      const endTime = formatVTTTime(caption.end || caption.start + 3);
      vtt += `${startTime} --> ${endTime}\n${caption.text}\n\n`;
    });
  } else if (result.text) {
    // Fallback: single caption for entire audio
    vtt += `00:00:00.000 --> 00:10:00.000\n${result.text}\n\n`;
  }

  return vtt;
}

/**
 * Format seconds to VTT timestamp
 */
function formatVTTTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    seconds = 0;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Process a single podcast episode
 */
async function processPodcast(podcast) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📻 Episode ${podcast.episode_number}: ${podcast.title}`);
  console.log('='.repeat(60));

  try {
    // Get signed URL for audio
    const audioUrl = await getAudioUrl(podcast.audio_url);
    console.log('   ✅ Audio URL obtained');

    // Download audio to temp file
    const ext = podcast.audio_url.split('.').pop() || 'm4a';
    const localPath = path.join(TEMP_DIR, `episode-${podcast.episode_number}.${ext}`);

    await downloadFile(audioUrl, localPath);

    // Convert to WAV format
    const wavPath = await convertToWav(localPath);

    // Transcribe using local Whisper
    const transcription = await transcribeAudio(wavPath);

    console.log(`   ✅ Transcription complete`);
    console.log(`   Preview: "${transcription.text.substring(0, 80)}..."`);

    // Convert to VTT format
    const vttContent = convertToVTT(transcription);
    const captionCount = (vttContent.match(/-->/g) || []).length;
    console.log(`   ✅ Generated ${captionCount} captions`);

    // Update database
    const { error } = await supabase
      .from('podcasts')
      .update({ transcript: vttContent })
      .eq('id', podcast.id);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    console.log('   ✅ Database updated successfully');

    // Clean up temp files
    [localPath, wavPath].forEach(f => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });

    return { success: true, episode: podcast.episode_number };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, episode: podcast.episode_number, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n' + '🎙️'.repeat(30));
  console.log('\n   🤖 LOCAL AI TRANSCRIPTION AGENT');
  console.log('   Powered by Whisper AI (runs 100% locally)');
  console.log('\n' + '🎙️'.repeat(30));

  // Get episode number from command line (optional)
  const targetEpisode = process.argv[2] ? parseInt(process.argv[2]) : null;

  // Fetch podcasts from database
  let query = supabase
    .from('podcasts')
    .select('id, title, slug, episode_number, audio_url, transcript')
    .eq('is_published', true)
    .order('episode_number');

  if (targetEpisode) {
    query = query.eq('episode_number', targetEpisode);
  }

  const { data: podcasts, error } = await query;

  if (error) {
    console.error('❌ Failed to fetch podcasts:', error.message);
    process.exit(1);
  }

  if (!podcasts || podcasts.length === 0) {
    console.log('No podcasts found');
    process.exit(0);
  }

  // Filter to podcasts needing transcription
  const toProcess = targetEpisode
    ? podcasts
    : podcasts.filter(p =>
        !p.transcript ||
        !p.transcript.includes('WEBVTT') ||
        p.transcript.includes('Welcome to the Kickoff Club Podcast')
      );

  if (toProcess.length === 0) {
    console.log('\n✅ All podcasts already have real transcripts!');
    process.exit(0);
  }

  console.log(`\n📋 Found ${toProcess.length} episode(s) to transcribe`);

  // Pre-load the Whisper model
  await initializeWhisper();

  // Process each podcast
  const results = [];
  for (const podcast of toProcess) {
    const result = await processPodcast(podcast);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSCRIPTION SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach(s => console.log(`   - Episode ${s.episode}`));

  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach(f => console.log(`   - Episode ${f.episode}: ${f.error}`));
  }

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR) && fs.readdirSync(TEMP_DIR).length === 0) {
    fs.rmdirSync(TEMP_DIR);
  }

  console.log('\n🎉 Done!\n');
}

main().catch(console.error);
