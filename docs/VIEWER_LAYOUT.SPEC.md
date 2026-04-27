# Feature spec: viewer layout (timeline mode)

<!--
  Implementación de referencia de `TEMPLATE.SPEC.md` (visor: viewport, grid, overflow).
  Spec hermano: `TIMELINE_LAYOUT.SPEC.md`.
-->

## Purpose

Definir cómo la app ocupa el **viewport** en modo visor / timeline (`viewer-phase` en `html`): sin scroll vertical del **documento**, reparto fijo entre región **superior** (chart + timeline) e **inferior** (listas + detalle), y dónde está permitido el scroll vertical. Leer antes de tocar la estructura de contenedores o el CSS del visor.

## Scope

**In scope:** Altura y `overflow` de `html`, `body`, `#root`; `.viewer-shell`, grid `.viewer-main`, `.viewer-chart-wrap`, bleed del chart en visor, emparejamiento de `overflow` en `.timeline-scroll`; `ViewerLower` y scroll interno. Hojas de estilo: `App.css`, `ViewerLower.css`, `index.css` bajo `viewer-phase`.

**Out of scope:** Cómo se **calculan** fechas, títulos de eventos o marcas del eje; eso va en [`TIMELINE_LAYOUT.SPEC.md`](./TIMELINE_LAYOUT.SPEC.md). Cualquier cambio de **altura** del timeline (etiquetas, carriles del eje) debe seguir respetando este documento.

## Behavior

### Objetivo

- La app usa la altura del **viewport** (p. ej. `100dvh`); el **documento** no debe crecer como una página larga con scroll global.
- El espacio vertical se divide en dos regiones: **superior** (timeline) e **inferior** (listas + detalle).

### Región superior (timeline)

**Contenedores (de afuera hacia adentro):** `.viewer-chart-wrap` → `<section class="chart chart-bleed chart--viewer">` → `.timeline-scroll` → `.timeline-stack`.

- La fila del timeline tiene **la altura que pide su contenido** (marcas del eje apiladas, barras de período, carriles semánticos, fila de títulos, controles en flujo cuando no van en overlay).
- **No** debe forzar un scroll **vertical** propio que recorte todo el chart (`max-height` + `overflow-y: auto` en el wrap) salvo decisión explícita de producto.
- El **pan/scroll horizontal** del eje vive en `.timeline-scroll`.

En CSS, la fila 1 de `.viewer-main` es `auto`: altura según contenido del timeline, no un `vh` fijo que obligue scroll vertical interno en el chart.

### Región inferior

**Componente:** `ViewerLower` (`.viewer-lower`).

- Ocupa el espacio **restante** bajo la región superior (`minmax(0, 1fr)` en el grid).
- **Desktop:** dos columnas (listas, detalle). **Estrecho:** apilado; detalle en `ViewerLower.css`.
- El scroll **vertical** solo **dentro** de listas/detalle, no en el documento ni en el shell entero.

### Cadena de layout (referencia)

| Capa | Rol |
|------|-----|
| `html.viewer-phase`, `body`, `#root` | Acotados al viewport; evitar scroll del documento. |
| `.app--viewer` | Columna flex bajo `#root`. |
| `.viewer-shell` | Columna principal; no scroll de “página entera”. |
| `.viewer-main` | Grid: fila 1 `auto` (timeline), fila 2 `minmax(0,1fr)` (inferior). `min-height: 0` / `overflow: hidden` para que el `1fr` tenga altura definida. |
| `.viewer-chart-wrap` | Fila 1; alineación acorde al contenido. |
| `.viewer-lower` | Fila 2; `min-height: 0` para scroll en hijos. |

### Caso límite (timeline muy alto)

Si la altura intrínseca del timeline supera el viewport menos cabecera, un viewport fijo sin scroll global no puede mostrar todo sin tradeoffs (recorte, mover scroll, o reducir densidad de UI). El diseño actual asume tamaño típico; el producto puede decidir overflow o compactación explícitos más adelante.

## Constraints and invariants

- **No** `max-height` + `overflow-y: auto` en `.viewer-chart-wrap` sin decisión explícita de producto (rompe el contrato de la región superior).
- **No** `overflow-y: auto` en `.viewer-shell` para “arreglar” el layout (convierte todo el visor en scroll de página).
- **Bleed del chart:** `.chart.chart-bleed.chart--viewer` → `width: 100%`, `margin: 0` (no bleed `100vw` del `.chart-bleed` genérico) para no desbordar ni sumar scroll horizontal raro.
- **`html.viewer-phase` y `body`:** fijar también `min-height: 100dvh` donde se use `height: 100dvh`; el `min-height: 100vh` global del `body` puede superar `100dvh` y generar unos px de scroll del documento.
- **Overflow por nodo (Chromium):** no emparejar `overflow-x: hidden|auto|scroll` con `overflow-y: visible` en el **mismo** nodo; el motor trata `y` como `auto` y aparece barra vertical espuria (thumb casi a toda la altura). Zonas: `section.chart.chart-bleed.chart--viewer`, `.viewer-chart-wrap`, `.timeline-scroll` (eje horizontal → `overflow-y: clip` o `hidden`, no `visible`).
- El **scroll horizontal** intencional en `.timeline-scroll` es correcto; el fallo es el **emparejamiento** de ejes, no `overflow-x: auto`. Puede haber scroll vertical **dentro** de `.timeline-scroll` si el stack es alto; no es scroll del documento. El modo títulos verticales puede resetear `scrollTop` para no dejar la vista pegada al fondo del stack.

### Pitfalls (no regresar)

1. **overflow-x no `visible` + overflow-y `visible`** en un solo nodo → barra vertical fantasma (thumb enorme). Nodos ya ajustados: sección chart, `.viewer-chart-wrap`, `.timeline-scroll`.
2. **`min-height: 100vh` vs `height: 100dvh`** en `body` en modo visor → alinear con `min-height: 100dvh` donde el shell use `dvh`.
3. **Bleed `100vw`** dentro del visor → más ancho que el área útil.
4. **Scroll en `.viewer-shell`** → scroll de toda la UI; invalida el modelo de dos regiones.
5. **`max-height` + scroll interno en `.viewer-chart-wrap`** → timeline recortado; contradice fila `auto`.

## Testing and verification

Tras cambios de layout/CSS, comprobar manualmente:

1. **No** barra de scroll vertical del **documento** en modo visor.
2. **No** barra vertical “rara” en el borde del chart / wrap / `timeline-scroll` (thumb ~toda la altura).
3. Con y **sin** ítem seleccionado; chrome del timeline **expandido** y **colapsado**.
4. Viewport **estrecho** y **ancho**; **Chrome** y **Firefox** si se puede.
5. Si se toca `overflow` en un nodo, revisar de nuevo la regla de **emparejamiento** de overflow arriba.

## Related

- Spec hermano (timeline, etiquetas, tests): [`TIMELINE_LAYOUT.SPEC.md`](./TIMELINE_LAYOUT.SPEC.md)
- Plantilla: [`TEMPLATE.SPEC.md`](./TEMPLATE.SPEC.md)
- [`AGENTS.md`](../AGENTS.md)
- Cursor: [`.cursor/rules/viewer-layout.mdc`](../.cursor/rules/viewer-layout.mdc)
