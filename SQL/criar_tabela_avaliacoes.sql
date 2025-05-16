-- Criar a tabela de avaliações de treinadores
CREATE TABLE IF NOT EXISTS avaliacoes_treinadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    treinador_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    estrelas INTEGER CHECK (estrelas >= 1 AND estrelas <= 5),
    texto TEXT NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE avaliacoes_treinadores ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
-- Política para permitir leitura de todas as avaliações
CREATE POLICY "Permitir leitura de avaliações"
ON avaliacoes_treinadores FOR SELECT
TO authenticated
USING (true);

-- Política para permitir inserção de avaliações por usuários autenticados
CREATE POLICY "Permitir inserção de avaliações"
ON avaliacoes_treinadores FOR INSERT
TO authenticated
WITH CHECK (true);

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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_treinadores_user_id ON avaliacoes_treinadores(user_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_treinadores_treinador_id ON avaliacoes_treinadores(treinador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_treinadores_data ON avaliacoes_treinadores(data);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_treinadores_estrelas ON avaliacoes_treinadores(estrelas); 