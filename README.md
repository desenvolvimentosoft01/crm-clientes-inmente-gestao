# CRM In Mente

Painel interno para gestão dos clientes que utilizam o sistema **In Mente Gestão**: cadastro, plano contratado, status (ativo, em implantação, inadimplente, cancelado) e histórico de interações. Não é um funil de vendas/leads, apenas gestão pós-venda dos clientes já ativos.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth) — mesma abordagem usada no In Mente Gestão

## Setup

1. Crie um projeto no [Supabase](https://supabase.com) (ou use um existente).
2. Rode a migration em `supabase/migrations/0001_init.sql` no SQL Editor do projeto.
3. Crie usuários da equipe em Authentication → Users (login por e-mail/senha).
4. Copie `.env.example` para `.env.local` e preencha com a URL e a anon key do projeto Supabase.
5. Instale as dependências e rode:

```bash
npm install
npm run dev
```

Acesse http://localhost:3000 — você será redirecionado para `/login`.

## Estrutura
- `src/app/login` — autenticação
- `src/app/clientes` — listagem, cadastro, edição e histórico de interações de clientes
- `src/lib/supabase` — clientes Supabase (browser, server, middleware)
- `supabase/migrations` — schema do banco (tabelas `clientes` e `interacoes`, com RLS)
