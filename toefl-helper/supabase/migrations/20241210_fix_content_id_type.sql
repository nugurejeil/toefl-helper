-- Fix content_id type in learning_records table
-- Change from UUID to TEXT to support non-UUID content IDs

-- Drop the foreign key constraint first
ALTER TABLE public.learning_records
DROP CONSTRAINT IF EXISTS learning_records_content_id_fkey;

-- Drop the index on content_id
DROP INDEX IF EXISTS idx_records_content_id;

-- Change content_id type from UUID to TEXT
ALTER TABLE public.learning_records
ALTER COLUMN content_id TYPE TEXT;

-- Recreate the index
CREATE INDEX idx_records_content_id ON public.learning_records(content_id);

-- Add comment for clarity
COMMENT ON COLUMN public.learning_records.content_id IS 'Content identifier (can be any string like vocab-1, reading-passage-1, etc.)';
