const CACHE_NAME = "produtos-v1"

const ASSETS = [
  "./",
  "./index.html",
  "./vencimentos.html",
  "./style.css",
  "./app.js",
  "./produtosBase.js",
  "./Icone.jpeg"
]

// INSTALAR
self.addEventListener("install", event => {
  self.skipWaiting() // 🔥 força atualizar
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  )
})

// ATIVAR
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim() // 🔥 ativa na hora
})

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
