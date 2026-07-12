import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic({ apiKey }) : null;

export async function gerarDiagnostico(erroId: number, erro: {
  mensagem: string;
  detalheTecnico: string | null;
  tela: string | null;
  tipo: string | null;
}) {
  if (!client) {
    console.error("[diagnostico] ANTHROPIC_API_KEY não configurada, diagnóstico não gerado");
    return;
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Você é um assistente que ajuda um desenvolvedor a triar erros de um sistema em produção.

Dado o erro abaixo, escreva em português, em no máximo 3 frases curtas e diretas: (1) a causa mais provável, (2) em qual arquivo/tela/fluxo do código o desenvolvedor deve procurar primeiro. Seja objetivo, sem rodeios, sem markdown.

Mensagem: ${erro.mensagem}
Tipo: ${erro.tipo ?? "desconhecido"}
Tela: ${erro.tela ?? "desconhecida"}
Detalhe técnico: ${erro.detalheTecnico ?? "não informado"}`,
        },
      ],
    });

    const bloco = response.content.find((b) => b.type === "text");
    const texto = bloco && bloco.type === "text" ? bloco.text.trim() : null;
    if (!texto) return;

    await prisma.erroLog.update({ where: { id: erroId }, data: { diagnostico: texto } });
  } catch (e) {
    console.error("[diagnostico] falha ao gerar diagnóstico", e);
  }
}
