# Feature spec: timeline layout and tests (greenfield)

<!--
  Implementación de referencia de `TEMPLATE.SPEC.md` (contenido del eje, etiquetas, pruebas).
  Spec hermano: `VIEWER_LAYOUT.SPEC.md`.
-->

## Purpose

Describir el **“sandwich”** del timeline (ticks de fecha, eje, carriles semánticos, marcadores de evento, conectores), el **contrato único tiempo → posición**, y cómo **verificar** solapes y alineación. El código nuevo de layout debe obedecer esto; no acoplarse a nombres de archivos heredados.

## Scope

**In scope:** Dominio temporal `[minMs, maxMs]`, posición horizontal `0..100%`, empaquetado de etiquetas (horizontal vs vertical según solape), marcas de eje, posiciones en carriles semánticos, geometría de conectores, y pruebas automáticas de reglas **puras** (intervalos, carriles, elección de modo).

**Out of scope:** Grid del viewport, qué nodos hacen scroll, emparejamiento de overflow; ver [`VIEWER_LAYOUT.SPEC.md`](./VIEWER_LAYOUT.SPEC.md). Los cambios de altura del timeline deben seguir cumpliendo el spec del visor.

## Behavior

### Pila visual (arriba → abajo, dentro de la pista)

1. **Ticks de fecha** — instantes (fechas de evento + inicio/fin de período): año, mes/día; **carriles** extra cuando las etiquetas solaparían en una fila.
2. **Eje** — **bandas** por década (relleno alternado), **micro-marcas** anuales, **número de década** centrado en la banda si hay ancho suficiente (si no, ocultar).
3. **Carriles semánticos** — una fila por categoría (p. ej. político, militar, económico, social); marcas en la fila = el evento participa en esa categoría en esa fecha.
4. **Fila de eventos** — disco + **título**; títulos **horizontales** o **verticales** (rotados) según **densidad / solape** y espacio **medido**, no solo un breakpoint fijo.

**Conectores:** línea **punteada vertical** desde el **evento (abajo)** hacia **ticks/eje**; **marca en la línea** donde cruza una **fila semántica** a la que el evento pertenece.

```text
| date ticks (stacked)     |
| axis: bands / years / #  |
| semantic lanes  ·o··o·   |
| disc + title  (H | V)    |
      ·  connector  ·
```

**Modo de etiquetas:** elegir horizontal vs vertical según qué disposición **reduzca** el solape a `stackWidthPx` (y altura de slot en vertical) actuales, no por zoom aislado.

## Constraints and invariants

- **Un solo mapa:** todas las capas usan el mismo dominio y `pctOnTrack(t)` en `0..100` (o un `TrackPct` único en un módulo). Nada de escalas duplicadas o que diverjan.
- **Solape:** un predicado de intervalos en % (más hueco) para etiquetas de **fecha** y para títulos de **evento** donde aplique. En vertical: cajas **2D** en pista × profundidad con desplazamiento por carril; tras colocar, **sin intersección** de pares (más hueco).
- **Conectores:** comparten ancla **horizontal** con el marcador del evento; la geometría debe cuadrar con el centro del disco y la altura de fila sin romper [`VIEWER_LAYOUT.SPEC.md`](./VIEWER_LAYOUT.SPEC.md).

```ts
type Pct = number; // 0..100

/** Cada marca, tick y ancla de etiqueta usa esto. */
type TrackPct = (tMs: number) => Pct;

type Interval = readonly [lo: Pct, hi: Pct];

function overlaps(
  a: Interval,
  b: Interval,
  gapPct: number
): boolean {
  return a[0] < b[1] + gapPct && a[1] > b[0] - gapPct;
}

// Títulos verticales: cajas 2D, desplazamiento por carril, luego no intersección por pares.
```

## Testing and verification

- **Unitario:** solo funciones puras (intervalos, asignación de carriles, modo de etiquetas, reglas de fusión de marcas); el modelo de salida no debe tener pares solapados ilegales.
- **Integración (acotada):** montar el timeline (o fixture) con ancho **fijo** y comprobar que la salida del layout no tiene solapes prohibidos; mockear `ResizeObserver` si hace falta.
- **TDD / baseline:** commitear una **línea base** antes de añadir tests que deban fallar; luego implementar hasta verde.
- **Cruce con el visor:** si cambia altura de fila u `overflow` de contenedores con scroll, revisar de nuevo [`VIEWER_LAYOUT.SPEC.md`](./VIEWER_LAYOUT.SPEC.md).

## Related

- Spec hermano (viewport, grid, overflow): [`VIEWER_LAYOUT.SPEC.md`](./VIEWER_LAYOUT.SPEC.md)
- Plantilla: [`TEMPLATE.SPEC.md`](./TEMPLATE.SPEC.md)
- [`AGENTS.md`](../AGENTS.md)
- Cursor: [`.cursor/rules/viewer-layout.mdc`](../.cursor/rules/viewer-layout.mdc)

---

## Optional sections

### Implementation order (suggested)

0. Commitear baseline; añadir tests en rojo.  
1. Motor de layout: marcas de eje + títulos + posiciones semánticas sobre `TrackPct` compartido y helpers de solape.  
2. Títulos horizontal vs vertical según solape **medido**, no un flag de zoom arbitrario.  
3. Conectores y alturas de fila según geometría real de etiqueta + carril.  
4. Extraer un componente de vista del timeline del shell de la app.  
5. Arnés de pruebas de integración (p. ej. Vitest + DOM + ancho fijo).
