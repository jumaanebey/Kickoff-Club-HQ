import 'dotenv/config';
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY not set — add it to .env.local');
  process.exit(1);
}
import { createClient } from '@supabase/supabase-js'

async function checkCourse() {
  const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase
    .from('courses')
    .select('title, slug, order_index, difficulty_level, tier_required')
    .order('order_index')
    .limit(5)

  if (error) {
    console.error('Error:', error)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}

checkCourse()
