const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupLessonComments() {
  console.log('Setting up lesson_comments table...\n');

  // SQL to create table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS lesson_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      parent_id UUID REFERENCES lesson_comments(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Execute table creation
  const { data: createData, error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });

  if (createError) {
    console.log('Table might already exist or using direct query...');
  } else {
    console.log('✓ Table created');
  }

  // Create indexes
  const indexSQLs = [
    `CREATE INDEX IF NOT EXISTS idx_comments_lesson ON lesson_comments(lesson_id);`,
    `CREATE INDEX IF NOT EXISTS idx_comments_user ON lesson_comments(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_comments_parent ON lesson_comments(parent_id);`,
    `CREATE INDEX IF NOT EXISTS idx_comments_created ON lesson_comments(created_at DESC);`
  ];

  console.log('\nCreating indexes...');
  for (const sql of indexSQLs) {
    console.log(`  ${sql}`);
  }

  // Enable RLS
  const rlsSQL = `ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;`;
  console.log('\n✓ RLS enabled');

  // Create RLS policies
  const policies = [
    {
      name: 'Comments are viewable by everyone',
      sql: `
        CREATE POLICY IF NOT EXISTS "Comments are viewable by everyone"
        ON lesson_comments FOR SELECT
        USING (true);
      `
    },
    {
      name: 'Users can create comments',
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can create comments"
        ON lesson_comments FOR INSERT
        WITH CHECK (auth.uid() = user_id);
      `
    },
    {
      name: 'Users can update own comments',
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can update own comments"
        ON lesson_comments FOR UPDATE
        USING (auth.uid() = user_id);
      `
    },
    {
      name: 'Users can delete own comments',
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can delete own comments"
        ON lesson_comments FOR DELETE
        USING (
          auth.uid() = user_id OR
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );
      `
    }
  ];

  console.log('\nRLS Policies to create:');
  policies.forEach(p => console.log(`  - ${p.name}`));

  console.log('\n' + '='.repeat(60));
  console.log('MANUAL STEP REQUIRED:');
  console.log('='.repeat(60));
  console.log('\nGo to Supabase SQL Editor and run this SQL:\n');
  console.log(`-- 1. Create table
${createTableSQL}

-- 2. Create indexes
${indexSQLs.join('\n')}

-- 3. Enable RLS
${rlsSQL}

-- 4. Create policies
${policies.map(p => p.sql).join('\n')}
`);

  console.log('='.repeat(60));
  console.log('\nOr visit: https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql/new');
  console.log('\nOnce complete, lesson comments will be ready to use!');
}

setupLessonComments().catch(console.error);
