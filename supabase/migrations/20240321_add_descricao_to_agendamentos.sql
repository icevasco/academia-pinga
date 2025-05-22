-- Adicionar coluna descricao à tabela agendamentos
ALTER TABLE agendamentos
ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Atualizar a coluna updated_at quando houver alterações
CREATE OR REPLACE TRIGGER update_agendamentos_updated_at
    BEFORE UPDATE ON agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 