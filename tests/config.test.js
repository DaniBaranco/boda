import test from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../js/config.js";

test("APP_CONFIG contiene estructura de boda válida", () => {
  assert.ok(APP_CONFIG.wedding);
  assert.ok(APP_CONFIG.wedding.couple);
  assert.ok(APP_CONFIG.wedding.date);
  assert.ok(APP_CONFIG.wedding.venue);
  assert.ok(APP_CONFIG.wedding.ceremony);
  assert.ok(APP_CONFIG.wedding.location);
});

test("APP_CONFIG contiene datos correctos de la boda", () => {
  assert.equal(APP_CONFIG.wedding.couple, "Almu & Dani");
  assert.equal(APP_CONFIG.wedding.date, "03-07-2027");
  assert.equal(APP_CONFIG.wedding.venue, "Finca Casa de Oficios");
});

test("APP_CONFIG contiene configuración de registro", () => {
  assert.ok(APP_CONFIG.registration);
  assert.ok(APP_CONFIG.registration.formUrl);
});
