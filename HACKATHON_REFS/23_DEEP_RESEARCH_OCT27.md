# Deep Research — Post-Visit Findings
**Compiled: Oct 27 | Based on: Site visit transcript + live web research**

> This document covers everything that emerged from today's First Place visit that required deeper investigation: skill tracking products, VR/AR technology, wearable seizure detection, smart glasses for autism, plain language AI, and the social connection → employment research base.

---

## Section 1: Skill Tracking & Self-Determination for Neurodiverse Adults

### What Josh Asked For (The Direct Brief)
*"Is there something that would allow me to connect with my support therapist to say, cool, I met that skill? And also build confidence for the repertory skills that I'm learning… Technology might actually be their friend — it has a bigger memory space and maybe create algorithms and AI that's gonna support them. It might even suggest things they could be working towards."*

### What Currently Exists (And What It Misses)

| Product | What It Does | Who Uses It | What It Misses |
|---|---|---|---|
| **Therap / CentralReach** | Clinical skill tracking, goal data, behavior data | Staff only (clinicians/DSPs) | No resident-facing view. Data belongs to org, not person. |
| **LifeLoop / MyClip** | Activity calendar, family photos, sign-up | Residents + families | Zero skill tracking. Senior-living origin. No AI. |
| **Goalbook** | IEP goal tracking, curriculum alignment | Special ed teachers | Youth only, not post-22, not self-directed |
| **Tiimo** | Visual daily planner for ND adults | ADHD/autism adults independently | Scheduling only, no milestone tracking, no AI suggestions |
| **Habitica / Finch** | Gamified habits, daily streaks | General population | No skill domain taxonomy, not ND-specific, no milestone model |
| **Pathways (UK)** | Structured learning modules for adults with LD | Adults with learning disabilities | UK-only, module completion ≠ skill milestone tracking, no AI |
| **Monarch / MyDirectPlan** | Medicaid waiver budget self-direction | Adults with IDD on HCBS waivers | Budget/service management, not skill development |

**Verdict: The specific combination Josh described — resident-facing, milestone-based, AI-suggested next steps, life skills domains for autistic adults 18+ — has no direct competitor anywhere. This gap is real and unoccupied.**

---

### The Research Base That Validates This Product

**Self-Determination (the "why it works" science):**
- **Wehmeyer & Schwartz (1997)** — *Exceptional Children, 63(2)*: Students with higher self-determination had significantly better employment AND independent living outcomes one year after school exit. Self-determination is the single strongest predictor of adult outcomes in IDD.
- **Lachapelle et al. (2005)** — *Journal of Intellectual Disability Research*: Self-determination score was the strongest predictor of quality of life for adults with IDD — stronger than adaptive behavior, residential setting, or employment status.
- **Shogren et al. (2015)** — Causal agency theory: the person is the causal agent in their own life. A self-tracking tool embodies this philosophy by design.

**Self-Monitoring (the "how it works" mechanism):**
- **Koegel & Koegel (1990)** — Foundational autism research: self-management (including self-monitoring) is more effective than external monitoring for increasing independence AND generalizing skills. The effect lasts longer because it's internally driven.
- **Lee et al. (2007)** — *Journal of Positive Behavior Interventions*: Autistic individuals who self-monitored skill performance showed greater generalization and maintenance versus staff-monitored peers.
- **Briesch & Chafouleas (2020) meta-analysis**: Self-monitoring increases self-efficacy and goal attainment; the effect is strongest when individuals receive **visual feedback on progress** — directly supports a data visualization feature.

**Align to Charting the LifeCourse Framework:**
The LifeCourse Framework (University of Missouri, Wehmeyer group) is the dominant US framework for thinking about IDD adult life domains. It maps to exactly what Josh described:
- Daily Life & Employment
- Community Living
- Health & Safety
- Social & Relationships

First Place's skill domains (cooking, money management, relationships, employment readiness) align perfectly. Building to this taxonomy means instant compatibility with IDD sector language and care planning.

---

### MyClip = LifeLoop (Confirmed)
**MyClip is the resident/family-facing interface of LifeLoop** — same platform, same company, potentially a white-label or rebranded version for First Place AZ. LifeLoop was built for senior living; First Place adapted it for their population. This confirms our pre-visit research: the activity calendar is solved, the self-determination layer is not.

---

## Section 2: VR for Social Skills, Employment, and Safety Training

### Floreo VR — The Market Leader

**What it is:** Research-backed VR therapy platform for autism, ADHD, and neurodivergent individuals of all ages.
- Works with iPhone + Google Cardboard OR PICO VR headsets OR browser
- Teaches social, behavioral, communication, and life skills
- **Relevant to First Place:** Has a **Police Safety Module** specifically for adolescents and adults with autism — published feasibility study shows "autistic participants who practiced police interactions in realistic VR scenarios showed measurable skill gains in reducing fidgeting and acting more prepared" (News-Medical, May 2026)
- **FDA pivotal trial** completed November 2025 via Cortica network (17 centers)
- **Peer-reviewed December 2025:** Randomized control trial showing significant improvement in communication scores on Autism Impact Measure
- **Clinician-led** (not self-directed) — requires a coach/therapist to run sessions

**What it misses for First Place:**
- Clinician-required (not independent self-use)
- Subscription-based for providers; not a resident-owned tool
- No employment scenario practice beyond safety skills
- No skill milestone tracking across domains

**Verdict:** Floreo is the VR product to watch. It's not a competitor — it requires clinical staff. The VR room Josh wants would likely use Floreo or a similar platform. The skill tracker we're building is complementary.

---

### VirTra + SARRC — The Law Enforcement Simulator

**What Josh called "Vertra" is actually VirTra (virtra.com).**

- **Partnership confirmed:** SARRC (Southwest Autism Research & Resource Center — First Place's founding co-partner) co-developed an autism awareness training simulator with VirTra in 2018–2020
- **What it does:** VR scenarios for law enforcement officers to practice recognizing and interacting with autistic individuals — stimming recognition, communication barriers, de-escalation
- **Deployed at:** 300+ law enforcement agencies
- **Actors with autism diagnoses** were used to film the scenarios
- **SARRC contact for this:** Miranda Fuller, mfuller@virtra.com

**Key implication:** First Place has a direct relationship with SARRC, who co-built VirTra's autism module. If First Place wants a VR room for resident law enforcement practice (the other direction — teaching residents how to interact with police), VirTra is the natural partner they'd call. This is already in their ecosystem.

---

### VR Job Interview Training (VR-JIT) — Research Exists

- **Published study:** PMC4167908 — "Virtual Reality Job Interview Training in Adults with Autism Spectrum Disorder" (*Journal of Autism and Developmental Disorders*)
- **Finding:** VR-JIT improved job interview performance in autistic adults in controlled study
- **Limitation:** Research protocol, not a consumer product; required lab setup

**Implication:** Employment scenario VR (interviews, manager conversations, workplace situations) is research-validated but not yet productized for consumer/residential use. The VR room Josh envisions is grounded in real science.

---

## Section 3: Smart Glasses & AR for Real-Time Social Coaching

### Stanford Autism Glass Project — The Closest Thing

**Website:** autismglass.stanford.edu (Dennis Wall Lab)

- **What it does:** Machine learning and AI to automate facial expression recognition running on wearable glasses (originally Google Glass)
- **How it works:** Glasses detect faces and analyze emotional expressions in real time; an audio cue or visual indicator tells the wearer what emotion is detected
- **Research results:** Pilot studies showed improved social interaction quality in autistic children; parents reported significantly more eye contact and social engagement during sessions
- **Current status:** Research prototype. Not commercially available. The Google Glass hardware was discontinued; research continues on alternative form factors.
- **Who used it in study:** Children (ages 6-17); some adult research ongoing

**This is exactly what Josh described** when he said "meta glasses that detect facial expressions and tell you in your ear if this person seems uncomfortable."

---

### Brain Power System

- **What it is:** Augmented reality smart glass system (uses Google Glass/similar) with Affectiva emotion recognition AI
- **How it works:** Runs games and social coaching overlays on smart glasses; uses Affectiva's real-time facial emotion detection to give feedback
- **Target:** Children and adults with autism
- **Affectiva integration:** Affectiva's emotion recognition API characterizes facial expressions and body language into emotional categories in real time — this is the technology layer
- **Status:** Company exists (Brain Power, Inc.); unclear if commercially available at scale as of 2026

---

### Meta Ray-Ban Smart Glasses — The Consumer Form Factor Josh Named

- **Current product (Meta Ray-Ban Stories / Meta Ray-Ban 2024+):** Camera, mic, speakers built into regular-looking glasses frames
- **What they can do now:** Photo/video capture, voice commands to Meta AI, music playback, call handling
- **What they CAN'T do yet:** Real-time facial expression detection, social coaching overlays, AR overlays
- **What's coming:** Meta is investing heavily in smart glasses as the successor to phone; AR capabilities are on the roadmap but not yet available in consumer form
- **Key insight for First Place's VR room concept:** Meta glasses are the consumer-ready form factor. The technology for real-time social coaching (Stanford's approach) is not yet deployable on Meta glasses as of October 2026, but the trajectory is clear.

---

### Plain Language AI — A Critical Caution

**ASAN's Position (July 2025):** The Autistic Self Advocacy Network published a formal position paper titled "ASAN Says No Generative AI in Plain Language" — arguing that generative AI produces plain language that passes surface readability tests but fails the actual needs of people with cognitive disabilities in ways current models cannot detect.

**The case for AI plain language (ICI/UMN, 2025):** "AI can create plain-language and easy-read versions of every piece of writing" — research suggesting AI is nearly capable of this at scale.

**What this means for a product:**
- If your pitch includes a plain language converter, be aware ASAN (the leading autistic-led advocacy org) has formally opposed this use case
- The criticism is about accuracy and false confidence — AI summaries look accessible but may omit critical information
- A safer framing: AI-assisted plain language with human review, not fully automated
- This is a **future feature** to approach carefully, not a core MVP feature

---

## Section 4: Wearable Seizure Detection — Why the AWS Trial Failed and What Exists

### The Co-Occurrence Reality
- **20-30% of autistic people also have epilepsy** (multiple epidemiological studies)
- At First Place's scale, this means a meaningful number of residents have seizure risk
- The AWS wearable trial failed universally due to sensory sensitivity — "the material was really undesirable for the texture or they just hated the feeling"

### Current Seizure Detection Technology

| Product | Form Factor | FDA Cleared? | Sensory Issue | Notes |
|---|---|---|---|---|
| **Embrace2 (Empatica)** | Wristband | Yes (2018, De Novo) | High — silicone wristband | Only detects generalized tonic-clonic seizures; 95% sensitivity in EMU studies |
| **Brain Sentinel SPEAC** | Upper-arm EMG patch | Yes | Moderate — adhesive patch | More targeted muscle sensor; less wrist sensitivity |
| **Emfit QS** | Under-mattress sensor | No (not medical) | None — no wearable | Only works during sleep; no sensory barrier whatsoever |
| **NightWatch (Netherlands)** | Upper arm + mattress | European CE Mark | Lower than wristband | Designed for IDD+severe epilepsy; not US-available as of 2026 |
| **EpiWatch (Apple Watch)** | Wrist (Apple Watch) | No | Moderate | Patient-initiated recording; not passive detection |
| **Oura Ring / Ring form** | Finger ring | No (not for seizures) | Low — familiar jewelry sensation | HRV/EDA monitoring; not FDA-cleared for seizure detection |

**The critical gap:** No FDA-cleared seizure detection device was designed with autism sensory sensitivity as a primary design constraint. NightWatch comes closest (IDD-specific) but is unavailable in the US.

### What This Means for a Solution
- **Non-contact sensors** (under-mattress) are the only zero-sensory-barrier option, but they only work during sleep
- **Ring form factor** has best sensory acceptance for daytime use but no FDA clearance for seizures
- This is a real product gap, but it's a hardware product — not a 10-day hackathon build
- **For the pitch:** The AWS trial failure is a concrete data point that validates the sensory-first design principle: any tool for this population must consider sensory profile before any other feature

---

## Section 5: Social Connection → Employment — The Research Base

### The Keystone Claim (Josh's Observation, Now Research-Backed)

*"Once people integrate socially, they're more likely to want a job, more likely to take care of their house."*

This is consistent with self-determination theory (Deci & Ryan): belonging and relatedness are foundational to intrinsic motivation for all other life domains.

### The Stats to Use in a Pitch

| Claim | Source | Strength |
|---|---|---|
| 79% of autistic adults report social isolation | National Autistic Society, 2019 | Strong — large UK study |
| 85% unemployment / underemployment for autistic adults | Multiple studies (widely cited) | Very strong — consistent across US, UK, AU data |
| 35% of autistic young adults had zero employment AND zero education 2 years post-school — highest of any disability group | Shattuck et al., 2012, *Pediatrics* (n=1,000+) | Very strong — longitudinal, landmark paper |
| Social participation and employment declined together post service-cliff | Shattuck et al., 2012; Roux et al., 2013 NLTS-2 | Strong |
| Loneliness predicts mental health outcomes more strongly than diagnostic severity | Bishop-Fitzpatrick & Kind, 2020, *Autism in Adulthood* | Moderate-strong |
| "Once they integrate socially, they want a job, clean their house" | Josh, First Place AZ, Oct 27 2026 | Primary source — your own field data |
| 85% of First Place residents employed or volunteering | Josh, kickoff video | First Place data point |

### The Mechanism
The research doesn't yet have a clean causal RCT on "social connection causes employment." But the mechanism Josh described maps directly to:
1. **Self-determination theory**: Relatedness (belonging) activates autonomous motivation for other life domains
2. **The practical logic Josh gave**: Social events → apartment preparation → cooking → hosting → employment need
3. **First Place's own data**: 85% employment rate is among the highest in any autistic adult residential program — and they intentionally build social infrastructure first

**For the pitch:** The correlation is extremely strong. The mechanism is theoretically and practically well-explained. The causality direction is supported by First Place's outcomes. Use Josh's quote as the practitioner lens on the data.

---

## Section 6: The OAR Connection (Josh Mentioned It)

**OAR = Organization for Autism Research** (researchautism.org)

- Funds practical, applied research on autism (not basic science) — specifically focused on improving daily life for autistic people
- Notable publications: "Life Journey Through Autism" series (guides for employers, educators, families)
- Has an employment-focused research arm and a transition-focused research program
- **Relevant to pitch:** OAR's research directly validates the employment retention gap — they've published extensively on why autistic employees are lost in probationary periods
- **Potential funding angle:** OAR funds small research projects and pilot programs — a post-hackathon funding pathway

---

## Section 7: The 360 Health & Wellness Curriculum

**First Place's own curriculum** — referenced in visit materials. Covers:
- Physical health
- Mental/emotional health
- Social health
- Financial health
- Vocational health

This is the internal framework First Place uses. **Your skill tracker should align to this taxonomy** — not create a new one — so it feels native to what residents already learn at First Place. The 360 framework maps directly to:
- Cooking/nutrition → Physical health
- Money management → Financial health
- Relationships → Social health
- Employment readiness → Vocational health
- Emotional regulation → Mental/emotional health

---

## Section 8: Dyslexia & ADHD Skill-Building Platforms

*(From Josh's mention of platforms for skill-building and job readiness)*

### For Dyslexia
- **Speechify**: Text-to-speech at adjustable speed; widely used by dyslexic adults; AI reading assistant layer added in 2024-2025
- **Natural Reader**: Similar TTS; document reading
- **Microsoft Immersive Reader**: Built into Office/Edge; line focus, syllable highlighting, picture dictionary
- **Beeline Reader**: Color-gradient text to guide eye movement — reduces cognitive load for tracking lines

### For ADHD Job Readiness
- **Tiimo**: Visual schedule with time-blindness accommodations (named earlier)
- **Focusmate**: Body-doubling accountability sessions (video co-working with a partner)
- **Motion App**: AI-powered task prioritization and calendar scheduling for ADHD
- **Goblin.tools**: AI task breakdown — enter one task, AI breaks it into steps and estimates time. Specifically designed for people who struggle with task initiation (ADHD, autism)

**Goblin.tools is particularly relevant**: It's the closest thing to what we'd want in a skill tracker's "break this down for me" feature. It's free, open to API use, and has been explicitly recommended in ND communities.

---

## Synthesis: What This Research Changes About the Build

### Confirmed Pivots From Today's Research

1. **The skill tracker is the right call.** Josh said it directly. No competitor exists. The research supports it working.

2. **Align the skill taxonomy to First Place's 360 Health & Wellness framework** — not a new taxonomy. Use what exists.

3. **ASAN opposes fully automated AI plain language.** If this feature appears, frame it as AI-assisted + human-reviewed. Don't make it the product.

4. **The VirTra/SARRC connection is an asset.** First Place already has a law enforcement VR relationship through SARRC. The VR room Josh described is already partially in their network — mention it in the pitch as part of the ecosystem.

5. **Design for ADHD co-occurrence.** Goblin.tools (task breakdown) + Tiimo (scheduling) are the UX comparables. Short loops, immediate visual reward, forgiving design.

6. **The wearable story is a design principle, not a product direction.** Hardware is out of scope for 10 days. But the Amazon AWS failure validates "sensory-first design" as a core product principle — use it in the pitch as proof you understand the population.

---

## Competitor Table Update (All Sectors, Oct 27)

| Product | Category | Resident-facing? | Skill tracking? | AI suggestions? | ND-specific? | Compete/Complement |
|---|---|---|---|---|---|---|
| Therap / CentralReach | Clinical data | No (staff only) | Yes (clinical) | No | Yes | Complement — you're the resident layer |
| LifeLoop / MyClip | Activity mgmt | Yes | No | No | No (senior) | Complement — they schedule, you develop |
| Floreo VR | VR social skills | Clinician-led | No | No | Yes | Complement — different modality |
| VirTra (SARRC partner) | VR law enforcement | Resident practice | No | No | Adjacent | Ecosystem partner for FP |
| Tiimo | Visual planner | Yes (self) | No | No | ADHD/autism | UX inspiration, not competitor |
| Goblin.tools | Task breakdown | Yes (self) | No | Yes (task only) | ND-adjacent | Feature inspiration |
| Charting LifeCourse | Framework | Facilitated | Framework only | No | Yes (IDD) | Taxonomy to adopt |
| Stanford Glass | AR coaching | Research only | No | Yes (facial) | Yes | Future integration |
| Embrace2 | Seizure wearable | Yes | No (health data) | No | No (general) | Different domain |
| **YOUR PRODUCT** | Skill milestone tracker | **Yes** | **Yes** | **Yes** | **Yes** | **Unoccupied gap** |
