# What Can Fill the Post-Hire Retention Gap — Solution Research
**Compiled: Oct 27 | Sources: peer-reviewed research + live web research**

> This file answers one question: given the documented post-hire retention crisis for autistic workers, what does the research say should be built? Covers proven intervention models, what autistic workers say they need, the accommodation automation opportunity, and what's actually buildable in 10 days.

---

## 1. The Proven Intervention Model: Covert Audio Coaching

### What It Is

**Covert Audio Coaching (CAC)** is the most directly analogous research-proven intervention to a mobile AI job coach. The original implementation:

- Worker wears a small earpiece during their shift
- A job coach observes from a distance (or monitors via camera)
- Coach delivers real-time instructions and praise via walkie-talkie connected to the earpiece
- No visible disability accommodation — coworkers don't know it's happening

### The Research

**Bennett et al. (2010):** Three autistic adults in supported employment settings. CAC resulted in substantial improvements in on-the-job task completion and social interactions. Critically:
- **Improvements were maintained 4-5 weeks after the coaching was removed** — the coaching built genuine skill, not just compliance
- The hardware: a ~$50 consumer walkie-talkie + earbud

**Why this matters for product design:** CAC proves the concept. Real-time, in-the-ear support during active work situations produces durable skill transfer. The limitation: it requires a human coach available in real time. The AI equivalent — a worker who can voice or text a situation during a break and get a response in seconds — delivers the same mechanism without requiring a human to be monitoring.

**The logical progression:**
```
1990s: Human job coach on-site (IPS model)
2010s: Covert audio coaching — remote human + earpiece
2020s: AI app — asynchronous, available 24/7, employer-context-aware
```

Your product is the next step in this evidence chain — same mechanism, massively improved scale and accessibility.

---

## 2. What Autistic Workers Say They Need (Singapore + Springer Studies)

### Study 1: Singapore LLM Participatory Research (PMC13226117)

**Method:** Qualitative study with autistic adults — participatory design. Asked what they would want from an LLM-based workplace tool.

**What they said they need:**

| Need Category | Specific Request |
|---|---|
| **Executive Function Scaffolding** | Work decomposition ("break this task into steps"), prioritizing demands when multiple tasks hit at once, stepwise plans with clear sequences, transition prep ("I'm about to go into a meeting, what should I do first") |
| **Social Communication** | Draft and rehearse workplace messages before sending, clarify vague requests from managers, generate contextually appropriate responses for situations they're uncertain about |
| **Self-Reflection** | Process what happened during the day, identify what went well vs. poorly, track patterns without relying on staff |
| **Mutual Understanding** | Tools that help coworkers understand them better, not just tools that make them "act more neurotypical" |

**What they specifically rejected:** Tools that tried to make them mask or "perform neurotypical behavior." They wanted tools that helped them navigate on their own terms.

**Design implication:** The tool should help decode NT workplace culture and draft communication — without framing autism as something to hide. "Here's how this manager probably meant that" is different from "here's how to fake it."

---

### Study 2: Springer 2026 — AI for Emotionally Responsive Verbal Communication

**Full title:** "Using AI to Support Emotionally Responsive Verbal Communication Among Autistic Workers in a Work Internship Setting" (DOI: 10.1007/s10803-026-07313-4)

**Why it matters:** This is the first published study using LLMs in an actual employment setting (internship) — not just practice scenarios. The finding: AI-generated response suggestions helped autistic workers produce more emotionally appropriate verbal responses in real workplace interactions.

**The gap this study leaves open:** Internship setting + facilitated (researcher present). The next research frontier is a self-directed, asynchronous tool a worker uses independently. That's what you're building.

**Practical takeaway:** The AI model works. The research validates the core mechanism. You're not guessing — you're operationalizing a demonstrated effect.

---

## 3. The Accommodation Automation Opportunity

### The Problem in One Stat
75% of autistic workers receive NO workplace adjustments despite legal entitlement. The barrier is not primarily employer refusal — it's the process of getting there:
1. Worker must know adjustments exist and they're entitled to them
2. Must identify what adjustment would help their specific situation
3. Must navigate JAN (Job Accommodation Network) website (requires significant EF)
4. Must translate generic database results to their specific employer/role
5. Must write a formal accommodation request in appropriate language
6. Must manage the conversation with their manager/HR

Each step is an executive function load. Autistic adults with the highest unmet accommodation needs are often the same people for whom these steps are most difficult.

### What Currently Handles This

**JAN (askjan.org) — the best public resource:**
- Free EEOC-funded advisory service
- Database + phone/chat consultation
- Comprehensive, evidence-based, legally authoritative
- **Not an app. Not conversational. Not real-time. Requires user to already know what to search for.**

### The Cedeno Precedent — AI as a Reasonable Accommodation

**Cedeno v. Brookdale Senior Living (2024-2025):** Federal case where an employee argued that access to AI tools constituted a reasonable accommodation under the ADA. The reasoning: AI writing assistance reduces the EF load for tasks a person with cognitive/neurological disabilities struggles with. While the specific case turned on other facts, the legal principle has been widely cited:

> AI tools that reduce cognitive barriers to job performance can constitute a reasonable accommodation.

**Washington State DSB AI Whitepaper (2025):** State vocational rehabilitation agency formally documented AI tools as assistive technology for workers with disabilities — including cognitive and communication disabilities.

**Design implication:** An in-app accommodation navigator isn't just a helpful feature — it can be positioned as the accommodation infrastructure that the ADA requires employers to provide but most never implement. This is a compliance argument, not just a welfare argument.

### What a Conversational Accommodation Navigator Looks Like

**Input from worker:** "I struggle to remember multi-step verbal instructions. By the time my manager finishes telling me what to do I've already forgotten the first part."

**System does:**
1. Identifies the relevant accommodation (written instructions / task list / follow-up email after verbal briefings)
2. Explains the ADA right (simple language, not legalese)
3. Drafts the accommodation request using language that is direct, non-confrontational, and ADA-compliant
4. Prepares them for the likely response ("most managers will say yes if you frame it this way")
5. Optionally: generates a follow-up email template to send after the conversation

**This is JAN + a legal explanation + a writing assistant + conversation prep — all in one conversational flow.**

---

## 4. What's Technically Buildable in 10 Days

### The Technical Reality

A well-prompted LLM (Claude, GPT-4, Gemini) with:
- A system prompt that includes employer-specific context (AMC Theaters protocols, Phoenix Zoo roles, Aramark standards)
- A few-shot library of common workplace scenarios with example responses
- A mobile-first conversational UI
- Optionally: a simple logging layer (SQLite or Supabase) for post-shift processing and pattern recognition

This is NOT a research project. The core AI capability exists. The gap is the application layer — the product design, the employer context, the UX tuned for autistic users.

### The Four Core Features (MVP)

**Feature 1: Situation Decoder**
- Input: "My manager said X" — voice or text, as short as one sentence
- System identifies: what the message likely means (with probability framing), what it does NOT mean, 2-3 specific responses the worker could give, one thing NOT to do
- Employer-context-aware: AMC manager communication patterns ≠ Phoenix Zoo manager communication patterns
- Grounding: explicit ("your manager probably meant X, not that you're in trouble")

**Feature 2: Accommodation Navigator**
- Input: "I struggle with [X] at work"
- System asks: how long has this been happening? Have you mentioned it to anyone?
- Outputs: What accommodation would help → your legal right under ADA → draft request in accessible language → what to expect
- Draws from JAN database logic, conversationally delivered

**Feature 3: Review Prep Coach**
- Modular: 30-day check-in, 90-day review, 6-month evaluation, annual review
- Helps worker gather and articulate their own wins ("what did you do well this month?")
- Prepares them for likely questions and how to answer
- Provides scripts for raising accommodation needs in a review context
- Directly addresses the probationary cliff: activated before the 90-day mark

**Feature 4: Post-Shift Processing**
- Triggered by worker at end of shift
- Low-pressure prompt: "How was your shift? What happened?"
- AI listens and reflects back the key stressor ("sounds like the part that was hardest was when the schedule changed")
- Names the pattern over time ("You've mentioned schedule changes 3 times this month")
- Optional: surface a relevant First Place event, suggest an accommodation request, or flag to First Place employment staff if worker explicitly requests

---

## 5. The Design Constraints That Matter

### What the Research Tells Us About UX for This Population

| Constraint | Why | Design Response |
|---|---|---|
| **Sensory / cognitive load** | Autistic adults often in high-load state when they most need support | Minimal chrome. One question at a time. Large text. No clutter. |
| **Literal language** | Indirect phrasing creates confusion | Plain language throughout. Probability estimates ("this probably means X, not Y"). No euphemisms. |
| **Predictability** | Unexpected UI changes can cause dysregulation | Consistent flows. No "surprise" UI. Clear back-out paths. |
| **Autonomy / dignity of risk** | First Place's core philosophy. Users are adults, not patients. | Never prescriptive. Always options, never commands. "Here are 3 options" not "you should do X." |
| **Privacy** | 65% of autistic employees hide their diagnosis at work | No employer data sharing without explicit user consent. Clear data controls. |
| **Low EF entry** | The moments when the tool is most needed are the moments when EF is most depleted | Pre-built scenario buttons as shortcuts. Voice input option. One-tap entry. |

### The Goblin.tools Principle

Goblin.tools (goblin.tools) is a free AI task decomposition tool widely used in the autistic/ADHD community. Its core insight: **one task in → step-by-step breakdown out.** No login, no friction, immediate value. The Situation Decoder should work the same way: one sentence in → grounded, actionable interpretation out.

---

## 6. Why This Is Defensible to Judges

### The Research Trifecta

Three independent streams all point to the same gap and the same solution direction:

| Stream | Source | What It Says |
|---|---|---|
| **Peer-reviewed scoping review** | Zhou, Richard & Kim, *Journal of Vocational Rehabilitation*, Jan 2025 | 30 years of AT research is pre-hire. Post-hire tools are underexplored. Researchers call for active post-hire tools. |
| **Government research grant** | Georgia Tech NSF $500K, Jan 2026 (Jennifer Kim, Mark Riedl, Heather Dicks) | Post-probationary period explicitly named as the next gap. Still in research phase. Not a product. |
| **Autistic worker participatory research** | Singapore PMC13226117 | Autistic workers themselves described exactly what they want: EF scaffolding, communication drafting, self-reflection, not masking tools. |

All three point to the same gap. None of them have shipped a product. You're building what they've confirmed is needed and hasn't been built.

### The Intervention Model Exists

Covert audio coaching (Bennett 2010) proves the mechanism: real-time, in-context support for autistic workers in active employment settings produces durable skill transfer. Your product is the AI-powered, asynchronous, scalable version of a research-proven intervention. You're not inventing a new approach — you're making an existing approach accessible at scale.

### The Market Is Defined and Underserved

Service-sector employers (AMC, Phoenix Zoo, Aramark, Harkins) have no neurodiversity retention infrastructure. The programs that work (SAP, Microsoft, auticon) are white-collar, tech-only, and built on custom HR infrastructure that service employers can't replicate. Your product brings the SAP layer to employers who would otherwise never have it.

---

## 7. The Full Architecture — Drawing It Together

```
LAYER 0: SKILL MILESTONE TRACKER (MVP)
├── Resident tracks life skills (cooking, money, social, employment readiness)
├── AI suggests next milestones based on current progress
├── Share progress with family / First Place support team
└── Social milestone → employment readiness connection

     ↕ feeds into ↕

LAYER 1: POST-HIRE RETENTION COACH (same app)
├── Situation Decoder — translate ambiguous manager feedback
├── Accommodation Navigator — JAN functionality, conversational
├── Review Prep Coach — 30/90-day review preparation
└── Post-Shift Processing — log, reflect, identify patterns

     ↕ long-term feeds into ↕

LAYER 2: PATTERN + EMPLOYER SIGNAL (post-hackathon)
├── Identify recurring stress triggers across shifts
├── Auto-generate accommodation requests based on patterns
├── Aggregate (anonymized) employer signal — "3 of 5 AMC workers logged stress around schedule changes"
└── IPS integration — extend job coach's visibility beyond day 90
```

**The two layers are one product.** A resident who builds skills at First Place → gets a job → uses the same app to stay in the job. The skill tracker data informs the retention coach. ("You've been working on 'handling unexpected change' for 3 months — here's how to request schedule advance notice as a formal accommodation.")

---

## Key Sources

| Claim | Source |
|---|---|
| Covert audio coaching produces durable job performance improvement | Bennett et al. (2010), *Journal of Applied Behavior Analysis* |
| Autistic workers need EF scaffolding, communication drafting, self-reflection — not masking tools | PMC13226117 (Singapore participatory LLM study) |
| AI in workplace settings improves autistic workers' verbal communication | Springer 10.1007/s10803-026-07313-4 (2026) |
| AI tools can constitute ADA reasonable accommodation | Cedeno v. Brookdale; Washington State DSB whitepaper 2025 |
| Post-hire AT is underexplored — researchers call for it explicitly | Zhou, Richard & Kim, *J. Vocational Rehabilitation*, Jan 2025 |
| 75% of autistic workers get no adjustments; adjustments = 3.14× odds | Cureus systematic review, 2025; Harvey et al. 2020 |
| Georgia Tech LLM job coach: post-hire gap confirmed, not yet shipped | gatech.edu + NSF award, Jan 15, 2026 |
