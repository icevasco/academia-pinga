-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem ver todos os formulários" ON formularios;
DROP POLICY IF EXISTS "Qualquer um pode inserir formulários" ON formularios;
DROP POLICY IF EXISTS "Admins podem atualizar formulários" ON formularios;

-- Criar novas políticas mais permissivas
CREATE POLICY "Admins podem ver todos os formulários"
ON formularios
FOR SELECT
USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 
        FROM utilizadores 
        WHERE utilizadores.id = auth.uid() 
        AND utilizadores.tipo_conta = 'admin'
    )
);

CREATE POLICY "Qualquer um pode inserir formulários"
ON formularios
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem atualizar formulários"
ON formularios
FOR UPDATE
USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 
        FROM utilizadores 
        WHERE utilizadores.id = auth.uid() 
        AND utilizadores.tipo_conta = 'admin'
    )
);

-- Verificar se a tabela tem dados
SELECT COUNT(*) FROM formularios;

-- Verificar se o RLS está ativado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'formularios'; 