-- Verificar se a tabela existe e recriar se necessário
drop table if exists utilizadores;

-- Criar a tabela de utilizadores
create table utilizadores (
    id uuid references auth.users on delete cascade primary key,
    nome text not null,
    email text unique not null,
    data_criacao timestamp with time zone default timezone('utc'::text, now()),
    ultimo_login timestamp with time zone,
    tipo_conta text default 'normal',
    status text default 'ativo',
    foto_perfil_url text,
    especialidade text
);

-- Habilitar Row Level Security (RLS)
alter table utilizadores enable row level security;

-- Remover políticas existentes
drop policy if exists "Usuários podem ver seus próprios dados" on utilizadores;
drop policy if exists "Usuários podem atualizar seus próprios dados" on utilizadores;
drop policy if exists "Usuários podem inserir seus próprios dados" on utilizadores;
drop policy if exists "Administradores podem ver todos os dados" on utilizadores;

-- Criar novas políticas de segurança
-- Política para usuários verem seus próprios dados
create policy "Usuários podem ver seus próprios dados"
on utilizadores for select
using (auth.uid() = id);

-- Política para usuários atualizarem seus próprios dados
create policy "Usuários podem atualizar seus próprios dados"
on utilizadores for update
using (auth.uid() = id);

-- Política para inserção de novos usuários
create policy "Usuários podem inserir seus próprios dados"
on utilizadores for insert
with check (auth.uid() = id);

-- Política para administradores
create policy "Administradores podem ver todos os dados"
on utilizadores for all
using (
    exists (
        select 1 from utilizadores
        where utilizadores.id = auth.uid()
        and utilizadores.tipo_conta = 'admin'
    )
);

-- Criar função para atualizar último login
create or replace function atualizar_ultimo_login()
returns trigger as $$
begin
    new.ultimo_login = now();
    return new;
end;
$$ language plpgsql security definer;

-- Criar trigger para atualizar último login
create trigger atualizar_ultimo_login_trigger
    before update on utilizadores
    for each row
    execute function atualizar_ultimo_login();

-- Criar índices para melhor performance
create index idx_utilizadores_email on utilizadores(email);
create index idx_utilizadores_data_criacao on utilizadores(data_criacao);
create index idx_utilizadores_status on utilizadores(status);
create index idx_utilizadores_tipo_conta on utilizadores(tipo_conta);
