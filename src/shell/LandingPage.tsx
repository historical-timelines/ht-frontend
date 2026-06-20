import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "./AppNavbar";
import { FEATURED_TIMELINES } from "./featuredTimelines";
import { SITE_INSTAGRAM_URL } from "./siteLinks";
import { TimelineCard } from "./TimelineCard";
import { TIMELINE_CARD_STYLES } from "./timelineCardStyles";

// SVG paint classes and pseudo-element effects that can't be expressed as Tailwind utilities
const LANDING_STYLES = `
  .lp-hero-bg { position: relative; overflow: hidden; }
  .lp-hero-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/picturefondo.png');
    background-size: 145%;
    background-position: center 38%;
    filter: sepia(0.55) brightness(0.55) saturate(0.65);
    z-index: 0;
  }
  .lp-hero-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(247, 240, 227, 0.84);
    z-index: 1;
  }
  @media (prefers-color-scheme: dark) {
    .lp-hero-bg::after { background: rgba(7, 17, 31, 0.86); }
  }
  html[data-theme="dark"] .lp-hero-bg::after { background: rgba(7, 17, 31, 0.86); }

  .lp-hero-illus-wrap { position: relative; }
  .lp-hero-illus-wrap::before {
    content: '';
    position: absolute;
    inset: -10%;
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    mask-image: radial-gradient(ellipse 82% 78% at 50% 52%, black 15%, transparent 68%);
    -webkit-mask-image: radial-gradient(ellipse 82% 78% at 50% 52%, black 15%, transparent 68%);
    z-index: 0;
    pointer-events: none;
  }
  .lp-hero-svg {
    display: block;
    width: 100%;
    height: auto;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 4px 24px color-mix(in srgb, var(--accent) 12%, transparent));
  }

  .lp-svg-period-label { font-family: Inter, system-ui, sans-serif; font-size: 8px; font-weight: 600; }
  .lp-svg-period-1-text { fill: #6f826d; }
  .lp-svg-period-2-text { fill: #9d8258; }
  .lp-svg-year-label { font-family: Inter, system-ui, sans-serif; font-size: 8px; fill: #627083; }
  .lp-svg-causal-arc { stroke: #a7792d; stroke-opacity: 0.5; stroke-width: 1.5; stroke-dasharray: 5 3; }
  .lp-svg-causal-arrow { fill: #a7792d; fill-opacity: 0.5; }
  .lp-svg-tooltip { fill: #fff8ec; stroke: #d4c6ad; stroke-width: 1; }
  .lp-svg-tooltip-line { stroke: #d4c6ad; stroke-width: 1; }
  .lp-svg-tooltip-title { font-family: Inter, system-ui, sans-serif; font-size: 9px; font-weight: 600; fill: #163457; }
  .lp-svg-tooltip-sub { font-family: Inter, system-ui, sans-serif; font-size: 8px; fill: #627083; }

  @media (prefers-color-scheme: dark) {
    .lp-svg-period-1-text { fill: #7a9478; }
    .lp-svg-period-2-text { fill: #b08a5a; }
    .lp-svg-year-label { fill: #b9ad97; }
    .lp-svg-causal-arc { stroke: #d5a74c; }
    .lp-svg-causal-arrow { fill: #d5a74c; }
    .lp-svg-tooltip { fill: #111d2c; stroke: #304054; }
    .lp-svg-tooltip-line { stroke: #304054; }
    .lp-svg-tooltip-title { fill: #f4ead7; }
    .lp-svg-tooltip-sub { fill: #b9ad97; }
  }
  html[data-theme="dark"] {
    .lp-svg-period-1-text { fill: #7a9478; }
    .lp-svg-period-2-text { fill: #b08a5a; }
    .lp-svg-year-label { fill: #b9ad97; }
    .lp-svg-causal-arc { stroke: #d5a74c; }
    .lp-svg-causal-arrow { fill: #d5a74c; }
    .lp-svg-tooltip { fill: #111d2c; stroke: #304054; }
    .lp-svg-tooltip-line { stroke: #304054; }
    .lp-svg-tooltip-title { fill: #f4ead7; }
    .lp-svg-tooltip-sub { fill: #b9ad97; }
  }
`;

export function LandingPage() {
  return (
    <>
      <style>{TIMELINE_CARD_STYLES}</style>
      <style>{LANDING_STYLES}</style>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <AppNavbar
          action={
            <Button asChild size="sm">
              <Link to="/app">Ingresar</Link>
            </Button>
          }
        />
        <LandingHero />
        <FeaturedTimelinesSection />
        <HowItWorksSection />
        <ClosingBand />
        <LandingFooter />
      </div>
    </>
  );
}

function LandingHero() {
  return (
    <div className="lp-hero-bg">
      <section className="relative z-[2] flex flex-col md:flex-row items-center gap-8 md:gap-14 px-4 md:px-8 py-16 md:py-20 max-w-[1100px] mx-auto">
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h1
            className="font-serif font-bold leading-[1.1] tracking-tight text-primary mb-5"
            style={{ fontSize: "clamp(2.2rem, 3.5vw + 1rem, 3.8rem)" }}
          >
            Líneas del tiempo
            <br />
            para estudiar historia
          </h1>
          <p
            className="text-muted-foreground leading-relaxed mb-8 max-w-[44ch] mx-auto md:mx-0"
            style={{ fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.15rem)" }}
          >
            Una plataforma educativa abierta. Estudiá períodos históricos sobre
            un eje interactivo, comparando eventos, relaciones causales y
            contexto.
          </p>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
            <Button asChild size="lg">
              <a href="#lineas-del-tiempo">Explorar las líneas del tiempo</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#como-se-usa">Cómo se usa</a>
            </Button>
          </div>
        </div>
        <div className="lp-hero-illus-wrap flex-1 min-w-0 max-w-[500px] w-full max-h-[180px] md:max-h-none">
          <TimelineIllustration />
        </div>
      </section>
    </div>
  );
}

function FeaturedTimelinesSection() {
  return (
    <section
      className="px-4 md:px-8 py-16 md:py-18 max-w-[1180px] mx-auto"
      id="lineas-del-tiempo"
      style={{ scrollMarginTop: "4rem" }}
    >
      <div className="text-center mb-10">
        <h2 className="font-serif font-semibold text-foreground text-[clamp(1.35rem,1.8vw+0.7rem,1.9rem)] mb-2">
          Líneas del tiempo
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[52ch] mx-auto">
          Una selección sobre la historia republicana de la región. Abrí una
          para recorrer sus períodos y eventos.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FEATURED_TIMELINES.map((t) => (
          <TimelineCard
            key={t.slug}
            href={`/${t.slug}`}
            seed={t.slug}
            title={t.title}
            description={t.description}
            category={t.category}
            yearRange={t.yearRange}
          />
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      className="bg-card border-t border-b border-border px-4 md:px-8 py-16 md:py-18"
      id="como-se-usa"
      style={{ scrollMarginTop: "4rem" }}
    >
      <h2 className="font-serif font-semibold text-foreground text-center text-[clamp(1.35rem,1.8vw+0.7rem,1.9rem)] mb-10">
        Cómo se usa
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
        <StepCard
          number="1"
          icon={<ExploreIcon />}
          title="Explorá una línea del tiempo"
          desc="Navegá períodos históricos con zoom, filtrá por categoría y avanzá a tu ritmo."
        />
        <StepCard
          number="2"
          icon={<ChatIcon />}
          title="Profundizá con asistencia de IA"
          desc="Resolvé dudas puntuales sobre cualquier evento o período. El asistente explica, contextualiza y conecta con otros temas."
        />
        <StepCard
          number="3"
          icon={<CausalIcon />}
          title="Visualizá conexiones causales"
          desc="Activá el modo causal para ver cómo un evento lleva al siguiente a lo largo del tiempo."
        />
      </div>
    </section>
  );
}

function ClosingBand() {
  return (
    <section className="flex items-center justify-center gap-5 flex-wrap px-4 py-10 bg-card border-t border-b border-border text-center">
      <p className="font-serif text-[1.05rem] text-foreground m-0">
        Elegí una línea del tiempo para comenzar.
      </p>
      <Button asChild variant="outline">
        <a href="#lineas-del-tiempo">Ver todas</a>
      </Button>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 md:px-8 py-6 border-t border-border text-[0.8rem] text-muted-foreground">
      <p className="italic m-0 text-center md:text-left">
        Proyecto educativo abierto · Pensado para estudiantes y docentes.
      </p>
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <span>© {new Date().getFullYear()} Historias en el Tiempo</span>
        <a
          href={SITE_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors no-underline"
        >
          @historic.timelines
        </a>
        <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors no-underline">
          Ingresar
        </Link>
      </div>
    </footer>
  );
}

// ── Step card ────────────────────────────────────────────────────────────────

type StepCardProps = {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
};

function StepCard({ number, icon, title, desc }: StepCardProps) {
  return (
    <div className="flex flex-col items-start gap-2.5 p-6 bg-background border border-border rounded-xl transition-shadow hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--accent)_10%,transparent)]">
      <div className="w-11 h-11 flex items-center justify-center rounded-[10px] text-primary"
        style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
        {icon}
      </div>
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.09em] text-muted-foreground">
        Paso {number}
      </span>
      <h3 className="text-[1rem] font-bold text-foreground m-0">{title}</h3>
      <p className="text-[0.875rem] text-muted-foreground leading-relaxed m-0">{desc}</p>
    </div>
  );
}

// ── Hero illustration ────────────────────────────────────────────────────────

function TimelineIllustration() {
  return (
    <svg
      viewBox="0 0 480 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="lp-hero-svg"
    >
      <rect x="36" y="62" width="148" height="48" rx="7" className="lp-svg-period-1" />
      <rect x="196" y="62" width="158" height="48" rx="7" className="lp-svg-period-2" />
      <rect x="366" y="62" width="86" height="48" rx="7" className="lp-svg-period-1" />

      <text x="52" y="82" className="lp-svg-period-label lp-svg-period-1-text">Independencia</text>
      <text x="210" y="82" className="lp-svg-period-label lp-svg-period-2-text">Organización Nacional</text>
      <text x="378" y="82" className="lp-svg-period-label lp-svg-period-1-text">Modernización</text>

      <text x="34" y="132" className="lp-svg-year-label">1810</text>
      <text x="192" y="132" className="lp-svg-year-label">1853</text>
      <text x="360" y="132" className="lp-svg-year-label">1880</text>
      <text x="434" y="132" className="lp-svg-year-label">1916</text>

      <line x1="20" y1="110" x2="460" y2="110" className="lp-svg-axis" />

      {[36, 96, 140, 196, 255, 310, 366, 440].map((x, i) => (
        <line key={i} x1={x} y1="106" x2={x} y2="114" className="lp-svg-tick" />
      ))}

      <path d="M 80 103 Q 148 50 220 103" className="lp-svg-causal-arc" />
      <polygon points="222,104 215,98 224,97" className="lp-svg-causal-arrow" />

      <circle cx="80" cy="110" r="7" className="lp-svg-event" />
      <circle cx="120" cy="110" r="7" className="lp-svg-event" />
      <circle cx="160" cy="110" r="6" className="lp-svg-event-secondary" />
      <circle cx="220" cy="110" r="7" className="lp-svg-event" />
      <circle cx="270" cy="110" r="7" className="lp-svg-event" />
      <circle cx="330" cy="110" r="6" className="lp-svg-event-secondary" />
      <circle cx="390" cy="110" r="7" className="lp-svg-event" />

      <rect x="188" y="140" width="136" height="42" rx="8" className="lp-svg-tooltip" />
      <line x1="220" y1="118" x2="236" y2="140" className="lp-svg-tooltip-line" />
      <text x="200" y="157" className="lp-svg-tooltip-title">Revolución de Mayo</text>
      <text x="200" y="172" className="lp-svg-tooltip-sub">25 de mayo, 1810</text>
    </svg>
  );
}

// ── Step icons ───────────────────────────────────────────────────────────────

function ExploreIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  );
}

function CausalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <path d="M9 12 Q 12 6 15 12" />
      <polyline points="14,10 15,12 13,12" />
    </svg>
  );
}
