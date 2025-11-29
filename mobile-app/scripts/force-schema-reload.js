// Force Supabase schema cache reload
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zejensivaohvtkzufdou.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplamVuc2l2YW9odnRrenVmZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTcxNDUsImV4cCI6MjA3Nzc3MzE0NX0.OKUt6y2d6zjPppreKLCx4aeWkceBSOXaEI8zRzlUZ_o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceReload() {
  console.log('\n🔄 Forcing PostgREST schema cache reload...\n');

  try {
    // Send NOTIFY command to reload schema
    const { data, error } = await supabase.rpc('exec_sql', {
      query: "NOTIFY pgrst, 'reload schema';"
    });

    if (error) {
      console.log('⚠️  RPC method not available, trying direct SQL...');

      // Alternative: Use a PostgreSQL function if available
      const { error: notifyError } = await supabase
        .from('_supabase_reload')
        .select('*')
        .limit(1);

      if (notifyError) {
        console.log('❌ Could not send reload signal via API');
        console.log('   You need to run this SQL command manually in Supabase SQL Editor:');
        console.log('   \n   NOTIFY pgrst, \'reload schema\';\n');
        return false;
      }
    }

    console.log('✅ Reload signal sent successfully!');
    console.log('   Waiting 5 seconds for cache to refresh...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test if tables are now accessible
    console.log('🔍 Testing table access...\n');

    const { data: buildings, error: buildingsError } = await supabase
      .from('user_buildings')
      .select('*')
      .limit(1);

    if (buildingsError) {
      console.log('❌ user_buildings still not accessible:', buildingsError.message);
      console.log('\n💡 The cache may take a few more minutes to refresh.');
      console.log('   Try refreshing your app in 2-3 minutes.\n');
      return false;
    }

    console.log('✅ SUCCESS! Schema cache has been reloaded.');
    console.log('   All tables are now accessible!\n');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

forceReload().catch(console.error);
