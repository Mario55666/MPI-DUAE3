# Líneas de Investigación e Innovación Tecnológica — IDC 2026

Single-Page Application institucional del **Instituto de Educación Superior Público
"Diseño & Comunicación" (IDC)** para su Plan de Investigación e Innovación
Tecnológica 2026. Sirve a estudiantes y docentes de 4 carreras (Diseño de
Interiores, Publicidad, Modas, Comunicación Audiovisual).

Rediseño basado en el superprompt `IDC-2026-INV`: se conservó el 100 % de la
información estructural, metodológica y de datos del documento original, y se
reorganizó el código monolítico (un solo HTML de 1.4 MB) en una arquitectura
multi-archivo mantenible.

## Estructura del proyecto

```
lineas-investigacion-idc-2026/
├── index.html              Documento principal SPA (HTML semántico + ARIA)
├── styles.css              Sistema de diseño IDC completo (custom properties)
├── app.js                  Lógica de interacción (3 bloques, ver abajo)
├── assets/
│   ├── logo-idc.jpg        Logo institucional (antes: base64 repetido 3 veces)
│   ├── favicon.svg         Favicon SVG con colores corporativos
│   └── wgen-templates.js   Plantillas Word (.docx en base64) del generador WGEN
└── README.md
```

### Cómo servir la página

Los assets se cargan por rutas relativas, así que basta cualquier servidor
estático desde esta carpeta:

```bash
python3 -m http.server 8000
# → http://localhost:8000/index.html
```

Abrir `index.html` directamente con `file://` también funciona (el logo tiene
fallback SVG en texto si la imagen no carga).

## Arquitectura de `app.js`

El archivo concatena los tres bloques de script originales, en orden:

1. **Núcleo de navegación/UI** — inyección de logo, scroll-progress,
   dropdown "Marco Académico", indicador de sección (ancla ACT-R), tooltips
   del Gantt, panel de detalle lateral, tabs, acordeones, toasts,
   IntersectionObserver para reveal-on-scroll, tutorial modal ABPP.
2. **`window.VR`** — mini-app "Proyecto Autofinanciado": calculadora de
   presupuesto, simulador de rentabilidad, conversor de divisas (SUNAT/BCRP),
   formulario de inscripción, cronograma de fechas y generador de documentos
   Word (WGEN). Requiere que `assets/wgen-templates.js` (global
   `DOCX_TEMPLATES`) esté cargado antes — `index.html` ya lo hace.
3. **Modo páginas (`pg-mode`)** — convierte el menú superior en pestañas que
   muestran una pantalla a la vez (chunking Miller 7±2, sin scroll infinito).

## Sistema de diseño (resumen)

| Token | Valor | Uso |
|---|---|---|
| `--idc-blue` | `#0072b9` | Estructura, navegación, confianza |
| `--idc-orange` | `#f3a100` | Acciones, alertas, destacados |
| `--c-accent1..4` | azul / naranja / `#00a0c6` / `#2ecc71` | Interiores / Publicidad / Modas / CAV |
| `--c-trans` | `#8e44ad` | Líneas transversales |
| Display | Playfair Display | Títulos y números destacados |
| Body | Nunito | Cuerpo, UI, etiquetas |

Única dependencia externa: Google Fonts (con fallback a Georgia/system-ui si
no hay red).

## Accesibilidad y performance

- WCAG 2.1 AA: skip-link, focus-visible, roles ARIA, `aria-live`, contraste
  ≥ 4.5:1, touch targets ≥ 44 px en dispositivos táctiles.
- `prefers-reduced-motion`: desactiva animaciones y scroll suave.
- `loading="lazy"` en imágenes bajo el pliegue; el logo pasó de estar
  embebido 3 veces en base64 (~600 KB de HTML) a un solo archivo cacheable.
- SEO: meta description, Open Graph, JSON-LD (`EducationalOrganization`).

## Cómo actualizar contenido

- **Líneas de investigación / temas / bibliografía**: editar las secciones
  correspondientes de `index.html` (cada `<section>` tiene `id` y
  `aria-labelledby` descriptivos, p. ej. `#areas-section`, `#bib-section`).
- **Datos de la mini-app** (montos, tasas, fases): constantes al inicio del
  bloque `window.VR` en `app.js`.
- **Plantillas Word**: reemplazar el base64 del `.docx` correspondiente en
  `assets/wgen-templates.js` (claves `pub`, `int`, `mod`, `cav`; el campo
  `fname` define el nombre de descarga).
- **Colores/tipografía**: custom properties en `:root` de `styles.css`.

## Fuente

Documento institucional **IDC-2026-INV** — Unidad de Investigación, IDC.
