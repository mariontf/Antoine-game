-- =============================================
-- Sildia Contest — Setup Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- =============================================

-- Table logos
CREATE TABLE IF NOT EXISTS logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  slogan text,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table votes
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_name text NOT NULL,
  rank1_logo_id uuid NOT NULL REFERENCES logos(id) ON DELETE CASCADE,
  rank2_logo_id uuid NOT NULL REFERENCES logos(id) ON DELETE CASCADE,
  rank3_logo_id uuid NOT NULL REFERENCES logos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (voter_name)  -- 1 vote par personne
);

-- Vue score Borda
CREATE OR REPLACE VIEW borda_scores AS
SELECT logo_id, SUM(points) AS score
FROM (
  SELECT rank1_logo_id AS logo_id, 3 AS points FROM votes
  UNION ALL
  SELECT rank2_logo_id AS logo_id, 2 AS points FROM votes
  UNION ALL
  SELECT rank3_logo_id AS logo_id, 1 AS points FROM votes
) t
GROUP BY logo_id
ORDER BY score DESC;

-- Activer Row Level Security
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies : lecture publique, écriture publique (concours interne, accès par lien)
CREATE POLICY "Public read logos" ON logos FOR SELECT USING (true);
CREATE POLICY "Public insert logos" ON logos FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Public insert votes" ON votes FOR INSERT WITH CHECK (true);

-- Storage bucket (à créer dans l'interface Supabase > Storage > New bucket)
-- Nom : logos
-- Public : oui
-- Taille max fichier : 5 MB
-- Types acceptés : image/png, image/svg+xml, image/jpeg, image/webp
