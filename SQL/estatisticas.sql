-- Criar tabela de estatísticas
CREATE TABLE estatisticas (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES utilizadores(id) ON DELETE CASCADE,
    trofeus INTEGER DEFAULT 0,
    max_liga VARCHAR(50),
    nivel_jogador INTEGER,
    vitorias INTEGER DEFAULT 0,
    derrotas INTEGER DEFAULT 0,
    taxa_vitoria VARCHAR(10),
    melhor_posicao INTEGER,
    clan_atual VARCHAR(100),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Criar índice para melhorar performance nas buscas
CREATE INDEX idx_estatisticas_user_id ON estatisticas(user_id);

-- Trigger para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_estatisticas_data_atualizacao
    BEFORE UPDATE ON estatisticas
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();

-- Comentários nas colunas
COMMENT ON TABLE estatisticas IS 'Tabela que armazena as estatísticas dos jogadores do Clash Royale';
COMMENT ON COLUMN estatisticas.user_id IS 'ID do usuário relacionado';
COMMENT ON COLUMN estatisticas.trofeus IS 'Número atual de troféus do jogador';
COMMENT ON COLUMN estatisticas.max_liga IS 'Liga máxima alcançada pelo jogador';
COMMENT ON COLUMN estatisticas.nivel_jogador IS 'Nível atual do jogador';
COMMENT ON COLUMN estatisticas.vitorias IS 'Número total de vitórias';
COMMENT ON COLUMN estatisticas.derrotas IS 'Número total de derrotas';
COMMENT ON COLUMN estatisticas.taxa_vitoria IS 'Taxa de vitória em porcentagem';
COMMENT ON COLUMN estatisticas.melhor_posicao IS 'Melhor posição em troféus alcançada';
COMMENT ON COLUMN estatisticas.clan_atual IS 'Nome do clã atual do jogador';
COMMENT ON COLUMN estatisticas.data_atualizacao IS 'Data e hora da última atualização das estatísticas'; 