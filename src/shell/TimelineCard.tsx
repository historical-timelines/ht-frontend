import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { eventPositionsForSeed } from "./timelineCardStyles";

export function MiniAxis({ positions }: { positions: number[] }) {
  const width = 280;
  const height = 70;
  const midY = 42;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height: 70 }}
    >
      <rect x="14" y="22" width={width / 2 - 24} height="18" rx="4" className="lp-svg-period-1" />
      <rect x={width / 2 + 10} y="22" width={width / 2 - 24} height="18" rx="4" className="lp-svg-period-2" />
      <line x1="10" y1={midY} x2={width - 10} y2={midY} className="lp-svg-axis" />
      {[0, 0.5, 1].map((t, i) => {
        const x = 10 + (width - 20) * t;
        return (
          <line key={i} x1={x} y1={midY - 4} x2={x} y2={midY + 4} className="lp-svg-tick" />
        );
      })}
      {positions.map((p, i) => {
        const x = 10 + (width - 20) * p;
        return (
          <circle
            key={i}
            cx={x}
            cy={midY}
            r="4"
            className={i % 3 === 0 ? "lp-svg-event-secondary" : "lp-svg-event"}
          />
        );
      })}
    </svg>
  );
}

export type TimelineCardProps = {
  href: string;
  seed: string;
  title: string;
  description?: string | null;
  category?: string;
  yearRange?: string;
  footer?: ReactNode;
};

export function TimelineCard({
  href,
  seed,
  title,
  description,
  category,
  yearRange,
  footer,
}: TimelineCardProps) {
  const positions = eventPositionsForSeed(seed, 6);
  return (
    <Link to={href} className="lp-timeline-card-link">
      <Card className="lp-timeline-card-interactive h-full overflow-hidden gap-0 py-0 rounded-xl">
        <div className="bg-background border-b border-border px-2 pt-2 pb-1.5">
          <MiniAxis positions={positions} />
        </div>
        <div className="flex flex-col gap-[0.45rem] px-5 py-4">
          {category && (
            <Badge variant="secondary" className="self-start text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              {category}
            </Badge>
          )}
          {yearRange && (
            <span className="font-serif font-semibold text-[0.95rem] text-primary tracking-tight">
              {yearRange}
            </span>
          )}
          <h3 className="font-serif font-semibold text-[1.15rem] text-foreground leading-tight m-0">
            {title}
          </h3>
          {description && (
            <p className="text-[0.875rem] text-muted-foreground leading-[1.55] m-0 line-clamp-3">
              {description}
            </p>
          )}
        </div>
        {footer}
      </Card>
    </Link>
  );
}
