import webpush from "web-push";
import { prisma } from "@/lib/prisma";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails("mailto:desenvolvimentosoft01@gmail.com", vapidPublicKey, vapidPrivateKey);
}

export async function notificarErro(erro: { clienteNome: string; mensagem: string; clienteId: number | null }) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("[push] VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY não configuradas, notificação não enviada");
    return;
  }

  const inscricoes = await prisma.pushSubscription.findMany();
  if (inscricoes.length === 0) {
    console.error("[push] nenhuma inscrição encontrada, notificação não enviada");
    return;
  }

  const payload = JSON.stringify({
    titulo: `⚠️ Erro em ${erro.clienteNome}`,
    corpo: erro.mensagem.slice(0, 150),
    url: erro.clienteId ? `/clientes/${erro.clienteId}` : "/clientes",
    clienteId: erro.clienteId,
  });

  await Promise.all(
    inscricoes.map(async (inscricao) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: inscricao.endpoint,
            keys: { p256dh: inscricao.p256dh, auth: inscricao.auth },
          },
          payload
        );
      } catch (erroEnvio: unknown) {
        const statusCode = (erroEnvio as { statusCode?: number }).statusCode;
        const body = (erroEnvio as { body?: string }).body;
        console.error("[push] falha ao enviar notificação", statusCode, body);
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: inscricao.id } }).catch(() => {});
        }
      }
    })
  );
}
