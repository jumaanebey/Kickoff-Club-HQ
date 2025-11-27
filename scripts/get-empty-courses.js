#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zejensivaohvtkzufdou.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getData() {
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at');

  const { data: lessons } = await supabase
    .from('lessons')
    .select('course_id');

  const courseIdsWithLessons = [...new Set(lessons?.map(l => l.course_id) || [])];

  const emptyCourses = courses?.filter(c => !courseIdsWithLessons.includes(c.id)) || [];

  console.log('EMPTY_COURSES:');
  console.log(JSON.stringify(emptyCourses, null, 2));
  console.log('---');
  console.log('EMPTY_IDS:');
  console.log(emptyCourses.map(c => `'${c.id}'`).join(','));
}

getData();
