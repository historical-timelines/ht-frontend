import type { CSSProperties, RefObject } from "react";
import type { TimelineEvent } from "../types";
import {
  type EventLabelPlacement,
  verticalReadSlotHeightPx,
} from "./timeline/eventLabelLayout";

export type EventTitleMarkerProps = {
  event: TimelineEvent;
  placement: EventLabelPlacement;
  leftPct: number;
  layoutLaneY: number;
  labelsVertical: boolean;
  isEventActive: boolean;
  isRelated: boolean;
  lanesMuted: boolean;
  eventPointerTitle: (e: TimelineEvent) => string;
  onSelectEvent: (e: TimelineEvent) => void;
  timelineSelectedEventDotRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Bola de evento + título (horizontal o columna con `.event-label-vrot-*` en
 * [`App.css`](./App.css)). En vertical, `maxWidthPx` = eje de lectura, `columnPx` = grosor;
 * `verticalReadSlotHeightPx` unifica alto del wrap. El ancla del DOM sigue 0×0 + abs; alinear
 * título/disco a la pista pasa por CSS (center en `.event-hit` + sizer/verticalEventTitlesRowLayoutPx).
 */
export function EventTitleMarker({
  event,
  placement: pl,
  leftPct: p,
  layoutLaneY,
  labelsVertical,
  isEventActive,
  isRelated,
  lanesMuted,
  eventPointerTitle,
  onSelectEvent,
  timelineSelectedEventDotRef,
}: EventTitleMarkerProps) {
  const labelStyle = {
    maxWidth: `${Math.round(pl.maxWidthPx)}px`,
  } as CSSProperties;
  /** Caja: eje de lectura = alto (`verticalReadSlotHeightPx`); eje pista = ancho (`columnPx`). */
  const verticalSlotStyle = {
    ...(pl.columnPx != null
      ? { width: `${Math.round(pl.columnPx)}px` }
      : {}),
    height: `${Math.round(verticalReadSlotHeightPx(pl.maxWidthPx))}px`,
  } as CSSProperties;

  return (
    <div
      className={`event-marker ${isEventActive ? "event-marker--selected" : ""}${isRelated ? " event-marker--related" : ""}${lanesMuted ? " event-marker--lanes-muted" : ""}`.trim()}
      style={
        {
          left: `${p}%`,
          "--event-label-lane": layoutLaneY,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className={`event-hit event-hit--${pl.anchor}`}
        ref={(el) => {
          if (isEventActive) {
            timelineSelectedEventDotRef.current = el;
          } else if (timelineSelectedEventDotRef.current === el) {
            timelineSelectedEventDotRef.current = null;
          }
        }}
        onClick={() => onSelectEvent(event)}
        title={eventPointerTitle(event)}
      >
        <span
          className={`event-dot event-dot--titles ${isEventActive ? "active" : ""}`}
          aria-hidden="true"
        />
        {labelsVertical ? (
          <span className="event-label-vrot-wrap" style={verticalSlotStyle}>
            <span
              className="event-label-h timeline-event-title event-label-vrot-slab"
              style={labelStyle}
            >
              {event.title}
            </span>
          </span>
        ) : (
          <span className="event-label-h timeline-event-title" style={labelStyle}>
            {event.title}
          </span>
        )}
      </button>
    </div>
  );
}
