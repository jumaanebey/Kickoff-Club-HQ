-- Add new building levels to user_hq table

ALTER TABLE user_hq 
ADD COLUMN IF NOT EXISTS medical_center_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS scouting_office_level INTEGER DEFAULT 1;

COMMENT ON COLUMN user_hq.medical_center_level IS 'Level of the Medical Center building';
COMMENT ON COLUMN user_hq.scouting_office_level IS 'Level of the Scouting Office building';
