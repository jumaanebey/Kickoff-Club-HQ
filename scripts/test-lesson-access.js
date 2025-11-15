const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o';

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
