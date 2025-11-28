-- Create user_hq table to track building levels and decor
CREATE TABLE IF NOT EXISTS public.user_hq (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    stadium_level INTEGER DEFAULT 1 CHECK (stadium_level >= 1 AND stadium_level <= 5),
    film_room_level INTEGER DEFAULT 1 CHECK (film_room_level >= 1 AND film_room_level <= 5),
    weight_room_level INTEGER DEFAULT 1 CHECK (weight_room_level >= 1 AND weight_room_level <= 5),
    practice_field_level INTEGER DEFAULT 1 CHECK (practice_field_level >= 1 AND practice_field_level <= 5),
    headquarters_level INTEGER DEFAULT 1 CHECK (headquarters_level >= 1 AND headquarters_level <= 5),
    coins INTEGER DEFAULT 0 CHECK (coins >= 0),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    decor_slots JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_hq ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own HQ"
    ON public.user_hq FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own HQ"
    ON public.user_hq FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own HQ"
    ON public.user_hq FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS handle_user_hq_updated_at ON public.user_hq;
CREATE TRIGGER handle_user_hq_updated_at
    BEFORE UPDATE ON public.user_hq
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
