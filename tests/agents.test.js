import test from "node:test";
import assert from "node:assert/strict";
import { AgentOrchestrator } from "../orchestrator/agent-orchestrator.js";
import {
  DesignAgent,
  SecurityAgent,
  QAAgent,
  UnitTestAgent,
  FormsAgent
} from "../orchestrator/agent-implementations.js";

test("Agentes están instanciados como clases reales", () => {
  const orchestrator = new AgentOrchestrator();
  assert.ok(orchestrator.instances, "orchestrator debe tener instancias de agentes");
  assert.ok(orchestrator.instances.design instanceof DesignAgent);
  assert.ok(orchestrator.instances.security instanceof SecurityAgent);
  assert.ok(orchestrator.instances.qa instanceof QAAgent);
  assert.ok(orchestrator.instances.tests instanceof UnitTestAgent);
  assert.ok(orchestrator.instances.forms instanceof FormsAgent);
});

test("cada agente tiene método validate()", () => {
  const orchestrator = new AgentOrchestrator();
  Object.values(orchestrator.instances).forEach((agent) => {
    assert.ok(
      typeof agent.validate === "function",
      `${agent.id} debe tener método validate`
    );
  });
});

test("validateAll() retorna reporte con resultados de todos los agentes", () => {
  const orchestrator = new AgentOrchestrator();
  const report = orchestrator.validateAll();

  assert.ok(report.timestamp, "reporte debe tener timestamp");
  assert.ok(report.agents, "reporte debe tener sección agents");
  assert.equal(Object.keys(report.agents).length, 5, "debe haber 5 agentes");

  Object.values(report.agents).forEach((results) => {
    assert.ok(Array.isArray(results.passed));
    assert.ok(Array.isArray(results.warnings));
    assert.ok(Array.isArray(results.failed));
  });
});

test("getAgent() retorna instancia correcta por ID", () => {
  const orchestrator = new AgentOrchestrator();
  
  const designAgent = orchestrator.getAgent("design-agent");
  assert.ok(designAgent instanceof DesignAgent);
  
  const securityAgent = orchestrator.getAgent("security-agent");
  assert.ok(securityAgent instanceof SecurityAgent);
  
  const qaAgent = orchestrator.getAgent("qa-agent");
  assert.ok(qaAgent instanceof QAAgent);
  
  const testAgent = orchestrator.getAgent("unit-test-agent");
  assert.ok(testAgent instanceof UnitTestAgent);
  
  const formsAgent = orchestrator.getAgent("forms-agent");
  assert.ok(formsAgent instanceof FormsAgent);
});

test("routeTask sigue funcionando correctamente", () => {
  const orchestrator = new AgentOrchestrator();
  
  const designTask = orchestrator.routeTask("mejorar diseno mobile");
  assert.equal(designTask.id, "design-agent");
  
  const securityTask = orchestrator.routeTask("validar cabeceras de seguridad");
  assert.equal(securityTask.id, "security-agent");
  
  const formsTask = orchestrator.routeTask("revisar integracion google forms");
  assert.equal(formsTask.id, "forms-agent");
});

test("cada agente tiene propiedades correctas", () => {
  const orchestrator = new AgentOrchestrator();
  
  Object.values(orchestrator.instances).forEach((agent) => {
    assert.ok(agent.id, `${agent.constructor.name} debe tener id`);
    assert.ok(agent.focus, `${agent.constructor.name} debe tener focus`);
    assert.equal(typeof agent.id, "string");
    assert.equal(typeof agent.focus, "string");
  });
});
