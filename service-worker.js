const CACHE_NAME = "produtos-v99"

// 🔥 arquivos que o app precisa offline
const ASSETS = [
  "./",
  "./index.html",
  "./vencimentos.html",
  "./style.css",
  "./app.js",
  "./produtosBase.js",
  "./Icone.jpeg"
]

// 📦 INSTALAÇÃO (salva no cache)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS)
      })
  )
})

// ♻️ ATIVAÇÃO (limpa cache antigo)
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
})

// 🌐 FETCH (offline first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // se tiver no cache → usa
        if(response){
          return response
        }

        // senão → busca da internet
        return fetch(event.request)
          .then(res => {
            return res
          })
          .catch(() => {
            // fallback simples (opcional)
            if(event.request.mode === "navigate"){
              return caches.match("./index.html")
            }
          })
      })
  )
})
