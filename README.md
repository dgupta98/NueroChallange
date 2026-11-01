# Step Cards — North America AI Challenge 2026

**Team Kaleidoscope | ASU Scottsdale Launchpad | Nov 6, 2026**

A web app that turns any spoken classroom instruction into personalized picture step cards for autistic and ADHD students — in real time, without setup. Support fades automatically as students master each routine. The same engine serves neurodivergent adults in first employment through a work mode that breaks manager instructions into plain steps and flags ambiguous terms.

---

## The problem

Special education teachers at autism charter schools (AZACS) give multi-step spoken instructions dozens of times per class. Autistic and ADHD students lose track mid-task — not because they weren't paying attention, but because working memory under task-load is the neurological failure point. Every existing visual schedule tool requires an adult to build each routine ahead of time. Step Cards handles instructions that were never planned.

The same failure follows students into first employment. Neurodivergent adults at First Place AZ lose jobs because they can't decode vague manager feedback, not because they can't do the work.

---

## How it works

### School mode
1. Teacher speaks or types any instruction
2. LLM breaks it into 2–6 ordered steps (task analysis)
3. Second LLM pass rewrites each step for each student's reading level in parallel
4. ARASAAC pictograms are fetched per step keyword — students can swipe through up to 3 variations and their preference is remembered
5. Teacher reviews and taps **Approve** — cards never reach students without approval
6. Students tap through cards one at a time; **Help me** sends a private signal to the teacher tab only
7. Fading algorithm: after 2 completions the card count reduces (75% → 50% → 1 summary), building independence over time

### Work mode
1. Worker pastes a manager's verbal instruction
2. LLM returns numbered plain-language steps, ambiguous terms explained, and one suggested clarifying question
3. Worker taps through steps; shift log tracks completed instructions per session

---

## Evidence base

Implements 4 of the 28 verified evidence-based practices from the [NCAEP 2020 report](https://ncaep.fpg.unc.edu/):

| EBP | Where it appears |
|---|---|
| Task Analysis | LLM instruction breakdown into ordered steps |
| Visual Supports | ARASAAC pictograms per step |
| Prompting with systematic fading | Fading algorithm reduces cards as routine is mastered |
| Technology-Aided Instruction | Browser-based, device-independent delivery |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Radix UI |
| LLM | Groq API — `qwen/qwen3.8-27b` with `/no_think` (fast, free tier) |
| Pictograms | [ARASAAC](https://arasaac.org) REST API — 35,000+ CC BY-NC-SA symbols |
| Speech input | Web Speech API (Chrome/Edge, browser built-in, free) |
| Storage | localStorage only — no backend, no student data off-device |
| Hosting | Vercel (static frontend + serverless API proxy) |

---

## Repository structure

```
NorthAmericaChallange/
├── step-cards/              # React web app
│   ├── src/
│   │   ├── api/             # LLM calls (Groq) and ARASAAC pictogram fetcher
│   │   ├── components/
│   │   │   ├── school/      # TeacherView, StudentView, StepCard, HelpNotice
│   │   │   ├── work/        # WorkInput, StepList, AmbiguousTerms, ClarifyQuestion, ShiftLog
│   │   │   └── shared/      # ModeToggle, LoadingDots, CompletionScreen
│   │   ├── hooks/           # useSpeechRecognition, useStudentCards, useShiftLog
│   │   ├── utils/           # fadingRule, storage (localStorage)
│   │   └── data/            # fallbackPictograms (verified ARASAAC IDs)
│   ├── api/
│   │   └── chat.js          # Vercel serverless proxy — keeps GROQ_API_KEY server-side
│   └── .env.example
├── ResearchDocs/            # 44 research and planning documents
│   ├── 06_PARTNER_AZACS.md
│   ├── 07_PARTNER_FIRST_PLACE_AZ.md
│   ├── 29_AZACS_VISIT_DEBRIEF_OCT29.md
│   ├── 41_REVALIDATED_TECH_AND_LITERATURE.md
│   ├── 43_BUSINESS_MODEL_CANVAS.md
│   └── 44_PITCH_SCRIPT.md
├── _For Presenters/         # Slide template, BMC PDF, 5-minute timer
├── CREDITS.md
└── README.md
```

---

## Local setup

**Requirements:** Node 18+, Chrome or Edge (for speech input)

```bash
cd step-cards
npm install

# Create .env.local with your Groq API key (free at console.groq.com)
echo "VITE_GROQ_API_KEY=your_key_here" > .env.local

npm run dev
# → http://localhost:5173
```

---

## Deployment (Vercel)

1. Import the GitHub repo at vercel.com
2. Set **Root Directory** to `step-cards`
3. Add environment variables:
   - `GROQ_API_KEY` — used by the serverless proxy (`api/chat.js`)
   - `VITE_GROQ_API_KEY` — used in dev builds
4. Deploy — the `api/` folder is auto-detected as serverless functions

---

## Privacy and safety

- No student names, photos, or diagnoses are ever stored or sent to any API
- Demo student profiles use nicknames only (Leo, Sam, Alex)
- All student progress data is localStorage only — it never leaves the device
- Speech recognition runs in the browser via the Web Speech API — audio is not recorded
- Teacher approval is required before any card reaches a student screen
- COPPA compliant by design: no accounts, no data collection, no backend

---

## AI attribution

LLM calls use Groq's API (qwen/qwen3.8-27b). System prompts were written by the team and are in `step-cards/src/api/`. All AI-assisted code is marked with `// AI-generated — reviewed and tested by Naman Dewan`. Research documents in `ResearchDocs/` were drafted with Claude (Anthropic) and reviewed by the team. See [CREDITS.md](CREDITS.md) for full attribution.

---

## Team

| Name | Role |
|---|---|
| Dipesh Gupta | Research, adult mode spec, written submissions |
| Naman Dewan | AI pipeline, LLM prompts, API integration |
| Manan Batra | UI/UX, school and work mode components, demo recording |
| Anand Kumar | Pitch script, Business Model Canvas, slides |

**Partners:** Arizona Autism Charter Schools (AZACS) · First Place AZ

---

## Pictogram credit

Pictographic symbols by Sergio Palao. Origin: [ARASAAC](https://arasaac.org), Government of Aragón. Licence: [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/).
