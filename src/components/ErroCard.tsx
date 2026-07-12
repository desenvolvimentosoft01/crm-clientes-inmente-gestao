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

export function ErroCard({ erro }: { erro: Erro }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-black/10 border-l-4 border-l-red-500 bg-black/[0.02] p-4 text-sm shadow-sm dark:border-white/10 dark:border-l-red-500 dark:bg-white/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-black/50 dark:text-white/50">
          {new Date(erro.ocorridoEm ?? erro.criadoEm).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          })}
          {erro.tela ? ` · ${erro.tela}` : ""}
        </p>
        {erro.tipo && (
          <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
            {erro.tipo}
          </span>
        )}
      </div>
      <p className="font-medium leading-snug">
        <span aria-hidden className="mr-1">
          ⚠️
        </span>
        {erro.mensagem}
      </p>
      {erro.detalheTecnico && (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/5 p-3 text-xs text-black/70 dark:bg-white/5 dark:text-white/70">
          {erro.detalheTecnico}
        </pre>
      )}
      {erro.usuario && (
        <p className="text-xs text-black/50 dark:text-white/50">Usuário: {erro.usuario}</p>
      )}
    </div>
  );
}
