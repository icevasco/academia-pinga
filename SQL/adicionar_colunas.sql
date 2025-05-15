-- Adicionar colunas faltantes na tabela utilizadores
ALTER TABLE utilizadores
ADD COLUMN IF NOT EXISTS tag VARCHAR(20),
ADD COLUMN IF NOT EXISTS trofeus INTEGER,
ADD COLUMN IF NOT EXISTS nivel INTEGER CHECK (nivel >= 1 AND nivel <= 14),
ADD COLUMN IF NOT EXISTS plano VARCHAR(20) CHECK (plano IN ('iniciante', 'avancado', 'pro')),
ADD COLUMN IF NOT EXISTS tipo_conta VARCHAR(20) DEFAULT 'gratuito',
ADD COLUMN IF NOT EXISTS data_registo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Adicionar índices
CREATE INDEX IF NOT EXISTS idx_utilizadores_tag ON utilizadores(tag);
CREATE INDEX IF NOT EXISTS idx_utilizadores_plano ON utilizadores(plano); 