import { createClient } from '@supabase/supabase-js'

async function checkCourses() {
  const supabase = createClient(
    'https://zejensivaohvtkzufdou.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o'
  )

  // Check for the "Introduction to Downs" course
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug, difficulty_level, tier_required, order_index')
    .eq('slug', 'introduction-to-downs')
    .single()

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Introduction to Downs:', JSON.stringify(data, null, 2))
  }
}

checkCourses()
