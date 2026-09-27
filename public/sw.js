// Service Worker - Paróquia São José Painel Administrativo PWA & Web Push Notifications

const CACHE_NAME = "paroquia-panel-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale-While-Revalidate for Static Assets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API requests from caching
  if (url.pathname.startsWith("/api") || url.pathname.includes("/v1/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Notification Event
self.addEventListener("push", (event) => {
  let notificationData = {
    title: "Painel Paróquia São José",
    body: "Você tem um novo alerta administrativo ou atualização de agendamento.",
    url: "/",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
  };

  if (event.data) {
    try {
      const json = event.data.json();
      notificationData = { ...notificationData, ...json };
    } catch {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || "/icons/icon-192x192.png",
    badge: notificationData.badge || "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.url || "/",
    },
    actions: [
      {
        action: "open",
        title: "Acessar Painel",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
