-- Fix Achievements Table Schema - Comprehensive Fix
DO $$
BEGIN
    -- 1. Add 'slug' column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'slug') THEN
        ALTER TABLE public.achievements ADD COLUMN slug text;
        UPDATE public.achievements SET slug = lower(replace(name, ' ', '-')) WHERE slug IS NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS achievements_slug_idx ON public.achievements (slug);
    END IF;

    -- 2. Add 'category' column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'category') THEN
        ALTER TABLE public.achievements ADD COLUMN category text DEFAULT 'general';
    END IF;

    -- 3. Add 'badge_icon' column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'badge_icon') THEN
        ALTER TABLE public.achievements ADD COLUMN badge_icon text;
    END IF;

    -- 4. Add 'is_active' column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'is_active') THEN
        ALTER TABLE public.achievements ADD COLUMN is_active boolean DEFAULT true;
    END IF;
END $$;

-- 5. Insert Game Achievements
insert into public.achievements (name, slug, description, points, category, is_active, badge_icon)
values
  ('Blitz Rookie', 'blitz-rush-rookie', 'Score 500 points in Blitz Rush', 100, 'games', true, 'Zap'),
  ('Blitz Master', 'blitz-rush-master', 'Score 2000 points in Blitz Rush', 500, 'games', true, 'Zap'),
  ('QB Rookie', 'qb-precision-rookie', 'Score 500 points in QB Precision', 100, 'games', true, 'Target'),
  ('QB Elite', 'qb-precision-elite', 'Score 1500 points in QB Precision', 500, 'games', true, 'Target'),
  ('Rhythm Rookie', 'snap-reaction-rookie', 'Score 500 points in Snap Reaction', 100, 'games', true, 'Music'),
  ('Rhythm Master', 'snap-reaction-master', 'Score 2000 points in Snap Reaction', 500, 'games', true, 'Music')
on conflict (slug) do update set
  description = EXCLUDED.description,
  points = EXCLUDED.points,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  badge_icon = EXCLUDED.badge_icon;
