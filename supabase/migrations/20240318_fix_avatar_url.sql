-- Função para obter as colunas de uma tabela
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
    column_name text,
    data_type text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        c.data_type::text
    FROM information_schema.columns c
    WHERE c.table_name = table_name;
END;
$$;

-- Função para alterar o tipo de uma coluna
CREATE OR REPLACE FUNCTION alter_column_type(
    table_name text,
    column_name text,
    new_type text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE %s', table_name, column_name, new_type);
END;
$$;

-- Alterar o tipo da coluna avatar_url para text
ALTER TABLE treinadores ALTER COLUMN avatar_url TYPE text; 