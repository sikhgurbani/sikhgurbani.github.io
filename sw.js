var cacheName = "v22";

var cacheFiles = [
    'index.html',
    'index.css',
    'index.js',
    'manifest.json',
    'icons/512.png',
    'icons/ios-add.png',
    'icons/ios-share.png',
    'data/sections.json',
    'data/full.json',
    'data/1.json',
    'data/2.json',
    'data/3.json',
    'data/4.json',
    'data/5.json',
    'data/6.json',
    'data/7.json',
    'data/8.json',
    'data/9.json',
    'data/10.json',
    'data/11.json',
    'data/12.json',
    'data/13.json',
    'data/14.json',
    'data/15.json',
    'data/16.json',
    'data/17.json',
    'data/18.json',
    'data/19.json',
    'data/20.json',
    'data/21.json',
    'data/22.json',
    'data/23.json',
    'data/24.json',
    'data/25.json',
    'data/26.json',
    'data/27.json',
    'data/28.json',
    'data/29.json',
    'data/30.json',
    './',
];

self.addEventListener("install", onInstall);
self.addEventListener('fetch', onfetch);

async function onInstall(e) {
    self.skipWaiting();
    self.caches.keys().then(keys => keys.forEach(key => caches.delete(key)));

    e.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(cacheFiles)
        })
    )
}

async function onfetch(e) {
    e.respondWith(caches.match(e.request).then(res => {
      return res || fetch(e.request)
    }));
}
