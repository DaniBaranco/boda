// Hook de Claude Code (evento Stop): ejecuta los tests y la validacion del
// orquestador al final de cada turno. Si algo falla, bloquea el cierre del
// turno y devuelve el error para que se corrija antes de terminar.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// stop_hook_active=true significa que ya estamos en un ciclo de correccion
// iniciado por este mismo hook; no volver a bloquear para evitar bucles.
let stopHookActive = false;
try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  stopHookActive = input.stop_hook_active === true;
} catch {
  // sin stdin o JSON invalido: seguir con la revision normal
}

const checks = [
  { name: "tests unitarios", args: ["--test"] },
  { name: "validacion orquestador", args: ["orchestrator/validate.js"] },
];

const failures = [];
for (const check of checks) {
  const result = spawnSync(process.execPath, check.args, {
    cwd: root,
    encoding: "utf8",
    timeout: 110000,
  });
  if (result.status !== 0) {
    const output = `${result.stdout || ""}${result.stderr || ""}`.slice(0, 4000);
    failures.push(`[${check.name}]\n${output}`);
  }
}

if (failures.length > 0 && !stopHookActive) {
  console.log(
    JSON.stringify({
      decision: "block",
      reason:
        "Revision automatica de la app: hay fallos que corregir antes de terminar.\n" +
        failures.join("\n---\n"),
    }),
  );
} else if (failures.length > 0) {
  console.log(
    JSON.stringify({
      systemMessage: "Revision automatica: siguen fallando comprobaciones tras el ciclo de correccion.",
    }),
  );
} else {
  console.log(JSON.stringify({ suppressOutput: true }));
}
