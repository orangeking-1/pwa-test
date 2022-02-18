console.log(self)
// 缓存文件
const appShellFiles = [
  '/index.html',
  '/icon.png',
  '/icon1.png',
  '/icon2.png',
]
// 监听server worker安装
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install')
  e.waitUntil((async () => {
    console.log(caches)
    const cache = await caches.open('orangeking')
    await cache.addAll(appShellFiles)
  })())
})

// 拦截请求，首先利用本地缓存文件，没有再请求服务器资源
self.addEventListener('fetch', e =>  {
  e.respondWith(
    caches.match(e.request).then(req => {
      // console.log('[Service Worker] Fetching resource: '+e.request.url)
      return req || fetch(e.request).then(response => {
         return caches.open('orangeking').then(cache => {
          // console.log('[Service Worker] Caching new resource: '+e.request.url)
          cache.put(e.request, response.clone())
          return response
        })
      })
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('[Service Worker] activate')
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if('orangeking'.indexOf(key) === -1) {
          return caches.delete(key)
        }
      }))
    })
  )
})