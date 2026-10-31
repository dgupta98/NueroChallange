# Step Cards — Proposal for the School Stage (Team Kaleidoscope)

**Author:** Naman Dewan · **Date:** Oct 30, 2026 · **Status:** proposal for team sign-off before the Nov 1 build

> Step Cards turns any spoken instruction into picture steps matched to each autistic student, and fades the help as they master it, from classroom to home to first job.

**How it fits our existing direction:** the skill milestone tracker and post-hire coach (files 26–28) stay as the adult stages. Step Cards is the same AI engine (break an instruction into steps the person can follow, then need it less over time) starting at AZACS. One story: **school → home → First Place AZ → first job.**

Related: research in [31](31_STEP_CARDS_RESEARCH.md), responsible AI in [32](32_STEP_CARDS_RESPONSIBLE_AI.md), build plan in [33](33_STEP_CARDS_BUILD_PLAN.md), AZACS debrief in [29](29_AZACS_VISIT_DEBRIEF_OCT29.md).


## One line

Turn any spoken instruction into picture steps the student can follow, and need less help over time.

## Who it's for

**Primary user: autistic students at Arizona Autism Charter Schools (AZACS)**, often with ADHD as well. Their days are full of hands-on, multi-step activities: cooking, robotics, drone building, coding, dance.

**Also used by:**
- **Teachers and aides**, who approve the cards and see who's stuck. AZACS runs about 1 staff member for every 3 students.
- **Parents**, who see the day's routines in the journal and practise them at home.
- **Later: adults at First Place AZ and new employees**, for recipes and chores, and for decoding instructions at work.

## Personas (made up, for the pitch and demo)

**Leo, 12.** Autistic with ADHD. Loves trains. Reads at about a 2nd-grade level. In cooking class he gets the first step right, then freezes because he's forgotten the rest. Staff see him wander and redirect him, which frustrates him.

**Maya, 16.** Autistic, a strong reader, and in the drone course. She can follow written steps well but gets anxious when instructions are only spoken and fast. She wants to do things herself, without an aide standing next to her.

**Ms. R, teacher.** Has three students who each need instructions in a different way. She can't write three sets of visual steps for every instruction in a 45-minute lesson.

**Jordan, 22.** Lives at First Place AZ and started a job at a movie theatre. His manager says "restock concessions before the rush and let Jake know if we're low on cups." Jordan isn't sure what "before the rush" means, or whether "low" means 10 cups or 100.

## The executive-function skills it targets

| Skill | How Step Cards helps |
|---|---|
| Working memory | The steps live on the screen, not in the student's head |
| Planning and sequencing | Instructions arrive already ordered and numbered |
| Task initiation | The first card is always small and concrete ("Get your tray") |
| Self-monitoring | Checking off cards shows the student their own progress |
| Asking for help | "Help me" is one tap, private and shame-free |
| Transitions | The last card says what happens next ("Then: wait for Ms. R") |

## How it's different from a "focus app"

The challenge rules warn against "the generic focus app." Step Cards isn't a timer or a to-do list:
- It works on **live, unplanned instructions**, which no one can prepare ahead of time. This is why it needs AI.
- It **personalises each instruction for each student**, from the same sentence the teacher says.
- It **fades the support** so students become independent, rather than dependent on the app.
- It **closes the loop**: the teacher sees which step trips which student, and parents see what to practise.

## Demo script (about 90 seconds of the 5-minute pitch)

1. The teacher view is open. Say aloud: *"Get your tray, wash your hands, measure two cups of flour, then wait for me."*
2. Three student versions appear side by side:
   - **Leo:** 4 big picture cards with 3–5 words each and a train sticker on completion.
   - **Maya:** 4 short text steps with small icons.
   - **A student who has mastered it:** 1 card: "Get ready to bake (4 steps)."
3. The teacher taps **Approve**, and the cards go to the student tablets.
4. On Leo's tablet, tap card 1, then card 2, then tap **Help me** on card 3. The teacher's screen shows "Leo – step 3 (measure flour)".
5. Switch to **Jordan at work**: paste the manager's message, and it becomes clear steps, plus one suggested question to ask his manager ("How many cups counts as low?").
6. Close with: *"Same engine, from the classroom to the kitchen to the first job."*

Always bring a **pre-recorded backup** of this demo (required by the rules).
