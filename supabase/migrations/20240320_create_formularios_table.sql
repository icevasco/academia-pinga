-- Criar a tabela formularios se não existir
CREATE TABLE IF NOT EXISTS formularios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilizador_id UUID REFERENCES auth.users(id),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    plano TEXT NOT NULL,
    tag TEXT,
    trofeus INTEGER DEFAULT 0,
    nivel INTEGER DEFAULT 0,
    aprovado BOOLEAN DEFAULT false,
    data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice para melhorar performance de busca
CREATE INDEX IF NOT EXISTS idx_formularios_aprovado ON formularios(aprovado);
CREATE INDEX IF NOT EXISTS idx_formularios_plano ON formularios(plano);

-- Ativar RLS
ALTER TABLE formularios ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem ver todos os formulários" ON formularios;
DROP POLICY IF EXISTS "Qualquer um pode inserir formulários" ON formularios;
DROP POLICY IF EXISTS "Admins podem atualizar formulários" ON formularios;

-- Criar novas políticas
CREATE POLICY "Admins podem ver todos os formulários"
ON formularios
FOR SELECT
USING (
    EXISTS (
        SELECT 1 
        FROM utilizadores 
        WHERE utilizadores.id = auth.uid() 
        AND utilizadores.tipo_conta LIKE 'admin%'
    )
);

CREATE POLICY "Qualquer um pode inserir formulários"
ON formularios
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem atualizar formulários"
ON formularios
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 
        FROM utilizadores 
        WHERE utilizadores.id = auth.uid() 
        AND utilizadores.tipo_conta LIKE 'admin%'
    )
); 