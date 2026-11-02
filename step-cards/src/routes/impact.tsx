import { Link, createFileRoute } from "@tanstack/react-router";

import { DemoAccess } from "@/components/site/DemoAccess";
import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Why Step Cards matters — the story, the evidence, the demo" },
      {
        name: "description",
        content:
          "Meet Leo, see what two partner visits taught us, how Step Cards differs from visual schedules, how we measure independence, and try the 3-minute demo.",
      },
      { property: "og:title", content: "Why Step Cards matters" },
      {
        property: "og:description",
        content: "Spoken instruction in, independence out: the story, the evidence and a live demo school.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Impact,
});

const BEFORE = [
  "The teacher says five steps out loud while the class is moving.",
  "By step two Leo has lost the thread. Holding the list while doing the task is the hard part.",
  "He waits, or copies a classmate, or raises his hand in front of everyone.",
  "An adult walks over and repeats it. Tomorrow, the same thing happens.",
];

const AFTER = [
  "The teacher says the same five steps once, into the tablet.",
  "Leo gets short words and a picture for each step. Mia gets full sentences.",
  "If Leo is stuck, Help me tells only the teacher. Nobody else sees.",
  "After a few mornings, Leo's cards fade from five to three. He's doing it on his own.",
];

const COMPARE: { feature: string; cards: string; apps: string; us: string }[] = [
  { feature: "Works for an instruction nobody planned", cards: "No", apps: "No — built ahead of time", us: "Yes, in seconds" },
  { feature: "A version for each student's reading level", cards: "Rarely", apps: "One version", us: "Yes, per student" },
  { feature: "Support fades as skills grow", cards: "By hand", apps: "No", us: "Automatically" },
  { feature: "Teacher sees who is stuck, privately", cards: "No", apps: "No", us: "Live board" },
  { feature: "Practice continues at home", cards: "Sometimes", apps: "Separate app", us: "Take-home sheet + home tap" },
];

const RESPONSIBLE = [
  ["The teacher approves every card", "Nothing reaches a student until a person has read it and tapped Send."],
  ["The AI never sees who a student is", "Only the instruction and a reading level are sent. No names, ages or diagnoses exist in the system."],
  ["No student accounts, no photos", "Students join with a class code and a nickname. Their tablet holds a random key, not a login."],
  ["Pictures are checked, not guessed", "Common actions use hand-checked pictures. When nothing fits, the card shows its number instead of a wrong picture."],
  ["Motivation without pressure", "A sticker the student chose. No points, streaks, leaderboards, and nothing is ever taken away."],
];

const DEMO_PATH = [
  ["Sign in as Ms. Rivera", "Open Room 4. A morning routine is live: Sam has asked for help on step 3, Mia's cards have faded to one, Leo is on step 2."],
  ["Tap “I'm on my way” for Sam", "Help is private. Sam sees that his teacher is coming. Classmates see nothing."],
  ["Open the Cooking lab", "Pancake batter is waiting for approval: three versions of the same instruction, one per reading level. Approve and send."],
  ["Give a new instruction", "Speak or type anything, with a time in it. Cards with pictures and timers appear for every student."],
  ["Switch to Leo", "Pick a sticker to work for, follow the drone pre-flight check, and see his sticker book fill up."],
  ["Open the Organization page", "Steps done without help, across every class. This is the number a pilot would track."],
];

function Impact() {
  return (
    <PublicLayout>
      <section className="hero-wash">
        <div className="container-narrow py-16 lg:py-20">
          <p className="eyebrow">Why it matters</p>
          <h1 className="display-xl mt-3">Spoken instruction in. Independence out.</h1>
          <p className="lead mt-5">
            In a hands-on class, one spoken instruction has to reach every student, right now, in the way each one
            understands it. Nobody has time to make three versions. That gap is where students get lost.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="btn-primary btn-lg">Try the 3-minute demo</a>
            <Link to="/research" className="btn-outline btn-lg">Read the evidence</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Meet Leo</p>
        <h2 className="display-lg mt-2 max-w-3xl">Leo is 12. He knows how to hang up his coat. He loses the list.</h2>
        <p className="lead prose-width mt-4">
          Leo is the student our partner school described to us: bright, hands-on, and lost by the second step of a
          spoken instruction. It isn't attention. It's working memory under load — common in autism and ADHD, which
          often come together.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="surface-quiet p-7">
            <h3 className="text-xl font-semibold">A morning today</h3>
            <ol className="mt-5 space-y-4">
              {BEFORE.map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-display font-semibold">{i + 1}</span>
                  <span className="pt-1">{t}</span>
                </li>
              ))}
            </ol>
          </article>
          <article className="surface p-7">
            <h3 className="text-xl font-semibold">A morning with Step Cards</h3>
            <ol className="mt-5 space-y-4">
              {AFTER.map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-primary-foreground">{i + 1}</span>
                  <span className="pt-1">{t}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page py-20">
          <p className="eyebrow">What we heard</p>
          <h2 className="display-lg mt-2 max-w-3xl">Built from two partner visits, not a guess</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <figure className="surface-quiet p-7">
              <p className="text-sm font-bold text-muted-foreground">Arizona Autism Charter Schools · visit, Oct 29</p>
              <blockquote className="mt-3 text-lg">
                About one adult for every three students. Cooking, robotics, drones, dance — every class is multi-step,
                and a single instruction has to land three different ways, right now.
              </blockquote>
              <figcaption className="mt-4 text-muted-foreground">
                So the input is spoken, cards come in reading levels, and they go home for the daily family journal.
              </figcaption>
            </figure>
            <figure className="surface-quiet p-7">
              <p className="text-sm font-bold text-muted-foreground">First Place AZ · Josh Munoz, Transition Academy</p>
              <blockquote className="mt-3 text-lg">
                “If they had a way to track how much they're improving in certain skills — like, I would want that.”
              </blockquote>
              <figcaption className="mt-4 text-muted-foreground">
                So students see their own progress as “steps on your own”, and cards fade when a skill is learned.
              </figcaption>
            </figure>
          </div>
          <p className="mt-6 max-w-3xl text-muted-foreground">
            Both partners pointed to the same design rule: asking for help must be private. In class it carries social
            risk; at work, asking twice can cost a job. That is why Help me goes only to the teacher.
          </p>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">What makes it different</p>
        <h2 className="display-lg mt-2 max-w-3xl">Every other tool needs the routine built before the moment</h2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
            <caption className="sr-only">Step Cards compared with laminated cards and visual schedule apps</caption>
            <thead>
              <tr className="text-sm text-muted-foreground">
                <th scope="col" className="border-b border-border p-4 font-bold">What a class needs</th>
                <th scope="col" className="border-b border-border p-4 font-bold">Laminated cards</th>
                <th scope="col" className="border-b border-border p-4 font-bold">Visual schedule apps</th>
                <th scope="col" className="border-b border-border bg-primary-soft p-4 font-bold text-foreground">Step Cards</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.feature}>
                  <th scope="row" className="border-b border-border p-4 font-semibold">{r.feature}</th>
                  <td className="border-b border-border p-4 text-muted-foreground">{r.cards}</td>
                  <td className="border-b border-border p-4 text-muted-foreground">{r.apps}</td>
                  <td className="border-b border-border bg-primary-soft p-4 font-semibold">{r.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="container-page py-20">
          <p className="eyebrow">Responsible by design</p>
          <h2 className="display-lg mt-2 max-w-3xl">AI does the busy work. People stay in charge.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESPONSIBLE.map(([t, b]) => (
              <div key={t} className="rounded-xl bg-card p-6">
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How we'll know it works</p>
            <h2 className="display-lg mt-2">One honest number: steps done without help</h2>
            <p className="lead mt-4 prose-width">
              Every tap is a step. Every Help me is a step with support. The share done alone is the measure special
              educators already use for independence, and it is on every teacher's and admin's screen.
            </p>
            <p className="mt-4 text-muted-foreground prose-width">
              In the demo school, Leo asked for help 3 times on his first morning routine, then 2, then 1. His cards have
              already faded from five to three.
            </p>
          </div>
          <div className="surface p-7">
            <h3 className="text-xl font-semibold">Next: a six-week pilot</h3>
            <ol className="mt-5 space-y-4">
              {[
                ["Weeks 1–2", "Baseline: teachers run their usual routines with full cards."],
                ["Weeks 3–6", "Fading on. Track steps done alone and help requests per routine."],
                ["After", "Publish the results and a guide so any school can run the same pilot."],
              ].map(([w, t]) => (
                <li key={w} className="flex gap-4">
                  <span className="w-24 shrink-0 font-bold">{w}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-5 py-20 md:grid-cols-3">
          <div className="md:col-span-3">
            <p className="eyebrow">Path to scale</p>
            <h2 className="display-lg mt-2">From one classroom to a first job</h2>
          </div>
          {[
            ["Almost free to run", "About a tenth of a cent of AI per instruction. Pictures, speech and the student app cost nothing extra."],
            ["Schools first", "Assistive technology funding already exists for special education. Then per-teacher plans for any school."],
            ["Then adults at work", "The same engine helps a new employee follow a manager's spoken instructions — the First Place AZ track."],
          ].map(([t, b]) => (
            <div key={t} className="surface-quiet p-6">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" className="container-page scroll-mt-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">See it in 3 minutes</p>
            <h2 className="display-lg mt-2">Walk through a real school day</h2>
            <p className="lead mt-4 prose-width">
              The demo school has three classes, two weeks of history and a lesson happening right now. Nothing to set up.
            </p>
            <ol className="mt-8 space-y-5">
              {DEMO_PATH.map(([t, b], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-primary-foreground">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{t}</h3>
                    <p className="text-muted-foreground">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <DemoAccess />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
