"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function AtivarNotificacoes() {
  const [inscrito, setInscrito] = useState<boolean | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then((registro) => registro.pushManager.getSubscription())
      .then((subscricao) => setInscrito(!!subscricao))
      .catch(() => setInscrito(false));
  }, []);

  async function ativar() {
    const chavePublica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!chavePublica) return;

    const permissao = await Notification.requestPermission();
    if (permissao !== "granted") return;

    const registro = await navigator.serviceWorker.ready;
    const subscricao = await registro.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(chavePublica),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscricao.toJSON()),
    });

    setInscrito(true);
  }

  async function desativar() {
    const registro = await navigator.serviceWorker.ready;
    const subscricao = await registro.pushManager.getSubscription();
    if (subscricao) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscricao.endpoint }),
      });
      await subscricao.unsubscribe();
    }
    setInscrito(false);
  }

  if (inscrito === null) return null;

  return (
    <button
      type="button"
      onClick={inscrito ? desativar : ativar}
      className="underline underline-offset-2"
      title={inscrito ? "Desativar notificações de erro" : "Ativar notificações de erro"}
    >
      {inscrito ? "🔔 Notificações ativas" : "🔕 Ativar notificações"}
    </button>
  );
}
