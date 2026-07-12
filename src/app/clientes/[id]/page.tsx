import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClienteForm } from "@/components/ClienteForm";
import { ClienteView } from "@/components/ClienteView";
import { StatusBadge } from "@/components/StatusBadge";
import { LinkBotao } from "@/components/Botao";
import { ErroCard } from "@/components/ErroCard";
import { atualizarCliente, adicionarInteracao } from "@/app/clientes/actions";
import { hojeSP, limitesDoDiaSP } from "@/lib/data";

const SELECT_ERRO = {
  id: true,
  mensagem: true,
  detalheTecnico: true,
  tela: true,
  tipo: true,
  usuario: true,
  ocorridoEm: true,
  criadoEm: true,
} as const;

export default async function ClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; editar?: string; dataErros?: string }>;
}) {
  const { id } = await params;
  const { erro, editar, dataErros } = await searchParams;
  const emEdicao = editar === "1";
  const clienteIdNumerico = Number(id);
  if (!Number.isInteger(clienteIdNumerico)) notFound();

  const cliente = await prisma.cliente.findUnique({ where: { id: clienteIdNumerico } });
  if (!cliente) notFound();

  const interacoes = await prisma.interacao.findMany({
    where: { clienteId: clienteIdNumerico },
    orderBy: { criadoEm: "desc" },
    select: { id: true, descricao: true, criadoEm: true },
  });

  const hoje = hojeSP();
  const { inicio: inicioHoje, fim: fimHoje } = limitesDoDiaSP(hoje);
  const filtroAtivo = !!dataErros && dataErros !== hoje;

  const filtroLimites = filtroAtivo ? limitesDoDiaSP(dataErros!) : null;

  const [errosHoje, errosFiltrados] = await Promise.all([
    prisma.erroLog.findMany({
      where: { clienteId: clienteIdNumerico, criadoEm: { gte: inicioHoje, lte: fimHoje } },
      orderBy: { criadoEm: "desc" },
      select: SELECT_ERRO,
    }),
    prisma.erroLog.findMany({
      where: {
        clienteId: clienteIdNumerico,
        ...(filtroLimites ? { criadoEm: { gte: filtroLimites.inicio, lte: filtroLimites.fim } } : {}),
      },
      orderBy: { criadoEm: "desc" },
      take: filtroLimites ? undefined : 50,
      select: SELECT_ERRO,
    }),
  ]);

  const atualizarComId = atualizarCliente.bind(null, id);
  const adicionarInteracaoComId = adicionarInteracao.bind(null, id);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 space-y-6 p-6">
      <div>
        <LinkBotao href="/clientes" variante="fantasma" className="mb-3 px-0">
          ← Voltar para clientes
        </LinkBotao>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">{cliente.nome}</h1>
          {!emEdicao && <StatusBadge status={cliente.status} />}
        </div>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dados do cliente</h2>
          {!emEdicao && (
            <LinkBotao href={`/clientes/${id}?editar=1`} variante="secundario">
              Editar
            </LinkBotao>
          )}
        </div>

        {emEdicao ? (
          <ClienteForm cliente={cliente} action={atualizarComId} cancelarHref={`/clientes/${id}`} />
        ) : (
          <ClienteView cliente={cliente} />
        )}
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">Histórico de interações</h2>

        <form action={adicionarInteracaoComId} className="mb-5 space-y-2">
          <textarea
            name="descricao"
            required
            rows={3}
            placeholder="Registre uma ligação, e-mail, reunião..."
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
          />
          <button
            type="submit"
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            Adicionar interação
          </button>
        </form>

        <div className="divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
          {interacoes.length === 0 && (
            <p className="p-4 text-sm text-black/60 dark:text-white/60">
              Nenhuma interação registrada ainda.
            </p>
          )}
          {interacoes.map((interacao) => (
            <div key={interacao.id} className="p-4 text-sm">
              <p className="mb-1 text-xs text-black/50 dark:text-white/50">
                {new Date(interacao.criadoEm).toLocaleString("pt-BR")}
              </p>
              <p>{interacao.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">Erros do sistema</h2>

        {errosHoje.length > 0 && (
          <div className="sticky top-0 z-10 mb-6 -mx-6 -mt-1 border-b border-black/10 bg-amber-500/10 px-6 pb-4 pt-1 backdrop-blur dark:border-white/10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Hoje ({errosHoje.length})
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {errosHoje.map((erro) => (
                <ErroCard key={erro.id} erro={erro} />
              ))}
            </div>
          </div>
        )}

        <form className="mb-4 flex items-end gap-2" action={`/clientes/${id}`}>
          <input type="hidden" name="editar" value={editar ?? ""} />
          <label className="text-sm">
            <span className="mb-1 block text-xs text-black/60 dark:text-white/60">Filtrar por data</span>
            <input
              type="date"
              name="dataErros"
              defaultValue={dataErros ?? ""}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            Filtrar
          </button>
          {filtroAtivo && (
            <LinkBotao href={`/clientes/${id}`} variante="fantasma">
              Limpar filtro
            </LinkBotao>
          )}
        </form>

        {errosFiltrados.length === 0 ? (
          <p className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
            {filtroAtivo ? "Nenhum erro nessa data." : "Nenhum erro registrado para este cliente."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {errosFiltrados.map((erro) => (
              <ErroCard key={erro.id} erro={erro} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
