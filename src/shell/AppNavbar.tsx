import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AppNavbarProps = {
  action?: ReactNode;
};

export function AppNavbar({ action }: AppNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3.5 bg-card border-b border-border shadow-sm">
      <Link
        to="/"
        className="font-serif font-semibold text-[1.05rem] text-primary tracking-tight leading-none no-underline"
      >
        <span className="hidden sm:inline">Historias en el Tiempo</span>
        <span className="sm:hidden">HT</span>
      </Link>
      {action}
    </nav>
  );
}
