export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch {
    return null;
  }
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission === "granted") return "granted";
  return Notification.requestPermission();
}

export async function scheduleLocalNotification(
  delayMs: number,
  title: string,
  body: string,
  url = "/my-turn"
): Promise<void> {
  const permission = await requestPermission();
  if (permission !== "granted") return;

  const reg = await registerServiceWorker();
  if (!reg) return;

  setTimeout(async () => {
    try {
      await reg.showNotification(title, {
        body,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "tornoo-queue",
        data: { url },
        requireInteraction: false,
      });
    } catch {
      // SW not ready or permission revoked — silent fail
    }
  }, delayMs);
}

export function getPermissionStatus(): NotificationPermission | "unsupported" {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}
