const newCacheName = "restaurants-v2";

//  install new cache
self.addEventListener("install", function(event) {
  //  files to be cached
  let urlsToCache = [
    "/",
    "index.html",
    "restaurant.html",
    "css/styles.css",
    // "data/restaurants.json",
    "img/normal/1.jpg",
    "img/normal/2.jpg",
    "img/normal/3.jpg",
    "img/normal/4.jpg",
    "img/normal/5.jpg",
    "img/normal/6.jpg",
    "img/normal/7.jpg",
    "img/normal/8.jpg",
    "img/normal/9.jpg",
    "img/normal/10.jpg",
    "img/small/1.jpg",
    "img/small/2.jpg",
    "img/small/3.jpg",
    "img/small/4.jpg",
    "img/small/5.jpg",
    "img/small/6.jpg",
    "img/small/7.jpg",
    "img/small/8.jpg",
    "img/small/9.jpg",
    "img/small/10.jpg",
    // "js/dbhelper.js",
    "js/httpHelper.js",
    "js/idb.js",
    "js/main.js",
    "js/restaurant_info.js"
  ];

  //  create cache and add all files to it
  event.waitUntil(
    caches.open(newCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

//  fetch data
self.addEventListener("fetch", function(event) {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/restaurant.html")) {
    event.respondWith(
      caches
        .match("restaurant.html")
        .then(response => response || fetch(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

//  delete old cache as new data fetched
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(
            cacheName =>
              cacheName.startsWith("restaurants") && cacheName !== newCacheName
          )
          .map(cacheName => cache.delete(cacheName))
      );
    })
  );
});
