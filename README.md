# Boda Almu & Dani

App web ligera para la boda de Almu y Dani con:

- Home visual moderna con imagenes de finca
- Boton de inscripcion siempre visible en mobile
- Enlace a Google Forms (con almacenamiento en Google Sheets)
- Orquestador base para coordinar agentes de diseno, seguridad, QA, test y formularios

## Estructura

- `index.html`: home principal (web completa, con inscripcion)
- `css/styles.css`: estilos globales responsive
- `js/config.js`: datos de boda + URL de formulario
- `js/form-link.js`: validacion y aplicacion de enlaces de Google Forms
- `js/app.js`: inicializacion de la app y enlaces de inscripcion
- `js/confetti.js`: efecto confeti del boton de cabecera
- `sw.js`: Service Worker de desinstalacion (limpia la antigua PWA; ver mas abajo)
- `icons/favicon-32.png`: favicon del sitio
- `images/`: todas las imagenes y logos del sitio
- `vendor/`: librerias en local, sin dependencia de CDN
  - `bootstrap/`: Bootstrap 5.3.3 (CSS + JS); se carga antes de `styles.css` para que los estilos propios tengan prioridad
  - `bootstrap-icons/`: Bootstrap Icons 1.11.3 (uso: `<i class="bi bi-heart"></i>`)
  - `aos/`: AOS 2.3.4, animaciones al hacer scroll (activo en ambas paginas via `data-aos`)
  - `swiper/`: Swiper 11.2.10, carrusel tactil (descargado, pendiente de activar)
  - `gsap/`: GSAP 3.12.5 + ScrollTrigger, animaciones avanzadas (descargado, pendiente de activar)
- `scripts/generate_labanda_logo.py`: genera el logo `images/labanda.png` (requiere Pillow)
- `orchestrator/agent-orchestrator.js`: enrutado de tareas a agentes especializados
- `tests/*.test.js`: tests unitarios basicos

## Ejecutar en local

```bash
npm start          # sirve la web en http://localhost:8000 (requiere Python)
```

## Entornos

La web se publica en dos sitios en paralelo:

- **Vercel** (principal), conectado al repositorio Git: cada push despliega automaticamente.
  - **Produccion**: rama `main`. Cada push a `main` publica en la URL real de Vercel. Solo llegan cambios probados.
  - **Desarrollo**: rama `dev`. Cajon de sastre para experimentar sin afectar a produccion. Cada push a `dev` genera automaticamente una *Preview URL* propia en Vercel para ver la propuesta online.
- **GitHub Pages**: <https://danibaranco.github.io/boda/>. Se sirve directamente desde la rama `main` (raiz del repo), asi que se actualiza sola con cada push a `main`. Es la URL pensada para compartir con los invitados.

Flujo de trabajo:

```bash
git switch dev         # trabajar y experimentar aqui
npm start              # probar en local (http://localhost:8000)
git push               # Vercel crea una Preview URL con el experimento

# cuando una propuesta este lista para publicar:
git switch main
git merge dev
git push               # Vercel y GitHub Pages despliegan produccion a la vez

# si un experimento no convence, se descarta sin mas:
git switch dev
git reset --hard main  # dev vuelve a estar limpia como produccion
```

El CLI de Vercel (`vercel`) queda como opcion para despliegues manuales o consultar logs, pero no es necesario para el flujo normal.

## Invitacion instalable (PWA) — retirada

La web tuvo durante un tiempo una version instalable en el movil
(`invitacion.html` + `manifest.webmanifest` + iconos de app). Se retiro: ahora
la web es un sitio normal, sin instalacion ni cache offline.

Queda un unico resto intencionado: `sw.js` ya no cachea nada, sino que borra
las caches antiguas y se da de baja a si mismo. Es necesario porque un Service
Worker registrado sobrevive al borrado de sus archivos: sin este "kill switch",
quien ya hubiera visitado la web seguiria viendo indefinidamente la version
antigua guardada en cache. Se puede borrar el archivo dentro de unos meses.

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
