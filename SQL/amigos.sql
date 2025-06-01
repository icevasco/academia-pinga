-- Criar tabela de amigos
CREATE TABLE amigos (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES utilizadores(id) ON DELETE CASCADE,
    amigo_id UUID REFERENCES utilizadores(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'rejeitado')),
    data_adicao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, amigo_id)
);

-- Criar índices para melhorar performance
CREATE INDEX idx_amigos_user_id ON amigos(user_id);
CREATE INDEX idx_amigos_amigo_id ON amigos(amigo_id);
CREATE INDEX idx_amigos_status ON amigos(status);

-- Trigger para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_amigos_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_amigos_data_atualizacao
    BEFORE UPDATE ON amigos
    FOR EACH ROW
    EXECUTE FUNCTION update_amigos_data_atualizacao();

-- Comentários nas colunas
COMMENT ON TABLE amigos IS 'Tabela que armazena as relações de amizade entre usuários';
COMMENT ON COLUMN amigos.user_id IS 'ID do usuário que enviou a solicitação';
COMMENT ON COLUMN amigos.amigo_id IS 'ID do usuário que recebeu a solicitação';
COMMENT ON COLUMN amigos.status IS 'Status da amizade: pendente, aceito ou rejeitado';
COMMENT ON COLUMN amigos.data_adicao IS 'Data em que a solicitação foi enviada';
COMMENT ON COLUMN amigos.data_atualizacao IS 'Data da última atualização do status'; 