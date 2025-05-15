-- Create cartas table
create table if not exists cartas (
    id uuid default gen_random_uuid() primary key,
    nome text not null,
    imagem_url text not null,
    custo_elixir integer not null,
    tipo text not null,
    raridade text not null,
    evolui boolean default false,
    descricao text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists idx_cartas_nome on cartas(nome);
create index if not exists idx_cartas_tipo on cartas(tipo);
create index if not exists idx_cartas_raridade on cartas(raridade);
create index if not exists idx_cartas_evolui on cartas(evolui);

-- Create function to update updated_at timestamp
create or replace function atualizar_data_carta()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger atualizar_data_carta_trigger
    before update on cartas
    for each row
    execute function atualizar_data_carta();

-- Insert some sample cards
insert into cartas (nome, imagem_url, custo_elixir, tipo, raridade, evolui, descricao) values
('Cavaleiro Evo', '../IMG/CARTAS/cavaleiro_evo.png', 3, 'Tropa', 'Comum', true, 'Cavaleiro evoluído com habilidades aprimoradas'),
('Arqueiras Evo', '../IMG/CARTAS/arqueiras_evo.png', 3, 'Tropa', 'Comum', true, 'Arqueiras evoluídas com maior alcance'),
('Mineiro', '../IMG/CARTAS/mineiro.png', 3, 'Tropa', 'Lendária', false, 'Unidade que pode aparecer em qualquer lugar do mapa'),
('Veneno', '../IMG/CARTAS/veneno.png', 4, 'Feitiço', 'Raro', false, 'Feitiço de área que causa dano ao longo do tempo'),
('Torre Bomba', '../IMG/CARTAS/torre_bomba.png', 4, 'Construção', 'Raro', false, 'Torre defensiva que causa dano em área'),
('Espírito de Gelo', '../IMG/CARTAS/espirito_gelo.png', 1, 'Tropa', 'Comum', false, 'Espírito que congela inimigos'),
('Tronco', '../IMG/CARTAS/tronco.png', 2, 'Feitiço', 'Comum', false, 'Feitiço que rola pelo mapa causando dano'),
('Goblins', '../IMG/CARTAS/goblins.png', 2, 'Tropa', 'Comum', false, 'Grupo de goblins rápidos'); 