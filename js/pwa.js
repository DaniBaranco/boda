/**
 * PWA: registro del Service Worker y botones de "Descarga la invitación".
 *
 * El evento `beforeinstallprompt` solo lo disparan algunos navegadores
 * (Chrome/Edge en Android y escritorio). Ahi podemos instalar la app de
 * verdad con un clic. En iOS/Safari y Firefox ese evento no existe y la
 * instalacion la tiene que hacer el usuario desde el menu del navegador,
 * asi que mostramos un modal con los pasos exactos de su dispositivo.
 */

const INVITATION_URL = './invitacion.html';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

let deferredPrompt = null;

/** Detecta la plataforma para dar las instrucciones correctas. */
function detectPlatform() {
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ se presenta como Mac con pantalla tactil
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // En iOS solo Safari permite "Añadir a pantalla de inicio".
    const isSafari = !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    return isSafari ? 'ios-safari' : 'ios-otro';
  }
  if (/Android/.test(ua)) return 'android';
  return 'escritorio';
}

const INSTRUCTIONS = {
  'ios-safari': {
    title: 'Añade la invitación a tu iPhone',
    steps: [
      'Pulsa el botón <strong>Compartir</strong> <i class="bi bi-box-arrow-up" aria-hidden="true"></i> de la barra de Safari.',
      'Baja y elige <strong>Añadir a pantalla de inicio</strong>.',
      'Pulsa <strong>Añadir</strong> y listo: tendrás la invitación como una app más.',
    ],
  },
  'ios-otro': {
    title: 'Ábrelo en Safari para instalarlo',
    steps: [
      'En iPhone solo se puede instalar desde <strong>Safari</strong>.',
      'Abre esta misma página en Safari.',
      'Pulsa <strong>Compartir</strong> <i class="bi bi-box-arrow-up" aria-hidden="true"></i> y luego <strong>Añadir a pantalla de inicio</strong>.',
    ],
  },
  android: {
    title: 'Añade la invitación a tu móvil',
    steps: [
      'Abre el menú <strong>⋮</strong> de tu navegador (arriba a la derecha).',
      'Elige <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.',
      'Confirma y la tendrás junto al resto de tus apps.',
    ],
  },
  escritorio: {
    title: 'Instala la invitación',
    steps: [
      'Busca el icono <strong>Instalar</strong> <i class="bi bi-download" aria-hidden="true"></i> en la barra de direcciones.',
      'Si no aparece, ábrelo desde el menú del navegador → <strong>Instalar…</strong>',
      'También puedes abrir esta web en tu móvil para llevarla siempre encima.',
    ],
  },
};

/** Modal con los pasos de instalacion, creado solo cuando hace falta. */
function showInstallHelp() {
  const platform = detectPlatform();
  const { title, steps } = INSTRUCTIONS[platform];

  const overlay = document.createElement('div');
  overlay.className = 'install-help';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title);
  overlay.innerHTML = `
    <div class="install-help__dialog">
      <button class="install-help__close" type="button" aria-label="Cerrar">&times;</button>
      <span class="install-help__icon"><i class="bi bi-phone" aria-hidden="true"></i></span>
      <h2>${title}</h2>
      <ol class="install-help__steps">
        ${steps.map((step) => `<li>${step}</li>`).join('')}
      </ol>
      <a class="install-help__link" href="${INVITATION_URL}">Ver la invitación ahora</a>
    </div>
  `;

  const close = () => {
    overlay.remove();
    document.body.style.removeProperty('overflow');
  };

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('.install-help__close')) {
      close();
    }
  });
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') close();
    },
    { once: true }
  );

  document.body.append(overlay);
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.install-help__close').focus();
}

function setupInstallButtons() {
  const buttons = Array.from(document.querySelectorAll('[data-install-btn]'));
  if (buttons.length === 0) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      // Caso ideal: el navegador permite instalar con un clic.
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        // Si lo descarta, no insistimos con el modal.
        if (outcome !== 'accepted') return;
        return;
      }
      // Resto de navegadores: explicamos como añadirla a mano.
      showInstallHelp();
    });
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    buttons.forEach((btn) => btn.classList.add('is-hidden'));
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
