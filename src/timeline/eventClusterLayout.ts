import type { TimelineEvent } from "../../types";
import type { EventLabelPlacement } from "./eventLabelLayout";
import { readRootRemPx, verticalColumnWidthPx } from "./eventLabelLayout";

const DISPLACED_EVENT_GAP_PX = 4;
const DISPLACEMENT_CONNECTOR_MIN_PX = 1;

export interface DisplacedEventPlacement {
  event: TimelineEvent;
  datePct: number;
  displayPct: number;
  offsetPx: number;
  needsConnector: boolean;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Coloca eventos visualmente separados cuando sus columnas verticales se pisan.
 * La fecha real queda en `datePct`; `displayPct` es solo la posición de lectura.
 */
export function layoutDisplacedEventPlacements(
  eventsSorted: TimelineEvent[],
  placements: EventLabelPlacement[],
  trackPct: (ms: number) => number,
  stackWidthPx: number
): DisplacedEventPlacement[] {
  if (eventsSorted.length === 0) return [];

  const safeStackWidthPx = stackWidthPx > 0 ? stackWidthPx : 520;
  const columnPx =
    placements[0]?.columnPx ?? verticalColumnWidthPx(false, readRootRemPx());
  const separationPct = ((columnPx + DISPLACED_EVENT_GAP_PX) / safeStackWidthPx) * 100;

  type Item = { event: TimelineEvent; index: number; datePct: number };
  const items: Item[] = eventsSorted.map((event, index) => ({
    event,
    index,
    datePct: trackPct(event.date.getTime()),
  }));

  const groups: Item[][] = [];
  let current: Item[] = [items[0]!];
  for (let i = 1; i < items.length; i++) {
    const item = items[i]!;
    const last = current[current.length - 1]!;
    if (item.datePct - last.datePct < separationPct) {
      current.push(item);
    } else {
      groups.push(current);
      current = [item];
    }
  }
  groups.push(current);

  const out: DisplacedEventPlacement[] = eventsSorted.map((event) => ({
    event,
    datePct: trackPct(event.date.getTime()),
    displayPct: trackPct(event.date.getTime()),
    offsetPx: 0,
    needsConnector: false,
  }));

  for (const group of groups) {
    if (group.length === 1) continue;

    const minDatePct = group[0]!.datePct;
    const maxDatePct = group[group.length - 1]!.datePct;
    const centerPct = (minDatePct + maxDatePct) / 2;
    const effectiveSeparationPct =
      group.length > 1 ? Math.min(separationPct, 100 / (group.length - 1)) : 0;
    const displaySpanPct = effectiveSeparationPct * (group.length - 1);
    const startPct = clamp(centerPct - displaySpanPct / 2, 0, 100 - displaySpanPct);

    for (let i = 0; i < group.length; i++) {
      const item = group[i]!;
      const displayPct = startPct + i * effectiveSeparationPct;
      const offsetPx = ((displayPct - item.datePct) / 100) * safeStackWidthPx;
      out[item.index] = {
        event: item.event,
        datePct: item.datePct,
        displayPct,
        offsetPx,
        needsConnector: Math.abs(offsetPx) >= DISPLACEMENT_CONNECTOR_MIN_PX,
      };
    }
  }

  return out;
}

export function minEventSeparationPct(
  eventsSorted: TimelineEvent[],
  trackPct: (ms: number) => number
): number | null {
  let minDiff = Infinity;
  let prevPct: number | null = null;
  for (const event of eventsSorted) {
    const pct = trackPct(event.date.getTime());
    if (prevPct != null) {
      const diff = pct - prevPct;
      if (diff > 0) minDiff = Math.min(minDiff, diff);
    }
    prevPct = pct;
  }
  return Number.isFinite(minDiff) ? minDiff : null;
}
