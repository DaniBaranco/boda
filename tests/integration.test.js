import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";

test("Integración: todos los scripts se cargan en index.html", () => {
  const content = readFileSync("index.html", "utf-8");
  assert.ok(content.includes("js/app.js"), "index.html debe cargar app.js");
  assert.ok(content.includes("js/confetti.js"), "index.html debe cargar confetti.js");
  assert.ok(content.includes("css/styles.css"), "index.html debe cargar styles.css");
});

test("Integración: todos los scripts se cargan en info.html", () => {
  const content = readFileSync("info.html", "utf-8");
  assert.ok(content.includes("js/app.js"), "info.html debe cargar app.js");
  assert.ok(content.includes("js/invitation.js"), "info.html debe cargar invitation.js");
  assert.ok(content.includes("css/styles.css"), "info.html debe cargar styles.css");
});

test("Integración: estructura de datos de boda es consistente entre archivos", () => {
  const configContent = readFileSync("js/config.js", "utf-8");
  const indexContent = readFileSync("index.html", "utf-8");
  const infoContent = readFileSync("info.html", "utf-8");

  // Verificar que existen referencias a campos de boda
  assert.ok(
    indexContent.includes("data-wedding-field"),
    "index.html debe usar data-wedding-field"
  );
  assert.ok(
    infoContent.includes("data-wedding-field"),
    "info.html debe usar data-wedding-field"
  );

  // Verificar campos específicos
  const fields = ["date", "venue", "ceremony", "location"];
  fields.forEach((field) => {
    assert.ok(
      indexContent.includes(`data-wedding-field="${field}"`) ||
      indexContent.includes(`data-wedding-field='${field}'`),
      `index.html debe contener referencia a ${field}`
    );
  });
});

test("Integración: la URL de Google Forms está configurada", () => {
  const configContent = readFileSync("js/config.js", "utf-8");
  assert.ok(
    configContent.includes("formUrl"),
    "config.js debe contener formUrl"
  );
});

test("Integración: todos los elementos interactivos tienen data-attributes", () => {
  const indexContent = readFileSync("index.html", "utf-8");
  const infoContent = readFileSync("info.html", "utf-8");

  // Botones de confetti
  assert.ok(indexContent.includes("confettiBtn"), "index.html debe tener botón de confetti");
  assert.ok(infoContent.includes("confettiBtn"), "info.html debe tener botón de confetti");

  // Enlaces de registro
  assert.ok(
    indexContent.includes("data-register-link"),
    "index.html debe tener enlaces de registro"
  );
  assert.ok(
    infoContent.includes("data-register-link"),
    "info.html debe tener enlaces de registro"
  );

  // Botón de descarga de invitación en info.html
  assert.ok(
    infoContent.includes("downloadInviteBtn"),
    "info.html debe tener botón de descarga"
  );
});

test("Integración: las versiones de assets se incluyen en las URLs", () => {
  const indexContent = readFileSync("index.html", "utf-8");
  
  // Verificar que los archivos tengan versiones en query string para cache busting
  assert.ok(
    indexContent.includes("styles.css?v=") || indexContent.includes("styles.css"),
    "styles.css debe estar referenciado"
  );
  assert.ok(
    indexContent.includes("app.js?v=") || indexContent.includes("app.js"),
    "app.js debe estar referenciado"
  );
});
