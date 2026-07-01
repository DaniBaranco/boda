import { APP_CONFIG } from "./config.js";
import { mapRegistrationLinks } from "./form-link.js";
import { submitRegistration, isSupabaseConfigured } from "./registration.js";

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

  if (isSupabaseConfigured(APP_CONFIG)) {
    registerLinks.forEach((link) => {
      link.setAttribute("href", "#register-modal");
      link.setAttribute("data-open-register-modal", "true");
      link.setAttribute("aria-disabled", "false");
      link.setAttribute("title", "Abrir formulario de inscripción");
    });
    return;
  }

  try {
    mapRegistrationLinks(APP_CONFIG.registration.formUrl, registerLinks);
  } catch (error) {
    registerLinks.forEach((link) => {
      link.setAttribute("href", "#");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "Configura la URL real de Google Forms o Supabase en js/config.js");
    });

    console.warn("No se pudo configurar el enlace de inscripcion:", error);
  }
}

function attachRegistrationFormHandlers() {
  const modal = document.querySelector("#register-modal");
  const openButtons = document.querySelectorAll("[data-open-register-modal]");
  const closeButton = document.querySelector("[data-close-register-modal]");
  const form = document.querySelector("#registration-form");
  const statusNode = document.querySelector("#registration-status");

  if (!modal || !form || !statusNode) {
    return;
  }

  const openModal = () => {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    form.reset();
    if (statusNode) {
      statusNode.textContent = "";
      statusNode.className = "registration-status";
    }
    const firstField = form.querySelector("input, textarea, select");
    firstField?.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeButton?.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    statusNode.textContent = "Guardando inscripción...";
    statusNode.className = "registration-status registration-status--pending";

    try {
      await submitRegistration(values, APP_CONFIG);
      statusNode.textContent = "Inscripción guardada correctamente.";
      statusNode.className = "registration-status registration-status--success";
      form.reset();
      setTimeout(closeModal, 900);
    } catch (error) {
      statusNode.textContent = error.message;
      statusNode.className = "registration-status registration-status--error";
    }
  });
}

function init() {
  hydrateWeddingInfo();
  hydrateRegistrationLinks();
  attachRegistrationFormHandlers();
}

init();
