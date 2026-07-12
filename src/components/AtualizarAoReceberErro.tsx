"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AtualizarAoReceberErro({ clienteId }: { clienteId: number }) {
  const router = useRouter();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    function aoReceberMensagem(event: MessageEvent) {
      if (event.data?.tipo !== "novo-erro") return;
      if (event.data.clienteId !== null && event.data.clienteId !== clienteId) return;
      router.refresh();
    }

    navigator.serviceWorker.addEventListener("message", aoReceberMensagem);
    return () => navigator.serviceWorker.removeEventListener("message", aoReceberMensagem);
  }, [clienteId, router]);

  return null;
}
