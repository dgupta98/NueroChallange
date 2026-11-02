# Step Cards — Complete Technical Build Documentation
**Author: Dipesh | Updated: Nov 1, 2026**
**Audience:** Naman (AI pipeline), Manan (UI), Anand (pitch/BMC context), code reviewers (Nov 7–9)

> This is the single source of truth for how the app is built. Every screen, every data shape, every API call, every state transition. If something isn't here, ask before guessing.

> **⚠ This document covers v2 (production, full-stack). The original Vite-only proof-of-concept (step-cards-old/) has been removed from the repo.**

---

## 0. Quick Reference

| Thing | Answer |
|---|---|
| **Live URL** | **https://nuero-challange.vercel.app/** |
| Framework | TanStack Start (React SSR) + Vite 8 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI base, ARIA-compliant) |
| Font | Atkinson Hyperlegible (Google Fonts) |
| Speech input | Web Speech API (`SpeechRecognition`) |
| AI | Groq API — model `qwen/qwen3.8-27b` (fast, free tier) |
| Pictograms | ARASAAC public API (free, CC BY-NC-SA, must credit) |
| Database | Supabase (PostgreSQL + Realtime + Auth) |
| Auth | Supabase Auth — email/password + Google OAuth |
| Deployment | Vercel (SSR function + static assets via Build Output API v3) |
| Repo | https://github.com/dgupta98/NueroChallange |
| Browsers supported | Chrome 90+, Edge 90+, Safari 16+ |

Env vars go in `step-cards/.env.local`, which is gitignored. **Never commit keys.**

### Demo access
- **Teacher:** demo.teacher@stepcards.app / StepCards-demo-2026 → redirects to /dashboard
- **Student Leo:** one-tap via demo panel → redirects to /student (grade 2, pictograms)
- **Student Mia:** one-tap via demo panel → redirects to /student (grade 6, faded cards)
- **Students Cam, Sam, Jin:** in database (no one-tap buttons) — visible in class roster

---

## 1. App Architecture Overview

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Root: mode toggle (school / work)
├── components/
│   ├── school/
│   │   ├── TeacherView.jsx   # Speech input + student cards side-by-side
│   │   ├── StudentView.jsx   # Full-screen card flow for one student
│   │   ├── StepCard.jsx      # Single card: pictogram + text + tap state
│   │   ├── HelpNotice.jsx    # Teacher sees which student + which step
│   │   └── TakeHomePage.jsx  # End-of-session card export
│   ├── work/
│   │   ├── WorkInput.jsx     # Text/speech input for Jordan flow
│   │   ├── StepList.jsx      # Numbered steps + tap to complete
│   │   ├── AmbiguousTerms.jsx  # Collapsible flagged terms
│   │   ├── ClarifyQuestion.jsx # Collapsible suggested question
│   │   └── ShiftLog.jsx      # Today's completed instructions
│   └── shared/
│       ├── ModeToggle.jsx    # School ↔ Work switcher
│       ├── LoadingDots.jsx   # Quiet loading animation
│       └── CompletionScreen.jsx # Quiet "Done." screen
├── hooks/
│   ├── useSpeechRecognition.js  # Web Speech API wrapper
│   ├── useStudentCards.js    # Manages per-student card state + fading
│   └── useShiftLog.js        # Reads/writes work log to localStorage
├── api/
│   ├── breakInstruction.js   # LLM Call 1: instruction → steps JSON
│   ├── rewriteForStudent.js  # LLM Call 2: steps → per-student version
│   ├── workModeBreak.js      # LLM Call 3: workplace instruction → adult JSON
│   └── arasaac.js            # Fetches pictogram URLs from ARASAAC API
├── data/
│   ├── students.js           # Made-up student profiles (no real data)
│   └── fallbackPictograms.js # Local fallback for 50 common action words
├── utils/
│   ├── localStorage.js       # Read/write helpers with error handling
│   └── fadingRule.js         # Determines how many cards to show per student
└── styles/
    └── globals.css           # Atkinson Hyperlegible import + base tokens
```

---

## 2. Made-Up Student Profiles (`data/students.js`)

**No real names, no real diagnoses, no real data.**

```js
export const STUDENTS = [
  {
    id: "leo",
    displayName: "Leo",
    readingLevel: "grade2",    // "grade2" | "grade4" | "grade6" | "adult"
    preferPictograms: true,
    completionHistory: {}      // { routineKey: completionCount }
  },
  {
    id: "maya",
    displayName: "Maya",
    readingLevel: "grade6",
    preferPictograms: false,
    completionHistory: {}
  },
  {
    id: "sam",
    displayName: "Sam",
    readingLevel: "grade4",
    preferPictograms: true,
    completionHistory: {}
  }
]
```

`completionHistory` is persisted to `localStorage` under key `stepCards_students`.

---

## 3. Data Flow — School Mode

```
Teacher speaks instruction
        ↓
useSpeechRecognition hook captures transcript
        ↓
breakInstruction(transcript) → LLM Call 1
        ↓ returns BaseSteps JSON
For each student:
  rewriteForStudent(baseSteps, student.readingLevel) → LLM Call 2
        ↓ returns StudentSteps JSON
  arasaac.fetchPictograms(studentSteps) → ARASAAC API
        ↓ returns steps with pictogram URLs
  fadingRule(student, routineKey) → number of cards to show
        ↓
TeacherView renders three student card columns
        ↓
Teacher taps Approve → cards sent to StudentView
        ↓
Student taps through cards → tap state managed in useStudentCards
        ↓
Student taps Help Me on step N → HelpNotice appears in TeacherView
        ↓
All cards tapped → CompletionScreen → student.completionHistory[routineKey]++
        ↓
localStorage.save(STUDENTS)
```

---

## 4. Data Flow — Work Mode (Jordan)

```
Jordan types or speaks workplace instruction
        ↓
workModeBreak(instructionText) → LLM Call 3
        ↓ returns WorkSteps JSON
StepList renders steps
AmbiguousTerms renders (collapsed after first view)
ClarifyQuestion renders (collapsed)
        ↓
Jordan taps through steps → quiet gray-out
        ↓
All steps tapped → CompletionScreen ("Done.")
        ↓
useShiftLog.addEntry(instructionSummary, stepCount, timestamp)
        ↓
localStorage.save(SHIFT_LOG)
```

---

## 5. LLM API Calls

All three calls follow the same pattern:

```js
// api/breakInstruction.js
export async function breakInstruction(transcript) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',        // swap to challenge-provided model if available
      temperature: 0.2,            // low temperature: consistent, predictable steps
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_CALL_1 },
        { role: 'user', content: transcript }
      ]
    })
  })
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}
```

**Always parse the response before using it.** The model returns a string inside `message.content` even with `json_object` mode.

**Always validate the shape** — check that `steps` is an array before rendering cards.

---

### 5a. LLM Call 1 — Instruction → Base Steps

**System prompt:**

```
You are an assistant helping a teacher support autistic and ADHD students in a classroom.

A teacher has just spoken an instruction aloud. Break it into clear, numbered, plain-language steps that a student can follow one at a time.

Rules:
- Maximum 8 words per step.
- Active voice. Start with a verb.
- Concrete actions only. Do not infer steps that were not said.
- If the instruction has only one action, return one step.
- The last step should describe what the student does when they finish (e.g., "Wait for Ms. R" or "Sit back down").
- Return JSON only. No text before or after the JSON.

Return this shape:
{
  "instruction_summary": "Short description of the overall task",
  "steps": [
    { "n": 1, "text": "Step text here", "icon_keyword": "one-word search term for a pictogram" },
    ...
  ]
}

icon_keyword must be a single concrete noun or verb — the most visually obvious word in the step. Examples: "tray", "hands", "flour", "wait". Never use abstract words like "prepare" or "check".
```

**Expected output shape:**

```json
{
  "instruction_summary": "Get ready to bake bread",
  "steps": [
    { "n": 1, "text": "Get your tray.", "icon_keyword": "tray" },
    { "n": 2, "text": "Wash your hands.", "icon_keyword": "wash" },
    { "n": 3, "text": "Measure 2 cups of flour.", "icon_keyword": "flour" },
    { "n": 4, "text": "Wait for Ms. R.", "icon_keyword": "wait" }
  ]
}
```

---

### 5b. LLM Call 2 — Per-Student Rewrite

**System prompt:**

```
You are an assistant helping a teacher support autistic and ADHD students at different reading levels.

You will receive a list of steps and a reading level. Rewrite each step for that reading level. Do not add or remove steps. Do not change the meaning.

Reading levels:
- "grade2": 1–3 words per step, very simple vocabulary ("Get tray", "Wash hands")
- "grade4": 4–6 words, simple sentences ("Get your tray from the shelf", "Wash both hands with soap")
- "grade6": Same as the original steps — no rewrite needed, return them as-is
- "adult": Plain professional language, no visual simplification needed

Rules:
- Do not add encouragement or praise ("Great job!", "You can do it!").
- Do not change the order of steps.
- Return JSON only.

Return this shape:
{
  "student_id": "[the id you receive]",
  "steps": [
    { "n": 1, "text": "Rewritten step text" },
    ...
  ]
}
```

**Call signature:**

```js
// api/rewriteForStudent.js
export async function rewriteForStudent(baseSteps, student) {
  const userMessage = JSON.stringify({
    student_id: student.id,
    reading_level: student.readingLevel,
    steps: baseSteps.steps
  })
  // ... same fetch pattern as Call 1
}
```

---

### 5c. LLM Call 3 — Work Mode (Adult)

**System prompt:**

```
You are an assistant helping a neurodivergent adult worker understand and complete workplace instructions. The user has ADHD and/or autism. They have working memory challenges and may struggle with ambiguous or multi-step verbal instructions.

Your job:
1. Break the instruction into numbered plain-language steps.
2. Flag any ambiguous terms (jargon, unclear references, implicit context words like "before the rush" or "when it's ready").
3. Suggest one clarifying question the user could ask their manager if needed.

Rules:
- Maximum 10 words per step.
- Active voice. Verb first.
- Do not invent steps. Only break down what was said.
- Do not add encouragement or praise.
- If there are no ambiguous terms, return "ambiguous_terms": [].
- If no clarifying question is needed, return "clarifying_question": null.
- Return JSON only.

Return this shape:
{
  "instruction_summary": "Short title for the task",
  "steps": [
    { "n": 1, "text": "Step text here" },
    ...
  ],
  "ambiguous_terms": [
    { "term": "the original ambiguous phrase", "plain": "plain-language explanation" }
  ],
  "clarifying_question": "A sentence the user could say to their manager"
}
```

---

## 6. ARASAAC Pictogram API

**Base URL:** `https://api.arasaac.org/v1`

**Step 1 — Search by keyword:**
```
GET https://api.arasaac.org/v1/pictograms/en/search/{keyword}
```
Returns an array. Take `result[0]._id` — the first result is usually the most common symbol.

**Step 2 — Get image URL:**
```
https://api.arasaac.org/v1/pictograms/{id}?color=true
```
This is a direct image URL. Use it in `<img src={url} alt={stepText} />`.

**Full pipeline (in `api/arasaac.js`):**

```js
export async function fetchPictogramUrl(keyword) {
  try {
    const search = await fetch(
      `https://api.arasaac.org/v1/pictograms/en/search/${encodeURIComponent(keyword)}`
    )
    const results = await search.json()
    if (!results || results.length === 0) return getFallback(keyword)
    const id = results[0]._id
    return `https://api.arasaac.org/v1/pictograms/${id}?color=true`
  } catch {
    return getFallback(keyword)
  }
}
```

**Fallback:** `getFallback(keyword)` checks `data/fallbackPictograms.js` — a local map of the 50 most common classroom action words to their ARASAAC IDs. If not found, returns `null` (render text-only card).

**Credit requirement (CC BY-NC-SA):** The app footer and the take-home page must include: "Pictograms by ARASAAC (arasaac.org), licensed CC BY-NC-SA 4.0."

---

## 7. Web Speech API

**Supported browsers:** Chrome 90+, Edge 90+. Not supported in Firefox, Safari (limited). Show a browser notice if unsupported.

```js
// hooks/useSpeechRecognition.js
import { useState, useRef } from 'react'

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false   // final transcript only
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      setTranscript(e.results[0][0].transcript)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return { transcript, listening, isSupported, startListening, stopListening }
}
```

**Privacy note for code review:** The Web Speech API sends audio to Google's servers for processing. This is disclosed in the README and in the responsible AI section. No student identifiers are sent — only the audio of the spoken instruction.

---

## 8. Fading Rule (`utils/fadingRule.js`)

```js
// Returns how many cards to show for a given student + routine
export function getVisibleCardCount(totalCards, completionCount) {
  if (completionCount === 0) return totalCards           // first time: all cards
  if (completionCount === 1) return totalCards           // second time: all cards (build confidence)
  if (completionCount === 2) return Math.ceil(totalCards * 0.75)  // 75% of cards
  if (completionCount === 3) return Math.ceil(totalCards * 0.5)   // 50% of cards
  if (completionCount >= 4)  return 1                   // one summary card
}

// routineKey is a stable hash of the instruction_summary
export function getRoutineKey(instructionSummary) {
  return instructionSummary.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)
}
```

**When showing fewer than all cards:** always show the first N cards in order. Never show the middle cards and hide the first — the first card is always the current action.

**When showing 1 card (fully faded):** the card text reads: `"{instruction_summary} (tap when done)"`.

---

## 9. localStorage Schema

All keys are namespaced with `stepCards_` to avoid collisions.

```js
// utils/localStorage.js

const KEYS = {
  STUDENTS: 'stepCards_students',   // array of student objects with completionHistory
  SHIFT_LOG: 'stepCards_shiftLog',  // array of work session entries
  PREFS: 'stepCards_prefs'          // user preferences (calm mode, font size, etc.)
}

export function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('localStorage write failed', e)  // storage full or private browsing
  }
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
```

**Shift log entry shape:**
```js
{
  id: Date.now(),                    // unique enough for demo purposes
  timestamp: new Date().toISOString(),
  instructionSummary: "Set up popcorn station",
  stepCount: 5,
  note: ""                           // user-added, optional
}
```

---

## 10. Screen-by-Screen Specification

### Screen 1 — Home / Mode Toggle

- Two large buttons: "School Mode" and "Work Mode"
- App name "Step Cards" centered above
- ARASAAC credit in footer
- No login, no setup

---

### Screen 2 — Teacher View (School Mode)

**Layout:** Full width. Top bar: microphone button (large, labeled "Speak instruction") + text field fallback. Below: three columns, one per student (Leo, Maya, Sam).

**States:**
- `idle`: Empty columns. "Speak an instruction to get started." in muted text.
- `listening`: Mic icon pulses. "Listening..." text. Quiet.
- `loading`: LoadingDots appear in each column. "Generating cards..."
- `ready`: Each column shows student name + their cards stacked vertically.
  - Pictogram centered on card, 80×80px minimum
  - Step text below pictogram, 22px, Atkinson Hyperlegible
  - Card background: white, 8px rounded corners, soft drop shadow
- `approved`: Cards lock in. Teacher taps "Send to students" button (single large button).
- `help_request`: A yellow notice bar appears above a student's column: "Leo needs help — Step 3 (measure flour)"

**Approve flow:** Teacher reviews cards. If a card is wrong, teacher taps the card to edit the text (inline edit, plain text field, no styling controls). Teacher taps "Send to students" to approve all three sets at once.

---

### Screen 3 — Student View (School Mode)

**Who sees it:** Presented full-screen on a student's tablet, or as a column in a shared teacher screen during demo.

**Layout:** One card visible at a time (current step). Below it: step progress indicator (Step 2 of 4 — dots, not a bar). Two buttons: "Done ✓" (large, primary) and "Help me" (small, muted, bottom right).

**Tap "Done ✓":** Current card grays out softly (no strikethrough, no sound, no animation longer than 100ms). Next card appears. No praise message.

**Tap "Help me":** Nothing visible changes on student screen except a quiet "Help on the way" text in muted gray. Teacher screen shows yellow notice.

**Last card tapped:** CompletionScreen appears. "Done." in large text. 1.5 second hold. Fades to TakeHomePage.

---

### Screen 4 — Take-Home Page (School Mode)

**Layout:** Clean printable/shareable summary.
- Heading: "Today's steps: [instruction_summary]"
- All steps listed with pictograms (smaller, ~48px)
- Date and student name (made-up, no real data)
- ARASAAC credit line
- Two buttons: "Print" (`window.print()`) and "Copy link" (copies a data URI or shares via Web Share API if available)

---

### Screen 5 — Work Input (Work Mode)

**Layout:** Single large text area. "What did your manager just say?" as placeholder. Mic button labeled "Or speak it". Large "Break it down" button below.

- No timer, no urgency, no character count
- Paste works (no restrictions)
- Min height: 4 lines

---

### Screen 6 — Work Steps View (Work Mode)

**Layout:** Full page, scrollable.

**Section 1 — Steps (always visible):**
```
STEP 1   Fill the kettle with oil to the line.
STEP 2   Add one bag of kernels.
...
```
Each step: step number in muted gray, step text in 22px Atkinson Hyperlegible. Tap anywhere on the row to mark done (row grays out — no strikethrough). Current step has a 2px left border in muted blue (#3B82F6 at 60% opacity).

**Section 2 — Unclear Terms (collapsible):**
- Header: "UNCLEAR TERMS" in small caps, muted
- Chevron to expand/collapse
- Expanded by default first time (`localStorage` flag); collapsed after
- Each row: `"the line"  →  The oil fill line marked on the inside of the kettle`

**Section 3 — If Something Is Still Unclear (collapsible):**
- Always collapsed by default
- Header: "IF SOMETHING IS STILL UNCLEAR"
- Body: `You could ask: "[clarifying_question]"`
- Never imperative ("you should ask") — always optional framing

**All steps tapped:** CompletionScreen. "Done." + "Steps saved to today's log." after 1.5 seconds. Fades to Shift Log.

---

### Screen 7 — Shift Log (Work Mode)

```
TODAY — Friday, Nov 6
─────────────────────
7:14 PM   Set up popcorn station    5 steps ✓
8:02 PM   Close the east lobby      3 steps ✓
```

Tap any entry to expand it and see the step list. Tap the "+" on any entry to add a note (text field, auto-saves to localStorage on blur).

---

## 11. Accessibility Checklist

All items must pass before Nov 3 end-of-day.

**Color contrast:**
- Step text (#1A1A1A on #FFFFFF): 19:1 — passes AAA
- Muted text (#6B7280 on #FFFFFF): 4.6:1 — passes AA
- Active card border (#3B82F6 at 60% on #FFFFFF): supplemented by bold step number — never color-only

**Typography:**
- All body text: Atkinson Hyperlegible
- Step text: minimum 22px
- Line height: 1.5×
- No all-caps (use CSS `font-variant: small-caps` only for section headers, never for step text)

**Interactions:**
- Every button: minimum 44×44px tap target
- Every interactive element: visible focus ring (`:focus-visible { outline: 2px solid #3B82F6; outline-offset: 2px; }`)
- Keyboard: Tab order follows visual order. Enter/Space activates buttons.
- No horizontal scroll on any screen

**Motion:**
- All animations: under 200ms
- `@media (prefers-reduced-motion: reduce)` removes all transitions and animations

**Screen reader:**
- All images: `alt` text set to step text (e.g., `alt="Wash your hands"`)
- Buttons: descriptive labels (`aria-label="Mark step 2 complete"` not just "Done")
- Collapsible sections: `aria-expanded` attribute toggled correctly
- Loading state: `role="status" aria-live="polite"` on the loading dots container

**Pictogram-only mode:**
- Add `localStorage` flag `stepCards_prefs.pictogramOnly`
- When true: hide step text, enlarge pictogram to 120×120px
- Toggle accessible from home screen settings (gear icon)

---

## 12. Environment Setup (for Naman — Nov 1)

```bash
npm create vite@latest step-cards -- --template react
cd step-cards
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @radix-ui/react-collapsible @radix-ui/react-dialog
```

**`.env` file (gitignored — never commit this):**
```
VITE_OPENAI_KEY=your_key_here
```

**`index.html` — add Atkinson Hyperlegible:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
```

**`globals.css`:**
```css
body {
  font-family: 'Atkinson Hyperlegible', sans-serif;
  background-color: #FAF9F7;
  color: #1A1A1A;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**`tailwind.config.js` — add font:**
```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Atkinson Hyperlegible', 'sans-serif'],
      },
    },
  },
}
```

---

## 13. README Content (for Dipesh to write Nov 3)

The GitHub README must include:

1. **What it is** (one sentence)
2. **How to run it locally** (clone → npm install → add .env → npm run dev)
3. **What's in .env** (variable name only, never the value)
4. **Tech stack** (React, Vite, Tailwind, Radix, Web Speech API, ARASAAC, localStorage)
5. **AI use** (three LLM calls — briefly described; full prompts in the prompt PDF)
6. **Attribution** (ARASAAC credit with license; list any third-party code used)
7. **Browser requirements** (Chrome or Edge for speech recognition)
8. **Team** (alphabetical: Anand Kumar, Dipesh Gupta, Manan Batra, Naman Dewan)
9. **Challenge** (North America AI Challenge 2026, Scottsdale Launchpad, ASU)

No API keys. No private data. No real student information anywhere in the repo.

---

## 14. Prompt PDF Content (for Naman — Nov 4)

The PDF must contain:

1. **System prompt — Call 1** (instruction → base steps) — full text
2. **System prompt — Call 2** (rewrite for student reading level) — full text
3. **System prompt — Call 3** (work mode adult) — full text
4. **JSON schemas** — the exact shapes each call returns
5. **Guardrails** — what the prompts are designed to prevent:
   - No invented steps ("do not infer steps not said")
   - No praise language ("do not add encouragement")
   - No diagnoses mentioned ("your ADHD" is never in a prompt to the user)
   - No student-identifying information sent to the API
6. **Fading logic** — documented as a rule, not in a prompt (it is computed locally)
7. **ARASAAC pipeline** — keyword extraction from LLM output, API call, fallback

Organize it so a judge can follow the flow: Call 1 input → shape → Call 2 input → shape → rendered output. One page per call is fine. Clear headings.

---

## 15. Pre-recorded Demo Script (for Manan — record by Nov 3)

Two flows, one recording, 90 seconds total.

**Flow 1 — School (60 seconds):**
1. Teacher view open. Tap mic. Say: *"Get your tray, wash your hands, measure two cups of flour, then wait for me."*
2. Loading dots appear briefly.
3. Three columns appear: Leo (pictogram-heavy, short words), Maya (longer text, small icons), Sam (faded — one summary card).
4. Teacher taps Approve. "Sent to students."
5. Switch to Leo's student view. Tap card 1 (gray). Tap card 2 (gray). Tap "Help me" on card 3.
6. Teacher view briefly: yellow notice "Leo — Step 3 (measure flour)".
7. Return to Leo. Tap card 3. Tap card 4. "Done." screen.

**Flow 2 — Work Mode (30 seconds):**
1. Tap "Work Mode" toggle.
2. Paste (or type): *"Before the 7 PM show, fill the popcorn kettle to the oil line, add one bag of kernels, set it for four minutes, move the batch to the warming tray, and text me when it's done."*
3. Tap "Break it down."
4. Five steps appear. Ambiguous terms section shown. Clarifying question shown.
5. Tap through all five steps. "Done." screen. Shift log shows the entry.

**Recording requirements:**
- Screen recording from a Chromebook or laptop — no mobile aspect ratio
- No audio needed (narration happens live); or record with narration as a backup
- MP4 or MOV, under 100MB
- Stored in `/demo/` folder in the repo with a clear filename (`step-cards-demo-nov3.mp4`)

---

## 16. What the Code Review Will Check (Nov 7–9)

Reviewers will look at:

| What | What they want to see |
|---|---|
| AI integration | Real API calls, not hardcoded responses. Prompts visible in code or prompt PDF. |
| Prompt design | Guardrails present. No sensitive data in prompts. JSON return enforced. |
| Attribution | ARASAAC credited in code comments + UI. Any borrowed code snippets attributed. |
| Data privacy | No real student data. No keys in code. localStorage only. |
| Code readability | Components under 150 lines. Meaningful variable names. No dead code. |
| Accessibility | ARIA attributes present. Focus management present. |
| Authenticity | Naman and Manan must explain the code they wrote. Don't write code you can't explain. |

If AI (Cursor, Copilot, Claude) wrote a function: add a comment `// AI-generated — reviewed and tested by [name]`. This is required by the challenge rules. Not a penalty — an honesty requirement.
