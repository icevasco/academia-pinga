-- Criar a tabela de treinadores
CREATE TABLE IF NOT EXISTS treinadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    especialidade TEXT,
    foto_perfil_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT treinadores_user_id_key UNIQUE (user_id)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE treinadores ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Permitir leitura de treinadores" ON treinadores;
DROP POLICY IF EXISTS "Permitir inserção de treinadores" ON treinadores;
DROP POLICY IF EXISTS "Permitir atualização de treinadores" ON treinadores;

-- Criar políticas de segurança
CREATE POLICY "Permitir leitura de treinadores"
ON treinadores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir inserção de treinadores"
ON treinadores FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta IN ('admin', 'treinador')
    )
);

CREATE POLICY "Permitir atualização de treinadores"
ON treinadores FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta = 'admin'
    )
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_treinadores_user_id ON treinadores(user_id);
CREATE INDEX IF NOT EXISTS idx_treinadores_especialidade ON treinadores(especialidade);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_treinador_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_treinador_updated_at ON treinadores;
CREATE TRIGGER update_treinador_updated_at
    BEFORE UPDATE ON treinadores
    FOR EACH ROW
    EXECUTE FUNCTION update_treinador_updated_at(); 