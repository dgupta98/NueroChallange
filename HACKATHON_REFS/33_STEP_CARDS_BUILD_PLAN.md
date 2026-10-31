# Step Cards — Build Plan, Deliverables and Open Questions

**Author:** Naman Dewan · **Date:** Oct 30, 2026 · Deliverable rules: [02_DELIVERABLES.md](02_DELIVERABLES.md)

## Build plan (Nov 1–5)

### Stack (simple, so everyone can explain it)

| Part | Choice | Why |
|---|---|---|
| App | Web app (React or plain HTML/JS) | Runs on any school tablet or laptop, no install |
| Speech to text | Browser Web Speech API | Free, built in |
| Splitting steps | One LLM call that returns JSON steps, plus a second for per-student versions | The core AI; the prompts go in the prompt PDF |
| Pictures | [ARASAAC](https://arasaac.org) pictograms via its public API | Free symbols made for AAC. Licence CC BY-NC-SA: fine for a non-commercial prototype, and must be credited |
| Storage | Local JSON or SQLite with made-up students | No real data needed |
| Read aloud | Browser speech synthesis | Free, built in |

API keys go in `.env` (gitignored). **Never commit keys.** Check which AI tools the challenge gives us access to before paying for anything.

### Card format (what the AI returns)

```json
{
  "instruction": "Get your tray, wash your hands, measure two cups of flour, then wait for me",
  "steps": [
    {"n": 1, "text": "Get your tray", "icon": "tray"},
    {"n": 2, "text": "Wash your hands", "icon": "wash hands"},
    {"n": 3, "text": "Measure 2 cups of flour", "icon": "flour"},
    {"n": 4, "text": "Wait for Ms. R", "icon": "wait", "is_transition": true}
  ]
}
```

Per student, the app then rewrites each step for their reading level and picks how many cards to show (the fading rule).

### Day by day

| Day | Goal |
|---|---|
| **Sun Nov 1** | Repo set up. Speech → steps working end to end. Agree on the screens. |
| **Mon Nov 2** | Student view (cards, tap to finish, help me) and teacher view (approve, see who's stuck). Pictograms. |
| **Tue Nov 3** | Per-student versions plus the fading rule. Parent "take home" page. Adult/work mode. |
| **Wed Nov 4** | Polish, accessibility pass, record the backup demo. Slides, Business Model Canvas and the prompt PDF drafted. |
| **Thu Nov 5** | Written responses, final slides (required template, published with "anyone with link can view"), README and credits. **Submit before 11:59 PM MT.** |

### Suggested split (to agree as a team)

| Who | Owns |
|---|---|
| Naman | AI pipeline (prompts, JSON steps, per-student versions), prompt PDF |
| Manan | Student and teacher screens, pictograms, demo recording |
| Dipesh | Research write-up, adult/work stage, executive summary and roadmap |
| Anand | Slides in the required template, Business Model Canvas, pitch script |

Everyone: progress reports twice a day, and be able to explain the code (Nov 7–9 code review).

---

## Deliverables (due Nov 5, 11:59 PM MT)

| Deliverable | Notes | Owner |
|---|---|---|
| **5-minute pitch** in the required 5-slide template | Slides auto-advance. Don't change layout, fonts or colours (animations are fine). Publish on Google Slides with "anyone with link can view." **Don't edit after submitting.** | |
| **Working AI MVP** | Original work built during the sprint. Bring a **pre-recorded backup demo**. | |
| **Business Model Canvas** | Strategyzer template (in "_For Presenters") | |
| **Public GitHub repo** | This repo. Can't be fully AI-generated, and the team must explain the code. Credit external and AI code. No keys. | |
| **PDF of AI prompts** | System prompts, personas, guardrails, prompt flows | |
| **Written responses** | Executive summary, partner research insights, future roadmap | |

### The 5 slides

1. **Title:** Step Cards, team names in alphabetical order (Anand Kumar, Dipesh Gupta, Manan Batra, Naman Dewan), Scottsdale Launchpad, ASU logo.
2. **Target user:** Leo (AZACS student) and, briefly, Jordan (First Place resident at his first job).
3. **Executive-function problem:** working memory and multi-step directions. Skills learned at school don't carry over to home.
4. **Solution + demo:** speak → cards → approve → tap → help me → fade, then work mode.
5. **What's next:** pilot in one AZACS class, measure steps done without help, extend to First Place AZ and job sites.

### How we score against the rubric (10 × 5 = 50)

| Criterion | Our evidence |
|---|---|
| MVP Development | Live demo: speech → cards → student taps → teacher sees help requests |
| User-Centered Problem | Personas from the AZACS and First Place visits; working-memory research |
| Impact & Inclusivity | Pictograms, read-aloud, reading levels, shame-free design |
| Functionality | Works end to end live, with a backup video |
| Collaboration | Clear roles, two partner visits, twice-daily reports |
| Principled Innovation | Teacher approval, fading for independence, no diagnoses stored |
| Creativity & Vision | Live instructions plus fading plus school → home → job |
| Tools & Techniques | Built on evidence-based practices (task analysis, visual supports, prompting); JSON pipeline; free AAC symbols |
| Pitch Storytelling | Leo's story, live demo, Jordan's story, one-line close |
| Growth & Scalability | Every classroom has instructions; same engine for adults and employers |

### Nov 6 launchpad

5-minute pitch + demo, then up to 5 minutes of jury Q&A. At least 2 of us must attend (Scottsdale, SkySong, 4–8 PM). Practise with the "5 minute timer" video in the presenter folder.

---

## Open questions

### To ask AZACS (through their preferred channel; allow about a day for a reply)

1. Is following multi-step directions a daily challenge for your students?
2. Would teachers use a tablet tool during class? Do students already have tablets or Chromebooks?
3. Do you have non-speaking students who use picture communication?
4. Could we show a teacher the prototype for 10 minutes of feedback before Nov 5?

### To ask First Place AZ (Josh Munoz)

1. Is "about half of Be Open Be Ready graduates are employed" the right way to say it? Do you have a figure for how many keep their jobs?
2. Is MyClip the same as LifeLoop?
3. What kinds of work instructions do residents struggle with most at their jobs?

### Claims NOT to use until someone finds a source

| Claim | Status |
|---|---|
| "50% of residents who get jobs lose them" | Josh said about half of graduates are **employed**, which is a different claim. Use that, or confirm with Josh. |
| "Government job coaches leave at day 90" | Oversimplified. Under Arizona DES Vocational Rehabilitation, coaching ends when someone moves to "extended services," and a case can close after at least 90 days of stable work. |
| "SAP's autism program has 92% retention" | No source found. Drop it. |
| Georgia Tech NSF $500K grant, PMC9838300, Zhou/Richard/Kim 2025, Bennett 2010, Cureus 2025 | Not verified. Check each before using. |
| "Paperwork is up to 50% of a special-ed teacher's time" | From a vendor blog citing older studies. Check before quoting. |

### Team decisions

- [ ] Agree that Step Cards is the product, with the adult "pocket coach" as the later stage (not a separate app).
- [ ] Agree on roles (see the build plan).
- [ ] Pick React or plain JS, and which AI model or API we have access to.
- [ ] Who attends the Nov 6 launchpad (at least 2).
