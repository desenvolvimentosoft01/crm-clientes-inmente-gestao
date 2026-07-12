import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ClienteForm } from "@/components/ClienteForm";
import { ClienteView } from "@/components/ClienteView";
import { StatusBadge } from "@/components/StatusBadge";
import { LinkBotao } from "@/components/Botao";
import { ErroLinha } from "@/components/ErroCard";
import { AtualizarAoReceberErro } from "@/components/AtualizarAoReceberErro";
import { atualizarCliente, adicionarInteracao } from "@/app/clientes/actions";
import { hojeSP, limitesDoDiaSP } from "@/lib/data";

const SELECT_ERRO = {
  id: true,
  mensagem: true,
  detalheTecnico: true,
  tela: true,
  tipo: true,
  usuario: true,
  diagnostico: true,
  ocorridoEm: true,
  criadoEm: true,
} as const;

export default async function ClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; editar?: string; dataErros?: string; aba?: string }>;
}) {
  const { id } = await params;
  const { erro, editar, dataErros, aba } = await searchParams;
  const emEdicao = editar === "1";
  const abaAtual = aba === "interacoes" || aba === "erros" ? aba : "dados";
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
        // sem filtro, exclui os de hoje (ja aparecem fixados na seção "Hoje" acima)
        criadoEm: filtroLimites
          ? { gte: filtroLimites.inicio, lte: filtroLimites.fim }
          : { lt: inicioHoje },
      },
      orderBy: { criadoEm: "desc" },
      take: filtroLimites ? undefined : 50,
      select: SELECT_ERRO,
    }),
  ]);

  const totalErros = await prisma.erroLog.count({ where: { clienteId: clienteIdNumerico } });

  const atualizarComId = atualizarCliente.bind(null, id);
  const adicionarInteracaoComId = adicionarInteracao.bind(null, id);

  const abas = [
    { valor: "dados", rotulo: "Dados do cliente", icone: "👤" },
    { valor: "interacoes", rotulo: "Interações", icone: "💬", contagem: interacoes.length, alerta: false },
    { valor: "erros", rotulo: "Erros", icone: "⚠️", contagem: totalErros, alerta: errosHoje.length > 0 },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
      <AtualizarAoReceberErro clienteId={clienteIdNumerico} />
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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
            Plano
          </p>
          <p className="mt-1 text-xl font-semibold capitalize">{cliente.plano ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
            Interações
          </p>
          <p className="mt-1 text-xl font-semibold">{interacoes.length}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
            Total de erros
          </p>
          <p className="mt-1 text-xl font-semibold">{totalErros}</p>
        </div>
        <div
          className={`rounded-xl border p-4 shadow-sm ${
            errosHoje.length > 0
              ? "border-amber-500/30 bg-amber-500/10"
              : "border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wide ${
              errosHoje.length > 0 ? "text-amber-700 dark:text-amber-400" : "text-black/50 dark:text-white/50"
            }`}
          >
            Erros hoje
          </p>
          <p
            className={`mt-1 text-xl font-semibold ${
              errosHoje.length > 0 ? "text-amber-700 dark:text-amber-400" : ""
            }`}
          >
            {errosHoje.length}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <nav className="flex gap-1 border-b border-black/10 p-2 dark:border-white/10">
          {abas.map((aba) => (
            <Link
              key={aba.valor}
              href={`/clientes/${id}?aba=${aba.valor}`}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                abaAtual === aba.valor
                  ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                  : "text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <span>{aba.icone}</span>
              {aba.rotulo}
              {"contagem" in aba && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    aba.alerta
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                      : "bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60"
                  }`}
                >
                  {aba.contagem}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6">
          {abaAtual === "dados" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dados do cliente</h2>
                {!emEdicao && (
                  <LinkBotao href={`/clientes/${id}?aba=dados&editar=1`} variante="secundario">
                    Editar
                  </LinkBotao>
                )}
              </div>

              {emEdicao ? (
                <ClienteForm cliente={cliente} action={atualizarComId} cancelarHref={`/clientes/${id}?aba=dados`} />
              ) : (
                <ClienteView cliente={cliente} />
              )}
            </>
          )}

          {abaAtual === "interacoes" && (
            <>
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
            </>
          )}

          {abaAtual === "erros" && (
            <>
              <h2 className="mb-4 text-lg font-semibold">Erros do sistema</h2>

              <form className="mb-6 flex items-end gap-2" action={`/clientes/${id}`}>
                <input type="hidden" name="aba" value="erros" />
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
                <LinkBotao href={`/clientes/${id}?aba=erros`} variante="fantasma">
                  Limpar filtro
                </LinkBotao>
              </form>

              {errosHoje.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-lg border border-amber-500/30">
                  <p className="bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    Hoje ({errosHoje.length})
                  </p>
                  <div className="divide-y divide-black/10 dark:divide-white/10">
                    {errosHoje.map((erro) => (
                      <ErroLinha key={erro.id} erro={erro} />
                    ))}
                  </div>
                </div>
              )}

              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                {filtroAtivo ? `Erros em ${new Date(dataErros!).toLocaleDateString("pt-BR")}` : "Erros anteriores"}
              </p>
              {errosFiltrados.length === 0 ? (
                <p className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
                  {filtroAtivo
                    ? "Nenhum erro nessa data."
                    : errosHoje.length > 0
                      ? "Nenhum outro erro registrado além dos de hoje."
                      : "Nenhum erro registrado para este cliente."}
                </p>
              ) : (
                <div className="divide-y divide-black/10 overflow-hidden rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
                  {errosFiltrados.map((erro) => (
                    <ErroLinha key={erro.id} erro={erro} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
