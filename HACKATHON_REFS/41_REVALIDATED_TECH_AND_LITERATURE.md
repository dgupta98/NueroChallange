# Step Cards — Revalidated Technical Document + Literature Review
**Author: Dipesh | Date: Oct 31, 2026**
**Supersedes file 40 for research validation. File 40 is still the build reference for code structure.**

> This document: (1) validates every design decision in file 40 against primary literature, (2) adds new research findings that change or deepen decisions, (3) contains production-ready LLM prompts with reasoning, and (4) provides implementation patterns that can be copied directly into code.

---

## PART 1: LITERATURE FOUNDATION

### 1.1 Evidence-Based Practices — The Authoritative Source

**NCAEP 2020 (National Clearinghouse on Autism Evidence and Practice)**
- Steinbrenner et al. (2021): *Evidence-based practices for children, youth, and young adults with Autism.* Frank Porter Graham Child Development Institute, UNC.
- Reviewed studies 1990–2017. Identified **28 verified EBPs** for autistic children, youth, and young adults.
- Step Cards uses four of them. All four are Tier 1 (strongest evidence):

| EBP | What the research shows | How Step Cards implements it |
|---|---|---|
| **Task Analysis** | Breaking a skill into small ordered steps and teaching each step systematically improves independent performance across settings and populations | LLM Call 1 performs automated task analysis from spoken instructions |
| **Visual Supports** | Pictures, written words, and objects that support understanding. Effective across age groups and settings. | ARASAAC pictograms displayed on each card |
| **Prompting with systematic fading** | Giving help then systematically reducing it as the learner succeeds produces durable independent skills | Fading algorithm reduces card count across sessions |
| **Technology-Aided Instruction** | Instruction or intervention delivered via technology devices. Strong evidence base for improving outcomes | Delivered on tablet/laptop browser |

**Knight, Sartini & Spriggs (2015):** Evaluating visual activity schedules as evidence-based practice for ASD. *Journal of Autism and Developmental Disorders*, 45(1), 157–178.
- Systematic review confirming visual activity schedules (VAS) as EBP for ASD across multiple settings and behaviors.

**Hume, Steinbrenner, Odom et al. (2021):** Evidence-based practices for children, youth, and young adults with autism: Third generation review. *Journal of Autism and Developmental Disorders*, 51(11), 4013.
- Third-generation review confirming the NCAEP 2020 EBP list with additional studies.

---

### 1.2 Digital Activity Schedules — Direct Evidence

**PMC7304246 — Creating Digital Activity Schedules to Promote Independence (2020):**
This is the direct evidence base for why Step Cards works as a *digital* implementation, not just a paper one.

Key findings:
- **Photographic/digital activity schedules** have been demonstrated to be effective in helping individuals with autism and other developmental disabilities learn how to complete multi-step tasks independently
- Digital schedules offer advantages over paper: portability, customization, ease of updating, ability to embed audio prompts
- Tablet-based implementations show strong transfer of skills from supported to independent completion
- **Systematic prompt fading** (reducing prompts as student succeeds) is the mechanism that produces lasting independence — without fading, skills do not transfer

**Design implication:** The fading algorithm in Step Cards is not a feature. It is the evidence-based mechanism that makes the app a *teaching tool* rather than a permanent support device. Without it, Step Cards would be equivalent to a visual schedule app that never removes itself — which research shows creates learned helplessness.

---

### 1.3 Visual Schedules — Implementation Research

**Liang, Lee, Zuo & Liang (2024):** The use of visual schedules to increase academic-related on-task behaviors of individuals with autism: A literature review. *International Journal of Developmental Disabilities.*
- 31 studies reviewed. 16 met quality criteria.
- Visual schedules are EBP especially when combined with **systematic instructional procedures** (task analysis + explicit instruction).
- This confirms that the teacher approval step in Step Cards is not bureaucratic — it is the "explicit instruction" component that makes the evidence-based practice complete.

**CHECK Framework (SAGE Journals, 2024):** CHECK Visual Schedules to Support Individuals on the Autism Spectrum.
- Key steps for implementing visual schedules (the acronym):
  - **C** — Choose the right format (individual symbols, photos, text — per student)
  - **H** — How many items (start small — 2–4 steps, build up)
  - **E** — Establish a routine (same visual cue, same location, same flow)
  - **C** — Connect the visual to the action (the pictogram must represent what is physically done)
  - **K** — Keep it going (generalize to multiple settings)

**For Step Cards:** The CHECK framework validates per-student format selection (Leo gets 3 pictogram-heavy cards, Maya gets 5 text-heavy cards) and reinforces the "cards go home" feature as the generalization mechanism.

---

### 1.4 ADHD and AuDHD — Design Evidence

**Dr. Thomas Brown (Yale School of Medicine)** — ADHD as a management system disorder:
- ADHD is a management system problem, not a behavior problem
- People with ADHD cannot push peripheral thoughts aside — they all demand attention simultaneously
- Strong *long-term* memory, weak *short-term* working memory — this is the exact deficit Step Cards addresses
- Emotions are amplified (7–8/10 frustration = 0–1/10 for neurotypical) — this is why shame-free design is non-negotiable, not optional

**Smart Interface Design Patterns / Vitaly Friedman (2025) — 15 ADHD-specific design rules:**
All 15 verified against Step Cards design. Key ones that inform specific decisions:

| Rule | Where it shows in Step Cards |
|---|---|
| Don't make users rely on working memory | Steps are displayed, not held in memory |
| Show progress, chunk everything | Step counter "2 of 4" on every card |
| Prefer shorter pages over long ones | One card per screen in student view |
| Disclose details gradually, not all at once | Ambiguous terms collapsed by default; clarifying question collapsed |
| Avoid auto-playing videos and animations | No autoplay anywhere |
| Use visual highlights for important items | Current card has left-border highlight, not color-only |
| Avoid jargon | LLM prompt explicitly prohibits jargon and requires plain language |
| Allow to continue later | localStorage persists state — Jordan can close the app and return |

**AuDHD-specific finding:** AuDHD users (both autism AND ADHD, which is most AZACS students and First Place residents) are especially sensitive to busy, noisy, or visually overwhelming experiences. This is why the color palette uses #FAF9F7 off-white background, not white; why there are no sidebars; and why the completion screen shows "Done." and nothing else.

---

### 1.5 Cognitive Accessibility — W3C COGA and Section 508

**W3C COGA (Cognitive Accessibility) 2023:** Making Content Usable for People with Cognitive and Learning Disabilities.
- The most comprehensive design pattern library for cognitive disabilities, published by the W3C.
- Key patterns Step Cards implements:
  - **Use a familiar hierarchy and design** — card-based layouts are universally understood
  - **Avoid interruptions** — no modals, no pop-ups, all notifications inline
  - **Support adaptation** — font size slider, pictogram-only mode, calm mode
  - **Use clear and understandable content** — LLM rewriting enforces plain language rules
  - **Keep the interface simple** — one CTA per screen rule

**Section 508 (US Federal Government, GSA):** Designing Digital Content for Users with Cognitive Disabilities.
- Use plain, straightforward language. Complex language causes cognitive overload.
- Use simple, consistent layouts with clear navigation.
- Avoid clutter and unnecessary elements.
- Use recognizable icons with descriptive text labels (never icon-only).
- Allow users to customize font size, color themes, interaction speed.
- Design interactive elements with ample size and spacing.
- **Test with real users.** (This is why we want 10 minutes with an AZACS teacher before Nov 5.)

---

### 1.6 Generalization — The School-to-Home Gap

**PACT-G trial (University of Manchester):** Analysis of 248 autistic children. Skills generalized *less well* from school to home than from home to school.

**Design implication:** The "cards go home" feature is not a nice-to-have. It is the evidence-based mechanism for closing the most common generalization failure in autism education. A student who only sees the step cards at school will not transfer the skill to home without the same visual support in the home setting. This finding justifies the TakeHomePage screen and the end-of-session export.

---

## PART 2: VALIDATED DESIGN DECISIONS

Every major design decision in file 35 and file 40 is now cross-referenced against primary literature. Decisions that changed are marked **UPDATED**.

| Decision | Original basis | Literature validation | Status |
|---|---|---|---|
| One CTA per screen | Rusakova research synthesis | W3C COGA: "Avoid interruptions", Section 508: "simple consistent layouts" | CONFIRMED |
| Off-white (#FAF9F7) background | Frontiers luminance aversion study | Supported by all autism UX research (avoid pure white) | CONFIRMED |
| Atkinson Hyperlegible font | Harvard Accessibility + Section 508 | Section 508 explicitly recommends sans-serif fonts; Atkinson is the leading option designed for low-vision | CONFIRMED |
| 22px minimum step text | WCAG + cognitive accessibility | Section 508: minimum 14pt (18.6px) if no customization; 22px exceeds this. W3C COGA supports larger text | CONFIRMED |
| Fading algorithm | NCAEP EBP (Prompting) | PMC7304246: systematic prompt fading is THE mechanism that produces durable independence | CONFIRMED — **This is non-negotiable** |
| Teacher approval step | Responsible AI judgment | Liang et al. 2024: visual schedules most effective with "systematic instructional procedures" — teacher approval IS this | CONFIRMED — not bureaucratic, evidence-required |
| Cards go home export | AZACS visit debrief | PACT-G trial: school-to-home generalization gap. Same visual support in both settings is the fix | CONFIRMED |
| "Help me" is private | Shame design rule (file 35) | Brown/Yale: emotions amplified 7–8x in ADHD. Public help-request = major shame trigger | CONFIRMED |
| No streaks, no points | ADHDump market evidence | Dr. Brown: shame/frustration amplified in ADHD brain. Gamification creates shame when broken | CONFIRMED |
| Quiet "Done." completion | Clean exit test (file 35) | AuDHD sensory sensitivity: overstimulation at reward screen causes dysregulation. Silent acknowledgment is correct | CONFIRMED |
| Max 4 visible cards | Rusakova (visual info capacity) | CHECK framework: "start small, 2–4 steps." PMC7304246 supports limited simultaneous items | CONFIRMED |
| Teacher can edit any card | Responsible AI design | NCAEP Task Analysis: teacher judgment for safety steps is irreplaceable. AI can split steps wrongly | CONFIRMED |
| No diagnoses in LLM calls | Privacy + responsible AI | COPPA + FERPA: diagnosis is protected health information. LLM never needs to know this to do its job | CONFIRMED |
| ARASAAC over custom pictograms | Build speed + quality | 35,000+ symbols designed for AAC use. Free. CC BY-NC-SA. The standard in the field. | CONFIRMED |
| localStorage over backend | Privacy + build speed | COPPA compliance simplified. No data leaves device. Zero backend risk for prototype. | CONFIRMED |
| Font size slider | W3C COGA personalisation | Section 508: "Allow users to customize font size" | **UPDATED: add to MVP, not post-MVP** |
| Browser banner for non-Chrome | Web Speech API limitation | — | CONFIRMED |

**One changed decision: font size slider moves to MVP.** It is on the Section 508 cognitive disability requirement list. It is one `<input type="range">` and a CSS variable. Build it on Nov 2 as part of Manan's accessibility pass.

---

## PART 3: PRODUCTION-READY LLM PROMPTS

These are the final prompts. They include every rule, edge case, and guardrail. Naman copies these directly into `/prompts/` or inline in the API files.

---

### PROMPT 1: Instruction → Base Steps (School Mode)

**Purpose:** Takes a teacher's spoken instruction and returns numbered, ordered steps with pictogram keywords.

**File:** `src/api/breakInstruction.js` or `prompts/01_break_instruction.txt`

```
SYSTEM PROMPT — CALL 1 (SCHOOL MODE — BREAK INSTRUCTION)

You are an assistive technology system helping a special education teacher support autistic and ADHD students in a classroom. The teacher has just spoken an instruction aloud.

Your job: break the instruction into numbered, plain-language steps a student can follow one action at a time.

RULES — FOLLOW ALL OF THEM:
1. Each step is ONE physical action. Never combine two actions in one step.
2. Start each step with an action verb ("Get", "Wash", "Measure", "Wait", "Put", "Pick up").
3. Plain language: short words, simple sentences. Maximum 8 words per step.
4. Concrete nouns only: "flour" not "the ingredient". "Tray" not "the item".
5. Numbers as numerals: "2 cups" not "two cups".
6. The last step must describe what the student does when the task is finished ("Wait for Ms. R" / "Sit back down" / "Raise your hand").
7. Return between 2 and 6 steps. If the instruction has only 1 action, return 1 step.
8. If the instruction has more than 6 actions, combine the simplest adjacent ones.
9. Do NOT invent steps that were not said. Only break down what was actually spoken.
10. Do NOT add safety warnings, praise, or encouragement ("Be careful!" / "Great job!").
11. For icon_keyword: one or two concrete words that represent the physical object or action. Must work as a pictogram search term. Examples: "tray", "wash hands", "flour", "wait", "timer". Never abstract words like "prepare", "consider", or "complete".

OUTPUT: Return valid JSON only. No text before or after the JSON block.

SCHEMA:
{
  "instruction_summary": "Short title for this task (max 6 words)",
  "steps": [
    {
      "n": 1,
      "text": "Step text here.",
      "icon_keyword": "search term"
    }
  ]
}

EXAMPLE INPUT:
"Get your tray, wash your hands, measure two cups of flour, then wait for me."

EXAMPLE OUTPUT:
{
  "instruction_summary": "Get ready to bake",
  "steps": [
    { "n": 1, "text": "Get your tray.", "icon_keyword": "tray" },
    { "n": 2, "text": "Wash your hands.", "icon_keyword": "wash hands" },
    { "n": 3, "text": "Measure 2 cups of flour.", "icon_keyword": "flour" },
    { "n": 4, "text": "Wait for Ms. R.", "icon_keyword": "wait" }
  ]
}
```

**API call configuration:**
```js
{
  model: "gpt-4o-mini",          // or challenge-provided model
  temperature: 0.1,              // very low — we want consistent, predictable output
  response_format: { type: "json_object" },
  max_tokens: 500
}
```

---

### PROMPT 2: Per-Student Version (School Mode)

**Purpose:** Rewrites base steps for a specific student's reading level. Does not change what the steps do, only how they are expressed.

**File:** `src/api/rewriteForStudent.js` or `prompts/02_rewrite_for_student.txt`

```
SYSTEM PROMPT — CALL 2 (SCHOOL MODE — PER-STUDENT REWRITE)

You are an assistive technology system rewriting classroom instructions for individual students based on their reading level and support needs.

You will receive a list of steps and a student profile. Rewrite EACH step for this student.

READING LEVEL DEFINITIONS:
- "grade2": 1–3 words per step. Very simple nouns and verbs. No sentences — just the action word and object. Example: "Get tray", "Wash hands", "Measure flour", "Wait".
- "grade4": 4–6 words per step. Simple subject-verb-object sentences. Example: "Get your tray from the shelf", "Wash both hands with soap".
- "grade6": Keep the original step text unchanged. Return it exactly as received.
- "pictogram_only": 1–2 words maximum. Single noun or single verb only. Will display as pictogram with tiny label.

SUPPORT LEVEL DEFINITIONS (do not change — this is for the fading algorithm, not you):
- "full": Return all steps.
- "partial": You will receive a "max_cards" number. Combine adjacent steps to fit within max_cards.
- "minimal": Return only the steps marked "needs_support": true in the input.

RULES:
1. Do NOT change what the step asks the student to do.
2. Do NOT add or remove steps (unless support level is "partial" with max_cards).
3. Do NOT add praise, encouragement, or motivational language.
4. Do NOT change step order.
5. Keep the icon_keyword from the original step — do not change it.
6. Return the student_id exactly as received.

OUTPUT: Return valid JSON only.

SCHEMA:
{
  "student_id": "the id you received",
  "steps": [
    {
      "n": 1,
      "text": "Rewritten step text",
      "icon_keyword": "same as original"
    }
  ]
}

USER MESSAGE FORMAT (what you send as the user turn):
{
  "student_id": "leo",
  "reading_level": "grade2",
  "support_level": "full",
  "steps": [
    { "n": 1, "text": "Get your tray.", "icon_keyword": "tray" },
    { "n": 2, "text": "Wash your hands.", "icon_keyword": "wash hands" },
    { "n": 3, "text": "Measure 2 cups of flour.", "icon_keyword": "flour" },
    { "n": 4, "text": "Wait for Ms. R.", "icon_keyword": "wait" }
  ]
}

EXAMPLE OUTPUT for grade2 / Leo:
{
  "student_id": "leo",
  "steps": [
    { "n": 1, "text": "Get tray.", "icon_keyword": "tray" },
    { "n": 2, "text": "Wash hands.", "icon_keyword": "wash hands" },
    { "n": 3, "text": "Measure flour.", "icon_keyword": "flour" },
    { "n": 4, "text": "Wait.", "icon_keyword": "wait" }
  ]
}
```

**API call configuration:**
```js
{
  model: "gpt-4o-mini",
  temperature: 0.1,
  response_format: { type: "json_object" },
  max_tokens: 400
}
```

**Call this once per student, in parallel using `Promise.all()`:**
```js
const [leoSteps, mayaSteps, samSteps] = await Promise.all([
  rewriteForStudent(baseSteps, students[0]),
  rewriteForStudent(baseSteps, students[1]),
  rewriteForStudent(baseSteps, students[2])
])
```

---

### PROMPT 3: Workplace Instruction Breakdown (Work / Adult Mode)

**Purpose:** Jordan's flow. Takes a manager's verbal instruction and returns plain steps, flagged ambiguous terms, and a suggested clarifying question.

**File:** `src/api/workModeBreak.js` or `prompts/03_work_mode_break.txt`

```
SYSTEM PROMPT — CALL 3 (WORK MODE — ADULT)

You are an assistive technology system helping a neurodivergent adult worker understand and execute workplace instructions. The user has ADHD and/or autism. They have working memory challenges and may struggle with ambiguous, implicit, or multi-step verbal instructions.

Your job has three parts:
1. Break the instruction into numbered, plain-language steps.
2. Flag any genuinely ambiguous terms (jargon, implicit context, unclear quantities, undefined timing).
3. Suggest one clarifying question the worker could say to their manager.

RULES:
1. Maximum 10 words per step.
2. Active voice. Verb first in every step.
3. Concrete nouns and verbs. No jargon in the steps.
4. Do NOT invent steps. Only break down what was said.
5. Do NOT add praise, encouragement, or motivational language.
6. Ambiguous terms: flag ONLY terms that are genuinely unclear without more context. Do not flag clear, concrete language.
   - Flag: "before the rush", "when it's ready", "low on cups", "check the back"
   - Do NOT flag: "the popcorn machine", "the register", "your station"
7. If there are NO ambiguous terms, return: "ambiguous_terms": []
8. The clarifying question must be phrased as something natural a person would actually say at work — not formal, not aggressive.
9. If the instruction is completely clear (no ambiguous terms, no clarifying question needed), return: "clarifying_question": null
10. Return between 1 and 8 steps.
11. Do NOT include safety instructions that were not mentioned by the manager.

PRIVACY RULE: Never reference the user's diagnosis, disability, or accommodation status in your response. Respond as if helping any person who prefers clear instructions.

OUTPUT: Return valid JSON only.

SCHEMA:
{
  "instruction_summary": "Short task title (max 6 words)",
  "steps": [
    { "n": 1, "text": "Step text here." }
  ],
  "ambiguous_terms": [
    {
      "term": "the original ambiguous phrase from the instruction",
      "plain": "Plain-language explanation of what it probably means"
    }
  ],
  "clarifying_question": "A sentence the worker could say to their manager, or null"
}

EXAMPLE INPUT:
"Before the 7 PM show, fill the popcorn kettle to the oil line, add one bag of kernels, set it for four minutes, move the batch to the warming tray, and text me when it's done."

EXAMPLE OUTPUT:
{
  "instruction_summary": "Set up the popcorn station",
  "steps": [
    { "n": 1, "text": "Fill the kettle with oil to the line." },
    { "n": 2, "text": "Add one bag of kernels." },
    { "n": 3, "text": "Set the timer to 4 minutes." },
    { "n": 4, "text": "Move the batch to the warming tray." },
    { "n": 5, "text": "Text your manager when done." }
  ],
  "ambiguous_terms": [
    {
      "term": "the oil line",
      "plain": "The fill line marked on the inside of the popcorn kettle"
    },
    {
      "term": "the warming tray",
      "plain": "The tray that keeps popcorn warm — usually to the right of the main kettle"
    }
  ],
  "clarifying_question": "Can you show me where the oil line is before the show starts?"
}
```

**API call configuration:**
```js
{
  model: "gpt-4o-mini",
  temperature: 0.2,              // slightly higher — more natural clarifying questions
  response_format: { type: "json_object" },
  max_tokens: 600
}
```

---

## PART 4: COMPLETE IMPLEMENTATION PATTERNS

### 4.1 API Wrapper — Base Pattern

All three calls use this base wrapper:

```js
// src/api/_base.js
const API_BASE = 'https://api.openai.com/v1/chat/completions'
const MODEL = import.meta.env.VITE_LLM_MODEL || 'gpt-4o-mini'
const KEY = import.meta.env.VITE_OPENAI_KEY

export async function callLLM(systemPrompt, userMessage, maxTokens = 500) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: typeof userMessage === 'string'
            ? userMessage
            : JSON.stringify(userMessage) }
      ]
    })
  })
  if (!res.ok) throw new Error(`LLM API error: ${res.status}`)
  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}
```

**Validation wrapper — always validate JSON shapes before rendering:**
```js
export function validateBaseSteps(json) {
  if (!json?.steps || !Array.isArray(json.steps)) throw new Error('Missing steps array')
  if (json.steps.length === 0) throw new Error('Empty steps array')
  json.steps.forEach((s, i) => {
    if (typeof s.n !== 'number') throw new Error(`Step ${i} missing n`)
    if (typeof s.text !== 'string') throw new Error(`Step ${i} missing text`)
  })
  return json
}
```

---

### 4.2 ARASAAC — Complete Integration

```js
// src/api/arasaac.js
const ARASAAC_BASE = 'https://api.arasaac.org/v1'

// Manually verified fallbacks for 20 most common classroom action words
// Reduces API dependency for demo
const FALLBACK_IDS = {
  'wait':        2626,
  'wash hands':  2458,
  'sit':         7321,
  'stand':       7322,
  'listen':      8245,
  'look':        6456,
  'stop':        5556,
  'go':          5210,
  'eat':         2920,
  'drink':       2919,
  'write':       8011,
  'read':        6890,
  'draw':        3021,
  'clean':       3402,
  'open':        5891,
  'close':       3480,
  'put':         6101,
  'get':         4523,
  'help':        4892,
  'done':        3180,
}

export async function fetchPictogramUrl(keyword) {
  // Check fallback first (faster, no API call)
  const fallbackId = FALLBACK_IDS[keyword.toLowerCase()]
  if (fallbackId) {
    return `${ARASAAC_BASE}/pictograms/${fallbackId}?color=true`
  }

  try {
    const res = await fetch(
      `${ARASAAC_BASE}/pictograms/en/search/${encodeURIComponent(keyword)}`
    )
    if (!res.ok) return null
    const results = await res.json()
    if (!results || results.length === 0) return null
    return `${ARASAAC_BASE}/pictograms/${results[0]._id}?color=true`
  } catch {
    return null   // render text-only card if API fails
  }
}

// Fetch all pictograms for a step list in parallel
export async function enrichStepsWithPictograms(steps) {
  const urls = await Promise.all(
    steps.map(step => fetchPictogramUrl(step.icon_keyword))
  )
  return steps.map((step, i) => ({ ...step, pictogramUrl: urls[i] }))
}
```

---

### 4.3 Fading Algorithm — Complete

```js
// src/utils/fadingRule.js

/**
 * Returns how many cards to show for a student on this routine.
 * Based on NCAEP Prompting EBP: systematic fading produces durable independence.
 *
 * Threshold: confirmed independence requires 2 clean runs before reducing.
 * Pilot data will tell us if this is too fast or too slow.
 */
export function getVisibleCardCount(totalCards, completionCount) {
  if (completionCount <= 1) return totalCards          // first and second run: full support
  if (completionCount === 2) return totalCards          // build confidence on the third run
  if (completionCount === 3) return Math.ceil(totalCards * 0.75)
  if (completionCount === 4) return Math.ceil(totalCards * 0.5)
  if (completionCount >= 5)  return 1                  // summary card only
}

/**
 * Returns the steps to show based on fading.
 * Always shows the FIRST n cards — never the middle cards.
 * The first step is always the current action.
 */
export function getFadedSteps(steps, completionCount) {
  const count = getVisibleCardCount(steps.length, completionCount)
  if (count >= steps.length) return steps
  if (count === 1) return [{
    n: 1,
    text: `${steps[0].text.replace(/\.$/, '')} (${steps.length} steps)`,
    icon_keyword: steps[0].icon_keyword,
    pictogramUrl: steps[0].pictogramUrl,
    isSummaryCard: true
  }]
  return steps.slice(0, count)
}

/**
 * Stable routine key — same instruction = same routine across sessions
 */
export function getRoutineKey(instructionSummary) {
  return instructionSummary
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
}
```

---

### 4.4 localStorage — Complete Schema

```js
// src/utils/storage.js

export const KEYS = {
  STUDENTS:   'stepCards_students_v1',
  SHIFT_LOG:  'stepCards_shiftLog_v1',
  PREFS:      'stepCards_prefs_v1',
}

// Versioned keys — if schema changes, bump the version, don't break old data

export const DEFAULT_PREFS = {
  fontSize: 'medium',            // 'small' | 'medium' | 'large'
  calmMode: false,               // reduces all colors to greyscale palette
  pictogramOnly: false,          // hides text labels from student view
  reducedMotion: false,          // explicit override (mirrors prefers-reduced-motion)
  ambiguousSectionSeen: false,   // collapses ambiguous terms after first view
}

export const DEFAULT_STUDENTS = [
  {
    id: 'leo',
    displayName: 'Leo',
    readingLevel: 'grade2',
    preferPictograms: true,
    supportLevel: 'full',
    completionHistory: {},        // { routineKey: completionCount }
  },
  {
    id: 'maya',
    displayName: 'Maya',
    readingLevel: 'grade6',
    preferPictograms: false,
    supportLevel: 'full',
    completionHistory: {},
  },
  {
    id: 'sam',
    displayName: 'Sam',
    readingLevel: 'grade4',
    preferPictograms: true,
    supportLevel: 'full',
    completionHistory: {},
  },
]

export function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    // Storage quota exceeded or private browsing — degrade gracefully
    console.warn('[StepCards] localStorage write failed:', e.message)
  }
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveStudents(students) { save(KEYS.STUDENTS, students) }
export function loadStudents() { return load(KEYS.STUDENTS, DEFAULT_STUDENTS) }

export function savePrefs(prefs) { save(KEYS.PREFS, prefs) }
export function loadPrefs() { return load(KEYS.PREFS, DEFAULT_PREFS) }

export function addShiftLogEntry(entry) {
  const log = loadShiftLog()
  log.unshift(entry)              // newest first
  if (log.length > 100) log.pop() // keep last 100 entries max
  save(KEYS.SHIFT_LOG, log)
}
export function loadShiftLog() { return load(KEYS.SHIFT_LOG, []) }
```

---

### 4.5 CSS Design Tokens — Complete

```css
/* src/styles/globals.css */

@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  /* Colors */
  --bg-primary:       #FAF9F7;   /* off-white — reduces luminance vs pure white */
  --bg-card:          #FFFFFF;   /* card surfaces */
  --bg-card-done:     #F0F0EE;   /* completed step */
  --bg-card-active:   #FFFFFF;   /* current step */

  --text-primary:     #1A1A1A;   /* dark gray — not pure black */
  --text-muted:       #6B7280;   /* secondary text */
  --text-step-number: #9CA3AF;   /* step counter */

  --border-default:   #E5E7EB;
  --border-active:    #60A5FA;   /* current card highlight — soft blue, not yellow */
  --border-help:      #F59E0B;   /* amber — teacher help notice */

  --btn-primary:      #2563EB;   /* "Done" button */
  --btn-primary-text: #FFFFFF;
  --btn-secondary:    #F3F4F6;   /* "Help me" button */
  --btn-secondary-text: #374151;

  /* Typography */
  --font-family: 'Atkinson Hyperlegible', -apple-system, sans-serif;
  --font-step:   22px;
  --font-body:   16px;
  --font-label:  14px;
  --line-height: 1.5;
  --letter-spacing: 0.02em;

  /* Spacing */
  --card-padding:  24px;
  --card-gap:      16px;
  --btn-min-size:  44px;         /* WCAG 2.5.5 touch target minimum */

  /* Motion */
  --transition-fast: 100ms ease;
  --transition-done: 100ms ease; /* card completion — intentionally fast */
}

/* Font size scale — controlled by user pref */
[data-fontsize="small"]  { --font-step: 18px; --font-body: 14px; }
[data-fontsize="medium"] { --font-step: 22px; --font-body: 16px; }
[data-fontsize="large"]  { --font-step: 28px; --font-body: 20px; }

/* Calm mode — desaturates everything */
[data-calm="true"] {
  filter: saturate(0.4);
}

/* Reduced motion — removes all transitions */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

body {
  font-family: var(--font-family);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-body);
  line-height: var(--line-height);
  letter-spacing: var(--letter-spacing);
  -webkit-font-smoothing: antialiased;
}

/* Focus visible — keyboard navigation */
:focus-visible {
  outline: 2px solid var(--border-active);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## PART 5: TESTING CHECKLIST

Run before Nov 3 end-of-day. Every item must pass.

### Functional
- [ ] Teacher speaks instruction → cards appear in under 3 seconds
- [ ] Three student columns show different reading levels from one instruction
- [ ] Teacher can tap any card to edit the text inline
- [ ] Teacher taps Approve → student view receives correct cards
- [ ] Student taps Done → card grays out, no sound, no excessive animation
- [ ] Student taps Help Me → teacher view shows student name + step number
- [ ] All cards tapped → quiet "Done." screen with 1.5 second hold
- [ ] Fading: same routine on second run shows all cards, third run shows 75%
- [ ] ARASAAC pictogram loads for common keywords; falls back to text-only if not found
- [ ] Work mode: paste instruction → steps + ambiguous terms + clarifying question appear
- [ ] Work mode: all steps tapped → shift log entry appears
- [ ] Shift log shows today's entries with timestamp
- [ ] LocalStorage persists across page refresh

### Accessibility
- [ ] Chrome Lighthouse accessibility score ≥ 90
- [ ] axe DevTools shows 0 critical violations
- [ ] All step text is minimum 22px
- [ ] All buttons are minimum 44×44px
- [ ] Color contrast: step text passes WCAG AA (≥ 4.5:1)
- [ ] Font size slider works: small/medium/large changes step text size
- [ ] `prefers-reduced-motion: reduce` removes all transitions
- [ ] Tab key navigates through all interactive elements in visual order
- [ ] All ARASAAC images have `alt` text matching step text
- [ ] "Help me" button has descriptive `aria-label`
- [ ] Loading state has `role="status" aria-live="polite"`

### Privacy
- [ ] No real names anywhere in codebase
- [ ] `.env` file is gitignored
- [ ] `git log --all` shows no API keys ever committed
- [ ] Network tab in DevTools: LLM call payload contains no student identifiers
- [ ] No third-party scripts loaded except Google Fonts

### Demo readiness
- [ ] Full school demo path runs without errors on the presentation device (Chrome)
- [ ] Full Jordan (work mode) path runs without errors
- [ ] Pre-recorded backup demo exists in `/demo/` folder
- [ ] Browser banner appears when running in Firefox
- [ ] ARASAAC credit appears on TakeHomePage and in app footer

---

## PART 6: LITERATURE SOURCES — COMPLETE REFERENCE LIST

All sources used in this document and in the research files. Use these for citations in written responses and slide notes.

| Source | Type | Verified? | Citation |
|---|---|---|---|
| NCAEP 2020 EBP Report | Peer-reviewed systematic review | YES | Steinbrenner et al. (2021). *Evidence-based practices for children, youth, and young adults with Autism.* Frank Porter Graham Child Development Institute, UNC. https://ncaep.fpg.unc.edu |
| Knight, Sartini & Spriggs (2015) | Peer-reviewed journal | YES (cited in NCAEP) | *Journal of Autism and Developmental Disorders*, 45(1), 157–178 |
| Liang, Lee, Zuo & Liang (2024) | Peer-reviewed literature review | YES | *International Journal of Developmental Disabilities.* DOI: 10.1080/20473869.2024.2402124 |
| PMC7304246 (2020) | Peer-reviewed | YES | *Creating Digital Activity Schedules to Promote Independence.* PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC7304246/ |
| W3C COGA (2023) | W3C Technical Report | YES | *Making Content Usable for People with Cognitive and Learning Disabilities.* https://www.w3.org/TR/coga-usable/ |
| Section 508 / GSA | US Government guidance | YES | *Designing Digital Content For Users With Cognitive Disabilities.* https://www.section508.gov/design/digital-content-users-with-cognitive-disabilities/ |
| Vitaly Friedman / Smart Interface Design Patterns (2025) | Practitioner synthesis | YES | *Designing For People With ADHD.* https://smart-interface-design-patterns.com/articles/design-adhd/ |
| Neurodiversity Design System (Will Soward) | Design system | YES | https://neurodiversity.design/ |
| Dr. Thomas Brown, Yale School of Medicine | Clinical research | YES | Via Understood.org ADHD Fact Sheet 2025 |
| PACT-G trial, University of Manchester | Peer-reviewed | CHECK FIRST | https://research.manchester.ac.uk/en/publications/generalisation-of-social-communication-skills-by-autistic-childre/ |
| Frontiers in Psychology — color study | Peer-reviewed | CHECK FIRST | Luminance aversion study (n=67); confirm before citing exact figures |
| ARASAAC | Resource / API | YES | http://www.arasaac.org — CC BY-NC-SA license |
| Atkinson Hyperlegible | Font resource | YES | https://fonts.google.com/specimen/Atkinson+Hyperlegible |
| Josh Munoz, First Place AZ | Primary source (visit) | YES | Oct 27 site tour + Oct 29 Zoom. Notes in file 22. |
| AZACS faculty | Primary source (visit) | YES | Oct 29 AM visit. Notes in file 29. |
