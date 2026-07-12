import { APP_CONFIG } from "./config.js";
import { mapRegistrationLinks } from "./form-link.js";

function hydrateWeddingInfo() {
  const weddingFields = document.querySelectorAll("[data-wedding-field]");

  weddingFields.forEach((node) => {
    const fieldName = node.getAttribute("data-wedding-field");
    const value = APP_CONFIG.wedding[fieldName];
    if (value) {
      node.textContent = value;
    }
  });
}

function hydrateRegistrationLinks() {
  const registerLinks = [...document.querySelectorAll("[data-register-link]")];

  try {
    mapRegistrationLinks(APP_CONFIG.registration.formUrl, registerLinks);
  } catch (error) {
    // Permite que la web siga funcionando aunque el enlace de Forms aun no este configurado.
    registerLinks.forEach((link) => {
      link.setAttribute("href", "#");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "Configura la URL real de Google Forms en js/config.js");
    });

    console.warn("No se pudo configurar el enlace de inscripción:", error);
  }
}

function hydrateBusLinks() {
  const busLinks = [...document.querySelectorAll("[data-bus-link]")];
  if (busLinks.length === 0) return;

  try {
    mapRegistrationLinks(APP_CONFIG.registration.busFormUrl, busLinks);
  } catch {
    // El formulario del autobús aún no existe: el botón queda deshabilitado.
    busLinks.forEach((link) => {
      link.setAttribute("href", "#");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "El formulario del autobús estará disponible muy pronto");
    });
  }
}

function init() {
  hydrateWeddingInfo();
  hydrateRegistrationLinks();
  hydrateBusLinks();
}

init();
