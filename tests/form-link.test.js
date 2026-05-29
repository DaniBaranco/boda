import test from "node:test";
import assert from "node:assert/strict";
import { ensureGoogleFormUrl, isValidGoogleFormUrl } from "../js/form-link.js";

test("isValidGoogleFormUrl acepta forms.gle", () => {
  assert.equal(isValidGoogleFormUrl("https://forms.gle/abc123"), true);
});

test("isValidGoogleFormUrl acepta docs.google.com/forms", () => {
  assert.equal(
    isValidGoogleFormUrl("https://docs.google.com/forms/d/e/1FAIpQLSfake/viewform"),
    true
  );
});

test("ensureGoogleFormUrl rechaza urls que no son Google Forms", () => {
  assert.throws(
    () => ensureGoogleFormUrl("https://example.com/formulario"),
    /debe apuntar a Google Forms/
  );
});
