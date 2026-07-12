const FUSO_SP = "America/Sao_Paulo";

export const TIPOS_ERRO_CRITICO = ["Erro de JavaScript não tratado", "Falha interna não tratada"] as const;

export function hojeSP(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: FUSO_SP });
}

export function limitesDoDiaSP(data: string): { inicio: Date; fim: Date } {
  return {
    inicio: new Date(`${data}T00:00:00-03:00`),
    fim: new Date(`${data}T23:59:59.999-03:00`),
  };
}
