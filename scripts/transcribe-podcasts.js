/**
 * Podcast Transcription Agent
 *
 * This script downloads podcast audio files from R2, transcribes them using
 * OpenAI Whisper API, and updates the database with VTT-formatted captions.
 *
 * Usage: node scripts/transcribe-podcasts.js [episode_number]
 *
 * If episode_number is provided, only that episode will be transcribed.
 * Otherwise, all episodes without transcripts will be processed.
 */

const { createClient } = require('@supabase/supabase-js');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

require('dotenv').config({ path: '.env.local' });

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Temp directory for downloaded audio
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
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
        // Follow redirect
        downloadFile(response.headers.location, localPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
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
 * Transcribe audio file using OpenAI Whisper API
 * Returns transcript with word-level timestamps
 */
async function transcribeAudio(audioPath) {
  console.log(`  Transcribing: ${audioPath}`);

  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  });

  return response;
}

/**
 * Convert Whisper response to VTT format
 */
function convertToVTT(transcription) {
  let vtt = 'WEBVTT\n\n';

  if (!transcription.segments || transcription.segments.length === 0) {
    // Fallback: create single caption for entire audio
    vtt += `00:00:00.000 --> 00:10:00.000\n${transcription.text}\n\n`;
    return vtt;
  }

  transcription.segments.forEach((segment, index) => {
    const startTime = formatVTTTime(segment.start);
    const endTime = formatVTTTime(segment.end);
    const text = segment.text.trim();

    if (text) {
      vtt += `${startTime} --> ${endTime}\n${text}\n\n`;
    }
  });

  return vtt;
}

/**
 * Format seconds to VTT timestamp (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds) {
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
  console.log(`\nProcessing Episode ${podcast.episode_number}: ${podcast.title}`);

  try {
    // Get signed URL for audio
    const audioUrl = await getAudioUrl(podcast.audio_url);
    console.log(`  Audio URL obtained`);

    // Download audio to temp file
    const ext = podcast.audio_url.split('.').pop() || 'm4a';
    const localPath = path.join(TEMP_DIR, `episode-${podcast.episode_number}.${ext}`);

    console.log(`  Downloading audio...`);
    await downloadFile(audioUrl, localPath);
    console.log(`  Downloaded to: ${localPath}`);

    // Transcribe using Whisper
    console.log(`  Sending to Whisper API...`);
    const transcription = await transcribeAudio(localPath);
    console.log(`  Transcription complete: ${transcription.text.substring(0, 100)}...`);

    // Convert to VTT format
    const vttContent = convertToVTT(transcription);
    console.log(`  Generated VTT with ${(vttContent.match(/-->/g) || []).length} captions`);

    // Update database
    const { error } = await supabase
      .from('podcasts')
      .update({ transcript: vttContent })
      .eq('id', podcast.id);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    console.log(`  ✅ Database updated successfully`);

    // Clean up temp file
    fs.unlinkSync(localPath);

    return { success: true, episode: podcast.episode_number };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, episode: podcast.episode_number, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Podcast Transcription Agent');
  console.log('='.repeat(60));

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ Error: OPENAI_API_KEY not found in environment');
    console.error('Please add OPENAI_API_KEY=your-key to .env.local');
    process.exit(1);
  }

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
    console.error('Failed to fetch podcasts:', error.message);
    process.exit(1);
  }

  if (!podcasts || podcasts.length === 0) {
    console.log('No podcasts found to transcribe');
    process.exit(0);
  }

  console.log(`\nFound ${podcasts.length} podcast(s) to process`);

  // Filter to only those without proper VTT transcripts (optional)
  const toProcess = targetEpisode
    ? podcasts
    : podcasts.filter(p => !p.transcript || !p.transcript.includes('WEBVTT') || p.transcript.includes('Welcome to the Kickoff Club Podcast'));

  if (toProcess.length === 0) {
    console.log('All podcasts already have transcripts');
    process.exit(0);
  }

  console.log(`Processing ${toProcess.length} episode(s)...`);

  // Process each podcast
  const results = [];
  for (const podcast of toProcess) {
    const result = await processPodcast(podcast);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed episodes:');
    failed.forEach(f => console.log(`  - Episode ${f.episode}: ${f.error}`));
  }

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR) && fs.readdirSync(TEMP_DIR).length === 0) {
    fs.rmdirSync(TEMP_DIR);
  }

  console.log('\nDone!');
}

main().catch(console.error);
