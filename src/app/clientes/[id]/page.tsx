import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClienteForm } from "@/components/ClienteForm";
import { ClienteView } from "@/components/ClienteView";
import { StatusBadge } from "@/components/StatusBadge";
import { LinkBotao } from "@/components/Botao";
import { atualizarCliente, adicionarInteracao } from "@/app/clientes/actions";

export default async function ClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; editar?: string }>;
}) {
  const { id } = await params;
  const { erro, editar } = await searchParams;
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

  const erros = await prisma.erroLog.findMany({
    where: { clienteId: clienteIdNumerico },
    orderBy: { criadoEm: "desc" },
    take: 50,
    select: {
      id: true,
      mensagem: true,
      detalheTecnico: true,
      tela: true,
      tipo: true,
      usuario: true,
      ocorridoEm: true,
      criadoEm: true,
    },
  });

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

        <div className="divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
          {erros.length === 0 && (
            <p className="p-4 text-sm text-black/60 dark:text-white/60">
              Nenhum erro registrado para este cliente.
            </p>
          )}
          {erros.map((erro) => (
            <div key={erro.id} className="p-4 text-sm">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-xs text-black/50 dark:text-white/50">
                  {new Date(erro.ocorridoEm ?? erro.criadoEm).toLocaleString("pt-BR")}
                  {erro.tela ? ` · ${erro.tela}` : ""}
                </p>
                {erro.tipo && (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600 dark:text-red-400">
                    {erro.tipo}
                  </span>
                )}
              </div>
              <p className="font-medium">{erro.mensagem}</p>
              {erro.detalheTecnico && (
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/5 p-3 text-xs text-black/70 dark:bg-white/5 dark:text-white/70">
                  {erro.detalheTecnico}
                </pre>
              )}
              {erro.usuario && (
                <p className="mt-2 text-xs text-black/50 dark:text-white/50">Usuário: {erro.usuario}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
