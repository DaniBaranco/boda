/**
 * Generates and downloads a PDF wedding invitation using
 * html2canvas (renders the hidden invite card) + jsPDF.
 * Both libraries are loaded via CDN as UMD globals.
 */

export async function downloadInvitation() {
  const btn = document.getElementById("downloadInviteBtn");
  if (!btn) return;

  if (!window.html2canvas || !window.jspdf) {
    alert("Las librerías de generación de PDF aún se están cargando. Inténtalo en unos segundos.");
    return;
  }

  const originalHTML = btn.innerHTML;
  btn.innerHTML = "Generando invitación…";
  btn.disabled = true;

  try {
    const card = document.getElementById("inviteCard");
    // Make visible off-screen before capturing
    card.classList.add("invite-card--capturing");

    const canvas = await window.html2canvas(card, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
    });

    card.classList.remove("invite-card--capturing");

    const { jsPDF } = window.jspdf;
    // PDF page size matches the card pixel dimensions at 1x scale
    const pxW = canvas.width / 2;
    const pxH = canvas.height / 2;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pxW, pxH],
      hotfixes: ["px_scaling"],
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.93);
    pdf.addImage(imgData, "JPEG", 0, 0, pxW, pxH);
    pdf.save("invitacion-almu-y-dani.pdf");
  } catch (err) {
    console.error("Error generando PDF:", err);
    alert("No se pudo generar la invitación. Comprueba que la página esté abierta desde un servidor local o inténtalo de nuevo.");
  } finally {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

export function initInvitation() {
  const btn = document.getElementById("downloadInviteBtn");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    downloadInvitation();
  });
}
