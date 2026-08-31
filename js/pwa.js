/**
 * PWA: registro del Service Worker y banner de instalación.
 * Permite a los invitados "instalar" la web como app en su móvil.
 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

let deferredPrompt = null;

function setupInstallButton() {
  const btn = document.getElementById('installBtn');
  if (!btn) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    btn.classList.remove('is-hidden');
  });

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.classList.add('is-hidden');
  });

  window.addEventListener('appinstalled', () => {
    btn.classList.add('is-hidden');
    deferredPrompt = null;
  });

  // Ya instalada (standalone): no mostrar el botón.
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isStandalone) {
    btn.classList.add('is-hidden');
  }
}

setupInstallButton();
