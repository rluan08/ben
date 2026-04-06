const CACHE_NAME = "produtos-offline-v1"

const ASSETS = [
  "./",
  "./index.html",
  "./vencimentos.html",
  "./style.css",
  "./app.js",
  "./produtosBase.js",
  "./Icone.jpeg",
  "./Logo.png"
]

// INSTALA
self.addEventListener("install", event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS)
    })
  )
})

// ATIVA
self.addEventListener("activate", event => {
  self.clients.claim()
})

// OFFLINE FUNCIONANDO
self.addEventListener("fetch", event => {

  event.respondWith(
    caches.match(event.request).then(response => {

      // se tiver no cache → usa
      if(response){
        return response
      }

      // senão tenta internet
      return fetch(event.request).catch(() => {
        return caches.match("./index.html")
      })

    })
  )

})
