-- SCHEMA: chapters & scences
SET search_path TO public;

-- Table: chapters
CREATE TABLE IF NOT EXISTS chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    note text,
    order_number integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chapters_project_id ON chapters(project_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order_number ON chapters(order_number);

-- Table: scences
CREATE TABLE IF NOT EXISTS scences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    name text NOT NULL,
    note text,
    order_number integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scences_chapter_id ON scences(chapter_id);
CREATE INDEX IF NOT EXISTS idx_scences_order_number ON scences(order_number);

-- RLS policies should be added as needed for multi-tenant security.
