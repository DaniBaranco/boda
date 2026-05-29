# Boda Almu & Dani

App web ligera para la boda de Almu y Dani con:

- Home visual moderna con imagenes de finca
- Landing de informacion de la boda
- Boton de inscripcion siempre visible en mobile
- Enlace a Google Forms (con almacenamiento en Google Sheets)
- Orquestador base para coordinar agentes de diseno, seguridad, QA, test y formularios

## Estructura

- `index.html`: home principal
- `info.html`: landing de informacion
- `css/styles.css`: estilos globales responsive
- `js/config.js`: datos de boda + URL de formulario
- `js/form-link.js`: validacion y aplicacion de enlaces de Google Forms
- `orchestrator/agent-orchestrator.js`: enrutado de tareas a agentes especializados
- `tests/*.test.js`: tests unitarios basicos

## Configuracion

1. Edita `js/config.js`
2. Sustituye `formUrl` por tu Google Form real (forms.gle o docs.google.com/forms)

### Como conectar Forms con Sheets

1. Abre tu Google Form
2. Ve a la pestana `Respuestas`
3. Pulsa en `Vincular con Hojas de calculo`
4. Crea o selecciona un Google Sheets
5. A partir de ahi, cada respuesta del formulario se guarda automaticamente en la hoja

## Ejecutar tests

```bash
npm test
```

## Notas de orquestacion

El orquestador es basico, pero ya decide agente principal por tipo de tarea y genera plan de colaboracion:

- `design-agent`: UI desktop/mobile
- `security-agent`: seguridad y enlaces seguros
- `qa-agent`: validacion de funcionamiento
- `unit-test-agent`: pruebas unitarias
- `forms-agent`: integracion de inscripcion, Google Forms y Sheets
