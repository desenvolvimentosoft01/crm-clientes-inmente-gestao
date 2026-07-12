self.addEventListener("push", (event) => {
  const dados = event.data ? event.data.json() : {};
  const titulo = dados.titulo ?? "Novo erro no sistema";

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(titulo, {
        body: dados.corpo ?? "",
        icon: "/favicon.ico",
        data: { url: dados.url ?? "/clientes" },
      }),
      self.clients.matchAll({ type: "window" }).then((abas) => {
        abas.forEach((aba) => aba.postMessage({ tipo: "novo-erro", clienteId: dados.clienteId ?? null }));
      }),
    ])
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/clientes";
  event.waitUntil(clients.openWindow(url));
});
