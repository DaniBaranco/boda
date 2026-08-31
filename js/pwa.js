/**
 * PWA: registro del Service Worker y botones de "Descarga la invitación".
 *
 * El evento `beforeinstallprompt` solo lo disparan algunos navegadores
 * (Chrome/Edge Android y escritorio). En iOS/Safari y Firefox nunca llega,
 * asi que los botones se muestran siempre y, cuando no hay prompt nativo
 * disponible, abren la invitacion para que el invitado la guarde a mano.
 */

const INVITATION_URL = './invitacion.html';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

let deferredPrompt = null;

function setupInstallButtons() {
  const buttons = Array.from(document.querySelectorAll('[data-install-btn]'));
  if (buttons.length === 0) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        return;
      }
      // Sin prompt nativo: abrimos la invitacion, que ya trae instrucciones
      // implicitas (el invitado la anade a su pantalla de inicio).
      window.location.href = INVITATION_URL;
    });
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });

  // Si ya se esta usando como app instalada, el boton sobra.
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isStandalone) {
    buttons.forEach((btn) => btn.classList.add('is-hidden'));
  }
}

setupInstallButtons();
