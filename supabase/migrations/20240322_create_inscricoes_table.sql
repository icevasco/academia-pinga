-- Criar a tabela inscricoes se não existir
CREATE TABLE IF NOT EXISTS inscricoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilizador_id UUID REFERENCES auth.users(id),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    plano TEXT NOT NULL,
    tag TEXT,
    trofeus INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pendente',
    data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhorar performance de busca
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes(status);
CREATE INDEX IF NOT EXISTS idx_inscricoes_plano ON inscricoes(plano);

-- Ativar RLS
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem ver todas as inscrições" ON inscricoes;
DROP POLICY IF EXISTS "Qualquer um pode inserir inscrições" ON inscricoes;
DROP POLICY IF EXISTS "Admins podem atualizar inscrições" ON inscricoes;

-- Criar novas políticas
CREATE POLICY "Admins podem ver todas as inscrições"
ON inscricoes
FOR SELECT
USING (
    EXISTS (
        SELECT 1 
        FROM utilizadores 
        WHERE utilizadores.id = auth.uid() 
        AND utilizadores.tipo_conta LIKE 'admin%'
    )
);

CREATE POLICY "Qualquer um pode inserir inscrições"
ON inscricoes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem atualizar inscrições"
ON inscricoes
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 
        FROM utilizadores 
        WHERE utilizadores.id = auth.uid() 
        AND utilizadores.tipo_conta LIKE 'admin%'
    )
); 