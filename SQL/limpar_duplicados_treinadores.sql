-- Criar uma tabela temporária com os registros únicos
CREATE TEMP TABLE treinadores_temp AS
SELECT DISTINCT ON (user_id) *
FROM treinadores
ORDER BY user_id, created_at DESC;

-- Limpar a tabela original e suas referências
TRUNCATE TABLE treinadores CASCADE;

-- Reinserir os registros únicos
INSERT INTO treinadores
SELECT * FROM treinadores_temp;

-- Remover a tabela temporária
DROP TABLE treinadores_temp; 