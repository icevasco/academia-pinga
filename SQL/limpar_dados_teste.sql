-- Script para limpar dados de teste do Supabase
-- ATENÇÃO: Revise antes de executar!

-- Exemplo: Remover treinadores de teste (ajuste os nomes conforme necessário)
DELETE FROM treinadores WHERE nome ILIKE '%teste%' OR nome ILIKE '%pinga%' OR nome ILIKE '%Pedro Ramos%';

-- Exemplo: Remover aulas de teste (por objetivos ou datas específicas)
DELETE FROM agendamentos WHERE objetivos ILIKE '%teste%' OR objetivos ILIKE '%estratégia%' OR objetivos ILIKE '%replays%' OR data >= '2025-05-18';

-- Exemplo: Remover utilizadores de teste (ajuste os nomes/emails conforme necessário)
DELETE FROM utilizadores WHERE nome ILIKE '%teste%' OR email ILIKE '%teste%' OR nome ILIKE '%Pedro Ramos%' OR nome ILIKE '%vasco manoel pinga%';

-- Opcional: Verificar o que será removido antes de executar
-- SELECT * FROM treinadores WHERE nome ILIKE '%teste%' OR nome ILIKE '%pinga%' OR nome ILIKE '%Pedro Ramos%';
-- SELECT * FROM agendamentos WHERE objetivos ILIKE '%teste%' OR objetivos ILIKE '%estratégia%' OR objetivos ILIKE '%replays%' OR data >= '2025-05-18';
-- SELECT * FROM utilizadores WHERE nome ILIKE '%teste%' OR email ILIKE '%teste%' OR nome ILIKE '%Pedro Ramos%' OR nome ILIKE '%vasco manoel pinga%'; 