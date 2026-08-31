import 'dotenv/config';
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY not set — add it to .env.local');
  process.exit(1);
}
import { createClient } from '@supabase/supabase-js'

async function checkCourses() {
  const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Check for any course with "downs" in the title
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .or('title.ilike.%downs%,slug.ilike.%downs%')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}

checkCourses()
