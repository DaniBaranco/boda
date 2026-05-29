import { AGENT_ROLES } from "./agents.js";
import {
  DesignAgent,
  SecurityAgent,
  QAAgent,
  UnitTestAgent,
  FormsAgent
} from "./agent-implementations.js";

const TASK_ROUTING_RULES = [
  { whenIncludes: ["diseno", "estilo", "mobile", "desktop", "ui"], routeTo: "design" },
  { whenIncludes: ["seguridad", "secure", "cabecera", "headers"], routeTo: "security" },
  { whenIncludes: ["test", "unit", "prueba"], routeTo: "tests" },
  { whenIncludes: ["form", "registro", "inscripcion", "google forms", "google sheets"], routeTo: "forms" },
  { whenIncludes: ["funcionamiento", "flujo", "qa", "error"], routeTo: "qa" }
];

// Instanciar agentes reales
const AGENT_INSTANCES = {
  design: new DesignAgent(),
  security: new SecurityAgent(),
  qa: new QAAgent(),
  tests: new UnitTestAgent(),
  forms: new FormsAgent()
};

export class AgentOrchestrator {
  constructor(agents = AGENT_ROLES, instances = AGENT_INSTANCES) {
    this.agents = agents;
    this.instances = instances;
  }

  routeTask(taskDescription) {
    const normalizedTask = String(taskDescription || "").toLowerCase();

    for (const rule of TASK_ROUTING_RULES) {
      if (rule.whenIncludes.some((word) => normalizedTask.includes(word))) {
        return this.agents[rule.routeTo];
      }
    }

    return this.agents.qa;
  }

  buildWorkPlan(taskDescription) {
    const primary = this.routeTask(taskDescription);

    return {
      task: taskDescription,
      primaryAgent: primary,
      collaborators: [this.agents.design, this.agents.security, this.agents.tests, this.agents.forms, this.agents.qa]
        .filter((agent) => agent.id !== primary.id)
    };
  }

  /**
   * Ejecuta validaciones de todos los agentes
   */
  validateAll() {
    const report = {
      timestamp: new Date().toISOString(),
      agents: {}
    };

    Object.entries(this.instances).forEach(([key, agent]) => {
      report.agents[agent.id] = agent.validate();
    });

    return report;
  }

  /**
   * Obtiene instancia de agente por ID
   */
  getAgent(agentId) {
    return Object.values(this.instances).find((agent) => agent.id === agentId);
  }
}
