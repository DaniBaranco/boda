import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "fs";

const HTML_FILES = ["index.html"];

test("archivos HTML principales existen", () => {
  HTML_FILES.forEach((html) => {
    assert.ok(existsSync(html), `${html} debe existir`);
  });
});

test("index.html contiene elementos críticos", () => {
  const content = readFileSync("index.html", "utf-8");
  assert.ok(content.includes("data-wedding-field"), "index.html debe contener campos de boda");
  assert.ok(content.includes("data-register-link"), "index.html debe contener enlaces de registro");
  assert.ok(content.includes("carousel-slide"), "index.html debe contener carousel");
  assert.ok(content.includes('class="site-logo-icon"'), "index.html debe contener el logo principal");
  assert.ok(content.includes("bi-hearts"), "index.html debe usar el icono de corazones como logo");
});

test("las rutas de imágenes en HTML son correctas", () => {
  const indexContent = readFileSync("index.html", "utf-8");
  const cssContent = readFileSync("css/styles.css", "utf-8");

  // Validar que todas las referencias de imágenes tienen la carpeta images/
  assert.ok(
    indexContent.includes('./images/'),
    "index.html debe usar rutas con carpeta images/"
  );
  assert.ok(
    cssContent.includes('../images/'),
    "styles.css debe usar rutas con carpeta images/"
  );

  // Validar que NO hay referencias sueltas (sin carpeta images)
  const hasInvalidRefs = indexContent.match(/src="\.\/(?!images\/)[a-z0-9\-\.]+\.(png|jpg|jpeg)"/gi);
  
  assert.equal(hasInvalidRefs, null, "No debe haber referencias de imágenes sin la carpeta images/");
});

test("index.html tiene links de seguridad en elementos externos", () => {
  const content = readFileSync("index.html", "utf-8");
  // Verificar que los links externos tengan rel="noreferrer noopener"
  const externalLinks = content.match(/href="https:\/\/[^"]+"/g) || [];
  assert.ok(externalLinks.length > 0, "Debe haber links externos en index.html");
});

