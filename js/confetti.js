/**
 * Confetti trigger for wedding celebration!
 */

export function initConfetti() {
  const btn = document.getElementById("confettiBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    triggerConfetti();
  });
}

function triggerConfetti() {
  if (!window.confetti) {
    console.warn("canvas-confetti not loaded yet");
    return;
  }

  // Launch confetti from center with wedding colors
  window.confetti({
    particleCount: 180,
    spread: 360,
    origin: { x: 0.5, y: 0.5 },
    colors: ["#d9b8ff", "#b78bff", "#8d62ff", "#b47b39", "#8d5d24"],
  });

  // Add some falling confetti
  setTimeout(() => {
    window.confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0.95, y: 0 },
      colors: ["#d9b8ff", "#b78bff", "#8d62ff"],
    });
  }, 150);

  setTimeout(() => {
    window.confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0.05, y: 0 },
      colors: ["#d9b8ff", "#b78bff", "#8d62ff"],
    });
  }, 300);
}
