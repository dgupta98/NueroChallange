import { Link } from "@tanstack/react-router";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="9" y="4" width="24" height="30" rx="6" className="fill-secondary stroke-border-strong" strokeWidth="1.5" />
      <rect x="5" y="8" width="24" height="30" rx="6" className="fill-primary" />
      <path d="M11 23.5l4.2 4.2L23 19.8" fill="none" className="stroke-primary-foreground" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ to = "/" }: { to?: "/" | "/dashboard" }) {
  return (
    <Link to={to} className="flex min-h-11 items-center gap-2.5 rounded-lg" aria-label="Step Cards home">
      <LogoMark />
      <span className="font-display text-lg font-semibold tracking-tight">Step Cards</span>
    </Link>
  );
}
