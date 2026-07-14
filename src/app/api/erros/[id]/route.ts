import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const erroId = Number(id);
  if (!Number.isInteger(erroId)) {
    return NextResponse.json({ erro: "Id inválido" }, { status: 400 });
  }

  const body = await req.json();
  const resolvido = Boolean(body.resolvido);

  const erro = await prisma.erroLog.update({
    where: { id: erroId },
    data: { resolvido, resolvidoEm: resolvido ? new Date() : null },
  });

  return NextResponse.json({ ok: true, resolvido: erro.resolvido });
}
