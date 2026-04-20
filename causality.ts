import type { TimelineEvent } from "./types";

export type StudyMode = "normal" | "exam" | "causal";

/** Primer evento por título exacto (los datos deben tener títulos únicos para enlaces). */
export function eventByTitleMap(
  events: readonly TimelineEvent[]
): Map<string, TimelineEvent> {
  const m = new Map<string, TimelineEvent>();
  for (const e of events) {
    if (!m.has(e.title)) m.set(e.title, e);
  }
  return m;
}

/**
 * Conjunto de eventos a resaltar por relación causal respecto a la selección.
 * - `causal`: cadena transitiva (causas al origen + consecuencias hacia adelante).
 * - `normal` / `exam`: solo vecinos directos por `causes` / `consequences`.
 */
export function causalHighlightSet(
  selected: TimelineEvent | null,
  byTitle: Map<string, TimelineEvent>,
  mode: StudyMode
): Set<TimelineEvent> {
  const out = new Set<TimelineEvent>();
  if (!selected) return out;

  if (mode === "causal") {
    const visitUp = (ev: TimelineEvent) => {
      for (const t of ev.causes ?? []) {
        const c = byTitle.get(t);
        if (c && !out.has(c)) {
          out.add(c);
          visitUp(c);
        }
      }
    };
    const visitDown = (ev: TimelineEvent) => {
      for (const t of ev.consequences ?? []) {
        const c = byTitle.get(t);
        if (c && !out.has(c)) {
          out.add(c);
          visitDown(c);
        }
      }
    };
    visitUp(selected);
    visitDown(selected);
    return out;
  }

  for (const t of selected.causes ?? []) {
    const c = byTitle.get(t);
    if (c) out.add(c);
  }
  for (const t of selected.consequences ?? []) {
    const c = byTitle.get(t);
    if (c) out.add(c);
  }
  return out;
}

/** Aristas dirigidas (causa → efecto) entre miembros del conjunto resaltado. */
export function causalEdgesInSet(
  highlight: ReadonlySet<TimelineEvent>,
  byTitle: Map<string, TimelineEvent>
): Array<{ from: TimelineEvent; to: TimelineEvent }> {
  const edges: Array<{ from: TimelineEvent; to: TimelineEvent }> = [];
  for (const e of highlight) {
    for (const t of e.consequences ?? []) {
      const c = byTitle.get(t);
      if (c && highlight.has(c)) edges.push({ from: e, to: c });
    }
  }
  return edges;
}
