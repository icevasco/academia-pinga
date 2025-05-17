-- Adicionar restrição única na coluna user_id
ALTER TABLE treinadores
ADD CONSTRAINT treinadores_user_id_key UNIQUE (user_id); 