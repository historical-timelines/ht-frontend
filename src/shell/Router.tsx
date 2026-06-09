import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import App from "../App";
import { createTimelineRepo, type TimelineSummary } from "../timelineEdition";
import { LandingPage } from "./LandingPage";
import { WelcomeScreen } from "./WelcomeScreen";

const timelineRepo = createTimelineRepo();

function WelcomeRoute() {
  const navigate = useNavigate();
  const [timelines, setTimelines] = useState<TimelineSummary[] | null>(null);

  useEffect(() => {
    timelineRepo.list().then(setTimelines).catch(() => setTimelines([]));
  }, []);

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
      timelines={timelines}
      onSelectTimeline={(slugOrId) => navigate(`/${slugOrId}`)}
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
