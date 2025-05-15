-- Verificar se a tabela existe
do $$
begin
    -- Criar a tabela apenas se não existir
    if not exists (select from pg_tables where schemaname = 'public' and tablename = 'inscricoes') then
        create table public.inscricoes (
            id uuid default uuid_generate_v4() primary key,
            utilizador_id uuid references auth.users(id),
            plano text not null,
            tag text,
            trofeus integer,
            nivel integer,
            status text default 'pendente',
            data_inscricao timestamp with time zone default timezone('utc'::text, now()),
            created_at timestamp with time zone default timezone('utc'::text, now())
        );
    end if;
end $$;

-- Habilitar RLS (Row Level Security)
alter table public.inscricoes enable row level security;

-- Remover políticas existentes (se houver)
drop policy if exists "Permitir inserção de inscrições" on public.inscricoes;
drop policy if exists "Permitir leitura de inscrições" on public.inscricoes;
drop policy if exists "Permitir atualização de inscrições" on public.inscricoes;

-- Criar políticas de segurança
create policy "Permitir inserção de inscrições"
on public.inscricoes for insert
to authenticated
with check (true);

create policy "Permitir leitura de inscrições"
on public.inscricoes for select
to authenticated
using (true);

create policy "Permitir atualização de inscrições"
on public.inscricoes for update
to authenticated
using (true);

-- Criar índices para melhor performance
create index if not exists idx_inscricoes_utilizador_id on public.inscricoes(utilizador_id);
create index if not exists idx_inscricoes_status on public.inscricoes(status);
create index if not exists idx_inscricoes_data_inscricao on public.inscricoes(data_inscricao); 