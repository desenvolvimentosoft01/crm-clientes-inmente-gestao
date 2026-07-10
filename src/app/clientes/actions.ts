"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma, type StatusCliente } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function parseFormData(formData: FormData) {
  const valorMensal = String(formData.get("valor_mensal") ?? "").trim();
  const dataInicio = String(formData.get("data_inicio") ?? "").trim();

  return {
    nome: String(formData.get("nome") ?? "").trim(),
    linkSite: String(formData.get("link_site") ?? "").trim() || null,
    contatoNome: String(formData.get("contato_nome") ?? "").trim() || null,
    contatoTelefone: String(formData.get("contato_telefone") ?? "").trim() || null,
    contatoEmail: String(formData.get("contato_email") ?? "").trim() || null,
    plano: String(formData.get("plano") ?? "").trim() || null,
    valorMensal: valorMensal ? new Prisma.Decimal(valorMensal) : null,
    status: String(formData.get("status") ?? "ativo") as StatusCliente,
    dataInicio: dataInicio ? new Date(dataInicio) : null,
    observacoes: String(formData.get("observacoes") ?? "").trim() || null,
  };
}

export async function criarCliente(formData: FormData) {
  const session = await auth();
  const dados = parseFormData(formData);

  const cliente = await prisma.cliente.create({
    data: { ...dados, criadoPorId: session?.user?.id },
  });

  revalidatePath("/clientes");
  redirect(`/clientes/${cliente.id}`);
}

export async function atualizarCliente(clienteId: string, formData: FormData) {
  const dados = parseFormData(formData);

  await prisma.cliente.update({ where: { id: clienteId }, data: dados });

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clienteId}`);
  redirect(`/clientes/${clienteId}`);
}

export async function adicionarInteracao(clienteId: string, formData: FormData) {
  const session = await auth();
  const descricao = String(formData.get("descricao") ?? "").trim();

  if (descricao) {
    await prisma.interacao.create({
      data: { clienteId, descricao, autorId: session?.user?.id },
    });
    revalidatePath(`/clientes/${clienteId}`);
  }

  redirect(`/clientes/${clienteId}`);
}
