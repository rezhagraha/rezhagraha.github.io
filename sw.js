const CACHE_NAME = "static_cache2"
const STATIC_ASSETS = [
    "/about.html",
    "/index.html",
    "/img/code1.svg",
    "/img/code2.svg",
    "/img/code3.svg",
    "/img/img.jpg",
    "/img/Instagram.svg",
    "/img/twitter.svg",
    "/img/whatsapp.svg"
    
]

async function preCache() {
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(STATIC_ASSETS)
}

self.addEventListener('install', event => {
    console.log("[SW] installed");
    event.waitUntil(preCache())
})

async function cleanupCache(){
    const keys = await caches.keys()
    const keysToDelete = keys.map(key => {
        if (key !== CACHE_NAME) {
            return caches.delete(key)
        }
    })

    return Promise.all(keysToDelete)
}

self.addEventListener('activate', event => {
    console.log("[SW] activated");
    event.waitUntil(cleanupCache())
})

async function fetchAssets(event){
    try {
        const response = await fetch(event.request)
        return response
    } catch (err){
        const cache = await caches.open(CACHE_NAME)
        return cache.match(event.request)
    }
}

self.addEventListener('fetch', event => {
    console.log("[SW] fetched");
    event.respondWith(fetchAssets(event))
})