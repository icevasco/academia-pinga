-- Inserir aulas de teste para o treinador
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
    t.user_id as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '1 day')::date as data,
    '09:00'::time as hora,
    1 as duracao,
    'Treino de estratégia e técnicas avançadas' as objetivos,
    'pendente' as status
FROM treinadores t
CROSS JOIN utilizadores u
WHERE t.user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
AND u.tipo_conta = 'gratuito'
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
    t.user_id as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '2 days')::date as data,
    '14:00'::time as hora,
    2 as duracao,
    'Análise de replays e correção de erros' as objetivos,
    'confirmado' as status
FROM treinadores t
CROSS JOIN utilizadores u
WHERE t.user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
AND u.tipo_conta = 'gratuito'
LIMIT 1; 