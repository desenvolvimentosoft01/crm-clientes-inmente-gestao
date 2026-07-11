import type { Cliente } from "@prisma/client";
import { STATUS_OPCOES } from "@/components/StatusBadge";
import { PLANO_OPCOES, MODULO_OPCOES } from "@/lib/opcoes";
import { normalizarUrl } from "@/lib/url";
import { SenhaVisivel } from "@/components/SenhaVisivel";

export function ClienteView({ cliente }: { cliente: Cliente }) {
  const statusLabel =
    STATUS_OPCOES.find((opcao) => opcao.value === cliente.status)?.label ?? cliente.status;
  const planoLabel = cliente.plano
    ? (PLANO_OPCOES.find((opcao) => opcao.value === cliente.plano)?.label ?? cliente.plano)
    : undefined;
  const modulosLabel = cliente.modulos
    .map((modulo) => MODULO_OPCOES.find((opcao) => opcao.value === modulo)?.label ?? modulo)
    .join(", ");

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <Campo label="Nome" valor={cliente.nome} />
      <Campo
        label="Link do site"
        valor={
          cliente.linkSite ? (
            <a
              href={normalizarUrl(cliente.linkSite)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 dark:text-blue-400"
            >
              {cliente.linkSite}
            </a>
          ) : undefined
        }
      />
      <Campo label="Nome do contato" valor={cliente.contatoNome} />
      <Campo label="Telefone do contato" valor={cliente.contatoTelefone} />
      <Campo label="E-mail do contato" valor={cliente.contatoEmail} />
      <Campo label="Plano contratado" valor={planoLabel} />
      <Campo label="Módulos utilizados" valor={modulosLabel || undefined} />
      <Campo
        label="Valor mensal"
        valor={cliente.valorMensal ? `R$ ${cliente.valorMensal.toFixed(2)}` : undefined}
      />
      <Campo
        label="Data de início"
        valor={
          cliente.dataInicio
            ? cliente.dataInicio.toLocaleDateString("pt-BR", { timeZone: "UTC" })
            : undefined
        }
      />
      <Campo label="Status" valor={statusLabel} />
      <Campo
        label="Senha do Supabase"
        valor={cliente.senhaSupabase ? <SenhaVisivel senha={cliente.senhaSupabase} /> : undefined}
      />
      <div className="sm:col-span-2">
        <Campo label="Observações" valor={cliente.observacoes} />
      </div>
    </dl>
  );
}

function Campo({ label, valor }: { label: string; valor?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
        {label}
      </dt>
      <dd className="mt-1 text-sm">
        {valor ?? <span className="text-black/35 dark:text-white/35">—</span>}
      </dd>
    </div>
  );
}
