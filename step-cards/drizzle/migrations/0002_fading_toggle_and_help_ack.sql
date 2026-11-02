ALTER TABLE public.students ADD COLUMN IF NOT EXISTS fading_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE public.lesson_cards ADD COLUMN IF NOT EXISTS help_ack_at timestamptz;