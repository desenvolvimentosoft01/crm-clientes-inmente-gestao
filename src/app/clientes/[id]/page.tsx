import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClienteForm } from "@/components/ClienteForm";
import { atualizarCliente, adicionarInteracao } from "@/app/clientes/actions";
import type { Cliente, Interacao } from "@/types/database";

export default async function ClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .returns<Cliente[]>()
    .single();

  if (!cliente) notFound();

  const { data: interacoes } = await supabase
    .from("interacoes")
    .select("id, descricao, criado_em")
    .eq("cliente_id", id)
    .order("criado_em", { ascending: false })
    .returns<Pick<Interacao, "id" | "descricao" | "criado_em">[]>();

  const atualizarComId = atualizarCliente.bind(null, id);
  const adicionarInteracaoComId = adicionarInteracao.bind(null, id);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 p-6">
      <h1 className="text-xl font-semibold">{cliente.nome}</h1>

      {erro && (
        <p className="rounded bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <ClienteForm cliente={cliente} action={atualizarComId} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Histórico de interações</h2>

        <form action={adicionarInteracaoComId} className="space-y-2">
          <textarea
            name="descricao"
            required
            rows={3}
            placeholder="Registre uma ligação, e-mail, reunião..."
            className="w-full rounded border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
          />
          <button
            type="submit"
            className="rounded border border-black/15 px-4 py-2 text-sm dark:border-white/15"
          >
            Adicionar interação
          </button>
        </form>

        <div className="divide-y divide-black/10 rounded border border-black/10 dark:divide-white/10 dark:border-white/10">
          {interacoes?.length === 0 && (
            <p className="p-4 text-sm text-black/60 dark:text-white/60">
              Nenhuma interação registrada ainda.
            </p>
          )}
          {interacoes?.map((interacao) => (
            <div key={interacao.id} className="p-4 text-sm">
              <p className="mb-1 text-xs text-black/50 dark:text-white/50">
                {new Date(interacao.criado_em).toLocaleString("pt-BR")}
              </p>
              <p>{interacao.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
