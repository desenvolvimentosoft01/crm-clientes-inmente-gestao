import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { LinkBotao } from "@/components/Botao";
import { PLANO_OPCOES } from "@/lib/opcoes";
import type { StatusCliente } from "@prisma/client";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; status?: StatusCliente }>;
}) {
  const { busca, status } = await searchParams;

  const clientes = await prisma.cliente.findMany({
    where: {
      ...(busca ? { nome: { contains: busca, mode: "insensitive" as const } } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, plano: true, valorMensal: true, status: true },
  });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <LinkBotao href="/clientes/novo" variante="primario">
          + Novo cliente
        </LinkBotao>
      </div>

      <form className="mb-4 flex gap-2 rounded-xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <input
          type="text"
          name="busca"
          defaultValue={busca}
          placeholder="Buscar por nome..."
          className="flex-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground dark:border-white/15 dark:bg-neutral-800"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground dark:border-white/15 dark:bg-neutral-800"
        >
          <option value="" className="bg-white text-black dark:bg-neutral-800 dark:text-white">
            Todos os status
          </option>
          <option value="ativo" className="bg-white text-black dark:bg-neutral-800 dark:text-white">
            Ativo
          </option>
          <option
            value="em_implantacao"
            className="bg-white text-black dark:bg-neutral-800 dark:text-white"
          >
            Em implantação
          </option>
          <option
            value="inadimplente"
            className="bg-white text-black dark:bg-neutral-800 dark:text-white"
          >
            Inadimplente
          </option>
          <option
            value="cancelado"
            className="bg-white text-black dark:bg-neutral-800 dark:text-white"
          >
            Cancelado
          </option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Filtrar
        </button>
      </form>

      <div className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-neutral-900">
        {clientes.length === 0 && (
          <p className="p-6 text-center text-sm text-black/60 dark:text-white/60">
            Nenhum cliente encontrado.
          </p>
        )}
        {clientes.map((cliente) => (
          <Link
            key={cliente.id}
            href={`/clientes/${cliente.id}`}
            className="flex items-center justify-between p-4 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div>
              <p className="font-medium">{cliente.nome}</p>
              <p className="text-black/60 dark:text-white/60">
                {PLANO_OPCOES.find((opcao) => opcao.value === cliente.plano)?.label ??
                  "Sem plano"}
                {cliente.valorMensal
                  ? ` · R$ ${cliente.valorMensal.toFixed(2)}/mês`
                  : ""}
              </p>
            </div>
            <StatusBadge status={cliente.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
