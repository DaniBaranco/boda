import { APP_CONFIG } from "./config.js";

/**
 * Cuenta atrás animada hasta la ceremonia.
 * Lee la fecha (dd-mm-aaaa) y la hora (HH:MM) de APP_CONFIG.
 */
export function initCountdown() {
  const container = document.querySelector("[data-countdown]");
  if (!container) return;

  const [day, month, year] = APP_CONFIG.wedding.date.split("-").map(Number);
  const [hour, minute] = (APP_CONFIG.wedding.ceremonyTime || "18:30").split(":").map(Number);
  const target = new Date(year, month - 1, day, hour, minute);

  const units = {
    days: container.querySelector('[data-countdown-unit="days"]'),
    hours: container.querySelector('[data-countdown-unit="hours"]'),
    minutes: container.querySelector('[data-countdown-unit="minutes"]'),
    seconds: container.querySelector('[data-countdown-unit="seconds"]'),
  };

  const setValue = (node, value) => {
    if (!node) return;
    const text = String(value).padStart(2, "0");
    if (node.textContent !== text) {
      node.textContent = text;
      node.classList.remove("tick");
      // Reinicia la animación de "pulso" al cambiar el número.
      void node.offsetWidth;
      node.classList.add("tick");
    }
  };

  const render = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      container.innerHTML = '<p class="countdown-done">¡Ya estamos casados! 🎉</p>';
      clearInterval(timer);
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    setValue(units.days, Math.floor(totalSeconds / 86400));
    setValue(units.hours, Math.floor((totalSeconds % 86400) / 3600));
    setValue(units.minutes, Math.floor((totalSeconds % 3600) / 60));
    setValue(units.seconds, totalSeconds % 60);
  };

  const timer = setInterval(render, 1000);
  render();
}

/**
 * Hoja de ruta del día B:
 * - La línea de progreso se rellena según avanza el scroll.
 * - Cada parada se activa (miga de pan "pisada") al entrar en pantalla.
 * - Las migas de pan superiores hacen scrollspy y permiten saltar a cada parada.
 */
export function initRoadmap() {
  const roadmap = document.querySelector("[data-roadmap]");
  if (!roadmap) return;

  const progressLine = roadmap.querySelector("[data-roadmap-progress]");
  const stops = [...roadmap.querySelectorAll("[data-stop]")];
  const crumbs = [...document.querySelectorAll("[data-crumb]")];

  // Activa el modo animado solo cuando el JS esta funcionando: sin JS, las
  // tarjetas quedan siempre visibles.
  roadmap.classList.add("js-anim");

  const activate = () => {
    const viewportAnchor = window.innerHeight * 0.62;
    const mapRect = roadmap.getBoundingClientRect();

    // Relleno de la línea: desde el inicio de la ruta hasta el ancla del viewport.
    if (progressLine) {
      const filled = Math.min(Math.max(viewportAnchor - mapRect.top, 0), mapRect.height);
      progressLine.style.height = `${filled}px`;
    }

    let currentIndex = -1;
    stops.forEach((stop, index) => {
      const reached = stop.getBoundingClientRect().top < viewportAnchor;
      stop.classList.toggle("is-active", reached);
      if (reached) currentIndex = index;
    });

    crumbs.forEach((crumb, index) => {
      crumb.classList.toggle("is-current", index === currentIndex);
      crumb.classList.toggle("is-done", index < currentIndex);
    });
  };

  let scheduled = false;
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      activate();
      scheduled = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  activate();

  // Las migas de pan navegan a su parada.
  crumbs.forEach((crumb) => {
    crumb.addEventListener("click", () => {
      const stop = document.getElementById(crumb.getAttribute("data-crumb"));
      stop?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // La última parada permite lanzar confeti (usa la librería global si está cargada).
  const partyBtn = roadmap.querySelector("[data-party-btn]");
  partyBtn?.addEventListener("click", () => {
    if (typeof window.confetti !== "function") return;
    window.confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#d9b8ff", "#b78bff", "#8d62ff", "#b47b39", "#fff7ea"],
    });
  });
}
