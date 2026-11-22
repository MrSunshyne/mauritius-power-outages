// Kill switch for the PWA service worker that power-outages-mauritius.netlify.app
// used to install. The site now redirects to https://courant.ramgolam.com, and a
// service worker script cannot be redirected, so this replacement removes the old
// worker and its caches, then reloads open pages so they follow the redirect.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.registration.unregister()
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
    const windows = await self.clients.matchAll({ type: 'window' })
    await Promise.all(windows.map((client) => client.navigate(client.url)))
  })())
})
