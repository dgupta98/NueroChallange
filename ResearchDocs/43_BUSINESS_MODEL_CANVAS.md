# Business Model Canvas — Step Cards
**Team Kaleidoscope | Author: Dipesh | Date: Oct 31, 2026**
**Anand: copy each cell below into the Strategyzer fillable PDF (`_For Presenters/Business Model Canvas/NA AI CHALLENGE_BMC_Fillable.pdf`)**

---

## THE NINE CELLS

---

### 1. VALUE PROPOSITIONS
*(Centre cell — the heart of the canvas)*

**For teachers (AZACS):**
Turn any spoken classroom instruction into personalized picture step cards for each student — in seconds, live, without any setup. Support fades as the student masters the routine, building independence instead of dependence.

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

**Core AI pipeline:**
- Speech → text (Web Speech API, free)
- Text → structured steps JSON (LLM Call 1)
- Steps → per-student reading-level versions (LLM Call 2, parallel)
- Instruction → adult workplace steps + ambiguous terms + clarifying question (LLM Call 3)

**Pictogram matching:**
- Step keyword → ARASAAC pictogram URL (API + local fallback map)

**Fading algorithm:**
- Track completion history per student per routine
- Reduce visible card count on subsequent runs (independence-building mechanism)

**Teacher approval loop:**
- Cards never reach students without teacher review + tap to approve
- Teacher sees who needs help (private "Help me" signal)

**Research and partner engagement:**
- AZACS and First Place AZ visits, debriefs, open questions answered
- Evidence base (NCAEP 2020) integrated into product design decisions

---

### 6. KEY RESOURCES
*(Left side — what we need)*

**Technology:**
- LLM API access (OpenAI gpt-4o-mini or challenge-provided model) — ~$0.001–0.003 per instruction
- ARASAAC pictogram library (free, CC BY-NC-SA)
- Web Speech API (free, browser built-in — Chrome/Edge)
- React + Vite + Tailwind + Radix UI (all open source, free)
- Vercel free tier for hosting (static React app)

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
| **OpenAI / Anthropic** | LLM API for instruction breakdown and rewriting | — |
| **ASU / Spark Center** | Challenge framework, mentors, launchpad access | Participation, prototype, pitch |

---

### 8. COST STRUCTURE
*(Bottom left)*

**During hackathon (current):**
- LLM API: ~$0.001–0.003 per instruction breakdown. At 50 instructions/day: ~$0.15/day, ~$4.50/month. Negligible.
- ARASAAC: Free
- Hosting: Free (Vercel free tier, static app)
- Development: Team time only

**Post-pilot (Year 1 projections):**
- LLM API costs scale with usage. At 1,000 instructions/day: ~$3/day = ~$90/month. Still low.
- Hosting: Free tier sufficient for pilot; Vercel Pro at ~$20/month for production
- Ongoing development: Grant-funded or sponsored by school district
- Main cost driver: Team time for pilot support, iteration, documentation

**Cost advantage:** Because everything except the LLM API call is free (Web Speech, ARASAAC, open-source stack), the marginal cost per additional school is essentially zero beyond the API calls.

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

**Value Propositions:** Spoken instruction → per-student picture step cards in seconds. No setup. Fades as student masters routine. Same engine: classroom to first job.

**Customer Segments:** Special ed teachers (AZACS). Autistic/ADHD students 8–18. Neurodivergent adults in first employment. Parents, school principals, employment coordinators.

**Channels:** Direct AZACS pilot → AZ Dept of Education → CEC teacher networks. First Place AZ Transition Academy for adult stage.

**Customer Relationships:** 6-week embedded pilot. Published outcome. Replication guide. App-based (no ongoing support needed for daily use).

**Key Activities:** LLM instruction breakdown. Per-student reading-level rewrite (parallel). ARASAAC pictogram fetch. Fading algorithm. Teacher approval loop.

**Key Resources:** LLM API. ARASAAC (free). Web Speech API (free). NCAEP 2020 evidence base. AZACS + First Place AZ partner access.

**Key Partners:** AZACS (pilot site). First Place AZ (adult validation). ARASAAC (pictograms). OpenAI/Anthropic (LLM). ASU/Spark Center (challenge).

**Cost Structure:** LLM API ~$0.001/instruction. Hosting free (Vercel). Dev: team time + grants. Low marginal cost per additional school.

**Revenue Streams:** IDEA/NSF grants (Stage 1). Per-teacher SaaS $200–500/year (Stage 2). Employer accessibility licensing + AZ DES VR program (Stage 3).
