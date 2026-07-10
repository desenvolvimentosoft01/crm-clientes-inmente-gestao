import { STATUS_OPCOES } from "@/components/StatusBadge";
import type { Cliente } from "@prisma/client";

export function ClienteForm({
  cliente,
  action,
}: {
  cliente?: Cliente;
  action: (formData: FormData) => void;
}) {
  const dataInicio = cliente?.dataInicio
    ? cliente.dataInicio.toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Campo label="Nome" name="nome" required defaultValue={cliente?.nome} />
      <Campo label="Link do site" name="link_site" defaultValue={cliente?.linkSite ?? ""} />
      <Campo
        label="Nome do contato"
        name="contato_nome"
        defaultValue={cliente?.contatoNome ?? ""}
      />
      <Campo
        label="Telefone do contato"
        name="contato_telefone"
        defaultValue={cliente?.contatoTelefone ?? ""}
      />
      <Campo
        label="E-mail do contato"
        name="contato_email"
        type="email"
        defaultValue={cliente?.contatoEmail ?? ""}
      />
      <Campo label="Plano contratado" name="plano" defaultValue={cliente?.plano ?? ""} />
      <Campo
        label="Valor mensal (R$)"
        name="valor_mensal"
        type="number"
        step="0.01"
        defaultValue={cliente?.valorMensal?.toString() ?? ""}
      />
      <Campo
        label="Data de início"
        name="data_inicio"
        type="date"
        defaultValue={dataInicio}
      />

      <div className="space-y-1">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={cliente?.status ?? "ativo"}
          className="w-full rounded border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        >
          {STATUS_OPCOES.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1 sm:col-span-2">
        <label htmlFor="observacoes" className="text-sm font-medium">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={4}
          defaultValue={cliente?.observacoes ?? ""}
          className="w-full rounded border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
  step?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
      />
    </div>
  );
}
