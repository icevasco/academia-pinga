-- Criar a tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    treinador_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    aluno_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    duracao INTEGER NOT NULL CHECK (duracao IN (1, 2)),
    objetivos TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Permitir leitura de agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Permitir inserção de agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Permitir atualização de agendamentos" ON agendamentos;

-- Criar políticas de segurança
-- Política para permitir leitura de agendamentos
CREATE POLICY "Permitir leitura de agendamentos"
ON agendamentos FOR SELECT
TO authenticated
USING (
    auth.uid() = treinador_id OR 
    auth.uid() = aluno_id OR
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta IN ('admin', 'treinador')
    )
);

-- Política para permitir inserção de agendamentos
CREATE POLICY "Permitir inserção de agendamentos"
ON agendamentos FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = aluno_id OR
    auth.uid() = treinador_id OR
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta IN ('admin', 'treinador')
    )
);

-- Política para permitir atualização de agendamentos
CREATE POLICY "Permitir atualização de agendamentos"
ON agendamentos FOR UPDATE
TO authenticated
USING (
    auth.uid() = treinador_id OR
    auth.uid() = aluno_id OR
    EXISTS (
        SELECT 1 FROM utilizadores
        WHERE utilizadores.id = auth.uid()
        AND utilizadores.tipo_conta IN ('admin', 'treinador')
    )
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_treinador_id ON agendamentos(treinador_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_aluno_id ON agendamentos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_agendamento_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS update_agendamento_updated_at ON agendamentos;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_agendamento_updated_at
    BEFORE UPDATE ON agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION update_agendamento_updated_at(); 