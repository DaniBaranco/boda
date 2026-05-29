import test from "node:test";
import assert from "node:assert/strict";
import { AgentOrchestrator } from "../orchestrator/agent-orchestrator.js";

const orchestrator = new AgentOrchestrator();

test("routeTask prioriza el agente de formularios para tareas de inscripcion", () => {
  const assigned = orchestrator.routeTask("Revisar flujo de inscripcion y Google Sheets");
  assert.equal(assigned.id, "forms-agent");
});

test("routeTask asigna seguridad para tareas de cabeceras", () => {
  const assigned = orchestrator.routeTask("validar cabeceras de seguridad");
  assert.equal(assigned.id, "security-agent");
});

test("buildWorkPlan devuelve agente principal y colaboradores", () => {
  const plan = orchestrator.buildWorkPlan("mejorar diseno mobile");
  assert.equal(plan.primaryAgent.id, "design-agent");
  assert.equal(plan.collaborators.length, 4);
});
