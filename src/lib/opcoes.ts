import type { ModuloSistema, PlanoContrato, PlanoSistema } from "@prisma/client";

export const PLANO_OPCOES: { value: PlanoContrato; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
];

export const MODULO_OPCOES: { value: ModuloSistema; label: string }[] = [
  { value: "ifood", label: "iFood" },
  { value: "orcamentos", label: "Orçamentos" },
];

// Plano do sistema In Mente Gestão contratado (limites de usuários, produtos
// e vendas do ERP — ver lib/planos.ts no repo do sistema). Diferente do
// PLANO_OPCOES acima, que é sobre a cobrança (free/mensal/anual).
export const PLANO_SISTEMA_OPCOES: { value: PlanoSistema; label: string }[] = [
  { value: "basico", label: "Básico" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];
