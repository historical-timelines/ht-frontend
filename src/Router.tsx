import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import App from "./App";
import { WelcomeScreen } from "./WelcomeScreen";

function WelcomeRoute() {
  const navigate = useNavigate();
  return (
    <WelcomeScreen
      onEnter={() => {
        navigate("/visor");
      }}
    />
  );
}

const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<WelcomeRoute />} />
        <Route path="/visor" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
