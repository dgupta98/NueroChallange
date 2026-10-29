# The Six ADHD Mechanisms — Mapped to Product Design
**Source: Dr. Sasha Hamdani, psychiatrist (ADHD-specialist, has ADHD herself) — YouTube transcript**
**Compiled: Oct 28 | Application: Skill Tracker + Post-Hire Retention Coach**

> Dr. Hamdani's core insight: underneath every ADHD hack that has ever worked, there are six mechanisms. Every product feature should serve one of these mechanisms explicitly. This file maps each mechanism to specific decisions in our build.

**Why this applies to our users:** Josh confirmed ADHD + autism co-occur at very high rates ("first cousins — really common"). First Place residents and employed autistic adults are not a single-diagnosis population. These mechanisms apply across autism, ADHD, and IDD. Any feature designed against these mechanisms will fail. Any feature designed for them will be used.

---

## Mechanism 1: Externalize Working Memory

**The science:** ADHD brains don't store information incorrectly — they often fail to encode it in the first place. Forgetting where you put your keys isn't a memory problem. The information never got in. The fix isn't trying harder to remember. It's removing memory from the equation entirely.

**Dr. Hamdani's rule:** "If you're relying on it living inside your head, it's already halfway gone. Get it out."

### Product Implications

| Feature | How It Externalizes Memory |
|---|---|
| **Skill milestone log** | Progress lives in the app, not in the resident's head or a staff member's notebook. The resident never has to "remember" how far they've come — it's visible. |
| **Post-shift voice log** | Voice capture at shift end before the working memory moves on. One tap, speak, done. The emotional processing happens later — the capture happens in the moment. |
| **Pre-shift prep brief** | "Here's what's scheduled for your shift today. Your manager is X. Your station is Y." Written, visible, not assumed. |
| **Accommodation record** | Once a request is made and filed, the app holds the record. Resident doesn't have to remember what they asked for or when. |
| **Step-by-step task breakdowns** | The Goblin.tools model — one task in, step-by-step breakdown out. Never ask someone to hold multi-step instructions in working memory. |

**Design rule:** Never ask the user to remember anything between sessions. Every session should be self-contained. Onboarding data, job context, employer name, prior logs — all surfaced by the app, not recalled by the user.

---

## Mechanism 2: Engineer the Start

**The science:** ADHD disrupts task initiation even when you know exactly what to do and how to do it. The gap between knowing and starting isn't laziness — it's executive dysfunction. The fix is not "just start." The fix is making the start so small that the brain can't generate enough resistance to stop it.

**Dr. Hamdani's rule:** "Your interest-based nervous system will get you moving. Logic won't."

### Product Implications

| Feature | How It Engineers the Start |
|---|---|
| **One-tap shift log entry** | The prompt is one question: "How was your shift?" Not a form. Not multiple fields. One question. The bar to entry is as low as possible. |
| **Pre-built scenario buttons** | "My manager said something confusing" / "Schedule changed" / "I had a conflict with a coworker" — tapping a button is a lower initiation cost than typing a description. |
| **Skill milestone: absurdly small units** | Not "Employment Readiness." Not "Get a Job." The smallest meaningful unit: "Attended one career exploration activity." "Introduced myself to one new person at work." Momentum builds from there. |
| **Two-minute rule for check-ins** | Notifications say: "Just 2 minutes — how did work go?" Not "Complete your daily wellness log." |
| **Review Prep: day-before setup** | Night-before prompt: "Your 90-day review is tomorrow. Let's get you ready." Preparation is separated from execution so morning-self has less resistance. |
| **Easiest task first** | The skill tracker should surface the most achievable next step, not the most important one. Build momentum. The interest-based nervous system carries the rest. |

**Design rule:** Every entry point into the app must have a "minimum viable interaction" path. A user who can only tap one thing and leave should still get value. Never gate the experience behind completing a full flow.

---

## Mechanism 3: Regulate Stimulation

**The science:** ADHD brains have a higher stimulation threshold. Dopamine dysregulation means the brain is constantly seeking input to reach optimal functioning. Fidgeting, tapping, hair twirling — these aren't distractions. They're regulation. The fix isn't eliminating stimulation. It's channeling it.

**Dr. Hamdani's four tools:** Body doubling, sound regulation (brown noise, lo-fi), gamification, novelty rotation.

### Product Implications

| Feature | How It Regulates Stimulation |
|---|---|
| **Body doubling via community life** | The skill tracker surfaces relevant First Place community events after a hard shift. "You had a tough one today — the cooking class is tonight and there'll be 4 people there." Getting out of the apartment into a low-pressure social setting IS the intervention. |
| **Gamification: micro-wins** | Every logged milestone gets a visible acknowledgment. Streaks for consistent logging. Progress bars. Small-win counters. The reward must be immediate — delayed payoff doesn't work for this brain type. |
| **Skill tracker as stimulation hook** | The act of logging a milestone IS a small dopamine hit. Design it to feel satisfying — haptic feedback, a celebratory micro-animation, a progress bar that moves. |
| **Novelty in AI responses** | The AI should not give the same response format every time. Vary phrasing, vary question style, vary the celebration message for milestones. Brain habituates to repeated stimuli. Rotate. |
| **Sound suggestion for work prep** | For users who log pre-shift anxiety: "Some people find brown noise or lo-fi helps before a high-stimulation shift. Want a link?" Not prescriptive — just surfaced as an option. |

**Design rule:** The app should feel responsive and alive, not clinical and static. Micro-animations, varied responses, tactile feedback. This isn't aesthetic polish — it's a functional regulation tool.

---

## Mechanism 4: Let the System Rest

**The science:** In ADHD brains, the executive network (goal-directed) and the default mode network (non-goal-directed) fire simultaneously. This doesn't happen in neurotypical brains, where the default mode quiets when goal-directed activity starts. The result: mental noise, faster burnout, creativity that only surfaces during rest. Pushing harder makes it worse. 5-10 minutes of genuine nothing — not scrolling, not resting while multitasking — lets the default mode run. That's where the answers are.

**Dr. Hamdani's rule:** "Not scrolling. Nothing. You just let that default mode network run."

### Product Implications

| Feature | How It Enables Rest |
|---|---|
| **Post-shift decompression — passive mode** | After a difficult shift log, the app's first response is NOT a suggestion list. It's: "That sounds like a hard one. You don't have to figure anything out right now." Optionally: a 5-minute guided wind-down. |
| **No shame for logging gaps** | If a user hasn't logged in 4 days, no "you haven't checked in" notification with a streak broken. Rest periods are normal and necessary. The app should resume without comment when they return. |
| **Overstimulation detection** | If a user logs 3+ high-stress shifts in a row, the app suggests a rest before offering action items. "You've had a lot going on. Before we look at what to do next, let's just acknowledge that." |
| **Boredom as a valid state** | Post-shift prompt includes a "Nothing much happened, it was fine" option. Not everything needs to be processed. Not every shift needs an insight. The default mode gets to run. |
| **Single-question UI discipline** | The app never asks more than one thing at a time. Less input = less load = more space for the brain to rest between interactions. |

**Design rule:** The app must never feel like another productivity system to maintain. Clinically-framed "you need to log daily" requirements are the notebook with a beautiful first page and nothing after. Build for intermittent, low-barrier engagement — not compliance.

---

## Mechanism 5: Regulate the Body Running the Brain

**The science:** Sleep, movement, and nutrition are the platform everything else runs on. For ADHD specifically: delayed melatonin onset means natural bedtime is later; this isn't a character flaw, it's biology. Exercise raises baseline dopamine — one of the few behavioral interventions with strong data. Diet matters: protein over simple carbs for a brain running hot.

**Dr. Hamdani:** "This isn't glamorous. But it's the one that keeps all the other ones running."

### Product Implications

| Feature | How It Supports Body Regulation |
|---|---|
| **Physical domain in skill tracker** | First Place's 360 framework includes Physical health. Milestones in this domain (consistent sleep routine, 20-min daily movement, cooking a protein-forward meal) are as trackable as social or vocational milestones. |
| **Post-shift physical check-in** | "Before we talk about work — how's your body right now? Hungry? Tired? Tense?" This is not medical. It's context. A user who logs "exhausted and didn't sleep" gets a different response than one who logged "felt great today." |
| **Pre-shift readiness** | Optional prompt the morning of a shift: "Did you eat? How did you sleep?" Not nagging — a lightweight physical state check that improves the quality of the AI's situational response. |
| **Movement as skill milestone** | "Walked to work 3 times this week" is a legitimate milestone in the Physical domain. The app should not only track the cognitive/social skills. Movement is brain fuel. |
| **Sleep routine milestone** | "Consistent wind-down routine for 2 weeks" is a trackable milestone with genuine employment impact. Sleep deprivation is one of the most underacknowledged predictors of job loss for this population. |

**Design rule:** The Physical domain is not an afterthought. The body-brain connection is especially strong for ADHD and autism. Skill tracker taxonomy must include it as a first-class domain, not a bonus category.

---

## Mechanism 6: Diffuse the Shame — THE MOST IMPORTANT

**The science:** Shame doesn't just feel bad — it directly crushes executive function. When in a shame spiral, the brain literally cannot access the tools that would help. Every failed system, abandoned app, and broken streak adds to a pile of evidence that you can't follow through. Trying harder in that state makes it worse. The block for many people isn't executive function — it's the shame that's accumulated from trying and failing.

**Dr. Hamdani:** "Shame isn't an abstract thing. We know it crushes executive function directly. Trying harder in that state is just pounding your head against a wall."

**This is the most important mechanism for our population.** PMC9838300 (the employer-initiated termination study) found nearly half of autistic adults attributed their job loss to internal causes — "my personality and weirdness," "I was not on my best behavior." That internalization IS shame. And shame prevents re-employment attempts.

### Product Implications

**A. Tone Architecture — Non-Negotiable**

Every piece of text in the app must be written against these principles:

| What NOT to do | What TO do |
|---|---|
| "You missed your check-in for 4 days" | Resume without comment when they return |
| "Your streak is broken" | No streaks that punish gaps |
| "You should have asked for accommodations sooner" | "Most people don't know they can ask. Now you do." |
| "You made a mistake" | "That situation was hard. Here's what was happening." |
| "Why did you do that?" | "What do you think was going on?" |

**B. The Situation Decoder Reframe**

When a user logs a difficult workplace interaction, the AI's first job is to externalize the cause — not confirm the user's fear that they're the problem.

- "My manager seemed frustrated with me" → "Managers often communicate frustration through tone rather than words. It's genuinely hard to read. Here's what this likely meant — and here's what it probably didn't mean."
- "I think I offended a coworker" → "Workplace social dynamics are complicated for everyone. Here's what likely happened and what your options are."
- "I got written up" → "A write-up is a formal communication about a specific behavior. It's not a verdict on you as a person. Here's what it means and what to do next."

**C. The Accommodation Reframe**

The 75% who never get accommodations often don't ask because asking feels like admitting failure or asking for special treatment. The app's framing must counter this:

- "The workplace was designed for a different brain type. Adjustments aren't charity — they're how you get equal access to the same job your coworkers have."
- "You're not asking for less. You're asking for what you need to do the same work."

**D. The Skill Tracker's Role in Shame Diffusion**

The skill tracker is an anti-shame device in disguise. When a resident has visual evidence of 30 milestones logged — cooking classes, conversations, employment readiness steps — they have an external record that contradicts the internal narrative of "I can't follow through."

- Milestone history = evidence against shame spiral
- Shareable progress with family = external validation that replaces staff-dependent confirmation
- "Look how far you've come" view = the opposite of "look at everything you haven't done"

**E. Job Loss Recovery Flow**

If a user logs that they lost their job, the app must:
1. First: validate, not assess. "That's really hard. I'm sorry."
2. Then: externalize. "Job loss for autistic workers often comes from situations that were genuinely difficult to navigate — not from inability to do the work."
3. Cite the research. "Research shows most autistic job losses happen in the first 90 days, when support is lowest and workplaces are least familiar. That's a structural failure, not yours."
4. Optionally: connect to First Place employment staff or offer to process what happened.
5. Never: suggest the user should have done something differently before they've had space to process.

**Design rule:** The shame mechanism is why every other feature gets abandoned. Design explicitly against shame at every decision point — copy, notifications, streaks, failure states, and re-engagement flows. The app that gets used is not the most feature-rich one. It's the one that never makes the user feel bad for opening it.

---

## Summary: The Six Mechanisms as a Design Filter

| Mechanism | Core Question for Every Feature |
|---|---|
| 1. Externalize memory | Does this remove something from the user's head and put it somewhere they can see? |
| 2. Engineer the start | Is the minimum viable action here actually minimal? What's the one-tap version? |
| 3. Regulate stimulation | Does this give the brain something to engage with? Is there novelty? Reward? |
| 4. Let the system rest | Does this ever demand too much? Is there a "nothing today" exit? |
| 5. Regulate the body | Are we treating the whole person or just the cognitive/social layer? |
| 6. Diffuse shame | Does any part of this make someone feel bad for being who they are? |

**Run every feature through this filter before building it.** If a feature fails mechanism 6, it doesn't matter how useful it is on paper — shame will prevent it from being used.

---

## The Pitch Addition — Mechanism 6 Language

> "The research tells us that nearly half of autistic adults who lose jobs blame themselves. 'My personality.' 'My weirdness.' Not the fact that their employer never communicated clearly, never provided adjustments they were legally entitled to, and never prepared them for their 90-day review. Our tool doesn't just help residents navigate workplace situations. It gives them a counter-narrative. Evidence that the system was hard, not that they were broken. That's not soft. That's neuroscience."
