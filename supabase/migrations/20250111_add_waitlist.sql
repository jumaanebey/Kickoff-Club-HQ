-- Create waitlist signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER NOT NULL DEFAULT 499, -- $4.99 in cents
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON waitlist_signups(email);

-- Create index on stripe_customer_id for webhook processing
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_stripe_customer ON waitlist_signups(stripe_customer_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_waitlist_signups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER waitlist_signups_updated_at
  BEFORE UPDATE ON waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_waitlist_signups_updated_at();

-- Add RLS policies
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for signups)
CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist_signups
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own waitlist entry
CREATE POLICY "Users can view own waitlist entry"
  ON waitlist_signups
  FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
