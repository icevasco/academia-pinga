-- Criar a tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    estrelas INTEGER CHECK (estrelas >= 1 AND estrelas <= 5),
    texto TEXT NOT NULL,
    trofeus INTEGER CHECK (trofeus >= 0 AND trofeus <= 9000),
    data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
-- Política para permitir leitura de todas as avaliações
CREATE POLICY "Permitir leitura de avaliações"
ON avaliacoes FOR SELECT
TO authenticated
USING (true);

-- Política para permitir inserção de avaliações por usuários autenticados
CREATE POLICY "Permitir inserção de avaliações"
ON avaliacoes FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para permitir exclusão de avaliações por admins e treinadores
CREATE POLICY "Permitir exclusão de avaliações por admins e treinadores"
ON avaliacoes FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta IN ('admin', 'treinador')
    )
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_user_id ON avaliacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON avaliacoes(data);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_estrelas ON avaliacoes(estrelas); 