import { createClient } from '@supabase/supabase-js'

async function checkCourse() {
  const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o'
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
