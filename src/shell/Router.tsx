import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import App from "../App";
import { createTimelineRepo, type TimelineSummary } from "../timelineEdition";
import { LandingPage } from "./LandingPage";
import { WelcomeScreen } from "./WelcomeScreen";

// TODO: timelines sin slug (creadas antes de este campo, o vía rutas que no lo
// generan) caen al id como URL. Generar slug con IA cuando falte.
const timelineRepo = createTimelineRepo();

function WelcomeRoute() {
  const navigate = useNavigate();
  const [items, setItems] = useState<TimelineSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    timelineRepo
      .list({ query: searchQuery || undefined })
      .then((page) => {
        if (cancelled) return;
        setItems(page.items);
        setNextCursor(page.nextCursor);
      })
      .catch(() => {
        if (cancelled) return;
        setError("No se pudieron cargar las líneas de tiempo. Intentá de nuevo.");
        setItems([]);
        setNextCursor(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await timelineRepo.list({ query: searchQuery || undefined, cursor: nextCursor });
      setItems((prev) => [...prev, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch {
      // Keep current items; the sentinel will retry once it's visible again.
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleCreateTimeline(title: string) {
    const record = await timelineRepo.create({
      title,
      description: null,
      timeline: { periods: [], events: [] },
    });
    navigate(`/${record.slug ?? record.id}`);
  }

  return (
    <WelcomeScreen
      items={items}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      hasMore={nextCursor !== null}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onLoadMore={handleLoadMore}
      onCreateTimeline={handleCreateTimeline}
    />
  );
}

const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WelcomeRoute />} />
        <Route path="/:timelineSlug" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
