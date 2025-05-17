-- Primeiro, verificar se a restrição única já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'treinadores_user_id_key'
    ) THEN
        -- Adicionar a restrição única se não existir
        ALTER TABLE treinadores
        ADD CONSTRAINT treinadores_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Verificar se o usuário existe em auth.users
SELECT * FROM auth.users WHERE id = '2e0d097d-a785-4191-b272-d8deb6677689';

-- Garantir que o treinador existe
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

-- Verificar se o treinador foi criado/atualizado e obter seu ID
SELECT id, user_id, nome FROM treinadores WHERE user_id = '2e0d097d-a785-4191-b272-d8deb6677689';

-- Verificar todas as aulas existentes
SELECT 
    a.*,
    t.user_id as treinador_user_id,
    t.nome as nome_treinador,
    u.nome as nome_aluno
FROM agendamentos a
LEFT JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
ORDER BY a.data, a.hora;

-- Verificar se existem aulas com treinador_id incorreto
SELECT 
    a.*,
    t.user_id as treinador_user_id,
    t.nome as nome_treinador
FROM agendamentos a
LEFT JOIN treinadores t ON a.treinador_id = t.id
WHERE t.user_id IS NULL;

-- Corrigir aulas com treinador_id incorreto
UPDATE agendamentos a
SET treinador_id = t.id
FROM treinadores t
WHERE a.treinador_id = t.user_id
AND t.id IS NOT NULL;

-- Verificar se existem alunos do tipo gratuito
SELECT * FROM utilizadores WHERE tipo_conta = 'gratuito';

-- Inserir aulas de teste se não existirem
WITH treinador_info AS (
    SELECT id FROM treinadores WHERE user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
)
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
    t.id as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '1 day')::date as data,
    '09:00'::time as hora,
    1 as duracao,
    'Treino de estratégia e técnicas avançadas' as objetivos,
    'pendente' as status
FROM treinador_info t
CROSS JOIN utilizadores u
WHERE u.tipo_conta = 'gratuito'
AND NOT EXISTS (
    SELECT 1 FROM agendamentos a
    WHERE a.treinador_id = t.id
    AND a.data = (CURRENT_DATE + INTERVAL '1 day')::date
    AND a.hora = '09:00'::time
)
LIMIT 1;

WITH treinador_info AS (
    SELECT id FROM treinadores WHERE user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
)
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
    t.id as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '2 days')::date as data,
    '14:00'::time as hora,
    2 as duracao,
    'Análise de replays e correção de erros' as objetivos,
    'confirmado' as status
FROM treinador_info t
CROSS JOIN utilizadores u
WHERE u.tipo_conta = 'gratuito'
AND NOT EXISTS (
    SELECT 1 FROM agendamentos a
    WHERE a.treinador_id = t.id
    AND a.data = (CURRENT_DATE + INTERVAL '2 days')::date
    AND a.hora = '14:00'::time
)
LIMIT 1;

-- Verificar se o treinador existe
SELECT * FROM treinadores WHERE user_id = '2e0d097d-a785-4191-b272-d8deb6677689';

-- Se não existir, inserir o treinador
INSERT INTO treinadores (user_id, nome, especialidade)
VALUES ('2e0d097d-a785-4191-b272-d8deb6677689', 'vasco manoel pinga', 'Treinador Profissional')
ON CONFLICT (user_id) DO UPDATE 
SET nome = EXCLUDED.nome,
    especialidade = EXCLUDED.especialidade;

-- Verificar se o treinador foi criado/atualizado
SELECT * FROM treinadores WHERE user_id = '2e0d097d-a785-4191-b272-d8deb6677689';

-- Verificar todas as aulas deste treinador
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno,
    t.id as treinador_id,
    t.user_id as treinador_user_id
FROM agendamentos a
JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
ORDER BY a.data, a.hora;

-- Verificar se existem aulas com treinador_id incorreto
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno,
    t.id as treinador_id,
    t.user_id as treinador_user_id
FROM agendamentos a
LEFT JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
AND a.treinador_id != t.id;

-- Corrigir aulas com treinador_id incorreto
UPDATE agendamentos a
SET treinador_id = t.id
FROM treinadores t
WHERE a.treinador_id = t.user_id
AND t.user_id = '2e0d097d-a785-4191-b272-d8deb6677689';

-- Verificar se as aulas foram corrigidas
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno,
    t.id as treinador_id,
    t.user_id as treinador_user_id
FROM agendamentos a
JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '2e0d097d-a785-4191-b272-d8deb6677689'
ORDER BY a.data, a.hora;

-- Verificar se o treinador existe
SELECT * FROM treinadores WHERE user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7';

-- Verificar todas as aulas deste treinador
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno
FROM agendamentos a
JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
ORDER BY a.data, a.hora;

-- Inserir aulas de teste para alunos com conta gratuita
WITH treinador_info AS (
    SELECT id FROM treinadores WHERE user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
)
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
    t.id as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '1 day')::date as data,
    '09:00'::time as hora,
    1 as duracao,
    'Treino de estratégia e técnicas avançadas' as objetivos,
    'pendente' as status
FROM treinador_info t
CROSS JOIN utilizadores u
WHERE u.tipo_conta = 'gratuito'
AND NOT EXISTS (
    SELECT 1 FROM agendamentos a
    WHERE a.treinador_id = t.id
    AND a.data = (CURRENT_DATE + INTERVAL '1 day')::date
    AND a.hora = '09:00'::time
)
LIMIT 1;

-- Inserir mais uma aula de teste para o dia seguinte
WITH treinador_info AS (
    SELECT id FROM treinadores WHERE user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
)
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
    t.id as treinador_id,
    u.id as aluno_id,
    (CURRENT_DATE + INTERVAL '2 days')::date as data,
    '14:00'::time as hora,
    2 as duracao,
    'Análise de replays e correção de erros' as objetivos,
    'confirmado' as status
FROM treinador_info t
CROSS JOIN utilizadores u
WHERE u.tipo_conta = 'gratuito'
AND NOT EXISTS (
    SELECT 1 FROM agendamentos a
    WHERE a.treinador_id = t.id
    AND a.data = (CURRENT_DATE + INTERVAL '2 days')::date
    AND a.hora = '14:00'::time
)
LIMIT 1;

-- Verificar se as aulas foram criadas
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno
FROM agendamentos a
JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
ORDER BY a.data, a.hora;

-- Verificar a estrutura da tabela agendamentos
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'agendamentos';

-- Verificar se RLS está habilitado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'agendamentos';

-- Habilitar RLS se não estiver habilitado
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Remover políticas RLS existentes
DROP POLICY IF EXISTS "Treinadores podem ver suas próprias aulas" ON agendamentos;
DROP POLICY IF EXISTS "Treinadores podem inserir aulas" ON agendamentos;
DROP POLICY IF EXISTS "Treinadores podem atualizar suas aulas" ON agendamentos;

-- Criar novas políticas RLS
CREATE POLICY "Treinadores podem ver suas próprias aulas"
ON agendamentos
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM treinadores t
        WHERE t.id = agendamentos.treinador_id
        AND t.user_id = auth.uid()
    )
);

CREATE POLICY "Treinadores podem inserir aulas"
ON agendamentos
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM treinadores t
        WHERE t.id = agendamentos.treinador_id
        AND t.user_id = auth.uid()
    )
);

CREATE POLICY "Treinadores podem atualizar suas aulas"
ON agendamentos
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM treinadores t
        WHERE t.id = agendamentos.treinador_id
        AND t.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM treinadores t
        WHERE t.id = agendamentos.treinador_id
        AND t.user_id = auth.uid()
    )
);

-- Verificar se o treinador existe
SELECT * FROM treinadores WHERE user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7';

-- Verificar todas as aulas deste treinador com detalhes
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno,
    t.id as treinador_id,
    t.user_id as treinador_user_id,
    a.data as data_aula,
    a.hora as hora_aula
FROM agendamentos a
JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
ORDER BY a.data, a.hora;

-- Verificar se existem aulas com treinador_id incorreto
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno,
    t.id as treinador_id,
    t.user_id as treinador_user_id
FROM agendamentos a
LEFT JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
AND a.treinador_id != t.id;

-- Corrigir aulas com treinador_id incorreto
UPDATE agendamentos a
SET treinador_id = t.id
FROM treinadores t
WHERE a.treinador_id = t.user_id
AND t.user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7';

-- Verificar se as aulas foram corrigidas
SELECT 
    a.*,
    t.nome as nome_treinador,
    u.nome as nome_aluno,
    t.id as treinador_id,
    t.user_id as treinador_user_id,
    a.data as data_aula,
    a.hora as hora_aula
FROM agendamentos a
JOIN treinadores t ON a.treinador_id = t.id
LEFT JOIN utilizadores u ON a.aluno_id = u.id
WHERE t.user_id = '3bc2fba0-4d04-4046-b5d1-ffa25ac01ad7'
ORDER BY a.data, a.hora; 