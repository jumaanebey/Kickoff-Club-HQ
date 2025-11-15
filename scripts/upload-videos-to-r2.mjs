#!/usr/bin/env node

/**
 * Upload videos to Cloudflare R2
 * Uses AWS SDK since R2 is S3-compatible
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import dotenv from 'dotenv'
import { homedir } from 'os'

dotenv.config({ path: '.env.local' })

const VIDEO_DIR = resolve(homedir(), 'Downloads/kickoff-youtube-uploads')

const videos = [
  'field-layout-basics.mp4',
  'how-downs-work.mp4',
  'scoring-touchdowns.mp4'
]

// Configure R2 client
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME

async function checkVideoExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }))
    return true
  } catch (error) {
    if (error.name === 'NotFound') {
      return false
    }
    throw error
  }
}

async function uploadVideo(filename) {
  const videoPath = resolve(VIDEO_DIR, filename)

  // Extract video ID from filename (remove .mp4)
  const videoId = filename.replace('.mp4', '')
  const key = `${videoId}.mp4`

  console.log(`\n📹 Processing: ${filename}`)

  // Check if already exists
  const exists = await checkVideoExists(key)
  if (exists) {
    console.log(`⚠️  Already exists in R2: ${key}`)
    return { filename, status: 'exists', key }
  }

  console.log(`📂 Reading file: ${videoPath}`)
  const fileBuffer = await readFile(videoPath)
  const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2)
  console.log(`📦 File size: ${fileSizeMB} MB`)

  console.log(`☁️  Uploading to R2: ${key}`)
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'video/mp4',
  }))

  console.log(`✅ Successfully uploaded: ${key}`)
  return { filename, status: 'uploaded', key, sizeMB: fileSizeMB }
}

async function main() {
  console.log('🚀 Starting video upload to Cloudflare R2...\n')
  console.log(`Bucket: ${BUCKET_NAME}`)
  console.log(`Source: ${VIDEO_DIR}`)
  console.log(`Videos: ${videos.length}`)

  const results = []

  for (const video of videos) {
    try {
      const result = await uploadVideo(video)
      results.push(result)
    } catch (error) {
      console.error(`❌ Failed to upload ${video}:`, error.message)
      results.push({ filename: video, status: 'error', error: error.message })
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Upload Summary:')
  console.log('='.repeat(60))

  const uploaded = results.filter(r => r.status === 'uploaded')
  const existing = results.filter(r => r.status === 'exists')
  const errors = results.filter(r => r.status === 'error')

  console.log(`✅ Uploaded: ${uploaded.length}`)
  console.log(`⚠️  Already existed: ${existing.length}`)
  console.log(`❌ Errors: ${errors.length}`)

  if (uploaded.length > 0) {
    console.log('\nNewly uploaded:')
    uploaded.forEach(r => console.log(`  - ${r.key} (${r.sizeMB} MB)`))
  }

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach(r => console.log(`  - ${r.filename}: ${r.error}`))
  }

  console.log('\n🎉 Upload process complete!')
}

main().catch(error => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
