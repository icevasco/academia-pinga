-- Inserir o treinador na tabela treinadores
INSERT INTO treinadores (
    user_id,
    nome,
    especialidade
)
VALUES (
    '2e0d097d-a785-4191-b272-d8deb6677689',
    'vasco manoel pinga',
    'Treinador Profissional'
)
ON CONFLICT (user_id) DO UPDATE
SET 
    nome = EXCLUDED.nome,
    especialidade = EXCLUDED.especialidade; 