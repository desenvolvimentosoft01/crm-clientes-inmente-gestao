import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TIPOS_ERRO_CRITICO } from "@/lib/data";
import { AtualizarAoReceberErro } from "@/components/AtualizarAoReceberErro";

export default async function ErrosCriticosPage() {
  const erros = await prisma.erroLog.findMany({
    where: { tipo: { in: [...TIPOS_ERRO_CRITICO] } },
    orderBy: { criadoEm: "desc" },
    take: 100,
    select: {
      id: true,
      mensagem: true,
      detalheTecnico: true,
      tela: true,
      tipo: true,
      usuario: true,
      ocorridoEm: true,
      criadoEm: true,
      cliente: { select: { id: true, nome: true } },
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6">
      <AtualizarAoReceberErro clienteId="todos" />
      <div>
        <h1 className="text-2xl font-semibold">Erros críticos</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Erros de JavaScript não tratados e falhas internas de todos os clientes — os que realmente travam o
          sistema para o usuário.
        </p>
      </div>

      {erros.length === 0 ? (
        <p className="rounded-lg border border-black/10 bg-white p-6 text-center text-sm text-black/60 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-white/60">
          Nenhum erro crítico registrado.
        </p>
      ) : (
        <div className="divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-neutral-900">
          {erros.map((erro) => (
            <div key={erro.id} className="border-l-4 border-l-red-500 bg-black/[0.02] p-4 text-sm dark:bg-white/[0.02]">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {erro.cliente ? (
                      <Link
                        href={`/clientes/${erro.cliente.id}?aba=erros`}
                        className="font-semibold underline underline-offset-2 hover:no-underline"
                      >
                        {erro.cliente.nome}
                      </Link>
                    ) : (
                      <span className="font-semibold text-black/50 dark:text-white/50">Cliente não identificado</span>
                    )}
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                      {erro.tipo}
                    </span>
                  </div>
                  <p className="font-medium leading-snug">
                    <span aria-hidden className="mr-1">
                      ⚠️
                    </span>
                    {erro.mensagem}
                  </p>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    {new Date(erro.ocorridoEm ?? erro.criadoEm).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })}
                    {erro.tela ? ` · ${erro.tela}` : ""}
                    {erro.usuario ? ` · ${erro.usuario}` : ""}
                  </p>
                </div>
              </div>
              {erro.detalheTecnico && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                    Detalhe técnico
                  </summary>
                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-black/5 p-3 text-xs text-black/70 dark:bg-white/5 dark:text-white/70">
                    {erro.detalheTecnico}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
