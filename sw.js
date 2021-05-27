var CACHE_NAME = 'my-site-cache-v1';
//Membuat variabel urlsToCache yaitu untuk menyimpan data/cache yang terdapat pada file"
var urlsToCache = [
  '/',
  '/callback.json',
  '/js/main.js',
  '/index.html',
  '/api.html',
  '/about.html',
  '/img/code1.svg',
  '/img/code2.svg',
  '/img/code3.svg',
  '/img/img.jpg',
  '/img/Instagram.svg',
  '/img/twitter.svg',
  '/img/whatsapp.svg'
];

self.addEventListener('install', function(event) {
  // Langkah untuk penginstalan
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        console.log('Instalasi ServiceWorker..... cache terbuka!!!');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    
    var request = event.request
    var url = new URL(request.url)

    //pisahkan request API dan Internal
    if(url.origin === location.origin) {
    event.respondWith(
        caches.match(request).then(function(response){
            return response || fetch(request)
        })
    )

    }else{
        event.respondWith(
            caches.open('car-cache').then(function(cache){
                return fetch(request).then(function(LiveResponse){
                    cache.put(request, LiveResponse.clone())
                    return LiveResponse
                }).catch(function(){
                    return caches.match(request).then(function(response){
                        if(response) return response
                        return caches.match('/callback.json')
                    })
                })
            })
        )

    }

  });

  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all( //Menggunakan JS.Promise
          cacheNames.filter(function(cacheName) {
              return cacheName != CACHE_NAME
           }).map(function(cacheName) {
              return caches.delete(cacheName);
            })
        );
      })
    );
  });