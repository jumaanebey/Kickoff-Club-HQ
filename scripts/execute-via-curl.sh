#!/bin/bash

# Execute SQL migrations using Supabase's internal API
# This is the same API the dashboard uses

set -e

SUPABASE_URL="https://zejensivaohvtkzufdou.supabase.co"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_KEY" ]; then
  echo "❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable"
  exit 1
fi

echo "🚀 Executing migrations via Supabase API..."
echo ""

# Function to execute a single migration
execute_migration() {
  local filename="$1"
  local sql=$(cat "supabase/migrations/$filename")

  echo "📝 Processing: $filename"

  # Try executing via pgMeta query endpoint
  response=$(curl -s -X POST \
    "${SUPABASE_URL}/rest/v1/rpc" \
    -H "apikey: ${SERVICE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"query\": $(echo "$sql" | jq -Rs .)}")

  # Check if successful
  if echo "$response" | grep -q "error"; then
    if echo "$response" | grep -qi "already exists\|duplicate"; then
      echo "⚠️  Skipped (already exists): $filename"
    else
      echo "❌ Failed: $filename"
      echo "   Error: $response"
      return 1
    fi
  else
    echo "✅ Success: $filename"
  fi

  echo ""
}

# Execute each migration
migrations=(
  "20250120_add_discussion_system.sql"
  "20250121_add_learning_paths.sql"
  "20250122_add_notes_streaks_leaderboards.sql"
  "20250123_add_practice_drills.sql"
  "20250124_add_study_groups.sql"
  "20250125_add_tags_activity_feed.sql"
)

success_count=0
fail_count=0

for migration in "${migrations[@]}"; do
  if execute_migration "$migration"; then
    ((success_count++))
  else
    ((fail_count++))
  fi
done

echo "============================================================"
echo "✅ Successful: $success_count/${#migrations[@]}"
if [ $fail_count -gt 0 ]; then
  echo "❌ Failed: $fail_count/${#migrations[@]}"
fi
echo "============================================================"

if [ $fail_count -gt 0 ]; then
  echo ""
  echo "⚠️  Some migrations failed."
  echo "   Please apply them manually in Supabase Dashboard:"
  echo "   https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql"
  exit 1
else
  echo ""
  echo "🎉 All migrations applied successfully!"
fi
