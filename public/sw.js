const CACHE_NAME = "tornoo-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/my-turn";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      const existing = cs.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

self.addEventListener("push", (e) => {
  const data = e.data?.json?.() ?? {};
  e.waitUntil(
    self.registration.showNotification(data.title ?? "Tornoo", {
      body: data.body ?? "C'est bientôt votre tour !",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "tornoo-queue",
      requireInteraction: false,
      data: { url: data.url ?? "/my-turn" },
    })
  );
});
