import { Link, createFileRoute } from "@tanstack/react-router";

import { HeroDemo } from "@/components/site/HeroDemo";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Step Cards — say it once, every student can follow" },
      {
        name: "description",
        content:
          "Step Cards turns a teacher's spoken instruction into calm, personal picture steps for autistic and ADHD students, and fades support as they master each routine.",
      },
      { property: "og:title", content: "Step Cards — say it once, every student can follow" },
      {
        property: "og:description",
        content: "One spoken instruction becomes personal picture step cards for every student, approved by the teacher.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { title: "Speak or type", body: "Give the instruction the way you normally would. No routine to build ahead of time." },
  { title: "Personal versions", body: "Each student gets steps at their reading level, with a picture for every action." },
  { title: "You approve", body: "Nothing reaches a student until you've checked it and tapped Send." },
  { title: "Follow, then fade", body: "Students tap through one card at a time. As a routine is mastered, the cards step back." },
];

const PRINCIPLES = [
  { title: "One thing at a time", body: "Students see a single card, a Done button and a Help button. Nothing else to tap." },
  { title: "Calm colors", body: "Soft, low-glare tones. No flashing, no yellow or red alerts. A Calm colors switch lowers them further." },
  { title: "No pop-ups", body: "Messages appear in place, never jumping over the page. Nothing plays by itself." },
  { title: "Help without raising a hand", body: "Help me sends a private signal to the teacher's screen only." },
  { title: "Read aloud", body: "Any card can be read out loud. Pictures always come with words, or words as alt text." },
  { title: "Your text size", body: "Small, medium or large text everywhere, remembered on each device." },
];

const AUDIENCES = [
  {
    title: "Teachers",
    body: "Run your class from one screen.",
    points: ["Speak an instruction, get cards for every student", "Edit or approve before sending", "See who is on which step, and who needs help", "Print take-home cards for the family journal"],
  },
  {
    title: "Students",
    body: "Join on your own tablet with a class code.",
    points: ["Tap your name, no password", "One clear card at a time", "Help me, without anyone else seeing", "Cards fade as you learn the routine"],
  },
  {
    title: "Organizations",
    body: "Support every teacher in your school.",
    points: ["Invite teachers with one code", "See classes and activity in one place", "Track independent steps over time", "No student names or diagnoses stored"],
  },
];

function Home() {
  return (
    <PublicLayout>
      <section className="hero-wash">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="eyebrow">For autistic and ADHD learners</p>
            <h1 className="display-xl mt-3">Say it once. Every student gets steps they can follow.</h1>
            <p className="lead prose-width mt-5">
              Step Cards turns a spoken classroom instruction into calm, personal picture steps — in seconds, with no
              setup — and steps back as each student masters the routine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" search={{ mode: "signup" }} className="btn-primary btn-lg">
                Start as a teacher
              </Link>
              <Link to="/join" className="btn-outline btn-lg">
                Join as a student
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Shaped with Arizona Autism Charter Schools and First Place AZ.{" "}
              <Link to="/impact" hash="demo" className="font-bold text-primary underline">
                Try the demo school
              </Link>
            </p>
          </div>
          <HeroDemo />
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">The problem</p>
            <h2 className="display-lg mt-2">Spoken instructions disappear.</h2>
          </div>
          <div className="space-y-4 text-lg text-muted-foreground prose-width">
            <p>
              A teacher gives a four-step instruction in cooking class. By step two, a student has lost the thread — not
              because they weren't listening, but because holding a list in working memory while doing the task is the
              hard part.
            </p>
            <p>
              Visual schedule tools help, but every one of them needs an adult to build the routine ahead of time. Step
              Cards handles the instructions nobody planned for.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="display-lg mt-2 max-w-2xl">From your words to their cards in four steps</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="surface-quiet p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
          <Link to="/how-it-works" className="btn-outline mt-8">
            See each workflow in detail
          </Link>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Who it's for</p>
        <h2 className="display-lg mt-2">One tool, three ways in</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <article key={a.title} className="surface flex flex-col p-7">
              <h3 className="text-xl font-semibold">{a.title}</h3>
              <p className="mt-1 text-muted-foreground">{a.body}</p>
              <ul className="mt-5 space-y-3">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden="true" className="mt-1 text-success">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Designed for neurodivergent minds</p>
            <h2 className="display-lg mt-2">Calm by design, not as an afterthought</h2>
            <p className="lead mt-4">Every screen follows the design research our team gathered with autistic and ADHD users in mind.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-xl bg-card p-6">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Evidence based</p>
            <h2 className="display-lg mt-2">Built on practices that already work</h2>
            <p className="lead mt-4 prose-width">
              Step Cards puts four of the 28 evidence-based practices from the NCAEP 2020 report into one moment in the
              classroom.
            </p>
            <Link to="/research" className="btn-outline mt-6">
              Read the research
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ["Task analysis", "Each instruction becomes ordered, single-action steps."],
              ["Visual supports", "A picture for every step, from 35,000+ ARASAAC symbols."],
              ["Prompting with fading", "Support reduces as a routine is mastered."],
              ["Technology-aided instruction", "Works in the browser on any tablet."],
            ].map(([t, b]) => (
              <li key={t} className="surface p-5">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="display-lg">Try it with your class</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg opacity-90">
            Create a class, add students by nickname, and give your first instruction in a few minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }} className="btn btn-lg bg-card font-bold text-foreground hover:bg-secondary">
              Create a teacher account
            </Link>
            <Link to="/impact" hash="demo" className="btn btn-lg border border-primary-foreground/40 text-primary-foreground hover:bg-primary-hover">
              Try the demo school
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
