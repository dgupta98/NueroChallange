# Step Cards — Complete Build Reference: Visual Design, Tech Stack, Accessibility
**Compiled: Oct 29 | Sources: peer-reviewed + live research + official docs**

> Everything the team needs to build Step Cards correctly. Visual design science, exact tech choices with implementation notes, what existing apps get wrong and how we fix it, accessibility spec, and free tools. No guessing — every decision is sourced.

---

## PART 1: WHAT EXISTS AND WHY IT FAILS

### The Competitive Landscape — What's Actually Out There

| App | Price | What It Does | The Core Failure |
|---|---|---|---|
| **Choiceworks** | ~$6.99 one-time, iOS only | Visual schedule boards: Schedule, Waiting, Feelings. Audio prompts, mark steps complete. OT gold standard. | Manual setup for every routine. Teacher must build schedules ahead of time. Cannot handle a live spoken instruction. No per-student differentiation. Dated interface. |
| **Goally** | $300+ device + subscription | Dedicated locked tablet (no YouTube/apps), visual schedules, timers, token boards, AAC tools. | Hardware cost and lock-in. Still manual schedule building. No AI. Kid can tap "All Done" without doing the task — no verification loop. Not for classrooms. |
| **First Then Visual Schedule** | Paid, iOS | Simple first/then boards. Clean. | Two-step only. Manual. No AI. |
| **Tiimo** | Subscription | Visual daily planner, color-coded timeline, focus timer, icon-based. | Personal planner only — no teacher, no classroom, no shared view, no live instruction handling. |
| **Goblin Tools (Magic ToDo)** | Free | Type a task → AI breaks into smaller steps. Adjustable detail level. | Text only, single user typing their own task. No pictograms, no classroom, no teacher loop, no fading, no voice input. |
| **VizyPlan** | Subscription | Puts the child's own photo in each schedule step. IEP document reviewer. | Setup-heavy. Parent-oriented, not classroom-real-time. No live instruction. |
| **Brili** | Paid | Visual schedules with timers for time-based routines. | Timer-oriented, not instruction-oriented. Manual. |

### The Specific Failures That Step Cards Fixes

**Failure 1: Everything requires setup before the moment of need.**
Every app above assumes an adult sat down earlier and built the schedule. A teacher saying "get your tray, wash your hands, measure two cups of flour, then wait for me" in a cooking class has no time to open an app, create a new routine, add four steps, assign pictograms, and push it to students. The instruction is spoken and gone. This is why Step Cards needs AI — it's the only way to handle instructions that weren't planned ahead.

**Failure 2: One version for all students.**
Even if a teacher builds a schedule, they build one version. Leo reads at a 2nd-grade level. Maya is a strong reader but anxious. A third student doesn't read at all and needs pictogram-only. No app personalizes per student from one input. Step Cards does this in a second LLM call.

**Failure 3: No fading.**
Every app shows the same full schedule forever. There's no mechanism for the tool to reduce itself as a student masters a routine. This creates dependency, not independence. Fading (NCAEP 2020 evidence-based practice) is what makes the tool a teaching tool, not a crutch.

**Failure 4: No teacher visibility loop.**
Students can tap "All Done" in Choiceworks without doing anything. Teachers don't know who's stuck at which step. Step Cards' "Help me" button creates a private signal that goes directly to the teacher view — no public hand-raising, no shame, immediate intervention.

**Failure 5: No school-to-home transfer.**
None of the apps above have a mechanism to send today's routine to a parent journal. The cards going home is what allows the skill to be practiced in a second setting — which is what generalizes it (PACT-G trial).

**Failure 6: No adult mode.**
Every app stops at age 12 effectively. The same working-memory problem that makes cooking class hard makes manager instructions hard at 22. No product spans the whole journey.

---

## PART 2: VISUAL DESIGN — THE SCIENCE

### What the Research Actually Says (9 Categories)

Source: Rusakova, UX Collective (research synthesis across 15+ peer-reviewed studies); Section 508.gov; WCAG 2.1; ResearchGate 2024 color study.

---

#### 1. Layout
**The principle:** Autistic brains process rapidly-changing, chaotic information with difficulty. They need stability, predictability, and structure. The cognitive load of a cluttered UI is not aesthetic — it's sensory.

**Specific rules:**
- One main call to action per screen. Never two competing actions.
- Consistent layout for similar information types — if a step card looks like X on screen 1, it looks like X on every screen.
- Clear visual hierarchy with generous whitespace — content should be sparse, not packed.
- Cluster and surface only the most-used features. Hide complexity behind progressive disclosure.
- No sidebars, no overlapping elements, no panels that slide in from the side (moving elements cause anxiety).
- All content for one subject on a single page — don't break information across multiple pages.

**For Step Cards specifically:**
- Teacher view and student view are completely separate screens, never shown simultaneously.
- Each step card is its own visual unit with clear borders.
- Maximum 4 step cards visible at once — scroll if more.

---

#### 2. Color
**The science:** Autistic individuals have heightened sensory sensitivity. Bright/saturated colors are experienced as sensory overloading, not just visually intense. Yellow specifically — in a Frontiers in Psychology study (n=67) — was significantly aversive to autistic boys due to its high luminance. Green and brown were preferred. The finding is attributed to luminance sensitivity, not hue specifically.

**Specific rules:**
- Use soft, desaturated, muted tones. Not pastels (which can feel babyish) — soft naturals.
- Avoid pure white backgrounds — slightly off-white (#F8F7F4 or similar) reduces luminance.
- Avoid pure black text — use dark gray (#1A1A1A or #2D2D2D) on off-white.
- Never use yellow as a primary color, status indicator, or notification color.
- High contrast between text and background: WCAG AA minimum = 4.5:1 ratio; target AAA = 7:1.
- Status indicators: use shape + color, never color alone (colorblindness + sensory sensitivity).
- The National Autistic Society website has a "calm" toggle — this is the model. Offer it.

**For Step Cards specifically:**
- Card backgrounds: soft blue-gray (#EEF2F7) or warm white (#FAF9F7)
- Active/current card: slightly warmer highlight (not yellow — use a soft amber or green border)
- Completed card: gentle checkmark + desaturated green — never bright green
- "Help me" button: calm blue or teal, not red (red is alarming, creates anxiety)

---

#### 3. Typography
**The science:** Section 508, WCAG 2.1, and Harvard Accessibility all converge on the same rules for cognitive accessibility.

**Specific rules:**
- **Font family:** Sans-serif only. Recommended: **Atkinson Hyperlegible** (designed specifically for low-vision readers, free, Google Fonts), or **OpenDyslexic** (free, reduces letter confusion for dyslexic readers — relevant for many AZACS students).
- **Font size:** Minimum 16px body text. Step card text: 20–24px. Teacher view labels: 14px acceptable.
- **Line height:** 1.5× the font size minimum (WCAG 1.4.12).
- **Letter spacing:** At least 0.12× the font size.
- **Word spacing:** At least 0.16× the font size.
- **Never all caps** — removes word shape recognition, slows reading.
- **Never justified text** — use left-aligned only. Justified creates irregular spacing that is hard to track.
- **No underlining** except links.
- **Line length:** 45–75 characters per line maximum. Wider lines are harder to track across.

**For Step Cards specifically:**
- Step text: Atkinson Hyperlegible, 22px, left-aligned, dark gray on off-white
- Step number: larger (32–40px), bold, right of pictogram
- All instruction text runs through the LLM reading-level filter before display — Leo's cards use ≤2nd grade vocabulary, Maya's use ≤6th grade

---

#### 4. Imagery (Pictograms)
**The science:** For children (the primary research population), visual learners benefit from images + words together. Images alone can be ambiguous — words + images together improve comprehension. For adults, preference shifts toward structured text when images are functional rather than decorative.

**The key insight:** Images should not be decorative. Every pictogram in Step Cards is functional — it represents the action, not the vibe.

**Specific rules:**
- Never use images as backgrounds to text.
- Simple graphics, ideally in color (not black and white line drawings — color aids recognition).
- One pictogram per card, representing the single action of that step.
- Pictogram + short text label together — never pictogram alone (ambiguous) or text alone (overloads working memory).
- Avoid abstract or metaphorical imagery. "Wait" should show a person waiting, not a clock. "Measure" should show a measuring cup, not a ruler.

---

#### 5. Interaction and Animation
**The science (Rusakova research synthesis):**
- Animations that add informational value are accepted. Animations for visual effect cause anxiety.
- Horizontal scrolling is significantly more disorienting than vertical — never use it.
- Auto-playing content (sound, video, animation) with no user control is severely anxiety-inducing.
- Pop-ups appear without warning — anxiety-inducing for 40% of autistic users who have co-occurring anxiety disorder.
- Hover effects that reveal more detail are accepted. Hover effects that just move things around are not.

**Specific rules:**
- No autoplay of anything.
- No pop-ups. Notifications appear inline, not as modals.
- No horizontal scrolling.
- Card completion animation: minimal — a soft fade and checkmark. Not a fireworks explosion.
- "Help me" tap: instant feedback (button state change), no animation delay, no confirmation modal.
- All transitions: under 200ms, predictable direction (forward = right, back = left — always).
- Reduce motion media query: `@media (prefers-reduced-motion)` must disable all transitions.

---

#### 6. Navigation
**Specific rules:**
- Progress bar in every multi-step journey (WCAG guidance for autistic users).
- One toolbar maximum.
- Every button has a text label — no icon-only buttons except universally understood ones (back arrow).
- Descriptive labels: "Approve cards for Leo" not "Submit."
- No time pressure on any interaction. No timeouts.
- Always show where you are in the flow.

**For Step Cards specifically:**
- Student view: shows only the current card + "Done" + "Help me." No navigation visible. Nothing else to tap.
- Teacher view: shows student cards + "Approve" + student status. No secondary navigation visible during active instruction.

---

#### 7. Plain Language (Content)
**Source:** Section 508.gov; WCAG 2.1 success criterion 3.1.5 (Reading Level); W3C COGA (Cognitive Accessibility).

**Specific rules:**
- Short sentences — target 8–12 words maximum per step.
- Active voice only — "Wash your hands" not "Hands should be washed."
- Concrete nouns — "flour" not "the ingredient."
- No idioms, no metaphors, no sarcasm.
- Verbs at the start of each step — "Get," "Wash," "Measure," "Wait."
- Numbers as numerals — "2 cups" not "two cups" (reduces cognitive decoding).

**For Step Cards specifically:**
- The LLM prompt for student-version rewriting must output steps following these rules precisely.
- Reading level targeting: Flesch-Kincaid Grade Level ≤ 2 for Leo-type profiles, ≤ 5 for Maya-type.
- The prompt PDF must document the exact plain language rules given to the model.

---

#### 8. Personalisation
**The science:** Autistic users strongly benefit from personalisation options — font size, color themes, line spacing. Even just a "calm mode" toggle significantly reduces sensory load.

**For Step Cards (quick wins):**
- Font size slider: Small / Medium / Large (maps to 18/22/28px)
- Color mode: Default / High Contrast / Dark
- Pictogram toggle: Show pictograms / Text only
- Per-student profiles persist these preferences automatically

---

## PART 3: TECH STACK — EXACT CHOICES AND WHY

### The Stack (Final Recommendations)

| Layer | Choice | Why | Notes |
|---|---|---|---|
| **Framework** | **React** (Vite) | Component-based, fast setup, excellent accessibility library ecosystem | Plain HTML/JS also works but React makes the per-student card system cleaner |
| **Accessibility components** | **Radix UI** (free, headless) | Every component is ARIA-compliant out of the box, keyboard navigable, screen-reader ready | No visual opinions — you style it. Zero cost. |
| **Styling** | **Tailwind CSS** | Utility-first, fast iteration, good a11y utilities | Use `@tailwindcss/typography` for readable prose |
| **Speech-to-text** | **Web Speech API** (browser built-in) | Free, zero latency, no API key, works in Chrome/Edge. Chrome desktop: full support. | **Fallback:** text paste input. Firefox: not supported — tell users to use Chrome. |
| **Text-to-speech (read aloud)** | **Web Speech Synthesis API** | Free, browser built-in, configurable rate/pitch/voice | One line: `speechSynthesis.speak(new SpeechSynthesisUtterance(text))` |
| **LLM API** | **Claude claude-haiku-4-5-20251001 or GPT-4o-mini** | Fast, cheap, structured JSON output | Confirm which API the challenge provides. Haiku = ~$0.25 per million tokens. |
| **Pictograms** | **ARASAAC REST API** | Free, 35,000+ pictograms, CC BY-NC-SA license (ok for non-commercial prototype) | Must credit ARASAAC on the UI |
| **Storage** | **localStorage** (browser) | Zero backend, zero cost, works offline, no data privacy issues | For demo: made-up students. No real names ever. |
| **Fonts** | **Atkinson Hyperlegible** (Google Fonts) | Designed for low-vision readers, freely licensed, dramatically improves readability | Import: `@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible')` |

---

### Web Speech API — What Works, What Doesn't

**Browser support (as of 2026):**

| Browser | Speech Recognition | Speech Synthesis |
|---|---|---|
| Chrome desktop | ✅ Full | ✅ Full |
| Edge desktop | ✅ Full (v79+) | ✅ Full |
| Safari desktop | ⚠️ Partial (v14.1+) | ✅ Full |
| Firefox | ❌ Not supported | ✅ Full |
| Chrome Android | ⚠️ Partial | ✅ Full |
| Safari iOS | ⚠️ Partial | ✅ Full |

**Recommendation:** Target Chrome. The demo device should be Chrome. Add a banner: "Step Cards works best in Google Chrome."

**Known limitations:**
- Privacy: Chrome sends audio to Google's servers for recognition. For demo with made-up data this is fine. Disclose in responsible AI PDF.
- Accuracy drops with background noise — classroom environment. Mitigation: use a directional microphone, or add a "Did I get this right?" confirmation step before sending to LLM.
- No offline support for speech recognition — requires internet connection.

**Implementation pattern:**
```javascript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = true; // shows real-time transcript
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // send to LLM
};

recognition.onerror = (event) => {
  // fallback: show text input
};
```

---

### ARASAAC API — Exact Endpoints

**Base URL:** `https://api.arasaac.org/v1/`

**Key endpoints:**

```
# Search by keyword → returns pictogram IDs
GET https://api.arasaac.org/v1/pictograms/{language}/search/{searchterm}
→ Returns array of [{_id, tags, keywords}]

# Get pictogram image directly (PNG, 500px)
GET https://api.arasaac.org/v1/pictograms/{id}?download=false
→ Returns image directly (use as <img src="">)

# Get pictogram with options
GET https://api.arasaac.org/v1/pictograms/{id}?color=true&resolution=500
```

**Example — search for "wash hands":**
```
GET https://api.arasaac.org/v1/pictograms/en/search/wash%20hands
→ Returns [{ _id: 2458, keywords: ["wash", "hands", "hygiene"] }, ...]

# Then get the image:
<img src="https://api.arasaac.org/v1/pictograms/2458?color=true&resolution=500" />
```

**The LLM → ARASAAC pipeline:**
1. LLM returns step: `{ text: "Wash your hands", icon_keyword: "wash hands" }`
2. App calls ARASAAC search with `icon_keyword`
3. Takes first result `_id`
4. Renders `<img src="https://api.arasaac.org/v1/pictograms/{id}?color=true" />`

**License:** CC BY-NC-SA 4.0. For non-commercial prototypes: free. Must credit: "Pictographic symbols used are the property of the Government of Aragón and have been created by Sergio Palao for ARASAAC (http://www.arasaac.org), that distributes them under Creative Commons License CC (BY-NC-SA)."

**Fallback:** If ARASAAC search returns no results for a keyword, show a generic placeholder icon (📋 or a simple emoji). Don't break the card.

---

### LLM Prompt Architecture

**Two LLM calls per instruction:**

**Call 1: Instruction → Base Steps (JSON)**
```
System: You are a special education assistant. Break a teacher's spoken instruction into clear, 
ordered steps for autistic students. Return valid JSON only.

Rules:
- Each step is one concrete physical action
- Start each step with an action verb
- Use plain language (short words, short sentences)  
- Maximum 8 words per step
- Last step should tell what happens next ("Wait for Ms. R")
- Return 2-6 steps. Never more than 6.
- For each step, suggest one pictogram search keyword (1-2 words)

Output format:
{
  "steps": [
    {"n": 1, "text": "Get your tray", "icon_keyword": "tray"},
    {"n": 2, "text": "Wash your hands", "icon_keyword": "wash hands"},
    ...
  ]
}

Instruction: [TEACHER_INSTRUCTION]
```

**Call 2: Base Steps → Per-Student Version**
```
System: Rewrite these steps for a specific student. Return JSON only.

Student profile:
- Name: [NICKNAME]
- Reading level: [GRADE_LEVEL] (e.g. "2nd grade", "6th grade", "pictogram only")
- Support level: [FULL/PARTIAL/MINIMAL] (how many cards to show)
- Interests: [OPTIONAL - e.g. "trains"] (for completion reward reference only)

Rules:
- Keep the same step order and actions
- Simplify vocabulary for the reading level
- If "pictogram only": return 3-word maximum per step
- If PARTIAL support: combine steps where appropriate to reduce card count
- If MINIMAL support: show only steps the student needs help with
- Never change what the step is asking the student to do

Input steps: [BASE_STEPS_JSON]
Output format: same JSON structure
```

**Call 3 (adult mode only): Work instruction → clear steps + clarifying question**
```
System: You help adults with neurodivergent profiles understand workplace instructions.
Break this manager's instruction into clear steps. Identify any ambiguous terms.
Suggest one polite clarifying question the worker could ask.

Rules:
- Plain language (short sentences, concrete nouns)
- Flag genuinely ambiguous terms (e.g. "before the rush", "low on cups")
- Clarifying question should be natural and non-confrontational
- Maximum 5 steps

Output format:
{
  "steps": [{"n": 1, "text": "...", "icon_keyword": "..."}],
  "ambiguous_terms": [{"term": "before the rush", "why": "unclear timing"}],
  "clarifying_question": "How long before showtime should I have concessions restocked?"
}

Instruction: [MANAGER_INSTRUCTION]
```

---

## PART 4: ACCESSIBILITY SPEC — WHAT TO BUILD

### WCAG 2.1 AA Requirements (Minimum)

| Requirement | Implementation |
|---|---|
| Color contrast ≥ 4.5:1 | Use off-white (#FAF9F7) background, dark gray (#1C1C1E) text. Test with Chrome DevTools |
| Text resize to 200% without content loss | Use rem units, not px. Test by browser zoom |
| No content relies on color alone | "Help me" sent indicator uses text + color, not color alone |
| All interactive elements keyboard navigable | Radix UI handles this automatically |
| All images have alt text | Every ARASAAC pictogram: `alt="[step text]"` |
| No autoplay audio/video | Not applicable — we don't autoplay |
| Consistent navigation | Same layout every screen |
| Descriptive labels | All buttons labeled, no icon-only controls |
| No timing requirements | No timeouts, no timed interactions |

### Autism-Specific Beyond WCAG

| Feature | Implementation |
|---|---|
| Reduced motion support | `@media (prefers-reduced-motion: reduce) { * { transition: none; } }` |
| Font size control | CSS custom property `--base-font-size`, adjustable via settings |
| Calm color mode toggle | One CSS class swap on `<body>` that switches to desaturated palette |
| No pop-ups | All notifications inline, no modals |
| Progress indicator | Step counter: "Step 2 of 4" visible on every card |
| Predictable layout | Identical card structure every time |
| Read aloud on tap | Tap any card text → Speech Synthesis reads it |
| "Pictogram only" mode | Student profile setting — hides text labels from student view |

### COPPA / Data Privacy (Students Are Minors)

AZACS students are minors. This matters for the responsible AI section.

**Rules:**
- Store no real names. Use nicknames only (Leo, Maya).
- Store no photos.
- Store no diagnoses or medical information.
- Store no precise age. Use "elementary" / "middle" / "high school."
- All storage is `localStorage` — data never leaves the device.
- No analytics, no tracking, no third-party scripts except Google Fonts.
- No accounts, no login.

**State this explicitly in the responsible AI PDF:** "Step Cards stores no personally identifiable information. All student profiles use nicknames and reading levels only. No data is transmitted to any server except the teacher's spoken instruction, which is sent to the speech recognition service (Google Chrome) and the LLM API (anonymized, no student identifiers included)."

---

## PART 5: FREE TOOLS AND RESOURCES — QUICK REFERENCE

| Tool | What it gives us | Cost | Link |
|---|---|---|---|
| **ARASAAC** | 35,000+ pictograms via REST API | Free (CC BY-NC-SA) | api.arasaac.org |
| **Atkinson Hyperlegible** | Accessible font, Google Fonts CDN | Free | fonts.google.com/specimen/Atkinson+Hyperlegible |
| **OpenDyslexic** | Dyslexia-friendly font | Free | opendyslexic.org |
| **Radix UI** | Accessible React component primitives | Free, open source | radix-ui.com |
| **Tailwind CSS** | Utility CSS including a11y utilities | Free | tailwindcss.com |
| **Web Speech API** | Speech recognition + synthesis | Free, browser built-in | MDN |
| **Vite** | Fast React build tool | Free | vitejs.dev |
| **Supabase** (if needed) | Free tier database for shared state | Free tier | supabase.com |
| **Chrome DevTools** | Color contrast checker, accessibility audit | Free, built-in | DevTools → Lighthouse |
| **axe DevTools** | Browser extension, auto a11y audit | Free version | deque.com/axe |
| **WAVE** | Web accessibility evaluation tool | Free | wave.webaim.org |

---

## PART 6: THE CARD COMPONENT — VISUAL SPEC

### What a Single Step Card Looks Like

```
┌─────────────────────────────────┐
│  ① ← step number (32px bold)   │
│                                 │
│  [PICTOGRAM 120×120px]          │
│                                 │
│  Wash your hands                │  ← 22px Atkinson Hyperlegible
│                                 │
│  ┌──────────┐  ┌─────────────┐ │
│  │  ✓ Done  │  │  🙋 Help me │ │  ← 44px touch targets minimum
│  └──────────┘  └─────────────┘ │
└─────────────────────────────────┘
```

**Card states:**
- **Default:** Off-white background, dark gray border (1px)
- **Active/current:** Soft blue-green left border (4px), slightly elevated shadow
- **Completed:** Gray background, ✓ overlay, no Done/Help buttons
- **Needs help:** Amber left border on teacher view for that student

**Touch target minimum:** 44×44px for all interactive elements (WCAG 2.5.5 AAA, iOS HIG standard). This is non-negotiable for tablet use.

**Card width:** Full width on mobile, max 400px on desktop — never shrink cards.

---

## PART 7: THINGS TO AVOID — THE "CLEAN EXIT" TEST

From real user research on visual schedule apps (1-gadget.com, n=month of testing):

> "The very tool that was supposed to prevent a tantrum just caused a worse one."

The risk: Step Cards itself becomes an overstimulating object that causes dysregulation when it's time to put it away.

**The three failure modes to design against:**

1. **Overstimulation from rewards:** No fireworks, no fanfare, no infinite animations on step completion. A soft ✓ and a quiet sound (optional). The reward is doing the task, not the app.

2. **Addiction to the app:** The app should feel like a tool, not a game. No points, no leaderboard, no "streak" for students. The fading mechanism is the opposite of addiction — it removes itself as the student succeeds.

3. **The "clean exit":** When the last card is tapped, the screen should show a single clear message: "All done! 🎉" with no further interactive elements. No "share your score," no "try again," no suggested next activity. Just a quiet acknowledgment and a natural stop.

---

## PART 8: WHAT GOOD LOOKS LIKE — REFERENCE EXAMPLES

**Apple's original iOS design** is cited in autism UX research as a model: clean layout, large margins, clear calls to action, no distraction. The original iPhone settings screen — one list, clear labels, consistent row design — is the aesthetic target.

**First Place AZ's own building** is a physical reference: wayfinding by floor color (consistent system, not arbitrary), recessed doorways (one stimulus at a time), extra-wide hallways (no close-quarters overwhelm). These are design principles in architectural form. The app should feel like the building looks.

**Goblin Tools Magic ToDo** is the UX reference for input-to-output immediacy: one field, one action, instant result. No chrome, no onboarding, no friction. Step Cards should feel this immediate.
