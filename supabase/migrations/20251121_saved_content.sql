-- Create saved_content table for Save for Later functionality
CREATE TABLE IF NOT EXISTS saved_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('course', 'podcast', 'lesson')),
    content_title TEXT NOT NULL,
    content_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can only save the same content once
    UNIQUE(user_id, content_id, content_type)
);

-- Create indexes for performance
CREATE INDEX idx_saved_content_user ON saved_content(user_id);
CREATE INDEX idx_saved_content_type ON saved_content(content_type);
CREATE INDEX idx_saved_content_created ON saved_content(created_at DESC);

-- Enable RLS
ALTER TABLE saved_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own saved content
CREATE POLICY "Users can view own saved content"
    ON saved_content FOR SELECT
    USING (auth.uid() = user_id);

-- Users can save content
CREATE POLICY "Users can save content"
    ON saved_content FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can unsave their own content
CREATE POLICY "Users can unsave own content"
    ON saved_content FOR DELETE
    USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saved_content_updated_at
    BEFORE UPDATE ON saved_content
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_content_updated_at();

-- Create a view for easy querying
CREATE OR REPLACE VIEW user_saved_content AS
SELECT 
    sc.id,
    sc.user_id,
    sc.content_id,
    sc.content_type,
    sc.content_title,
    sc.content_url,
    sc.created_at,
    sc.updated_at
FROM saved_content sc
WHERE sc.user_id = auth.uid();
