-- Remover políticas existentes
DROP POLICY IF EXISTS "Permitir leitura de avaliações" ON avaliacoes_treinadores;
DROP POLICY IF EXISTS "Permitir inserção de avaliações" ON avaliacoes_treinadores;
DROP POLICY IF EXISTS "Permitir exclusão de avaliações por admins e treinadores" ON avaliacoes_treinadores;

-- Criar novas políticas de segurança
-- Política para permitir leitura de todas as avaliações (público)
CREATE POLICY "Permitir leitura de avaliações"
ON avaliacoes_treinadores FOR SELECT
TO public
USING (true);

-- Política para permitir inserção de avaliações por usuários autenticados com plano premium
CREATE POLICY "Permitir inserção de avaliações"
ON avaliacoes_treinadores FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta NOT IN ('gratuito')
    )
);

-- Política para permitir exclusão de avaliações por admins e treinadores
CREATE POLICY "Permitir exclusão de avaliações por admins e treinadores"
ON avaliacoes_treinadores FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta IN ('admin', 'treinador')
    )
); 