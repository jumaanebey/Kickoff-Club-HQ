// Test Supabase connection and query
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('\n1. Testing basic connection...')

  // Test 1: Simple query
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, slug, is_published')
    .eq('is_published', true)

  if (error) {
    console.error('❌ Error querying courses:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
  } else {
    console.log(`✅ Query successful! Found ${courses?.length || 0} courses`)
    if (courses && courses.length > 0) {
      console.log('\nCourses:')
      courses.forEach(c => console.log(`  - ${c.title} (${c.slug})`))
    } else {
      console.log('\n⚠️ No courses found (but query succeeded)')
    }
  }

  // Test 2: Check if RLS is blocking
  console.log('\n2. Testing without is_published filter...')
  const { data: allCourses, error: error2 } = await supabase
    .from('courses')
    .select('id, title, slug, is_published')

  if (error2) {
    console.error('❌ Error:', error2)
  } else {
    console.log(`Found ${allCourses?.length || 0} total courses (including unpublished)`)
  }

  // Test 3: Check specific slugs
  console.log('\n3. Testing specific course slugs...')
  const targetSlugs = ['how-downs-work', 'field-layout-basics', 'scoring-touchdowns']

  for (const slug of targetSlugs) {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, slug, is_published')
      .eq('slug', slug)
      .single()

    if (error) {
      console.log(`  ❌ ${slug}: ${error.message}`)
    } else {
      console.log(`  ✅ ${slug}: "${data.title}" (published: ${data.is_published})`)
    }
  }
}

testConnection().catch(console.error)
