import { STATUS_OPCOES } from "@/components/StatusBadge";
import { Botao, LinkBotao } from "@/components/Botao";
import { PLANO_OPCOES, MODULO_OPCOES, PLANO_SISTEMA_OPCOES } from "@/lib/opcoes";
import type { Cliente } from "@prisma/client";

export function ClienteForm({
  cliente,
  action,
  cancelarHref,
}: {
  cliente?: Cliente;
  action: (formData: FormData) => void;
  cancelarHref: string;
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
      <div className="space-y-1">
        <label htmlFor="plano" className="text-sm font-medium">
          Plano contratado
        </label>
        <select
          id="plano"
          name="plano"
          defaultValue={cliente?.plano ?? ""}
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground dark:border-white/15 dark:bg-neutral-800"
        >
          <option value="" className="bg-white text-black dark:bg-neutral-800 dark:text-white">
            Sem plano
          </option>
          {PLANO_OPCOES.map((opcao) => (
            <option
              key={opcao.value}
              value={opcao.value}
              className="bg-white text-black dark:bg-neutral-800 dark:text-white"
            >
              {opcao.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="plano_sistema" className="text-sm font-medium">
          Plano do sistema
        </label>
        <select
          id="plano_sistema"
          name="plano_sistema"
          defaultValue={cliente?.planoSistema ?? "basico"}
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground dark:border-white/15 dark:bg-neutral-800"
        >
          {PLANO_SISTEMA_OPCOES.map((opcao) => (
            <option
              key={opcao.value}
              value={opcao.value}
              className="bg-white text-black dark:bg-neutral-800 dark:text-white"
            >
              {opcao.label}
            </option>
          ))}
        </select>
      </div>
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
      <Campo
        label="Senha do Supabase"
        name="senha_supabase"
        type="password"
        defaultValue={cliente?.senhaSupabase ?? ""}
      />

      <div className="space-y-1">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={cliente?.status ?? "ativo"}
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground dark:border-white/15 dark:bg-neutral-800"
        >
          {STATUS_OPCOES.map((opcao) => (
            <option
              key={opcao.value}
              value={opcao.value}
              className="bg-white text-black dark:bg-neutral-800 dark:text-white"
            >
              {opcao.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <span className="text-sm font-medium">Módulos utilizados</span>
        <div className="flex flex-wrap gap-4">
          {MODULO_OPCOES.map((opcao) => (
            <label key={opcao.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="modulos"
                value={opcao.value}
                defaultChecked={cliente?.modulos.includes(opcao.value)}
                className="h-4 w-4 rounded border-black/25 dark:border-white/25"
              />
              {opcao.label}
            </label>
          ))}
        </div>
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
          className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-800"
        />
      </div>

      <div className="flex gap-2 sm:col-span-2">
        <Botao type="submit" variante="primario">
          Salvar
        </Botao>
        <LinkBotao href={cancelarHref} variante="secundario">
          Cancelar
        </LinkBotao>
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
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-800"
      />
    </div>
  );
}
