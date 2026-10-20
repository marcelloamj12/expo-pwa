// Service worker do PWA.
// Regra de ouro: só guarda em cache os ARQUIVOS DO APP (telas, ícones).
// Nunca mexe nos dados do Firebase, que ficam em outro domínio.
const CACHE = "expo-pwa-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/listagem"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Só GET e só do mesmo domínio. Firebase/Firestore (outros domínios) passam direto.
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Páginas: tenta a rede primeiro (sempre a versão nova); sem internet, usa o cache.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Arquivos do app (JS, ícones, etc.): cache primeiro.
  // Os arquivos JS do Expo têm hash no nome, então uma versão nova vira outro arquivo.
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});
