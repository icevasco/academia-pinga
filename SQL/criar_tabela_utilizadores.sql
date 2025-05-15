-- Criar a tabela utilizadores se ela não existir
CREATE TABLE IF NOT EXISTS utilizadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tag VARCHAR(20) NOT NULL,
    trofeus INTEGER,
    nivel INTEGER CHECK (nivel >= 1 AND nivel <= 14),
    plano VARCHAR(20) CHECK (plano IN ('iniciante', 'avancado', 'pro')),
    tipo_conta VARCHAR(20) DEFAULT 'gratuito',
    data_registo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentários das colunas
COMMENT ON TABLE utilizadores IS 'Tabela de usuários da Academia Pinga';
COMMENT ON COLUMN utilizadores.id IS 'Identificador único do usuário';
COMMENT ON COLUMN utilizadores.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN utilizadores.email IS 'Email do usuário (único)';
COMMENT ON COLUMN utilizadores.tag IS 'Tag do Clash Royale';
COMMENT ON COLUMN utilizadores.trofeus IS 'Número de troféus do jogador';
COMMENT ON COLUMN utilizadores.nivel IS 'Nível do rei (1-14)';
COMMENT ON COLUMN utilizadores.plano IS 'Plano escolhido pelo jogador';
COMMENT ON COLUMN utilizadores.tipo_conta IS 'Tipo de conta do usuário';
COMMENT ON COLUMN utilizadores.data_registo IS 'Data e hora do registro';

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_utilizadores_email ON utilizadores(email);
CREATE INDEX IF NOT EXISTS idx_utilizadores_plano ON utilizadores(plano);
CREATE INDEX IF NOT EXISTS idx_utilizadores_tag ON utilizadores(tag);

-- Políticas de segurança (RLS - Row Level Security)
ALTER TABLE utilizadores ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de novos usuários
CREATE POLICY "Permitir inserção de novos usuários"
ON utilizadores FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para permitir leitura dos próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
ON utilizadores FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política para permitir atualização dos próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON utilizadores FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id); 