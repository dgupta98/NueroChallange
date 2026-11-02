ALTER TABLE public.lesson_cards
  ADD COLUMN IF NOT EXISTS feeling text,
  ADD COLUMN IF NOT EXISTS feeling_at timestamptz;
ALTER TABLE public.lesson_cards
  ADD CONSTRAINT lesson_cards_feeling_check CHECK (feeling IS NULL OR feeling IN ('happy','calm','worried','tired','sad','cross','skipped'));