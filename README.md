# Boda Almu & Dani

App web ligera para la boda de Almu y Dani con:

- Home visual moderna con imagenes de finca
- Boton de inscripcion siempre visible en mobile
- Enlace a Google Forms (con almacenamiento en Google Sheets)
- **Instalable como app en el movil (PWA)**: los invitados pueden anadirla a
  su pantalla de inicio como una invitacion digital simple, con cuenta atras,
  ceremonia, finca, autobus y preboda, incluso sin cobertura
- Orquestador base para coordinar agentes de diseno, seguridad, QA, test y formularios

## Estructura

- `index.html`: home principal (web completa, con inscripcion)
- `invitacion.html`: invitacion digital simplificada (es la app instalable, sin formularios)
- `css/styles.css`: estilos globales responsive
- `css/invitacion.css`: estilos propios de la invitacion digital simplificada
- `js/config.js`: datos de boda + URL de formulario
- `js/form-link.js`: validacion y aplicacion de enlaces de Google Forms
- `js/app.js`: inicializacion de la app y enlaces de inscripcion
- `js/confetti.js`: efecto confeti del boton de cabecera
- `js/pwa.js`: registro del Service Worker y botones "Descarga la invitación"
- `manifest.webmanifest`: metadatos de la PWA (nombre, iconos, colores)
- `sw.js`: Service Worker (cache offline del app shell)
- `icons/`: iconos de la PWA (192, 512, maskable, apple-touch, favicon)
- `make_icons.py`: genera los iconos a partir de `images/labanda-lavanda.png` (requiere Pillow)
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
- **GitHub Pages**: <https://danibaranco.github.io/boda/>. Se sirve directamente desde la rama `main` (raiz del repo), asi que se actualiza sola con cada push a `main`. Es la URL pensada para compartir con los invitados y para instalar la PWA en el movil.

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

## App instalable (PWA)

Los invitados pueden "instalar" una **invitación digital** en su móvil
(Android/Chrome: botón **Instalar app** o menú > *Añadir a pantalla de
inicio*; iPhone/Safari: *Compartir* > *Añadir a pantalla de inicio*) y
consultarla como si fuera una app nativa, con icono propio y sin la barra del
navegador. No es una copia del front completo: es una vista **simplificada**
(`invitacion.html`) con solo la información esencial para el día de la boda:

- Cuenta atrás
- Ceremonia (lugar, hora, cómo llegar)
- Recepción/finca (lugar, cómo llegar)
- Horarios de autobús (ida y vuelta)
- Preboda (fecha, hora, lugar)

A propósito **no incluye** el formulario de confirmación de asistencia: es
solo para llevar la invitación siempre a mano, no para inscribirse.

- `manifest.webmanifest`: nombre, iconos, colores y `start_url` apuntando a
  `invitacion.html`
- `sw.js`: Service Worker que cachea el "app shell" (ambas páginas) para
  poder abrir la invitación sin conexión (util el dia del evento, con
  cobertura irregular en la finca)
- `js/pwa.js`: registra el Service Worker y controla los botones **Descarga la
  invitación** de `index.html` (uno en el hero para escritorio y otro en el
  grupo flotante inferior para mobile). Siempre están visibles: si el navegador
  ofrece instalación nativa (`beforeinstallprompt`, Chrome/Edge) lanza el
  diálogo; si no (iOS/Safari, Firefox) abre `invitacion.html` para guardarla a
  mano. La propia `invitacion.html` no lleva botón.

### Regenerar iconos

Los iconos se generan a partir de `images/labanda-lavanda.png` con
[Pillow](https://python-pillow.org/) (sin dependencias nativas en Windows):

```bash
pip install pillow
python make_icons.py
```

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
