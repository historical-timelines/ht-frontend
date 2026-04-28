import type { CSSProperties, RefObject } from "react";
import type { TimelineEvent } from "../../../types";
import type { EventLabelPlacement } from "../eventLabelLayout";

export type EventTitleMarkerProps = {
  event: TimelineEvent;
  placement: EventLabelPlacement;
  leftPct: number;
  layoutLaneY: number;
  isEventActive: boolean;
  isRelated: boolean;
  lanesMuted: boolean;
  eventPointerTitle: (e: TimelineEvent) => string;
  onSelectEvent: (e: TimelineEvent) => void;
  timelineSelectedEventDotRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Solo modo horizontal: bola + etiqueta lateral. Para vertical ver [`EventTitleMarkerVertical`](./EventTitleMarkerVertical.tsx).
 */
export function EventTitleMarker({
  event,
  placement: pl,
  leftPct: p,
  layoutLaneY,
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
        <span className="event-label-h timeline-event-title" style={labelStyle}>
          {event.title}
        </span>
      </button>
    </div>
  );
}
