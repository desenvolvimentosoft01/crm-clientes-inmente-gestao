import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extrairHostname } from "@/lib/url";
import { notificarErro } from "@/lib/push";
import { gerarDiagnostico } from "@/lib/diagnostico";

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.ERROS_API_KEY) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const clienteSite = String(body.clienteSite ?? body.site ?? "").trim() || null;
  const mensagem = String(body.mensagem ?? "").trim();
  if (!mensagem) {
    return NextResponse.json({ erro: "Campo 'mensagem' é obrigatório" }, { status: 400 });
  }

  let clienteId: number | null = null;
  let clienteNome = clienteSite ?? "cliente desconhecido";
  const hostname = clienteSite ? extrairHostname(clienteSite) : null;
  if (hostname) {
    const clientes = await prisma.cliente.findMany({
      where: { linkSite: { not: null } },
      select: { id: true, nome: true, linkSite: true },
    });
    const cliente = clientes.find((c) => extrairHostname(c.linkSite!) === hostname);
    if (cliente) {
      clienteId = cliente.id;
      clienteNome = cliente.nome;
    }
  }

  const ocorridoEmRaw = body.quando ?? body.ocorridoEm;
  const ocorridoEm = ocorridoEmRaw ? new Date(ocorridoEmRaw) : null;

  const detalheTecnico = body.detalheTecnico ? String(body.detalheTecnico) : null;
  const tela = body.tela ? String(body.tela) : null;
  const tipo = body.tipo ? String(body.tipo) : null;

  const erroCriado = await prisma.erroLog.create({
    data: {
      clienteId,
      clienteSite,
      mensagem,
      detalheTecnico,
      tela,
      tipo,
      usuario: body.usuario ? String(body.usuario) : null,
      ocorridoEm: ocorridoEm && !Number.isNaN(ocorridoEm.getTime()) ? ocorridoEm : null,
    },
  });

  notificarErro({ clienteNome, mensagem, clienteId }).catch((e) => console.error("[push] erro inesperado", e));
  gerarDiagnostico(erroCriado.id, { mensagem, detalheTecnico, tela, tipo }).catch((e) =>
    console.error("[diagnostico] erro inesperado", e)
  );

  return NextResponse.json({ ok: true, vinculadoAoCliente: clienteId !== null });
}
