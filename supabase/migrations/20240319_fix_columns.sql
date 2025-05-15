-- Adicionar coluna updated_at à tabela utilizadores
ALTER TABLE utilizadores
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_utilizadores_updated_at ON utilizadores;
CREATE TRIGGER update_utilizadores_updated_at
    BEFORE UPDATE ON utilizadores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Remover função existente
DROP FUNCTION IF EXISTS get_table_columns(text);

-- Função para obter colunas de uma tabela
CREATE OR REPLACE FUNCTION get_table_columns(p_table_name text)
RETURNS TABLE (
    column_name text,
    data_type text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.attname::text as column_name,
        pg_catalog.format_type(a.atttypid, a.atttypmod)::text as data_type
    FROM pg_catalog.pg_attribute a
    WHERE a.attnum > 0 
    AND NOT a.attisdropped
    AND a.attrelid = (
        SELECT c.oid
        FROM pg_catalog.pg_class c
        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = p_table_name
        AND pg_catalog.pg_table_is_visible(c.oid)
    );
END;
$$ LANGUAGE plpgsql; 