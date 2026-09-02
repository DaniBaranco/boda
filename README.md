# Almu & Dani - Boda 2027

> Invitacion web responsive para compartir los detalles de la boda de Almu y Dani y centralizar la confirmacion de asistencia.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-en%20directo-222?logo=github)](https://danibaranco.github.io/boda/)
[![Vercel](https://img.shields.io/badge/Vercel-despliegue-000?logo=vercel)](https://vercel.com/)
[![Node.js tests](https://img.shields.io/badge/tests-node%20--test-339933?logo=node.js&logoColor=white)](#calidad)

## Vista general

La web presenta la hoja de ruta del evento y permite a los invitados confirmar su asistencia mediante un formulario externo. Esta construida como un sitio estatico, ligero y facil de desplegar.

**Fecha:** 3 de julio de 2027
**Ceremonia:** Iglesia de Santa Maria Magdalena, Torrelaguna (Madrid)
**Celebracion:** Finca Casa de Oficios, Torremocha del Jarama (Madrid)

## Caracteristicas

- Hoja de ruta animada con ceremonia, coctel, banquete y fiesta.
- Cuenta atras hasta la ceremonia.
- Galeria visual del lugar de celebracion.
- Enlaces directos a Google Maps.
- Confirmacion de asistencia configurable con Google Forms.
- CTA fijo en dispositivos moviles.
- Pop-up de video de *save the date* exclusivo para movil.
- Preguntas frecuentes y seccion de preboda.
- Animaciones con respeto por la preferencia de movimiento reducido.
- Validacion automatizada de la configuracion, los recursos y la estructura HTML.

## Tecnologias

- HTML5, CSS3 y JavaScript nativo (ES modules).
- [Bootstrap 5](https://getbootstrap.com/) y Bootstrap Icons.
- [AOS](https://michalsnik.github.io/aos/) para animaciones al hacer scroll.
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) para efectos de celebracion.
- Node.js para las comprobaciones automatizadas.
- GitHub Pages y Vercel para despliegue estatico.

Las dependencias de interfaz, salvo `canvas-confetti`, se incluyen en `vendor/`, por lo que la pagina no depende de un CDN para sus estilos y scripts principales.

## Ejecutar en local

### Requisitos

- Node.js 18 o superior.
- Python 3, para utilizar el servidor local incluido en los scripts.

### Inicio rapido

```bash
git clone https://github.com/DaniBaranco/boda.git
cd boda
npm start
```

Abre [http://localhost:8000](http://localhost:8000) en el navegador.

No se requiere instalar paquetes: el proyecto no tiene dependencias de npm.

## Configuracion

La informacion editable del evento se encuentra en [`js/config.js`](./js/config.js):

```js
export const APP_CONFIG = {
  wedding: {
    couple: "Almu & Dani",
    date: "03-07-2027",
    venue: "Finca Casa de Oficios",
    ceremony: "Iglesia de Santa María Magdalena"
  },
  registration: {
    formUrl: "https://forms.gle/REEMPLAZAR_CON_FORM_REAL",
    busFormUrl: ""
  }
};
```

### Confirmacion de asistencia

1. Crea el formulario de invitados en Google Forms.
2. Copia su URL publica, con formato `https://forms.gle/...` o `https://docs.google.com/forms/...`.
3. Sustituye `formUrl` en [`js/config.js`](./js/config.js).
4. Opcionalmente, vincula el formulario con una hoja de calculo desde la pestana **Respuestas** de Google Forms.

Mientras `formUrl` contenga el valor de ejemplo, el enlace de confirmacion queda deshabilitado para evitar que los invitados naveguen a una URL incorrecta.

## Estructura del proyecto

```text
.
|-- index.html              # Pagina principal
|-- css/styles.css          # Estilos responsive y animaciones
|-- js/
|   |-- config.js           # Datos del evento y enlaces configurables
|   |-- app.js              # Inicializacion y enlaces de inscripcion
|   |-- roadmap.js          # Cuenta atras y hoja de ruta interactiva
|   |-- video-popup.js      # Pop-up de save the date en movil
|   `-- form-link.js        # Validacion de URLs de Google Forms
|-- images/                 # Fotografias y recursos visuales
|-- icons/                  # Favicon
|-- vendor/                 # Recursos de terceros incluidos en el repositorio
|-- tests/                  # Pruebas con el runner nativo de Node.js
|-- orchestrator/           # Utilidades de coordinacion de agentes
|-- sw.js                   # Retirada segura del antiguo Service Worker
`-- vercel.json             # Configuracion de despliegue en Vercel
```

## Calidad

Ejecuta las pruebas automatizadas:

```bash
npm test
```

Para validar la configuracion del orquestador:

```bash
npm run validate
```

Durante el desarrollo tambien puedes dejar las pruebas en ejecucion:

```bash
npm run test:watch
```

## Despliegue

El sitio se publica como contenido estatico, sin proceso de compilacion.

- **GitHub Pages:** [danibaranco.github.io/boda](https://danibaranco.github.io/boda/), servido desde la raiz de la rama `main`.
- **Vercel:** la configuracion de [`vercel.json`](./vercel.json) publica directamente el directorio raiz.

Tras comprobar los cambios localmente, publica la nueva version:

```bash
git add .
git commit -m "docs: actualizar README"
git push origin main
```

## Notas de mantenimiento

- [`sw.js`](./sw.js) permanece temporalmente para eliminar caches y desregistrar el Service Worker de la antigua PWA. No debe eliminarse de inmediato, ya que usuarios anteriores podrian seguir viendo contenido cacheado.
- La seccion de autobus y los detalles de la preboda estan preparados para completarse cuando se confirmen los datos definitivos.
- Los telefonos y la URL de Google Forms son datos publicos del sitio: revisalos antes de cada despliegue.

---

Hecho con cariño para celebrar a **Almu & Dani**.
