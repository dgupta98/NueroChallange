import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import { DisplayControls } from "@/components/DisplayControls";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/queries";

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [displayOpen, setDisplayOpen] = useState(false);
  const userId = user?.id ?? "";
  const { data: profile } = useQuery({ ...profileQuery(userId), enabled: !!userId });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="no-print border-b border-border bg-card">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded-lg focus:bg-card focus:p-3">
          Skip to main content
        </a>
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-4">
            <Logo to="/dashboard" />
            <nav aria-label="App" className="flex items-center gap-1">
              <Link to="/dashboard" className="btn-ghost text-muted-foreground" activeProps={{ className: "btn-ghost bg-secondary text-foreground" }}>
                My classes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-ghost text-sm" aria-expanded={displayOpen} onClick={() => setDisplayOpen((o) => !o)}>
              Display
            </button>
            {profile?.display_name && <span className="hidden text-sm text-muted-foreground sm:inline">{profile.display_name}</span>}
            <button type="button" onClick={signOut} className="btn-outline text-sm">
              Sign out
            </button>
          </div>
        </div>
        {displayOpen && (
          <div className="border-t border-border">
            <DisplayControls className="container-page py-3" />
          </div>
        )}
      </header>
      <main id="main" className="container-page py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
