import { Link } from "@tanstack/react-router";

import { LogoMark } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-semibold">Step Cards</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Built by Team Kaleidoscope for the North America AI Challenge 2026, with Arizona Autism Charter Schools
            and First Place AZ.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <span className="font-bold">Learn</span>
          <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">How it works</Link>
          <Link to="/research" className="text-muted-foreground hover:text-foreground">Research and evidence</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">About and roadmap</Link>
        </nav>
        <nav aria-label="Get started" className="flex flex-col gap-2 text-sm">
          <span className="font-bold">Get started</span>
          <Link to="/auth" className="text-muted-foreground hover:text-foreground">Teacher or organization sign in</Link>
          <Link to="/join" className="text-muted-foreground hover:text-foreground">Student: join a class</Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="container-page py-5 text-xs text-muted-foreground">
          Pictographic symbols are the property of the Government of Aragón, created by Sergio Palao for{" "}
          <a href="https://arasaac.org" target="_blank" rel="noopener noreferrer" className="underline">
            ARASAAC
          </a>{" "}
          and distributed under CC BY-NC-SA.
        </p>
      </div>
    </footer>
  );
}
