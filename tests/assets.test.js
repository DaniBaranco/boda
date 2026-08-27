import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "fs";

const REQUIRED_FILES = [
  "css/styles.css",
  "js/app.js",
  "js/config.js",
  "js/form-link.js",
  "js/confetti.js",
  "orchestrator/agent-orchestrator.js",
  "orchestrator/agents.js",
];

test("todos los archivos CSS y JS requeridos existen", () => {
  REQUIRED_FILES.forEach((file) => {
    assert.ok(existsSync(file), `${file} debe existir`);
  });
});

test("styles.css contiene estilos principales", () => {
  const content = readFileSync("css/styles.css", "utf-8");
  assert.ok(content.includes("--bg-cream"), "styles.css debe contener variables CSS");
  assert.ok(content.includes(".glass-panel"), "styles.css debe tener clase glass-panel");
  assert.ok(content.includes(".carousel"), "styles.css debe tener estilos carousel");
});

test("app.js es módulo ES6 válido", () => {
  const content = readFileSync("js/app.js", "utf-8");
  assert.ok(content.includes("import"), "app.js debe usar módulos ES6");
  assert.ok(content.includes("export") || content.includes("init("), "app.js debe tener lógica de inicialización");
});

test("config.js exporta APP_CONFIG", () => {
  const content = readFileSync("js/config.js", "utf-8");
  assert.ok(content.includes("export const APP_CONFIG"), "config.js debe exportar APP_CONFIG");
});

test("form-link.js contiene funciones esperadas", () => {
  const content = readFileSync("js/form-link.js", "utf-8");
  assert.ok(content.includes("isValidGoogleFormUrl"), "form-link.js debe tener isValidGoogleFormUrl");
  assert.ok(content.includes("ensureGoogleFormUrl"), "form-link.js debe tener ensureGoogleFormUrl");
  assert.ok(content.includes("mapRegistrationLinks"), "form-link.js debe tener mapRegistrationLinks");
});

test("confetti.js contiene función initConfetti", () => {
  const content = readFileSync("js/confetti.js", "utf-8");
  assert.ok(content.includes("export function initConfetti"), "confetti.js debe exportar initConfetti");
});

test("package.json tiene configuración correcta", () => {
  const content = readFileSync("package.json", "utf-8");
  const pkg = JSON.parse(content);
  assert.equal(pkg.type, "module", "package.json debe usar type: module");
  assert.ok(pkg.scripts.test, "package.json debe tener script de test");
});
