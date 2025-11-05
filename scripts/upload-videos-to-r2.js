#!/usr/bin/env node

/**
 * Upload videos from old project to Cloudflare R2
 * Run: node scripts/upload-videos-to-r2.js
 */

require('dotenv').config({ path: '.env.local' })
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')

// R2 client configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

// Video files to upload
const videosToUpload = [
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/scoring-touchdowns.mp4',
    r2Key: 'scoring-touchdowns.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/field-layout-basics.mp4',
    r2Key: 'field-layout-basics.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/offensive-positions.mp4',
    r2Key: 'offensive-positions.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/defensive-positions.mp4',
    r2Key: 'defensive-positions.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/understanding-penalties.mp4',
    r2Key: 'understanding-penalties.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/special-teams-basics.mp4',
    r2Key: 'special-teams-basics.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/timeouts-and-clock.mp4',
    r2Key: 'timeouts-and-clock.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/nfl-seasons-playoffs.mp4',
    r2Key: 'nfl-seasons-playoffs.mp4'
  },
  {
    localPath: '/Users/jumaanebey/Downloads/kickoff-club-v2/public/assets/lessons/quarterback-101.mp4',
    r2Key: 'quarterback-101.mp4'
  },
]

async function uploadVideo(localPath, r2Key) {
  try {
    // Check if file exists
    if (!fs.existsSync(localPath)) {
      console.error(`❌ File not found: ${localPath}`)
      return false
    }

    // Get file stats
    const stats = fs.statSync(localPath)
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)

    console.log(`📤 Uploading ${r2Key} (${fileSizeMB} MB)...`)

    // Read file
    const fileBuffer = fs.readFileSync(localPath)

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileBuffer,
      ContentType: 'video/mp4',
    })

    await r2Client.send(command)
    console.log(`✅ Uploaded ${r2Key} successfully!`)
    return true
  } catch (error) {
    console.error(`❌ Error uploading ${r2Key}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting video upload to Cloudflare R2...')
  console.log(`📦 Bucket: ${process.env.R2_BUCKET_NAME}`)
  console.log(`📹 Videos to upload: ${videosToUpload.length}`)
  console.log('')

  let successCount = 0
  let failCount = 0

  for (const video of videosToUpload) {
    const success = await uploadVideo(video.localPath, video.r2Key)
    if (success) {
      successCount++
    } else {
      failCount++
    }
    console.log('')
  }

  console.log('=' .repeat(50))
  console.log(`✅ Successfully uploaded: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('=' .repeat(50))

  if (successCount === videosToUpload.length) {
    console.log('')
    console.log('🎉 All videos uploaded successfully!')
    console.log('📝 Next step: Run the SQL script to add these lessons to the database')
  }
}

main().catch(console.error)
