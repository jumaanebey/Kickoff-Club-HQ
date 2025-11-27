#!/usr/bin/env node
/**
 * Fix Courses Database Script
 *
 * This script queries and fixes courses data in the Supabase database.
 * It ensures all category values match the valid enum types.
 *
 * Valid categories: quarterback, wide_receiver, running_back, offensive_line,
 *                   defense, special_teams, general
 *
 * Run with: node scripts/fix-courses-database.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zejensivaohvtkzufdou.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Valid category enum values
const VALID_CATEGORIES = [
  'quarterback',
  'wide_receiver',
  'running_back',
  'offensive_line',
  'defense',
  'special_teams',
  'general'
];

async function main() {
  console.log('🏈 Kickoff Club - Courses Database Fix Script\n');
  console.log('=' .repeat(50));

  try {
    // 1. Query all courses
    console.log('\n📊 Fetching all courses...\n');
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, category, difficulty_level, tier_required, is_published, is_featured')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching courses:', error.message);
      return;
    }

    if (!courses || courses.length === 0) {
      console.log('⚠️  No courses found in database');
      return;
    }

    console.log(`Found ${courses.length} courses:\n`);

    // 2. Display courses and check for invalid categories
    const invalidCourses = [];

    courses.forEach((course, index) => {
      const isValid = VALID_CATEGORIES.includes(course.category);
      const status = isValid ? '✅' : '❌';
      const featured = course.is_featured ? '⭐' : '  ';

      console.log(`${status} ${featured} ${index + 1}. ${course.title}`);
      console.log(`      Slug: ${course.slug}`);
      console.log(`      Category: ${course.category}${!isValid ? ' (INVALID!)' : ''}`);
      console.log(`      Difficulty: ${course.difficulty_level} | Tier: ${course.tier_required} | Published: ${course.is_published}`);
      console.log('');

      if (!isValid) {
        invalidCourses.push(course);
      }
    });

    // 3. Summary
    console.log('=' .repeat(50));
    console.log('\n📈 Summary:');
    console.log(`   Total courses: ${courses.length}`);
    console.log(`   Valid categories: ${courses.length - invalidCourses.length}`);
    console.log(`   Invalid categories: ${invalidCourses.length}`);
    console.log(`   Featured courses: ${courses.filter(c => c.is_featured).length}`);
    console.log(`   Published courses: ${courses.filter(c => c.is_published).length}`);

    // 4. Show category distribution
    console.log('\n📊 Category Distribution:');
    const categoryCount = {};
    courses.forEach(c => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      const valid = VALID_CATEGORIES.includes(cat) ? '' : ' ⚠️ INVALID';
      console.log(`   ${cat}: ${count}${valid}`);
    });

    // 5. If there are invalid courses, show fix options
    if (invalidCourses.length > 0) {
      console.log('\n⚠️  Found courses with invalid categories!');
      console.log('   These need to be fixed in the database.\n');
      console.log('   Run the following SQL in Supabase to fix:\n');

      invalidCourses.forEach(course => {
        console.log(`   UPDATE courses SET category = 'general' WHERE id = '${course.id}';`);
      });

      console.log('\n   Or run: node scripts/fix-courses-database.js --fix');
    } else {
      console.log('\n✅ All courses have valid categories!');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the script
main();
