/**
 * Pop-up de vídeo (save the date): solo en mobile, aparece suavemente unos
 * instantes después de cargar la página y se puede cerrar en cualquier
 * momento. Se muestra como mucho una vez por sesión de navegador.
 */

const MOBILE_MAX_WIDTH = 768;
const SHOW_DELAY_MS = 900;
const SESSION_KEY = 'boda-video-popup-shown';

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

function initVideoPopup() {
  const popup = document.querySelector('#video-popup');
  if (!popup) return;

  const video = popup.querySelector('.video-popup__video');
  const closeTargets = popup.querySelectorAll('[data-close-video-popup]');

  if (!isMobileViewport()) return;
  if (sessionStorage.getItem(SESSION_KEY) === '1') return;

  // El vídeo solo se carga en mobile: en escritorio ni se descarga.
  const videoSrc = video?.getAttribute('data-src');
  if (video && videoSrc) {
    video.src = videoSrc;
    video.preload = 'auto';
  }

  const openPopup = () => {
    popup.hidden = false;
    // Fuerza el reflow para que la transición de entrada se aplique.
    requestAnimationFrame(() => {
      popup.classList.add('is-visible');
    });
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem(SESSION_KEY, '1');

    if (video) {
      video.muted = false;
      const tryUnmutedPlay = () => video.play();
      const fallbackToMuted = () => {
        video.muted = true;
        video.play().catch(() => {
          // Autoplay bloqueado por completo: el usuario puede darle al play.
        });
        // En cuanto el usuario interactúa (tocar/click en cualquier sitio),
        // quitamos el silencio para que el sonido quede siempre activado.
        const unmuteOnInteraction = () => {
          video.muted = false;
          video.play().catch(() => {});
        };
        document.addEventListener('touchstart', unmuteOnInteraction, { once: true });
        document.addEventListener('click', unmuteOnInteraction, { once: true });
      };

      tryUnmutedPlay().catch(fallbackToMuted);
    }
  };

  const closePopup = () => {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    video?.pause();
    setTimeout(() => {
      popup.hidden = true;
    }, 300);
  };

  closeTargets.forEach((target) => {
    target.addEventListener('click', closePopup);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.getAttribute('aria-hidden') === 'false') {
      closePopup();
    }
  });

  setTimeout(openPopup, SHOW_DELAY_MS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoPopup);
} else {
  initVideoPopup();
}
