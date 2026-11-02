# Business Model Canvas — Step Cards
**Team Kaleidoscope | Author: Dipesh | Date: Nov 2, 2026**
**Anand: copy each cell below into the Strategyzer fillable PDF (`_For Presenters/Business Model Canvas/NA AI CHALLENGE_BMC_Fillable.pdf`)**

**Live app:** https://nuero-challange.vercel.app/ · **Repo:** https://github.com/dgupta98/NueroChallange

---

## THE NINE CELLS

---

### 1. VALUE PROPOSITIONS
*(Centre cell — the heart of the canvas)*

**For teachers (AZACS):**
Turn any spoken classroom instruction into personalized picture step cards for each student — in seconds, live, without any setup. Long instructions auto-split into multi-part lessons (Part 1 of 3, Part 2 of 3…). Support fades as the student masters the routine. Teachers see a per-student sticker book that doubles as a progress record (which routines were finished independently, where help was asked).

**For neurodivergent workers (First Place AZ / employment):**
Turn a manager's verbal instruction into numbered plain-language steps, with ambiguous terms flagged and a suggested clarifying question — so a worker can act confidently without asking to repeat it twice.

**What makes it different:**
Every existing visual schedule tool requires an adult to build each routine ahead of time. Step Cards handles instructions that were never planned. That's the gap. That's why AI is necessary here — no other mechanism can do this in real time.

---

### 2. CUSTOMER SEGMENTS
*(Right side — who we serve)*

**Primary (school stage):**
Special education teachers at autism charter schools. Specifically: teachers at AZACS (and similar schools) who run hands-on multi-step classes (cooking, robotics, drone, coding) with 3–4 students at different reading levels, in 45-minute sessions, with no time to build visual supports on the fly.

**End users (students):**
Autistic and ADHD students aged 8–18. Students who lose track of multi-step verbal instructions — not because they weren't paying attention, but because working memory under task-load is the failure point.

**Adult stage:**
Neurodivergent adults (18–30) in first employment. Residents of supported-living programs like First Place AZ. Adults transitioning from school to independent work who receive verbal instructions from managers in noisy, time-pressured environments.

**Influencers / decision-makers:**
Parents (see daily parent journal integration), school principals, employment program coordinators (Josh Munoz equivalents), special education department heads.

---

### 3. CHANNELS
*(Right side — how we reach them)*

**Phase 1 (pilot):**
Direct relationship with AZACS. One teacher, one class, six weeks. No marketing needed — we are already in the building.

**Phase 2 (school adoption):**
- Arizona Department of Education Special Education division
- AZACS principal → district-level referral
- Special education teacher professional networks (CEC — Council for Exceptional Children)
- ASHA (American Speech-Language-Hearing Association)

**Phase 3 (adult/employment):**
- First Place AZ Transition Academy integration (direct partner)
- Arizona DES (Department of Economic Security) Vocational Rehabilitation program
- Employer accessibility and DEI program leads

**Demo / awareness:**
- Launchpad presentation (Nov 6, Scottsdale SkySong)
- Grand Final (Nov 21, Phoenix) if selected

---

### 4. CUSTOMER RELATIONSHIPS
*(Right side — how we maintain them)*

**Pilot phase:**
Embedded relationship. We are in the classroom, measuring, adjusting. Teacher has a direct channel to report what's working.

**Post-pilot:**
- Outcome report published (steps completed independently, before vs. after)
- Replication guide so another school can run the same pilot without our team present
- Teacher-facing setup documentation (in README and in-app onboarding)

**Adult/employer phase:**
- First Place AZ staff introduce it in Transition Academy sessions
- Workers use it independently — no ongoing relationship required for daily use
- Optional: post-shift log surfaces patterns to employment coordinators (with worker consent only)

---

### 5. KEY ACTIVITIES
*(Left side — what we do)*

**Core AI pipeline (Groq Qwen3-32B):**
- Speech → text (Web Speech API, free)
- Text → structured lesson JSON with auto-split into parts if long (CLASSROOM_PROMPT)
- Steps → per-student reading-level rewrites (REWRITE_PROMPT, parallel per student)
- Each step keyword → ARASAAC pictogram URL (API + local fallback map)
- Instruction → adult workplace steps + ambiguous terms + clarifying question (adult mode)

**Backend (Supabase):**
- Postgres with Row Level Security — teachers only see their own classes/students
- Realtime subscriptions keep student cards in sync as teachers approve
- Supabase Auth with magic-link email sign-in

**Fading + progress:**
- Track per-student runs per routine; reduce visible card count as mastery grows
- Record `steps_on_own` and `help_taps` per card; roll up to a per-student sticker book
- Teacher-facing drill-down shows which routines each student finished independently vs. with help

**Teacher approval loop:**
- Cards never reach students without teacher review + tap to approve
- Private "Help me" signal routes only to the teacher's device

**Research and partner engagement:**
- AZACS and First Place AZ visits, debriefs, open questions answered
- Evidence base (NCAEP 2020) integrated into product design decisions

---

### 6. KEY RESOURCES
*(Left side — what we need)*

**Technology:**
- Groq API running Qwen3-32B — ~$0.001 per instruction, ~1–2s latency (lives inside teacher's attention span)
- Supabase (Postgres, Auth, Realtime, RLS) — free tier covers pilot
- ARASAAC pictogram library (free, CC BY-NC-SA, Sergio Palao attribution)
- Web Speech API (free, browser built-in — Chrome/Edge)
- TanStack Start (SSR React) + Tailwind + Radix UI (open source)
- Vercel for hosting — live at https://nuero-challange.vercel.app/

**Evidence base:**
- NCAEP 2020 — 28 verified EBPs, four of which Step Cards implements
- Partner access: AZACS classroom, First Place AZ Transition Academy

**Team:**
- AI pipeline design: Naman Dewan
- UI/UX implementation: Manan Batra
- Research + written responses + adult mode spec: Dipesh Gupta
- Pitch + BMC + storytelling: Anand Kumar

---

### 7. KEY PARTNERS
*(Left side — who helps us)*

| Partner | What they provide | What we provide |
|---|---|---|
| **AZACS** | Pilot classroom access, teacher feedback, student context | A tool built around their exact daily challenge |
| **First Place AZ / Josh Munoz** | Adult stage validation, employment program context | Adult mode that addresses his direct product ask |
| **ARASAAC** | 35,000+ free AAC pictograms, CC BY-NC-SA | Attribution in-app and in README |
| **Google / Chrome** | Web Speech API (free) | — |
| **Groq** | LLM inference (Qwen3-32B) for instruction breakdown and rewriting | — |
| **Supabase** | Backend (Postgres, Auth, Realtime, RLS) on free tier | — |
| **Vercel** | Hosting (TanStack Start SSR) on free tier | — |
| **ASU / Spark Center** | Challenge framework, mentors, launchpad access | Participation, prototype, pitch |

---

### 8. COST STRUCTURE
*(Bottom left)*

**During hackathon (current):**
- Groq API (Qwen3-32B): ~$0.001 per instruction. At 50 instructions/day: ~$0.05/day. Negligible.
- Supabase: Free tier (500 MB db, 2 GB bandwidth) — covers pilot comfortably
- Vercel: Free tier covers hosting
- ARASAAC: Free (CC BY-NC-SA)
- Development: Team time only

**Post-pilot (Year 1 projections):**
- Groq API scales linearly. At 1,000 instructions/day: ~$1/day = ~$30/month.
- Supabase Pro at $25/month unlocks production scale (8 GB db, daily backups, more Realtime channels)
- Vercel Pro at $20/month for production hosting + custom domain
- Ongoing development: Grant-funded or sponsored by school district
- Main cost driver: Team time for pilot support, iteration, documentation

**Cost advantage:** Marginal cost per additional school is essentially zero beyond the ~$1/day in Groq calls. Nothing in the stack is proprietary or locked-in — ARASAAC is CC-licensed, Groq is drop-in-replaceable with other OpenAI-compatible providers, Supabase is Postgres under the hood.

---

### 9. REVENUE STREAMS
*(Bottom right)*

**Stage 1 — Pre-revenue (current):**
Grant funding. IDEA (Individuals with Disabilities Education Act) funds assistive technology in special education. NSF SBIR/STTR supports edtech innovation. Autism Speaks, Autism Science Foundation, and similar foundations fund tools aligned with evidence-based practices.

**Stage 2 — Pilot to license (Year 2+):**
Per-teacher SaaS licensing after the pilot produces measurable outcomes.
- Estimated: $200–500/teacher/year (benchmarked against similar edtech: Goally is $300+/device, Tiimo is subscription-based)
- First target: AZACS district license (multiple teachers, one contract)

**Stage 3 — Employment and employer market (Year 3+):**
- First Place AZ and similar programs: institutional licensing for adult mode
- Employer accessibility programs: manager communication training tools derived from aggregate (anonymized) workplace instruction data
- Arizona DES Vocational Rehabilitation program integration: potential state contract

**Non-revenue value (important for the pitch):**
Every dollar not spent on job coach re-engagement after a preventable dismissal is a cost avoided by the employer and the government. Step Cards' long-term value proposition is not subscription revenue — it is reducing the economic cost of neurodivergent employment failure, which is currently borne by government VR programs, families, and workers themselves.

---

## HOW TO FILL THE PDF (for Anand)

The fillable PDF is at: `_For Presenters/Business Model Canvas/NA AI CHALLENGE_BMC_Fillable.pdf`

The Strategyzer layout:

```
┌────────────────────────────────────────────────────────────────────┐
│  KEY          │  KEY          │  VALUE        │  CUSTOMER   │  CUSTOMER  │
│  PARTNERS     │  ACTIVITIES   │  PROPOSITIONS │  RELATION-  │  SEGMENTS  │
│  (cell 7)     │  (cell 5)     │  (cell 1)     │  SHIPS      │  (cell 2)  │
│               │               │               │  (cell 4)   │            │
│               ├───────────────┤               ├─────────────┤            │
│               │  KEY          │               │  CHANNELS   │            │
│               │  RESOURCES    │               │  (cell 3)   │            │
│               │  (cell 6)     │               │             │            │
├───────────────────────────────────────────────────────────────────-┤
│  COST STRUCTURE (cell 8)      │  REVENUE STREAMS (cell 9)          │
└────────────────────────────────────────────────────────────────────┘
```

For each cell, keep text to 3–5 bullet points maximum — judges scan, they don't read. Use the bold headers from each cell above as your bullets. Cut everything that doesn't fit.

**Shortest version for the PDF (bullets only):**

**Value Propositions:** Spoken instruction → per-student picture step cards in seconds. Long instructions auto-split into multi-part lessons. Fades as student masters routine. Teacher-facing sticker book doubles as progress record. Same engine scales classroom → first job.

**Customer Segments:** Special ed teachers (AZACS). Autistic/ADHD students 8–18. Neurodivergent adults in first employment (First Place AZ). Parents, school principals, employment coordinators.

**Channels:** Direct AZACS pilot → AZ Dept of Education → CEC teacher networks. First Place AZ Transition Academy for adult stage. Live demo at nuero-challange.vercel.app.

**Customer Relationships:** 6-week embedded pilot. Published outcome. Replication guide. App-based (no ongoing support needed for daily use).

**Key Activities:** Groq Qwen3-32B instruction breakdown + part-splitting. Per-student reading-level rewrite (parallel). ARASAAC pictogram fetch. Fading algorithm. Teacher approval loop. Per-student progress drill-down.

**Key Resources:** Groq API (Qwen3-32B). Supabase (Postgres + Auth + Realtime + RLS). ARASAAC (free). Web Speech API (free). NCAEP 2020 evidence base. AZACS + First Place AZ partner access.

**Key Partners:** AZACS (pilot site). First Place AZ (adult validation). ARASAAC (pictograms, Sergio Palao). Groq (LLM inference). Supabase (backend). Vercel (hosting). ASU/Spark Center (challenge).

**Cost Structure:** Groq ~$0.001/instruction. Supabase + Vercel free tier for pilot. Dev: team time + grants. Marginal cost per additional school ≈ $1/day.

**Revenue Streams:** IDEA/NSF grants (Stage 1). Per-teacher SaaS $200–500/year (Stage 2). Employer accessibility licensing + AZ DES VR program (Stage 3).
