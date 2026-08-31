require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLessonAccess() {
  const lessonId = 'a7f758d0-bb50-4f0f-960a-3a7f0ef9878e';

  console.log('Testing anon key access to lessons table...\n');

  // Test 1: Can we read the lesson?
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.log('❌ ANON KEY CANNOT READ LESSON');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    console.log('Details:', error.details);
    console.log('\n🔒 This is likely an RLS (Row Level Security) policy issue!');
    return;
  }

  if (!lesson) {
    console.log('❌ Lesson not found with anon key');
    return;
  }

  console.log('✅ ANON KEY CAN READ LESSON');
  console.log('   Title:', lesson.title);
  console.log('   Published:', lesson.is_published);
  console.log('   Free:', lesson.is_free);

  // Test 2: Can we read script sections?
  const { data: scriptSections, error: scriptError } = await supabase
    .from('lesson_script_sections')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('order_index', { ascending: true });

  if (scriptError) {
    console.log('\n❌ ANON KEY CANNOT READ SCRIPT SECTIONS');
    console.log('Error:', scriptError.message);
  } else {
    console.log('\n✅ ANON KEY CAN READ SCRIPT SECTIONS');
    console.log('   Found', scriptSections?.length || 0, 'sections');
  }

  // Test 3: Can we read quiz?
  const { data: quiz, error: quizError } = await supabase
    .from('lesson_quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .single();

  if (quizError && quizError.code !== 'PGRST116') {
    console.log('\n❌ ANON KEY CANNOT READ QUIZ');
    console.log('Error:', quizError.message);
  } else {
    console.log('\n✅ ANON KEY CAN READ QUIZ');
    console.log('   Question:', quiz?.question || 'No quiz found');
  }
}

testLessonAccess();
