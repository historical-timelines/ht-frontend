/**
 * Componentes internos del timeline expuestos solo vía `../index.ts`.
 * Los marcadores de título son detalle de implementación de la pista de títulos.
 */
export { LaneGlyph } from "./LaneGlyph";
export { TimelineEventTitlesLane } from "./TimelineEventTitlesLane";
export type {
  TimelineEventTitlesLaneProps,
  TimelineCausalitySvgEdge,
} from "./TimelineEventTitlesLane";
export { TimelineSemanticEventLanes } from "./TimelineSemanticEventLanes";
export type { TimelineSemanticEventLanesProps } from "./TimelineSemanticEventLanes";
