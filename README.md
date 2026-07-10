# CRM In Mente

Painel interno para gestão dos clientes que utilizam o sistema **In Mente Gestão**: cadastro, plano contratado, status (ativo, em implantação, inadimplente, cancelado) e histórico de interações. Não é um funil de vendas/leads, apenas gestão pós-venda dos clientes já ativos.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- PostgreSQL local + Prisma ORM
- Auth.js (Credentials) para login da equipe

## Setup

1. Tenha um Postgres rodando localmente e crie um banco (ex.: `crm-clientes-inmente`).
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` com a connection string do seu Postgres e `AUTH_SECRET` com um valor aleatório (`openssl rand -base64 32` ou `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`).
3. Instale as dependências e aplique as migrations:

```bash
npm install
npx prisma migrate deploy
```

4. Crie o primeiro usuário da equipe (login: `admin@inmente.com.br` / senha: `mudar123` por padrão — troque via variáveis de ambiente `SEED_USER_EMAIL`, `SEED_USER_SENHA`, `SEED_USER_NOME` antes de rodar):

```bash
npm run seed
```

5. Rode o projeto:

```bash
npm run dev
```

Acesse http://localhost:3000 — você será redirecionado para `/login`.

## Estrutura
- `src/app/login` — autenticação (Auth.js Credentials)
- `src/app/clientes` — listagem, cadastro, edição e histórico de interações de clientes
- `src/auth.ts` — configuração do Auth.js
- `src/lib/prisma.ts` — client Prisma
- `prisma/schema.prisma` — modelos `Usuario`, `Cliente`, `Interacao`
- `prisma/seed.ts` — script para criar o primeiro usuário
