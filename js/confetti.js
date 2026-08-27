/**
 * Header phone panel trigger.
 */

export function initConfetti() {
  const btn = document.getElementById("confettiBtn");
  const panel = document.getElementById("couplePhonePanel");
  if (!btn || !panel) return;

  const closePanel = () => {
    btn.classList.remove("is-open");
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  };

  const openPanel = () => {
    btn.classList.add("is-open");
    panel.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (btn.classList.contains("is-open")) {
      closePanel();
      return;
    }

    openPanel();
  });

  document.addEventListener("click", (event) => {
    if (!btn.classList.contains("is-open")) return;
    if (btn.contains(event.target) || panel.contains(event.target)) return;
    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });
}
