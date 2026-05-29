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

    console.warn("No se pudo configurar el enlace de inscripcion:", error);
  }
}

function init() {
  hydrateWeddingInfo();
  hydrateRegistrationLinks();
}

init();
