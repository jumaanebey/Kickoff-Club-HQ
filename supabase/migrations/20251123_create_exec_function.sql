-- Create a function to execute arbitrary SQL
-- This is required for the migration script to work via the REST API
CREATE OR REPLACE FUNCTION public.exec(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
