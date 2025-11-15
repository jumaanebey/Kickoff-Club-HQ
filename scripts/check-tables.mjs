#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const tables = [
  'lesson_comments', 'comment_replies', 'comment_likes',
  'learning_paths', 'learning_path_courses', 'user_learning_paths', 'course_prerequisites',
  'lesson_notes', 'user_streaks', 'daily_activity_log', 'leaderboard_entries',
  'practice_drills', 'drill_attempts', 'drill_scores',
  'study_groups', 'group_members', 'group_progress', 'group_invitations',
  'tags', 'course_tags', 'lesson_tags', 'activity_feed', 'activity_likes', 'user_follows'
];

console.log('🔍 Checking for new database tables...\n');

let existCount = 0;
let missingCount = 0;

for (const table of tables) {
  try {
    const { error } = await supabase.from(table).select('count').limit(0);
    if (error) {
      if (error.code === 'PGRST204' || error.message.includes('not found')) {
        console.log('❌', table, '- missing');
        missingCount++;
      } else {
        console.log('✅', table);
        existCount++;
      }
    } else {
      console.log('✅', table);
      existCount++;
    }
  } catch (e) {
    console.log('❌', table, '- error');
    missingCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`✅ Existing: ${existCount}/${tables.length}`);
console.log(`❌ Missing: ${missingCount}/${tables.length}`);
console.log('='.repeat(60));

if (missingCount === 0) {
  console.log('\n🎉 All migrations are applied! Database is up to date.');
} else {
  console.log(`\n⚠️  ${missingCount} tables still need to be created.`);
}
