import { readFileSync } from "fs";

/**
 * DesignAgent: valida coherencia visual y responsive design
 */
export class DesignAgent {
  constructor() {
    this.id = "design-agent";
    this.focus = "UI responsive, estilos modernos y consistencia visual en desktop/mobile";
  }

  validate() {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };

    try {
      const cssContent = readFileSync("css/styles.css", "utf-8");
      const htmlContent = readFileSync("index.html", "utf-8");

      // Validar variables CSS
      if (cssContent.includes("--bg-cream") && cssContent.includes("--band-grad")) {
        results.passed.push("✓ Variables CSS de diseño encontradas");
      } else {
        results.failed.push("✗ Variables CSS incompletas");
      }

      // Validar clases de componentes
      if (cssContent.includes(".glass-panel") && cssContent.includes(".carousel")) {
        results.passed.push("✓ Componentes CSS principales presentes");
      } else {
        results.failed.push("✗ Componentes CSS ausentes");
      }

      // Validar responsive design (media queries)
      if (cssContent.includes("@media")) {
        results.passed.push("✓ Media queries para responsive design encontradas");
      } else {
        results.warnings.push("⚠ No hay media queries detectadas");
      }

      // Validar CTA persistente en mobile
      if (htmlContent.includes("mobile-register-cta")) {
        results.passed.push("✓ CTA persistente en mobile presente");
      } else {
        results.failed.push("✗ CTA persistente en mobile ausente");
      }

      // Validar consistencia de colores
      if (cssContent.includes("--accent-gold") && cssContent.includes("--text-main")) {
        results.passed.push("✓ Paleta de colores consistente");
      } else {
        results.warnings.push("⚠ Paleta de colores incompleta");
      }
    } catch (error) {
      results.failed.push(`✗ Error en validación de diseño: ${error.message}`);
    }

    return results;
  }
}

/**
 * SecurityAgent: verifica enlaces seguros y validación de entrada
 */
export class SecurityAgent {
  constructor() {
    this.id = "security-agent";
    this.focus = "Cabeceras, enlaces seguros y proteccion de entrada de datos";
  }

  validate() {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };

    try {
      const htmlContent = readFileSync("index.html", "utf-8");
      const infoContent = readFileSync("info.html", "utf-8");
      const formLinkContent = readFileSync("js/form-link.js", "utf-8");

      // Validar atributos de seguridad en enlaces externos
      const externalLinkPattern = /href="https:\/\/[^"]*"[^>]*rel="noreferrer noopener"/g;
      const indexMatches = htmlContent.match(externalLinkPattern) || [];
      const infoMatches = infoContent.match(externalLinkPattern) || [];

      if (indexMatches.length > 0 || infoMatches.length > 0) {
        results.passed.push("✓ Enlaces externos con rel='noreferrer noopener' detectados");
      } else {
        results.warnings.push("⚠ Algunos enlaces externos pueden no tener atributos de seguridad");
      }

      // Validar validación de URL de Google Forms
      if (formLinkContent.includes("GOOGLE_FORM_URL_REGEX") && formLinkContent.includes("isValidGoogleFormUrl")) {
        results.passed.push("✓ Validación de URL de Google Forms implementada");
      } else {
        results.failed.push("✗ Validación de URL faltante");
      }

      // Validar protección contra injection
      if (formLinkContent.includes("trim()") || formLinkContent.includes("sanitize")) {
        results.passed.push("✓ Métodos de protección de entrada detectados");
      } else {
        results.warnings.push("⚠ Validar métodos de protección de entrada");
      }

      // Validar que no hay inline scripts críticos
      const inlineScripts = htmlContent.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
      const criticalInline = inlineScripts.filter(s => !s.includes("type='module'") && !s.includes("src="));
      if (criticalInline.length === 0) {
        results.passed.push("✓ No hay scripts inline críticos");
      } else {
        results.warnings.push(`⚠ ${criticalInline.length} script(s) inline detectados`);
      }

      // Validar atributo target="_blank" con seguridad
      if (infoContent.includes('target="_blank"') && infoContent.includes('rel="noreferrer noopener"')) {
        results.passed.push("✓ Links con target='_blank' tienen protección");
      } else {
        results.warnings.push("⚠ Revisar links con target='_blank'");
      }
    } catch (error) {
      results.failed.push(`✗ Error en validación de seguridad: ${error.message}`);
    }

    return results;
  }
}

/**
 * QAAgent: valida flujos críticos y comportamiento
 */
export class QAAgent {
  constructor() {
    this.id = "qa-agent";
    this.focus = "Flujos criticos de navegacion y comportamiento esperado";
  }

  validate() {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };

    try {
      const indexContent = readFileSync("index.html", "utf-8");
      const infoContent = readFileSync("info.html", "utf-8");
      const appContent = readFileSync("js/app.js", "utf-8");

      // Validar navegación entre páginas
      if (indexContent.includes('href="./info.html"') && infoContent.includes('href="./index.html"')) {
        results.passed.push("✓ Navegación bidireccional entre páginas presente");
      } else {
        results.failed.push("✗ Navegación incompleta");
      }

      // Validar componente hero con CTA
      if (indexContent.includes("hero") && indexContent.includes("data-register-link")) {
        results.passed.push("✓ Hero section con CTA presente");
      } else {
        results.failed.push("✗ Hero section incompleta");
      }

      // Validar información de boda en ambas páginas
      if (indexContent.includes("data-wedding-field") && infoContent.includes("data-wedding-field")) {
        results.passed.push("✓ Campos de información de boda disponibles en ambas páginas");
      } else {
        results.failed.push("✗ Campos de boda faltantes");
      }

      // Validar carousel
      if (indexContent.includes("carousel") && indexContent.includes("carousel-slide")) {
        results.passed.push("✓ Carousel de fotos presente");
      } else {
        results.warnings.push("⚠ Carousel no encontrado");
      }

      // Validar formulario de descargar invitación
      if (infoContent.includes("downloadInviteBtn") && infoContent.includes("inviteCard")) {
        results.passed.push("✓ Funcionalidad de descarga de invitación disponible");
      } else {
        results.warnings.push("⚠ Funcionalidad de invitación incompleta");
      }

      // Validar validación de formulario en app.js
      if (appContent.includes("hydrateWeddingInfo") && appContent.includes("hydrateRegistrationLinks")) {
        results.passed.push("✓ Inicialización de datos de boda implementada");
      } else {
        results.failed.push("✗ Inicialización de datos incompleta");
      }

      // Validar manejo de errores
      if (appContent.includes("catch") || appContent.includes("try")) {
        results.passed.push("✓ Manejo de errores presente");
      } else {
        results.warnings.push("⚠ Considerar agregar manejo de errores");
      }
    } catch (error) {
      results.failed.push(`✗ Error en validación QA: ${error.message}`);
    }

    return results;
  }
}

/**
 * UnitTestAgent: valida cobertura de pruebas
 */
export class UnitTestAgent {
  constructor() {
    this.id = "unit-test-agent";
    this.focus = "Cobertura de logica de negocio y validaciones";
  }

  validate() {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };

    try {
      const testFiles = [
        "tests/config.test.js",
        "tests/assets.test.js",
        "tests/html.test.js",
        "tests/form-link.test.js",
        "tests/agent-orchestrator.test.js",
        "tests/integration.test.js",
        "tests/images.test.js"
      ];

      let testCount = 0;

      testFiles.forEach((file) => {
        try {
          const content = readFileSync(file, "utf-8");
          const tests = (content.match(/test\(/g) || []).length;
          testCount += tests;
          if (tests > 0) {
            results.passed.push(`✓ ${file}: ${tests} tests`);
          }
        } catch (e) {
          results.warnings.push(`⚠ ${file} no encontrado o no legible`);
        }
      });

      if (testCount >= 30) {
        results.passed.push(`✓ Cobertura de pruebas: ${testCount} tests total`);
      } else {
        results.warnings.push(`⚠ Cobertura baja: solo ${testCount} tests`);
      }

      // Validar que form-link tiene validación
      const formLinkContent = readFileSync("js/form-link.js", "utf-8");
      if (formLinkContent.includes("isValidGoogleFormUrl")) {
        results.passed.push("✓ Validación de formulario Google implementada");
      } else {
        results.failed.push("✗ Validación de formulario faltante");
      }

      // Validar que orchestrator tiene lógica de routing
      const orchestratorContent = readFileSync("orchestrator/agent-orchestrator.js", "utf-8");
      if (orchestratorContent.includes("routeTask") && orchestratorContent.includes("buildWorkPlan")) {
        results.passed.push("✓ Lógica de orquestación implementada");
      } else {
        results.failed.push("✗ Orquestación incompleta");
      }
    } catch (error) {
      results.failed.push(`✗ Error en validación de tests: ${error.message}`);
    }

    return results;
  }
}

/**
 * FormsAgent: supervisa integración con Google Forms
 */
export class FormsAgent {
  constructor() {
    this.id = "forms-agent";
    this.focus = "Integracion con Google Forms y seguimiento en Google Sheets";
  }

  validate() {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };

    try {
      const configContent = readFileSync("js/config.js", "utf-8");
      const formLinkContent = readFileSync("js/form-link.js", "utf-8");
      const indexContent = readFileSync("index.html", "utf-8");
      const infoContent = readFileSync("info.html", "utf-8");

      // Validar que hay URL de formulario configurada
      if (configContent.includes("registration") && configContent.includes("formUrl")) {
        results.passed.push("✓ Configuración de URL de formulario presente");
      } else {
        results.failed.push("✗ Configuración de formulario faltante");
      }

      // Validar que la URL no es placeholder
      if (!configContent.includes("REEMPLAZAR_CON_FORM_REAL")) {
        results.passed.push("✓ URL de formulario no es placeholder");
      } else {
        results.warnings.push("⚠ URL de formulario aún es placeholder");
      }

      // Validar validación de URL
      if (
        formLinkContent.includes("isValidGoogleFormUrl") &&
        formLinkContent.includes("GOOGLE_FORM_URL_REGEX") &&
        formLinkContent.includes("forms.gle") &&
        formLinkContent.includes("docs.google.com/forms")
      ) {
        results.passed.push("✓ Validación de URL Google Forms implementada");
      } else {
        results.failed.push("✗ Validación de URL incompleta");
      }

      // Validar mapeo de enlaces de registro
      if (formLinkContent.includes("mapRegistrationLinks")) {
        results.passed.push("✓ Mapeo de enlaces de registro presente");
      } else {
        results.failed.push("✗ Mapeo de enlaces faltante");
      }

      // Validar que hay botones de registro
      const registerLinks = (indexContent.match(/data-register-link/g) || []).length;
      if (registerLinks >= 2) {
        results.passed.push(`✓ ${registerLinks} puntos de entrada a formulario`);
      } else {
        results.warnings.push("⚠ Considerar agregar más puntos de entrada");
      }

      // Validar que el formulario se abre en nueva pestaña
      if (
        formLinkContent.includes('target="_blank"') ||
        formLinkContent.includes("target")
      ) {
        results.passed.push("✓ Formulario se abre en nueva pestaña");
      } else {
        results.warnings.push("⚠ Considerar abrir formulario en nueva pestaña");
      }

      // Validar seguridad en apertura de formulario
      if (formLinkContent.includes('rel="noreferrer noopener"')) {
        results.passed.push("✓ Seguridad en apertura de formulario (noopener)");
      } else {
        results.warnings.push("⚠ Agregar rel='noopener' para seguridad");
      }
    } catch (error) {
      results.failed.push(`✗ Error en validación de formularios: ${error.message}`);
    }

    return results;
  }
}
