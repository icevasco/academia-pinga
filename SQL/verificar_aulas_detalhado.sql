-- Verificar todas as aulas existentes com detalhes
SELECT 
    a.*,
    t.nome as nome_treinador,
    t.user_id as treinador_user_id,
    u.nome as nome_aluno,
    u.id as aluno_id
FROM agendamentos a
LEFT JOIN treinadores t ON a.treinador_id = t.user_id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
ORDER BY a.data, a.hora;

-- Verificar se existem alunos do tipo gratuito
SELECT * FROM utilizadores WHERE tipo_conta = 'gratuito';

-- Verificar se o treinador existe
SELECT * FROM treinadores WHERE user_id = '2e0d097d-a785-4191-b272-d8deb6677689'; 