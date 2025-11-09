/**
 * List all videos in Cloudflare R2 bucket
 * Run with: node scripts/list-r2-videos.js
 */

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3')
require('dotenv').config({ path: '.env.local' })

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

async function listVideos() {
  try {
    console.log('\n📹 Listing videos in R2 bucket...\n')

    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    })

    const response = await r2.send(command)

    if (!response.Contents || response.Contents.length === 0) {
      console.log('❌ No videos found in bucket\n')
      return
    }

    console.log(`✅ Found ${response.Contents.length} files:\n`)

    response.Contents.forEach((file, index) => {
      const sizeInMB = (file.Size / 1024 / 1024).toFixed(2)
      const videoId = file.Key.replace('.mp4', '')

      console.log(`${index + 1}. ${file.Key}`)
      console.log(`   Size: ${sizeInMB} MB`)
      console.log(`   Video ID for database: "${videoId}"`)
      console.log(`   Last Modified: ${file.LastModified}`)
      console.log('')
    })

    console.log('\n📝 Next Steps:')
    console.log('1. Copy the "Video ID" values above')
    console.log('2. Update your lessons in Supabase with these video_ids')
    console.log('3. See VIDEO_INTEGRATION_GUIDE.md for SQL examples\n')

  } catch (error) {
    console.error('❌ Error listing videos:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check that .env.local has R2 credentials')
    console.error('2. Verify R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
    console.error('3. Ensure bucket name is correct:', process.env.R2_BUCKET_NAME)
  }
}

listVideos()
