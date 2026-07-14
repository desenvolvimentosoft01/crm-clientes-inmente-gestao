import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TIPOS_ERRO_CRITICO } from "@/lib/data";
import { AtualizarAoReceberErro } from "@/components/AtualizarAoReceberErro";
import { ErroLinha } from "@/components/ErroCard";

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
      diagnostico: true,
      resolvido: true,
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
            <div key={erro.id}>
              <div className="border-l-4 border-l-red-500 bg-black/[0.02] px-4 pt-3 dark:bg-white/[0.02]">
                {erro.cliente ? (
                  <Link
                    href={`/clientes/${erro.cliente.id}?aba=erros`}
                    className="text-sm font-semibold underline underline-offset-2 hover:no-underline"
                  >
                    {erro.cliente.nome}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-black/50 dark:text-white/50">
                    Cliente não identificado
                  </span>
                )}
              </div>
              <ErroLinha erro={erro} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
