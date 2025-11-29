-- Add energy and units columns to user_hq table

ALTER TABLE user_hq 
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS units JSONB DEFAULT '{}'::jsonb;

-- Comment on columns
COMMENT ON COLUMN user_hq.energy IS 'Current energy points for playing matches (max 100)';
COMMENT ON COLUMN user_hq.units IS 'JSON object storing unit counts and levels by type';
