import test from "node:test";
import assert from "node:assert/strict";
import { buildRegistrationPayload, isSupabaseConfigured } from "../js/registration.js";

test("isSupabaseConfigured detecta configuración completa", () => {
  assert.equal(
    isSupabaseConfigured({
      registration: {
        supabaseUrl: "https://example.supabase.co",
        supabaseAnonKey: "anon-key",
        tableName: "guest_registrations"
      }
    }),
    true
  );
});

test("buildRegistrationPayload construye el payload esperado", () => {
  const payload = buildRegistrationPayload(
    {
      name: "Ada",
      surname: "Lovelace",
      email: "ada@example.com",
      attending: "si",
      companions: "2",
      companionName: "Grace",
      companionSurname: "Hopper",
      needsBus: "si",
      notes: "Vegana"
    },
    {
      registration: {
        tableName: "guest_registrations"
      }
    }
  );

  assert.equal(payload.tableName, "guest_registrations");
  assert.equal(payload.data.name, "Ada");
  assert.equal(payload.data.surname, "Lovelace");
  assert.equal(payload.data.email, "ada@example.com");
  assert.equal(payload.data.attending, true);
  assert.equal(payload.data.companions, 2);
  assert.equal(payload.data.companion_name, "Grace");
  assert.equal(payload.data.companion_surname, "Hopper");
  assert.equal(payload.data.needs_bus, true);
  assert.equal(payload.data.notes, "Vegana");
});
