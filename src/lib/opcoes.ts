import type { ModuloSistema, PlanoContrato } from "@prisma/client";

export const PLANO_OPCOES: { value: PlanoContrato; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
];

export const MODULO_OPCOES: { value: ModuloSistema; label: string }[] = [
  { value: "ifood", label: "iFood" },
  { value: "orcamentos", label: "Orçamentos" },
];
