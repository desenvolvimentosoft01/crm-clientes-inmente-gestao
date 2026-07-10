-- CRM In Mente: clientes que utilizam o sistema In Mente Gestão

create extension if not exists "pgcrypto";

create type status_cliente as enum ('ativo', 'em_implantacao', 'inadimplente', 'cancelado');

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  link_site text,
  contato_nome text,
  contato_telefone text,
  contato_email text,
  plano text,
  valor_mensal numeric(10,2),
  status status_cliente not null default 'ativo',
  data_inicio date,
  observacoes text,
  criado_por uuid references auth.users(id),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.interacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  descricao text not null,
  autor_id uuid references auth.users(id),
  criado_em timestamptz not null default now()
);

create index if not exists interacoes_cliente_id_idx on public.interacoes(cliente_id);

-- Mantém atualizado_em em dia
create or replace function public.set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clientes_atualizado_em
before update on public.clientes
for each row execute function public.set_atualizado_em();

-- RLS: qualquer usuário autenticado (equipe interna) pode ler/escrever
alter table public.clientes enable row level security;
alter table public.interacoes enable row level security;

create policy "clientes_select_autenticado" on public.clientes
  for select using (auth.role() = 'authenticated');

create policy "clientes_insert_autenticado" on public.clientes
  for insert with check (auth.role() = 'authenticated');

create policy "clientes_update_autenticado" on public.clientes
  for update using (auth.role() = 'authenticated');

create policy "interacoes_select_autenticado" on public.interacoes
  for select using (auth.role() = 'authenticated');

create policy "interacoes_insert_autenticado" on public.interacoes
  for insert with check (auth.role() = 'authenticated');
