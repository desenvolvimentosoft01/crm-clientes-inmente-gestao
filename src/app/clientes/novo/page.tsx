import { ClienteForm } from "@/components/ClienteForm";
import { LinkBotao } from "@/components/Botao";
import { criarCliente } from "@/app/clientes/actions";

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-6">
      <div>
        <LinkBotao href="/clientes" variante="fantasma" className="mb-3 px-0">
          ← Voltar para clientes
        </LinkBotao>
        <h1 className="text-2xl font-semibold">Novo cliente</h1>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <ClienteForm action={criarCliente} cancelarHref="/clientes" />
      </section>
    </div>
  );
}
