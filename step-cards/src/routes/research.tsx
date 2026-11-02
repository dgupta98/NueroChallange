import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/site/PublicLayout";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research behind Step Cards — evidence, partners and design" },
      {
        name: "description",
        content:
          "The evidence base, partner visits with AZACS and First Place AZ, and the neurodivergent design research behind Step Cards.",
      },
      { property: "og:title", content: "The research behind Step Cards" },
      { property: "og:description", content: "Evidence-based practices, partner insights and calm design rules." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Research,
});

const EBPS = [
  ["Task analysis", "The AI breaks each instruction into ordered, single-action steps — the same thing a specialist does by hand."],
  ["Visual supports", "Every step has an ARASAAC pictogram alongside its words. Pictures and words together improve understanding."],
  ["Prompting with systematic fading", "Support reduces automatically as a student completes the same routine again and again."],
  ["Technology-aided instruction", "Delivered in the browser on any tablet, with nothing to install."],
];

const GAPS = [
  ["Setup before the moment of need", "Existing visual schedule apps need an adult to build each routine ahead of time."],
  ["One version for everyone", "A schedule is usually built once, for the whole group, at one reading level."],
  ["No fading", "The same full schedule is shown forever, which builds dependence instead of independence."],
  ["No teacher visibility", "Teachers can't see who is stuck on which step without walking over."],
  ["No school-to-home link", "Routines rarely travel home, so skills don't get practiced in a second setting."],
];

const DESIGN = [
  ["Layout", "One main action per screen, generous space, the same card structure everywhere."],
  ["Color", "Soft, low-luminance tones on off-white. No yellow or red for alerts. Status uses shape and words, never color alone."],
  ["Type", "Atkinson Hyperlegible, at least 16px, 1.5 line spacing, left aligned, never all capitals."],
  ["Motion", "Nothing autoplays, no pop-ups, transitions under 200ms and off when reduced motion is on."],
  ["Plain language", "Short active sentences that start with a verb, concrete nouns, numbers as numerals."],
  ["Personal settings", "Text size, calm colors and pictures-first mode, remembered per device and per student."],
];

function Research() {
  return (
    <PublicLayout>
      <section className="hero-wash">
        <div className="container-narrow py-16 lg:py-20">
          <p className="eyebrow">Research</p>
          <h1 className="display-xl mt-3">Grounded in evidence and in real classrooms</h1>
          <p className="lead mt-5">
            Step Cards came out of 44 research documents, two partner visits and a close read of the design literature on
            autism and ADHD.
          </p>
        </div>
      </section>

      <section className="container-narrow py-14">
        <h2 className="display-lg">The evidence base</h2>
        <p className="lead mt-3 prose-width">
          Step Cards implements 4 of the 28 evidence-based practices verified in the National Clearinghouse on Autism
          Evidence and Practice (NCAEP) 2020 report.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {EBPS.map(([t, b]) => (
            <li key={t} className="surface p-6">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{b}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-narrow py-14">
          <h2 className="display-lg">What we learned from our partners</h2>
          <div className="mt-8 space-y-6">
            <article className="surface-quiet p-6">
              <h3 className="text-xl font-semibold">Arizona Autism Charter Schools (AZACS)</h3>
              <p className="mt-1 text-sm text-muted-foreground">Phoenix campus visit, October 29</p>
              <ul className="mt-4 space-y-3">
                <li>About one staff member for every three students — and each of those three needs an instruction differently.</li>
                <li>Hands-on, multi-step classes: cooking, robotics, drone building, coding and dance.</li>
                <li>Students gave clear recaps of their own work, so self-checking cards fit naturally.</li>
                <li>A daily parent journal goes home. Step Cards should feed it, not replace it.</li>
              </ul>
            </article>
            <article className="surface-quiet p-6">
              <h3 className="text-xl font-semibold">First Place AZ</h3>
              <p className="mt-1 text-sm text-muted-foreground">Tour on October 27, call with Josh Munoz on October 29</p>
              <ul className="mt-4 space-y-3">
                <li>A supported-living community for autistic and neurodivergent adults, with a Transition Academy for job readiness.</li>
                <li>ADHD and autism commonly occur together, so the design serves both.</li>
                <li>An earlier wearable trial failed because of sensory discomfort — so Step Cards stays app-only.</li>
                <li>About half of Be Open Be Ready graduates are employed. The same instruction problem follows people into work.</li>
              </ul>
              <blockquote className="mt-5 border-l-4 border-primary pl-4 italic text-muted-foreground">
                "We've developed an entire work ecosystem that is relying on the neurotypical brain." — Josh Munoz, First Place AZ
              </blockquote>
            </article>
          </div>
        </div>
      </section>

      <section className="container-narrow py-14">
        <h2 className="display-lg">The gaps in today's tools</h2>
        <p className="lead mt-3">We reviewed Choiceworks, Goally, First Then, Tiimo, Goblin Tools, VizyPlan and Brili.</p>
        <ul className="mt-8 space-y-3">
          {GAPS.map(([t, b], i) => (
            <li key={t} className="surface flex gap-4 p-5">
              <span className="font-display text-lg font-semibold text-primary">{i + 1}</span>
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="text-muted-foreground">{b}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-secondary/60">
        <div className="container-narrow py-14">
          <h2 className="display-lg">Design rules we follow</h2>
          <p className="lead mt-3">From a synthesis of 15+ studies, WCAG 2.1, Section 508 and W3C cognitive accessibility guidance.</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {DESIGN.map(([t, b]) => (
              <div key={t} className="rounded-xl bg-card p-5">
                <dt className="font-semibold">{t}</dt>
                <dd className="mt-1 text-muted-foreground">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-narrow py-14">
        <h2 className="display-lg">Privacy and responsible AI</h2>
        <ul className="mt-6 space-y-3 text-lg">
          <li className="flex gap-3"><span aria-hidden="true" className="text-success">✓</span>Students are stored by nickname and reading level only — no real names, photos, diagnoses or ages.</li>
          <li className="flex gap-3"><span aria-hidden="true" className="text-success">✓</span>Students never create accounts. A class code links their tablet to their nickname.</li>
          <li className="flex gap-3"><span aria-hidden="true" className="text-success">✓</span>Only the teacher's instruction is sent to the AI, with no student information attached.</li>
          <li className="flex gap-3"><span aria-hidden="true" className="text-success">✓</span>The teacher reviews and approves every card before a student sees it.</li>
          <li className="flex gap-3"><span aria-hidden="true" className="text-success">✓</span>Speech is turned into text by the browser. Audio is not recorded or stored.</li>
        </ul>
      </section>
    </PublicLayout>
  );
}
