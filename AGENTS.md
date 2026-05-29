# Agent Orchestration Blueprint

## Orchestrator

`wedding-orchestrator` coordina el trabajo entre agentes especializados y decide prioridad por impacto en:

1. Correcto funcionamiento del flujo de inscripcion
2. Seguridad basica de interacciones y enlaces
3. Calidad visual cross-platform (desktop y mobile)
4. Cobertura de pruebas unitarias

## Subagentes

- `design-agent`
  - Mantiene coherencia visual y responsive design.
  - Garantiza que el CTA de inscripcion sea persistente en mobile.

- `security-agent`
  - Verifica enlaces externos con `rel="noreferrer noopener"`.
  - Revisa patrones de validacion de URL y entradas.

- `qa-agent`
  - Valida navegacion, estados y consistencia de contenido.
  - Comprueba accesibilidad funcional basica.

- `unit-test-agent`
  - Mantiene tests en `tests/` para logica de negocio.
  - Bloquea regresiones del orquestador y del enlace de formularios.

- `forms-agent`
  - Supervisa integracion Google Forms -> Google Sheets.
  - Asegura que los CTA usen siempre URL valida de Google Forms.

## Rule of Engagement

Si una tarea incluye mas de una especialidad, el orquestador nombra un agente principal y agrega colaboradores.
El enrutado base esta implementado en `orchestrator/agent-orchestrator.js`.
