import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";

import { DisplayControls } from "@/components/DisplayControls";
import { leaveDevice } from "@/lib/student.functions";
import { forgetAllSpaces, loadSpaces } from "@/lib/step-cards/student-spaces";
import { avatarGlyph } from "@/lib/step-cards/types";

/** Same top bar on every student screen: way back on the left, who you are, settings on the right. */
export function StudentTopBar({
  back,
  avatar,
  title,
  subtitle,
  settingsExtra,
}: {
  back?: boolean | undefined;
  avatar?: string | undefined;
  title: string;
  subtitle?: string | undefined;
  settingsExtra?: ReactNode | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const leave = useServerFn(leaveDevice);
  const navigate = useNavigate();

  // Sign out of the whole tablet: unlink every class saved here, then go to the join page
  async function signOut() {
    setSigningOut(true);
    const spaces = loadSpaces();
    await Promise.all(spaces.map((s) => leave({ data: { token: s.token } }).catch(() => undefined)));
    forgetAllSpaces();
    navigate({ to: "/join" });
  }
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex min-h-16 w-full max-w-3xl items-center justify-between gap-3 px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          {back && (
            <Link to="/student" className="btn-outline shrink-0 gap-2" aria-label="Back to my classes">
              <span aria-hidden="true">←</span> <span className="hidden sm:inline">My classes</span>
            </Link>
          )}
          {avatar && (
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xl text-primary">
              {avatarGlyph(avatar)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-bold leading-tight">{title}</p>
            {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" className="btn-ghost text-sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span aria-hidden="true">⚙ </span>Settings
          </button>
          <button type="button" className="btn-outline text-sm" aria-expanded={confirmOut} onClick={() => setConfirmOut((c) => !c)}>
            Sign out
          </button>
        </div>
      </div>
      {confirmOut && (
        <div className="border-t border-border bg-secondary/50">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
            <p className="flex-1">
              Sign out of this tablet? All your classes will be removed from it. You can join again with your class code.
              Your stickers stay safe.
            </p>
            <button type="button" className="btn-primary" onClick={signOut} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Yes, sign out"}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setConfirmOut(false)}>
              Stay signed in
            </button>
          </div>
        </div>
      )}
      {open && (
        <div className="border-t border-border">
          <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4">
            <DisplayControls student />
            {settingsExtra}
          </div>
        </div>
      )}
    </header>
  );
}
