"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Erro = {
  id: number;
  mensagem: string;
  detalheTecnico: string | null;
  tela: string | null;
  tipo: string | null;
  usuario: string | null;
  diagnostico?: string | null;
  resolvido?: boolean;
  ocorridoEm: Date | null;
  criadoEm: Date;
};

export function ErroLinha({ erro }: { erro: Erro }) {
  const router = useRouter();
  const [resolvido, setResolvido] = useState(erro.resolvido ?? false);
  const [pending, startTransition] = useTransition();

  async function alternarResolvido() {
    const novoValor = !resolvido;
    setResolvido(novoValor);
    try {
      const res = await fetch(`/api/erros/${erro.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolvido: novoValor }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar erro");
      startTransition(() => router.refresh());
    } catch {
      setResolvido(!novoValor);
    }
  }

  return (
    <div
      className={`border-l-4 p-4 text-sm ${
        resolvido
          ? "border-l-green-500 bg-black/[0.02] dark:bg-white/[0.02]"
          : "border-l-red-500 bg-black/[0.02] dark:bg-white/[0.02]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium leading-snug">
            <span aria-hidden className="mr-1">
              {resolvido ? "✅" : "⚠️"}
            </span>
            {erro.mensagem}
            {erro.diagnostico && (
              <details className="ml-1 inline-block align-middle">
                <summary
                  className="inline-flex cursor-pointer list-none select-none rounded-full px-1 text-base leading-none hover:bg-black/5 dark:hover:bg-white/10"
                  title="Ver diagnóstico"
                >
                  💬
                </summary>
                <div className="mt-2 max-w-prose rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs font-normal text-blue-900 dark:text-blue-200">
                  {erro.diagnostico}
                </div>
              </details>
            )}
          </p>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            {new Date(erro.ocorridoEm ?? erro.criadoEm).toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            })}
            {erro.tela ? ` · ${erro.tela}` : ""}
            {erro.usuario ? ` · ${erro.usuario}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {erro.tipo && (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
              {erro.tipo}
            </span>
          )}
          <button
            type="button"
            onClick={alternarResolvido}
            disabled={pending}
            className={`rounded-full px-2 py-0.5 text-xs font-medium transition disabled:opacity-50 ${
              resolvido
                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
            }`}
          >
            {resolvido ? "Resolvido" : "Marcar como resolvido"}
          </button>
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
  );
}
