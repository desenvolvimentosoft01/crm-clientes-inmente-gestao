"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ClienteInsert, ClienteUpdate, InteracaoInsert, StatusCliente } from "@/types/database";

function parseFormData(formData: FormData): Omit<ClienteInsert, "criado_por"> {
  const valorMensal = String(formData.get("valor_mensal") ?? "").trim();
  const dataInicio = String(formData.get("data_inicio") ?? "").trim();

  return {
    nome: String(formData.get("nome") ?? "").trim(),
    link_site: String(formData.get("link_site") ?? "").trim() || null,
    contato_nome: String(formData.get("contato_nome") ?? "").trim() || null,
    contato_telefone: String(formData.get("contato_telefone") ?? "").trim() || null,
    contato_email: String(formData.get("contato_email") ?? "").trim() || null,
    plano: String(formData.get("plano") ?? "").trim() || null,
    valor_mensal: valorMensal ? Number(valorMensal) : null,
    status: String(formData.get("status") ?? "ativo") as StatusCliente,
    data_inicio: dataInicio || null,
    observacoes: String(formData.get("observacoes") ?? "").trim() || null,
  };
}

export async function criarCliente(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dados = parseFormData(formData);
  const dadosInsert: ClienteInsert = { ...dados, criado_por: user?.id };

  const { data: cliente, error } = await supabase
    .from("clientes")
    .insert(dadosInsert)
    .select("id")
    .single();

  if (error) {
    redirect(`/clientes/novo?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clientes");
  redirect(`/clientes/${cliente.id}`);
}

export async function atualizarCliente(clienteId: string, formData: FormData) {
  const supabase = await createClient();
  const dados = parseFormData(formData);
  const dadosUpdate: ClienteUpdate = { ...dados };

  const { error } = await supabase.from("clientes").update(dadosUpdate).eq("id", clienteId);

  if (error) {
    redirect(`/clientes/${clienteId}?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clienteId}`);
  redirect(`/clientes/${clienteId}`);
}

export async function adicionarInteracao(clienteId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const descricao = String(formData.get("descricao") ?? "").trim();
  if (!descricao) {
    redirect(`/clientes/${clienteId}`);
  }

  const novaInteracao: InteracaoInsert = { cliente_id: clienteId, descricao, autor_id: user?.id };

  const { error } = await supabase.from("interacoes").insert(novaInteracao);

  if (error) {
    redirect(`/clientes/${clienteId}?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/clientes/${clienteId}`);
  redirect(`/clientes/${clienteId}`);
}
