/**
 * Agregado timeline: layout de etiquetas (`eventLabelLayout`) + piezas de UI de la pista.
 * Importá desde aquí en lugar de rutas internas (`timeline/ui/...`, `eventLabelLayout` directo).
 */
export * from "./eventLabelLayout";
export {
  LaneGlyph,
  TimelineEventTitlesLane,
  TimelineSemanticEventLanes,
} from "./ui";
export type {
  TimelineEventTitlesLaneProps,
  TimelineCausalitySvgEdge,
  TimelineSemanticEventLanesProps,
} from "./ui";
