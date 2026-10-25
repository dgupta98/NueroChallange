# Brainstorm & Solution Guide — Updated
**Team Kaleidoscope | USA Track | Oct 24 – Nov 5**

---

## The Core Problem Space: Executive Function × Neurodiversity

Executive function (EF) is the brain's management system — governed by the prefrontal cortex. It breaks into 8 specific skills:

| EF Skill | What It Governs | Failure Looks Like |
|---|---|---|
| **Task initiation** | Starting a task without indefinite delay | "I know I have to do it, I just can't start" |
| **Working memory** | Holding info in mind while acting on it | Forgetting a 3-step instruction by step 2 |
| **Sustained attention** | Staying focused over time | Can't finish a lesson that runs longer than 10 min |
| **Flexibility** | Adjusting when plans change | Meltdown when the schedule changes unexpectedly |
| **Emotional control** | Regulating feelings so they don't override behavior | Emotional flooding; can't get back to work after upset |
| **Planning / prioritization** | Creating a sequence; deciding what's most important | Starting a task from the middle; missing steps |
| **Organization** | Keeping track of materials, information, time | Losing work, forgetting where things are |
| **Goal-directed persistence** | Staying on course despite distraction or effort | Starts well, abandons as soon as it gets hard |

**Why this matters for both partners:**
- AZACS students experience EF deficits every day in class — teachers compensate manually at enormous cost
- First Place AZ adults experience EF deficits in real life — apartment management, employment, healthcare
- **Autism and ADHD both disrupt EF** — and 30–80% of autistic students also have ADHD

The problem is not motivation or intelligence. It is neurological. The solution must reduce EF load, not demand more of it.

---

## How Conditions Map to EF Failures — Know This Before Designing

| Condition | Primary EF Failures | Secondary Effects |
|---|---|---|
| **Autism (ASD)** | Flexibility, emotional control, task initiation | Sensory overload disrupts all EF; transitions cause failure cascades |
| **ADHD** | Task initiation, sustained attention, working memory, time management | Time blindness; hyperfocus on preferred tasks distorts self-awareness |
| **AuDHD (Autism + ADHD)** | All of the above, compounded | Most common profile at AZACS — do not design for just one |
| **Intellectual Disability** | Working memory, planning, organization | Abstraction and future-orientation are harder; concrete, visual supports essential |
| **Dyslexia** | Written output, phonological processing | Working memory load increases significantly when reading is effortful |
| **Anxiety (co-occurring)** | Flexibility, sustained attention, task initiation | Anticipatory anxiety before transitions; "behavior problems" are often anxiety |

**Designing for EF means:** Remove the need for the user to manage these skills manually. Build the scaffold into the tool.

---

## User Personas — Who You Are Actually Designing For

### Persona 1 — Dylan's 3rd Grader (AZACS, Modified Academic)

**Profile:** 8–9 years old. Autistic. Reading at K–1 level. Expected to follow CKLA, a rigorous general-education phonics curriculum designed for neurotypical students with 2-hour lesson blocks.

**EF Profile:** Limited sustained attention; working memory constraints; task initiation supported by teacher prompting. Cannot independently persist through a full CKLA lesson.

**Daily reality:** Teacher cuts the lesson in half every day. Students complete 1–3 questions at most. The gap between the curriculum and the student's capacity is bridged entirely by manual teacher adaptation — which takes hours of prep.

**What they need:** A tool that adapts the lesson automatically to their level BEFORE the teacher has to create it manually — while preserving curriculum fidelity so the teacher isn't running an unauthorized modified program.

---

### Persona 2 — Kaleigh's High School Student (AZACS, Academic or Modified)

**Profile:** 14–17 years old. Autistic + likely ADHD. Academically capable but consistently abandons organization and self-tracking the moment external support is removed. "I don't need to do this" is their stated reason for stopping.

**EF Profile:** Task initiation when self-directed (not teacher-prompted) is the failure point. Goal-directed persistence collapses when scaffolding is faded. Emotional control affects willingness to engage with SEL topics.

**Daily reality:** Teacher gives a tool. Student uses it. Teacher fades support. Student stops using it. Back to zero. This cycle repeats indefinitely. SEL lessons are perceived as boring and irrelevant until an incident happens.

**What they need:** A self-tracking system that provides intrinsic motivation — not just external compliance — and that can detect fading engagement early enough to intervene before the student fully opts out.

---

### Persona 3 — Harpreet's STEAM Class (AZACS, mixed Academic + Modified)

**Profile:** Classroom of 10–14 students. Widely varying communication profiles, sensory sensitivities, behavioral needs, and support levels — all in one room at once. Teacher is a single person.

**EF Profile (teacher's):** Teacher must rapidly triage which student needs what support at what moment. This is an EF demand on the teacher, not the student — and it hits planning, prioritization, and working memory under pressure.

**Daily reality:** A coding lesson is underway. One student is heading toward sensory overload. Another hasn't started. Another needs a different prompt type entirely. The teacher cannot be in three places at once. The wrong call triggers a behavioral incident.

**What they need:** A tool that gives the teacher signal about each student's current state in real time — not more data to review, but a prioritized alert that says "these are the two things to address right now."

---

### Persona 4 — First Place AZ Resident, Working Adult

**Profile:** Adult, 22–40. Autistic. Living at First Place independently (moderate support needs). Has a job — or is trying to get/keep one. High verbal ability. Wants independence and to be treated as an adult.

**EF Profile:** Time management and flexibility are hardest. Handling unexpected changes at work (different manager, schedule shift, vague feedback) can cause emotional dysregulation that leads to job loss. Getting out the door on time every morning requires sustained planning that is fragile under stress.

**Daily reality:** Got the job. Lost it 3 months in because of a miscommunication with a supervisor that escalated. Looking for the next one. Knows the skills. Can't maintain the workflow under pressure. Nobody to coach them in the moment.

**What they need:** Real-time or near-real-time support for navigating workplace situations — not job training curriculum (they may have done that), but in-the-moment scaffolding for the specific EF demands of employment.

---

### Persona 5 — Adult Outside First Place (The Scale Persona)

**Profile:** Autistic adult, 22+. NOT living at First Place or any supported community. Somewhere in the 70,000–120,000 who age out of school supports every year. May be living with family. Underemployed or unemployed. Limited access to services.

**EF Profile:** All EF challenges, with no daily structure provided by an institution. Appointments are missed. Medications are forgotten. The day is unstructured. Healthcare is avoided because medical environments are overwhelming.

**Daily reality:** Josh explicitly said: design for this person, not just the 75 at First Place.

**What they need:** Something that works without requiring a supportive residential community around them. Accessible on a phone. Does not require a caregiver or support worker to set up or operate.

---

## Solution Space — Where to Play

### Category A: Teacher EF Tools (AZACS focus)

**Problem:** Teachers spend 1–3 hours daily on manual work that AI could do — lesson modification, IEP progress notes, differentiation planning, behavioral pattern analysis.

**Best opportunities:**

**A1 — Curriculum Adaptation Engine**
- Input: standard CKLA (or similar) lesson plan
- Output: three simultaneous modified versions (Academic, Modified, Functional levels)
- Must: preserve curriculum fidelity; work within ABA principles; generate in < 2 minutes
- AI does the labor; teacher reviews and approves
- Dylan Shloss's pain point exactly

**A2 — Real-Time Classroom State Monitor**
- Tracks student engagement signals (via teacher input or wearable data if available) and surfaces prioritized alerts
- "Student 3 showing pre-escalation signals — sensory break recommended"
- AI pattern-recognizes from behavior data; teacher acts
- Harpreet Kaur and Amelie Wachsmuth's pain point

**A3 — IEP Progress Note Generator**
- Teacher inputs quick behavioral observations; AI drafts progress note in IEP-compliant language
- Reduces after-hours documentation load
- Multiple staff cited teacher workload — this directly addresses the most time-consuming admin task

---

### Category B: Student Independence Tools (AZACS focus)

**Problem:** Students can use tools when teachers support them but disengage when support fades. Self-tracking and self-advocacy are the primary independence skills needed for adult life — but they require EF skills students don't yet have reliably.

**Best opportunities:**

**B1 — Adaptive Independence Scaffold**
- A self-tracking system that starts fully scaffolded (teacher-like prompting) and fades prompts based on successful completion patterns — but detects disengagement before the student fully opts out
- AI tracks compliance patterns and adjusts support level dynamically
- Kaleigh VanAlstine's and Gave Warrior's pain point

**B2 — SEL Engagement System**
- SEL content delivered through the student's special interests (AI personalizes framing)
- Moment-of-need delivery — triggers SEL micro-lesson at the right moment rather than in a scheduled block
- "You seem to be getting frustrated. Here's a quick thing that might help."
- Kaleigh VanAlstine's SEL pain point

**B3 — Communication Profile Tool**
- Stores and surfaces each student's communication preferences for any staff member who interacts with them
- "Marcus prefers: visual instructions first, then verbal. He uses approximations before full words. He responds to gesture more than touch."
- Chelse Conway's pain point exactly

---

### Category C: Adult Independence Tools (First Place AZ focus)

**Problem:** Adults with autism need EF support in daily life contexts — employment, healthcare, housing management — where no teacher is present to scaffold them.

**Best opportunities:**

**C1 — Employment Retention Coach**
- Not job placement training — targeted support for the specific EF demands of staying employed
- Real-time: "You just received an ambiguous message from your manager. Here are 3 concrete ways to respond."
- Async: pre-shift prep (what to expect today, what's different), post-shift debrief (what went well, what to do differently)
- Josh explicitly flagged keeping a job as harder than getting one

**C2 — Healthcare Appointment Navigator**
- Pre-visit: helps user organize what to say, ask, and share with the doctor (builds the Peace of Mind Portfolio in real time)
- During: reminder of what to ask; visual structure for the appointment
- Post-visit: plain-language summary of what was said; next steps
- Josh's 360 Health & Wellness + Peace of Mind Portfolio maps to this exactly

**C3 — Daily Structure Companion for Adults**
- Morning routine support, not a childish checklist — an adult tool
- Adapts to the user's actual schedule and capacity that day
- Detects when the user is off-track and offers lowest-effort next step
- For the 70K–120K who age out without access to a supportive community

---

### Category D: Cross-Context (Both Partners, Scalable)

**Problem:** The same EF challenges appear at AZACS and at First Place, just in different life stages. A solution that bridges both could be especially compelling for judges.

**Best opportunities:**

**D1 — Transition Planning Tool (School → Adulthood)**
- Designed for AZACS 9–12 students AND their teachers AND their future adult-services providers
- Tracks skill growth, preferences, and support needs as a portable record
- Closes the "service cliff" gap by creating continuity of knowledge even when services change
- Addresses Pre-ETS goals at AZACS + First Place's Transition Academy entry point

**D2 — Universal EF Scaffold**
- A single tool that adjusts its scaffolding depth based on user profile
- Teacher mode (supports classroom differentiation) + Student mode (self-regulation) + Adult mode (daily life)
- Most ambitious — hardest to build in 10 days; most compelling for judges if it works

---

## Solution Evaluation Matrix — Run Every Idea Through This

| Question | What "Pass" Looks Like | What "Fail" Looks Like |
|---|---|---|
| **Is this validated by partner research?** | You heard this specific problem from at least one AZACS/First Place contact | You assumed the problem; never heard it confirmed |
| **Is AI essential?** | AI does something impossible or impractical without it (personalization at scale, pattern detection, real-time adaptation) | AI is a label on something a spreadsheet could do |
| **Is it accessible?** | Works for users with limited literacy, varied communication, sensory sensitivities | Requires reading, precise motor input, or neurotypical social processing |
| **Does it reduce EF load, not increase it?** | Using the tool is simpler than the problem it solves | Using the tool requires more EF than just managing without it |
| **Can we build a working version in 10 days?** | Core function demos live; one user flow works end-to-end | It's a mockup, or it requires infrastructure we can't set up in time |
| **Does it respect dignity and autonomy?** | User controls what is tracked; system suggests, doesn't override | Caregiver controls it; system makes decisions for the user |
| **Does it work for the specific population, not just everyone?** | Designed for autism/ADHD/I/DD specifically — not just "neurodivergent-friendly" branding | Generic app with no design decisions about sensory, communication, or EF load |
| **Is it different from what already exists?** | Addresses a gap; does not recreate Google Calendar or Todoist | "It's like [common app] but for autism" without a genuine design difference |

---

## Design Principles — Non-Negotiable for This Population

**1. Reduce EF load in the interface itself**
- Every tap, every screen, every decision point is an EF demand
- Fewer screens, fewer decisions, fewer words per prompt
- Default states should be the right choice; opt-out is easier than opt-in

**2. Visual + text, not text only**
- Many AZACS students and some First Place adults have limited reading fluency
- Icons, color coding, and spatial layout carry meaning — use them intentionally
- Do NOT rely on reading as the primary mode

**3. Predictable, not surprising**
- Notifications must not be alarming — tone, timing, and phrasing matter
- Changes to the interface should be communicated before they happen
- Unexpected behavior in the app is a trigger for the same users who struggle with unexpected behavior in life

**4. Explicit over implicit**
- Do not rely on the user inferring what to do next
- "Tap the green button to start your morning routine" > a green button with no label
- Social scripts work because they are explicit — so should your UI

**5. Sensory-aware**
- Avoid flashing/pulsing animations
- Default to lower contrast / softer tones (offer high-contrast mode)
- Audio should be optional and controllable
- Haptic feedback should be off by default for sensory-hypersensitive users

**6. Never infantilizing**
- Adult-first design at First Place: no primary colors, no cartoon characters, no patronizing tone
- For AZACS: visual interest and engagement are appropriate for kids; but never condescending
- Language should match the user's actual communication level, not lowest common denominator

**7. The user is in control**
- Especially at First Place: the system makes suggestions, the user decides
- Tracking is transparent — user knows what is being recorded
- Off/pause is always available

---

## What Judges Will Reward Most

From the rubric + PI framework + what the partners said in the video:

**Highest-value differentiators:**
1. **Real partner quotes in your pitch** — shows you actually talked to them
2. **Specific EF mechanism named** — "this addresses task initiation failure during curriculum transitions" is far stronger than "helps kids focus"
3. **Working demo, even if limited** — one flow that actually runs beats a beautiful mockup
4. **Scalability argument rooted in the service cliff** — Josh gave you the framing: 70K–120K people aging out every year; most have no First Place
5. **Principled Innovation framing** — explicitly name the tension your tool navigates (e.g., "we built AI that scaffolds independence rather than creating dependency — here's how")
6. **Research changed your solution** — the rubric requires you to say what you learned that changed your design; prepare this statement explicitly

**What will hurt you:**
- Solving a problem you assumed, not one the partner confirmed
- An MVP that only shows screenshots
- AI used only for content generation (LLM chatbot as core product)
- "Designed for neurodiverse people" without specific design decisions that prove it

---

## Sprint Plan — 10 Days (Oct 25 – Nov 5)

### Days 1–2 (Oct 25–26): First Contact
- [ ] Send intro emails to AZACS contacts (Gave, Kaleigh, Harpreet, Dylan — highest pain point match; CC Supreet on all)
- [ ] Attempt First Place AZ contact immediately (tour signup was due midnight Oct 24 — if missed, contact @ Challenge Organizer)
- [ ] Sign up for AZACS campus tour (deadline: Oct 27 noon)
- [ ] Submit Daily Progress Reports AM + PM
- [ ] Start discussion: which solution category are we targeting? (A, B, C, or D)

### Days 3–4 (Oct 27–28): Partner Research
- [ ] Conduct at least 2 partner meetings (Google Meet or Zoom)
- [ ] AZACS campus tour: Oct 29 OR Nov 5 — 2 people, 9:30 AM, 4125 N. 14th St
- [ ] Sort notes into: patterns / tensions / needs / design constraints
- [ ] Write: "Our research changed our solution because ___"
- [ ] Lock problem statement and primary user persona

**Josh blackout: Oct 30–Nov 3. Get First Place meeting in BEFORE Oct 30.**

### Days 5–7 (Oct 29–31): Define and Begin Build
- [ ] Finalize solution concept; reject everything that fails the evaluation matrix
- [ ] Define the one demo flow you will show live
- [ ] Begin GitHub repo with README
- [ ] Start MVP build: focus on the single working user flow
- [ ] Begin Business Model Canvas (9 sections)
- [ ] Log all AI prompts as you use them (PDF due at submission)

### Days 8–9 (Nov 1–4): Build + Pitch
- [ ] Functional MVP must be working by Nov 3
- [ ] 5-slide pitch deck in the required template (no custom slides)
- [ ] Populate Business Model Canvas fully
- [ ] Draft written submission responses
- [ ] Practice pitch timing — slides auto-advance, must hit 5:00 exactly

### Day 10 (Nov 5): Final Submission
- [ ] Final MVP polish — only what's needed for the demo path
- [ ] Full run-through on the presentation device (not your dev machine)
- [ ] Submit all materials via Airtable before 11:59 PM MT:
  - GitHub repo URL
  - Pitch deck URL
  - Business Model Canvas
  - AI Prompts PDF
  - Written responses
  - Responsible AI checklist

---

## Pitch Structure (5 Minutes — Auto-Advancing Slides)

| Slide | Time | What to Say | What NOT to Do |
|---|---|---|---|
| **1 — Title** | 10 sec | Venture name, team Kaleidoscope, Scottsdale Launchpad, ASU logo | Long intro |
| **2 — User** | 60 sec | Specific persona from partner research — name them (or give a representative description). Quote something a partner actually said. | Vague "neurodivergent person" persona |
| **3 — Problem** | 60 sec | Specific EF mechanism. "When [trigger], [user] cannot [EF skill], and the result is [consequence]." One stat or quote. | Generic "focus is hard" framing |
| **4 — Solution + Demo** | ~2.5 min | Show the working prototype live. One user flow from start to finish. Narrate what the AI is doing and why it's necessary. | Showing slides about the product instead of the product |
| **5 — What's Next** | 30 sec | Scale argument: who is the next 1,000 users? Reference the service cliff or AZACS expansion. | Vague "we'll grow this" |

---

## Red Flags — What Eliminates You

- Solution is not grounded in actual partner research conversations (disqualification risk under rubric criterion #2)
- MVP is wireframes or mockups only (must be functional)
- AI is cosmetic — the product would work the same without it
- 100% AI-generated code (human must be visibly in the loop)
- Missing daily progress reports (twice daily, Oct 25–Nov 5)
- First Place AZ tour missed AND no alternative partner meeting scheduled
- Pitch exceeds 5 minutes (slides cut you off — practice)
- Code repo has no documentation or attribution
- Responsible AI checklist not completed

---

## The One Thing to Keep Coming Back To

The problem is not that these students or adults are incapable. The problem is that the world was built for a neurological profile they don't have, and the scaffolding they need has to be provided by a human being — which is expensive, inconsistent, and doesn't scale.

**Your job is to build the scaffold, not fix the person.**

If your solution increases what the user can do independently, without requiring a human to manage it for them — you're in the right space.
