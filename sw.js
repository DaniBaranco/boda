// sw.js — Service Worker de desinstalación.
//
// La web ya no es una PWA. Este archivo se mantiene solo para desactivar
// limpiamente el Service Worker antiguo en los navegadores que ya lo tenían
// registrado: borra sus cachés y se da de baja a sí mismo. Si se borrara el
// archivo sin más, esos navegadores seguirían sirviendo la versión cacheada
// de la web indefinidamente.
//
// Se puede eliminar dentro de unos meses, cuando ya no queden visitantes con
// el Service Worker antiguo activo.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
