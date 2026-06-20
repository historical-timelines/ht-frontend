// SVG paint classes used by MiniAxis/TimelineCard — shared across Landing and Listado
// so both render the same visual identity without duplicating this block.
export const TIMELINE_CARD_STYLES = `
  .lp-timeline-card-link { display: block; text-decoration: none; color: inherit; height: 100%; }
  .lp-timeline-card-interactive {
    transition: transform 0.16s ease, box-shadow 0.18s ease, border-color 0.16s ease;
  }
  .lp-timeline-card-link:hover .lp-timeline-card-interactive {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px color-mix(in srgb, var(--accent) 14%, transparent);
    border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  }

  .lp-svg-period-1 { fill: #6f826d; fill-opacity: 0.18; }
  .lp-svg-period-2 { fill: #9d8258; fill-opacity: 0.18; }
  .lp-svg-period-label { font-family: Inter, system-ui, sans-serif; font-size: 8px; font-weight: 600; }
  .lp-svg-period-1-text { fill: #6f826d; }
  .lp-svg-period-2-text { fill: #9d8258; }
  .lp-svg-year-label { font-family: Inter, system-ui, sans-serif; font-size: 8px; fill: #627083; }
  .lp-svg-axis { stroke: #163457; stroke-opacity: 0.25; stroke-width: 2; }
  .lp-svg-tick { stroke: #163457; stroke-opacity: 0.3; stroke-width: 1.5; }
  .lp-svg-event { fill: #a7792d; }
  .lp-svg-event-secondary { fill: #163457; fill-opacity: 0.55; }

  @media (prefers-color-scheme: dark) {
    .lp-svg-axis { stroke: #e3bd73; }
    .lp-svg-tick { stroke: #e3bd73; }
    .lp-svg-event { fill: #d5a74c; }
    .lp-svg-event-secondary { fill: #e3bd73; fill-opacity: 0.5; }
    .lp-svg-period-1 { fill: #5f735f; }
    .lp-svg-period-2 { fill: #9b7544; }
    .lp-svg-period-1-text { fill: #7a9478; }
    .lp-svg-period-2-text { fill: #b08a5a; }
    .lp-svg-year-label { fill: #b9ad97; }
  }
  html[data-theme="dark"] {
    .lp-svg-axis { stroke: #e3bd73; }
    .lp-svg-tick { stroke: #e3bd73; }
    .lp-svg-event { fill: #d5a74c; }
    .lp-svg-event-secondary { fill: #e3bd73; fill-opacity: 0.5; }
    .lp-svg-period-1 { fill: #5f735f; }
    .lp-svg-period-2 { fill: #9b7544; }
    .lp-svg-period-1-text { fill: #7a9478; }
    .lp-svg-period-2-text { fill: #b08a5a; }
    .lp-svg-year-label { fill: #b9ad97; }
  }
`;

export function eventPositionsForSeed(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  let state = Math.abs(h) || 1;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    state = (state * 9301 + 49297) % 233280;
    out.push(0.08 + (state / 233280) * 0.84);
  }
  return out.sort((a, b) => a - b);
}
