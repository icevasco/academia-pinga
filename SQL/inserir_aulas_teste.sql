-- Primeiro, garantir que o treinador existe
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

-- Depois, inserir as aulas de teste
INSERT INTO agendamentos (
    treinador_id,
    aluno_id,
    data,
    hora,
    duracao,
    objetivos,
    status
)
SELECT 
    '2e0d097d-a785-4191-b272-d8deb6677689' as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '1 day')::date as data,
    '09:00'::time as hora,
    1 as duracao,
    'Treino de estratégia e técnicas avançadas' as objetivos,
    'pendente' as status
FROM utilizadores u
WHERE u.tipo_conta = 'gratuito'
LIMIT 1;

INSERT INTO agendamentos (
    treinador_id,
    aluno_id,
    data,
    hora,
    duracao,
    objetivos,
    status
)
SELECT 
    '2e0d097d-a785-4191-b272-d8deb6677689' as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '2 days')::date as data,
    '14:00'::time as hora,
    2 as duracao,
    'Análise de replays e correção de erros' as objetivos,
    'confirmado' as status
FROM utilizadores u
WHERE u.tipo_conta = 'gratuito'
LIMIT 1; 