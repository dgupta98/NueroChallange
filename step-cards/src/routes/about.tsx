import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Step Cards — team, partners and roadmap" },
      {
        name: "description",
        content: "Team Kaleidoscope, our partners AZACS and First Place AZ, and the Step Cards roadmap from classroom pilot to first job.",
      },
      { property: "og:title", content: "About Step Cards" },
      { property: "og:description", content: "The team, partners and roadmap behind Step Cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const TEAM = [
  ["Dipesh Gupta", "Research, adult mode, written submissions"],
  ["Naman Dewan", "AI pipeline, prompts, integrations"],
  ["Manan Batra", "UI and UX, school and work screens"],
  ["Anand Kumar", "Pitch, business model, slides"],
];

const ROADMAP = [
  ["Dec 2026 – Feb 2027", "Classroom pilot at AZACS", "Six to eight weeks with one teacher and class. One metric: the share of steps students complete independently."],
  ["Q1 2027", "Home continuity", "A shareable link for families each evening, with a one-tap \u201cpracticed at home\u201d check that reaches the teacher."],
  ["Q2 2027", "First-job support", "Work instructions broken into plain steps, unclear terms explained, and a private shift log for 30 and 90 day reviews — with First Place AZ."],
  ["Q3 2027", "Employer insights", "Anonymous patterns showing which instruction styles cause the most confusion, as a mirror for managers."],
];

function About() {
  return (
    <PublicLayout>
      <section className="hero-wash">
        <div className="container-narrow py-16 lg:py-20">
          <p className="eyebrow">About</p>
          <h1 className="display-xl mt-3">A tool that helps less and less over time</h1>
          <p className="lead mt-5">
            School, then home, then independent living, then a first job. Step Cards is meant to grow with the person —
            and to step back as they grow.
          </p>
        </div>
      </section>

      <section className="container-narrow py-14">
        <h2 className="display-lg">Our partners</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <article className="surface p-6">
            <h3 className="text-xl font-semibold">Arizona Autism Charter Schools</h3>
            <p className="mt-2 text-muted-foreground">
              Hands-on classes where one spoken instruction has to reach three students in three different ways.
            </p>
          </article>
          <article className="surface p-6">
            <h3 className="text-xl font-semibold">First Place AZ</h3>
            <p className="mt-2 text-muted-foreground">
              A supported-living community for neurodivergent adults, where the same challenge shows up at work.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-narrow py-14">
          <h2 className="display-lg">Roadmap</h2>
          <ol className="mt-8 space-y-4">
            {ROADMAP.map(([when, title, body]) => (
              <li key={title} className="surface-quiet grid gap-2 p-6 sm:grid-cols-[11rem_1fr]">
                <p className="font-bold text-primary">{when}</p>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground prose-width">
            Known limits today: voice input works best in Chrome or Edge, some abstract words get weaker pictures, and the
            fading thresholds still need testing with real classes.
          </p>
        </div>
      </section>

      <section className="container-narrow py-14">
        <h2 className="display-lg">Team Kaleidoscope</h2>
        <p className="mt-2 text-muted-foreground">ASU Scottsdale Launchpad · North America AI Challenge 2026</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {TEAM.map(([name, role]) => (
            <li key={name} className="surface p-5">
              <p className="font-semibold">{name}</p>
              <p className="text-muted-foreground">{role}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link to="/auth" search={{ mode: "signup" }} className="btn-primary btn-lg">
            Try Step Cards with your class
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
