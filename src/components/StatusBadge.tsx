import type { StatusCliente } from "@/types/database";

const ESTILOS: Record<StatusCliente, string> = {
  ativo: "bg-green-500/10 text-green-700 dark:text-green-400",
  em_implantacao: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  inadimplente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  cancelado: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const LABELS: Record<StatusCliente, string> = {
  ativo: "Ativo",
  em_implantacao: "Em implantação",
  inadimplente: "Inadimplente",
  cancelado: "Cancelado",
};

export function StatusBadge({ status }: { status: StatusCliente }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${ESTILOS[status]}`}>
      {LABELS[status]}
    </span>
  );
}

export const STATUS_OPCOES: { value: StatusCliente; label: string }[] = (
  Object.keys(LABELS) as StatusCliente[]
).map((value) => ({ value, label: LABELS[value] }));
