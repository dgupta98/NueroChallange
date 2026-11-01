# Adult Mode — Feature Spec for Naman
**Author: Dipesh | Date: Oct 30, 2026**

> This is the exact spec for the Jordan flow. What happens on screen, what the AI receives, what it returns, and what the user sees. Precise enough to build the pipeline without a follow-up.

---

## Who This Is For

**Jordan, 22.** Just started at AMC. ADHD + autism. His manager gives multi-step verbal instructions during his shift. Jordan can follow the first two steps and then blanks on the rest — not because he didn't listen, but because working memory under sensory load in a loud theater lobby means the instruction was gone before he could act on it. He can't ask "can you repeat that?" twice without looking incompetent. He needs a private tool that turns what he heard into a checklist he can work from.

The adult mode serves this exact scenario. It is the **same AI engine as the school mode** — but the input is text (typed or pasted), the output is plain-language steps (no pictograms by default, though user can turn them on), and the framing is for a working adult.

---

## The Full Jordan Flow — Step by Step

### Step 1 — Jordan opens the app

He taps the "Work Mode" toggle from the home screen (not a separate app — same app, different view). The screen shows:

> **"What did your manager just say?"**
> A large text input field.
> Below it: a microphone button labeled "Or speak it" and a keyboard icon for typing.

No login. No profile setup. The field is blank and focused. Jordan types or speaks what he just heard. The input field supports paste (he can type in Notes and paste over).

**Design rule:** No timer, no "you have X seconds," no urgency indicators. The screen waits.

---

### Step 2 — Jordan submits

He taps a large "Break it down" button (not "Submit" — verb-first, action language).

The screen shows a quiet loading state: a soft animation (two or three dots pulsing). No spinner. No percentage. No estimated time. Just "Working on it..." in muted text.

**Time target:** LLM call should complete in under 3 seconds for a typical instruction (≤30 words input).

---

### Step 3 — Jordan sees his steps

The response screen shows:

```
[INSTRUCTION SUMMARY — collapsible, collapsed by default]
"Set up the popcorn station before the 7 PM show."

STEP 1  Fill the kettle with oil to the line.
STEP 2  Add one bag of kernels.
STEP 3  Set the timer to 4 minutes.
STEP 4  When done, move the batch to the warming tray.
STEP 5  Text manager when the station is ready.

[FLAG THIS STEP]  on each step — tap if a step is unclear
```

Each step is on its own line. Large font (22px minimum). No checkboxes by default — Jordan taps a step to mark it done (it grays out quietly, no sound, no animation longer than 100ms). "Help me with this step" appears below any step he taps twice.

---

### Step 4 — Jordan sees ambiguous terms flagged

Below the steps, a section appears automatically if the AI detected ambiguous language:

```
UNCLEAR TERMS
─────────────
"the line"       →  The oil fill line marked on the inside of the kettle
"warming tray"   →  The silver tray on the right of the popcorn machine
```

This section is collapsible. It appears expanded the first time Jordan uses the feature and collapsed by default after that (localStorage flag: `adultMode_ambiguousSectionSeen = true`).

---

### Step 5 — Jordan sees the clarifying question (optional, not forced)

Below the steps and ambiguous terms, a third section appears:

```
IF SOMETHING IS STILL UNCLEAR
──────────────────────────────
You could ask:
"Can you show me where the oil line is before the show starts?"
```

This is framed as something Jordan *could* say — not something he must do. It gives him a script so he doesn't have to compose the question under pressure. The section is collapsible and starts collapsed.

**Design rule for this section:** Never frame it as "you should ask your manager." Frame it as "here's a sentence you can use if you want to."

---

### Step 6 — Jordan works through the steps

He taps each step as he completes it. Tapped steps go gray (no strikethrough — strikethroughs look like errors). The current step has a soft left-border highlight (2px, muted blue).

There is no progress bar on this screen — it adds pressure. Instead, the incomplete steps are simply visible.

When all steps are tapped, the screen shows a quiet completion state:

> **Done.**
> *(small text below)* "Steps saved to today's log."

No confetti. No "Great job!" No sound. Just "Done." followed by a 1.5-second pause, then the screen fades to the log.

---

### Step 7 — The shift log (passive, not a chore)

Every completed instruction is automatically saved to a shift log. Jordan never has to write in it — the log builds itself.

The log view shows:

```
TODAY — Thursday, Nov 6
─────────────────────────
7:14 PM   Set up popcorn station    ✓ 5 steps
8:02 PM   Close the east lobby      ✓ 3 steps
```

Jordan can add a note to any entry ("the kettle tip was confusing — I figured it out") but he doesn't have to. Notes are private.

At the end of a shift, the log is one tap away from a "shift summary" — a list of what he completed. This is the **90-day review preparation** feature. Before his 90-day check-in, Jordan has a record of everything he handled independently.

---

## What the AI Receives and Returns (for Naman)

### Input to the AI (LLM Call 1 — Adult Mode)

```
System prompt:
You are an assistant helping a neurodivergent adult worker understand and complete workplace instructions. The user has ADHD and/or autism. They have working memory challenges and may struggle with ambiguous or multi-step verbal instructions given quickly.

Your job:
1. Break the instruction into numbered, plain-language steps.
2. Flag any ambiguous terms (jargon, unclear references, implicit context).
3. Suggest one clarifying question the user could ask if something is still unclear.

Rules:
- Maximum 8–10 words per step.
- Active voice. Verb first.
- No jargon. If you encounter jargon, flag it.
- Do not invent steps. Only break down what was actually said.
- Do not add encouragement phrases. No "Great!" or "You've got this."
- If the instruction has fewer than 2 steps, still format it as a step list (even if there's only 1 step).

Return JSON only. No prose before or after the JSON.

User input:
{INSTRUCTION_TEXT}
```

### Expected JSON output (LLM Call 1 — Adult Mode)

```json
{
  "instruction_summary": "Set up the popcorn station before the 7 PM show.",
  "steps": [
    {"n": 1, "text": "Fill the kettle with oil to the line."},
    {"n": 2, "text": "Add one bag of kernels."},
    {"n": 3, "text": "Set the timer to 4 minutes."},
    {"n": 4, "text": "Move the batch to the warming tray when done."},
    {"n": 5, "text": "Text manager when the station is ready."}
  ],
  "ambiguous_terms": [
    {"term": "the line", "plain": "The oil fill line marked on the inside of the kettle"},
    {"term": "warming tray", "plain": "The silver tray on the right of the popcorn machine"}
  ],
  "clarifying_question": "Can you show me where the oil line is before the show starts?"
}
```

**If there are no ambiguous terms:** `"ambiguous_terms": []`
**If no clarifying question is needed:** `"clarifying_question": null`

---

## What This Is NOT (to avoid scope creep for Nov 1–3)

| Feature | Status | Reason |
|---|---|---|
| Accommodation navigator (ADA rights) | Not in MVP | Phase 2 — valuable but not needed for demo |
| Review prep coach (90-day coaching) | Not in MVP | The shift log alone is sufficient for demo |
| Post-shift reflection prompts | Not in MVP | Log + notes is sufficient |
| Manager message rewriter ("here's how to say this to your manager") | Not in MVP | Adds complexity; Jordan scenario doesn't need it |
| Pictograms in adult mode | Off by default | User can toggle on — but don't build the toggle for MVP |
| Per-user profile / multiple workers | Not in MVP | One user, localStorage only |

The MVP demo needs: input → steps → ambiguous terms → clarifying question → tap to complete → quiet completion. That's it.

---

## The Demo Script for Jordan's Scenario (for Manan and Anand)

**What the judge sees:**

1. Presenter switches to Work Mode on the same app used for Leo's school demo.
2. Types (or pastes): *"Before the 7 PM show, fill the popcorn kettle to the oil line, add one bag of kernels, set it for four minutes, move the batch to the warming tray, and text me when it's done."*
3. Taps "Break it down."
4. Five steps appear. Two ambiguous terms flagged below. One clarifying question below that.
5. Presenter taps through each step as done. Quiet gray-out.
6. Final step tapped — "Done." appears.
7. Presents flips to the log. The completed instruction is there with timestamp.

**One-line close:** "Same engine Jordan uses every shift — and after 90 days, he has a record of everything he did independently."

---

## Connection to School Mode (for Anand's slides)

The pitch slide 5 ("What's Next") should show this as a progression:

```
AZACS student (Leo, 12)
  → Cards learned at school go home
    → Same app, adult mode, first job (Jordan, 22)
      → Shift log becomes 90-day review prep
```

Same product. One human story. School → home → first job.
