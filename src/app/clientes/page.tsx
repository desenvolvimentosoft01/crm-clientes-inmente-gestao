import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
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
        <h1 className="text-xl font-semibold">Clientes</h1>
        <Link
          href="/clientes/novo"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Novo cliente
        </Link>
      </div>

      <form className="mb-4 flex gap-2">
        <input
          type="text"
          name="busca"
          defaultValue={busca}
          placeholder="Buscar por nome..."
          className="flex-1 rounded border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="em_implantacao">Em implantação</option>
          <option value="inadimplente">Inadimplente</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button
          type="submit"
          className="rounded border border-black/15 px-4 py-2 text-sm dark:border-white/15"
        >
          Filtrar
        </button>
      </form>

      <div className="divide-y divide-black/10 rounded border border-black/10 dark:divide-white/10 dark:border-white/10">
        {clientes.length === 0 && (
          <p className="p-4 text-sm text-black/60 dark:text-white/60">
            Nenhum cliente encontrado.
          </p>
        )}
        {clientes.map((cliente) => (
          <Link
            key={cliente.id}
            href={`/clientes/${cliente.id}`}
            className="flex items-center justify-between p-4 text-sm hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div>
              <p className="font-medium">{cliente.nome}</p>
              <p className="text-black/60 dark:text-white/60">
                {cliente.plano ?? "Sem plano"}
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
