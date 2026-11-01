# Step Cards — Responsible AI

**Author:** Naman Dewan · **Date:** Oct 30, 2026 · Maps to the Principled Innovation criterion ([04_JUDGING_RUBRIC.md](04_JUDGING_RUBRIC.md)) and [11_PRINCIPLED_INNOVATION_AND_ASU_VALUES.md](11_PRINCIPLED_INNOVATION_AND_ASU_VALUES.md)


The judges' "Principled Innovation" criterion, and the questions they told us they ask: why AI, user control, privacy, bias and limits, accessibility, and when to hand off to a human.

## Why AI is needed here

Teachers give instructions live, and they change all the time. Nobody can prepare visual steps for every sentence ahead of time, and doing it by hand for three students at three levels is impossible mid-lesson. AI makes the cards in seconds. Everything else (approval, tapping, fading rules) is plain code that a teacher can understand.

## Humans stay in charge

- **A teacher approves every set of cards** before a student sees it. They can edit, delete or reorder steps.
- **The fading rule is simple and visible:** for example, after 3 clean runs of a routine, show a shorter version. The teacher can turn it off for any student.
- **Students choose:** "more help" or "less help" is a button on their own screen.
- **"Help me" always reaches a person.** The app never tries to replace the teacher's help.

## Privacy (students are minors)

- **Demo uses made-up students only.** No real names, photos or records.
- The student profile holds only what's needed: first name or nickname, reading level, support level and interests. **No diagnoses or health data.**
- Instruction text is sent to the AI model without the student's name.
- No API keys in the repo, and data isn't sold or used for ads.
- For a real pilot: follow the school's FERPA process, get parent consent, and let parents delete data.

## Bias and limits

- AI can split steps wrongly or use words that are too hard. That's why the teacher approves, and why the cards use a fixed reading-level setting.
- Pictogram choice can miss cultural context. Teachers can swap any picture.
- AI can't judge safety (hot ovens, drone propellers). Safety steps come from the teacher's own checklist, never invented by the AI.
- It's a support, not a diagnosis or a behaviour score. We never rank students.

## Shame-free design (our top rule)

- No red marks, no streak-breaking, no "you're late."
- "Help me" is private: only the teacher sees it.
- Progress is framed as "you did 4 steps on your own today," never as what was missed.

## Accessibility

- Big tap targets, high contrast, one step per screen when needed.
- Pictograms with text, and read-aloud for every card.
- Calm colours and no flashing animations (sensory-friendly).
- Works on a school tablet or laptop browser. No wearable, since First Place's wearable trial failed on sensory grounds.

## What goes in the required prompt PDF

The system prompt for splitting instructions, the reading-level personas, guardrails (no safety steps invented, no diagnoses, kind language) and the prompt flow (instruction → steps → per-student versions → teacher approval). We keep these in a `prompts/` folder as we build them.
