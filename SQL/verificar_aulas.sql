-- Verificar aulas existentes
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno
FROM agendamentos a
LEFT JOIN treinadores t ON a.treinador_id = t.user_id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
ORDER BY a.data, a.hora; 