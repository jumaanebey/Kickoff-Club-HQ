-- Create email subscribers table for waitlist/newsletter signups
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'homepage' CHECK (source IN ('homepage', 'podcast', 'footer', 'mobile_app')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);

-- Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_email_subscribers_source ON email_subscribers(source);

-- Add RLS policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for signups)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow service role full access (for admin)
CREATE POLICY "Service role has full access"
  ON email_subscribers
  FOR ALL
  USING (auth.role() = 'service_role');
