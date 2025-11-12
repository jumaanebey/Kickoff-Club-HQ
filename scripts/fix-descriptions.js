const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const descriptions = [
  {
    slug: 'how-downs-work',
    description: 'Master the fundamental concept of football: 4 downs to gain 10 yards. This is the strategy engine that makes football unique. Learn why this simple rule creates infinite complexity and excitement.'
  },
  {
    slug: 'scoring-touchdowns',
    description: 'Learn how teams score the most points in football. Understand touchdowns, extra points, two-point conversions, and what it takes to put points on the board.'
  },
  {
    slug: 'field-layout-basics',
    description: 'Understand the football field structure, yard lines, and key areas of play. Learn to read the field like a pro and never be confused about field position again.'
  },
  {
    slug: 'offensive-positions',
    description: 'Learn about the quarterback, running backs, receivers, and offensive line. Understand what each position does and how they work together to move the ball.'
  },
  {
    slug: 'defensive-positions',
    description: 'Master defensive line, linebackers, cornerbacks, and safeties. Learn how each position stops the offense and creates turnovers.'
  },
  {
    slug: 'quarterback-101',
    description: 'The most important position in football - what quarterbacks do and why they matter. Learn proper footwork, throwing mechanics, and reading defenses.'
  },
  {
    slug: 'special-teams-basics',
    description: 'The third phase of football. Learn kicking, punting, returns, and coverage. Understand how special teams win championships.'
  },
  {
    slug: 'timeouts-and-clock',
    description: 'Master game clock strategy, timeouts, and time management tactics. Learn how coaches manipulate the clock to win games.'
  },
  {
    slug: 'understanding-penalties',
    description: 'Never be confused by a flag again. Learn all major penalties, why they are called, and how they impact the game. Includes real game examples.'
  },
  {
    slug: 'nfl-seasons-playoffs',
    description: 'Understand how the NFL season works, playoff seeding, Super Bowl path, and what it takes to win a championship. Perfect for new fans.'
  }
];

async function fixDescriptions() {
  console.log('Starting to fix course descriptions...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const course of descriptions) {
    const { data, error } = await supabase
      .from('courses')
      .update({ description: course.description })
      .eq('slug', course.slug)
      .select();

    if (error) {
      console.error(`❌ Error updating ${course.slug}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Updated ${course.slug}`);
      successCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  // Verify by fetching all courses
  console.log('\n=== Verifying all courses ===');
  const { data: allCourses, error: fetchError } = await supabase
    .from('courses')
    .select('slug, title, description')
    .order('order_index');

  if (fetchError) {
    console.error('Error fetching courses:', fetchError);
  } else {
    console.log('\nAll course descriptions:');
    allCourses.forEach(course => {
      const hasNewlines = course.description.includes('\n');
      const status = hasNewlines ? '❌' : '✅';
      console.log(`${status} ${course.slug}: ${course.description.substring(0, 60)}...`);
    });
  }
}

fixDescriptions().catch(console.error);
