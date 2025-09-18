// sw.js
const CACHE_NAME = "yj-interview-v6-cache-1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./youth_icon_192.png",
  "./youth_icon_512.png",
  "./youth_quiz_data.json"
];

// 설치: 앱 셸 캐싱
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// 활성화: 오래된 캐시 정리
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// 요청: 네트워크 우선, 실패 시 캐시
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    fetch(req)
      .then((res) => {
        // 동적 캐시 업데이트(옵션)
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((c) => c || caches.match("./")))
  );
});
