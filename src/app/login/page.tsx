import { entrar } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <form
        action={entrar}
        className="w-full max-w-sm space-y-4 rounded-lg border border-black/10 p-6 dark:border-white/10"
      >
        <h1 className="text-xl font-semibold">CRM In Mente</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Entre para gerenciar os clientes do In Mente Gestão.
        </p>

        {erro && (
          <p className="rounded bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">
            {erro}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-transparent"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="senha" className="text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            className="w-full rounded border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black py-2 font-medium text-white dark:bg-white dark:text-black"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
