import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Step Cards works — teachers, students and organizations" },
      {
        name: "description",
        content: "Step-by-step workflows for teachers, students and organization admins using Step Cards in the classroom.",
      },
      { property: "og:title", content: "How Step Cards works" },
      { property: "og:description", content: "The teacher, student and organization workflows behind Step Cards." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const FLOWS = [
  {
    id: "teachers",
    title: "For teachers",
    intro: "Everything happens from one class screen.",
    steps: [
      ["Create a class", "Give it a name. You get a 6 character class code for students."],
      ["Add students by nickname", "Choose each student's reading level and whether they read pictures first. No real names needed."],
      ["Speak or type an instruction", "\u201cGet your tray, wash your hands, measure 2 cups of flour, then wait for me.\u201d"],
      ["Check each student's cards", "Every student gets their own version with pictures. Edit any step or swap a picture."],
      ["Send to students", "Cards appear on students' tablets only after you tap Send."],
      ["Watch the class board", "See who is on which step. A Help me request shows up on your board with the step number."],
      ["Send it home", "Print the day's cards for the family journal so the routine can be practiced at home."],
    ],
  },
  {
    id: "students",
    title: "For students",
    intro: "Nothing to remember except the class code — and the tablet remembers that too.",
    steps: [
      ["Join once", "Type the class code and tap your name. That's it — no password."],
      ["Wait calmly", "When there are no cards, the screen simply says your teacher is getting them ready."],
      ["One card at a time", "A picture, a few words, and how many steps there are. Tap Read aloud to hear it."],
      ["Done or Help me", "Done moves to the next card. Help me quietly tells your teacher which step."],
      ["Finish", "A quiet \u201cAll done\u201d screen. No fireworks, no noise."],
    ],
  },
  {
    id: "organizations",
    title: "For organizations",
    intro: "For a school or program that wants every teacher on the same page.",
    steps: [
      ["Create your organization", "You become its admin and get an invite code."],
      ["Invite teachers", "Teachers create their account and enter your invite code."],
      ["See the whole picture", "Classes, teachers and recent activity in one place."],
      ["Measure independence", "Track how many steps students complete without asking for help — the pilot metric our partners asked for."],
    ],
  },
];

function HowItWorks() {
  return (
    <PublicLayout>
      <section className="hero-wash">
        <div className="container-narrow py-16 lg:py-20">
          <p className="eyebrow">How it works</p>
          <h1 className="display-xl mt-3">Three workflows, one calm system</h1>
          <p className="lead mt-5">
            The teacher stays in control, students see only what they need, and organizations can see what's working.
          </p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
            {FLOWS.map((f) => (
              <a key={f.id} href={`#${f.id}`} className="btn-outline">
                {f.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {FLOWS.map((flow) => (
        <section key={flow.id} id={flow.id} className="container-narrow scroll-mt-8 py-14">
          <h2 className="display-lg">{flow.title}</h2>
          <p className="lead mt-3">{flow.intro}</p>
          <ol className="mt-8 space-y-4">
            {flow.steps.map(([title, body], i) => (
              <li key={title} className="surface flex gap-5 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="container-narrow py-14">
        <div className="surface-quiet p-8">
          <h2 className="font-display text-2xl font-semibold">How fading works</h2>
          <p className="mt-3 text-muted-foreground prose-width">
            Cards are a support, not a crutch. Each time a student finishes the same routine, Step Cards counts it.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["First 2 times", "Every step is shown."],
              ["3rd time", "About three quarters of the steps."],
              ["4th time", "About half of the steps."],
              ["5th time on", "One summary card: \u201cWash your hands (5 steps — tap when done)\u201d."],
            ].map(([t, b]) => (
              <li key={t} className="rounded-lg bg-card p-4">
                <p className="font-bold">{t}</p>
                <p className="text-muted-foreground">{b}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            These thresholds are a starting point. The planned school pilot will test whether they are too fast or too slow.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/auth" search={{ mode: "signup" }} className="btn-primary btn-lg">
            Create a teacher account
          </Link>
          <Link to="/join" className="btn-outline btn-lg">
            Join a class
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
