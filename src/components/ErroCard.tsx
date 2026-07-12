type Erro = {
  id: number;
  mensagem: string;
  detalheTecnico: string | null;
  tela: string | null;
  tipo: string | null;
  usuario: string | null;
  ocorridoEm: Date | null;
  criadoEm: Date;
};

export function ErroLinha({ erro }: { erro: Erro }) {
  return (
    <div className="border-l-4 border-l-red-500 bg-black/[0.02] p-4 text-sm dark:bg-white/[0.02]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
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
        {erro.tipo && (
          <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
            {erro.tipo}
          </span>
        )}
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
