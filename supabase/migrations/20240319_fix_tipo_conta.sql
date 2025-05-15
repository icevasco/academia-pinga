-- Remover a restrição existente se houver
ALTER TABLE utilizadores DROP CONSTRAINT IF EXISTS utilizadores_tipo_conta_check;

-- Adicionar a nova restrição com os valores permitidos
ALTER TABLE utilizadores ADD CONSTRAINT utilizadores_tipo_conta_check 
CHECK (tipo_conta IN ('gratuito', 'premium_iniciante', 'premium_avancado', 'premium_pro', 'admin', 'treinador')); 