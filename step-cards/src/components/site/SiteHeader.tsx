import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { DisplayControls } from "@/components/DisplayControls";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/impact", label: "Why it matters" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/research", label: "Research" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/95">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded-lg focus:bg-card focus:p-3">
        Skip to main content
      </a>
      <div className="container-page flex min-h-16 items-center justify-between gap-4 py-2">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="btn-ghost text-muted-foreground"
              activeProps={{ className: "btn-ghost text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => setDisplayOpen((o) => !o)}
            aria-expanded={displayOpen}
            className="btn-ghost text-sm"
          >
            Display
          </button>
          <Link to="/join" className="btn-outline">
            I'm a student
          </Link>
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              Open dashboard
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary">
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          className="btn-outline md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "Close menu" : "Menu"}
        </button>
      </div>

      {displayOpen && (
        <div className="hidden border-t border-border bg-card md:block">
          <DisplayControls className="container-page py-3" />
        </div>
      )}

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border bg-card md:hidden">
          <nav aria-label="Main" className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/join" className="btn-outline mt-2">
              I'm a student
            </Link>
            <Link to={user ? "/dashboard" : "/auth"} className="btn-primary">
              {user ? "Open dashboard" : "Sign in"}
            </Link>
            <div className="mt-3 border-t border-border pt-3">
              <DisplayControls />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
