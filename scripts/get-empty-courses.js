#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY not set — add it to .env.local');
  process.exit(1);
}
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zejensivaohvtkzufdou.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
