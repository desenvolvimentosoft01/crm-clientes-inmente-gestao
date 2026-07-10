import { ClienteForm } from "@/components/ClienteForm";
import { criarCliente } from "@/app/clientes/actions";

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 p-6">
      <h1 className="mb-6 text-xl font-semibold">Novo cliente</h1>

      {erro && (
        <p className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <ClienteForm action={criarCliente} />
    </div>
  );
}
