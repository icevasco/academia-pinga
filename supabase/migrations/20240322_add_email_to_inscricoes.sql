-- Adicionar coluna email à tabela inscricoes
ALTER TABLE inscricoes
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL;

-- Atualizar a coluna updated_at quando houver alterações
CREATE OR REPLACE TRIGGER update_inscricoes_updated_at
    BEFORE UPDATE ON inscricoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 