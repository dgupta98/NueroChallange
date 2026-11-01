# CLAUDE.md — Step Cards Project Rules
**Team Kaleidoscope | North America AI Challenge 2026 | ASU Scottsdale Launchpad**

This file is automatically loaded by Claude Code. Follow every rule here exactly.

---

## Team Members and Commit Identities

| Name | Email | Role | GitHub handle (fill in) |
|---|---|---|---|
| Dipesh Gupta | dgupta98@asu.edu | Research, adult mode, written responses | — |
| Naman Dewan | ndewan1@asu.edu | AI pipeline, prompts, prompt PDF | — |
| Manan Batra | mbatra12@asu.edu | UI, student/teacher screens, demo recording | — |
| Anand Kumar | akuma579@asu.edu | Slides, BMC, pitch script | — |

**Note on GitHub email matching:** For `Co-Authored-By:` to show credit on GitHub, the email must match the one linked to each person's GitHub account. If someone uses a personal email on GitHub, use that instead of the ASU email. Each person should run `git config user.email` on their machine and confirm which email they use.

---

## Git Commit Rules

### NO AI authorship line in any commit.
Never add `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` to any commit message. The hackathon code review (Nov 7–9) checks for authentic team authorship. AI-generated lines undermine this.

### Attributing commits to the right person

**When Dipesh commits his own work (default):**
```bash
git commit -m "message"
```

**When Dipesh commits on behalf of one person:**
```bash
git commit --author="Naman Dewan <naman-email@here.com>" -m "Add AI pipeline step-breaking prompt"
```

**When Dipesh commits work done by multiple people (co-authored):**
```bash
git commit -m "$(cat <<'EOF'
Add student card view and teacher approval flow

Co-Authored-By: Manan Batra <manan-email@here.com>
Co-Authored-By: Naman Dewan <naman-email@here.com>
EOF
)"
```

**Format for the team's daily commit pattern:**
- Dipesh's research/writing: `git commit -m "Add [what]: [one-line description]"`
- Naman's AI work: use `--author="Naman Dewan <email>"` 
- Manan's UI work: use `--author="Manan Batra <email>"`
- Anand's slides/BMC: use `--author="Anand Kumar <email>"`

### Commit message style
- Present tense, imperative: "Add", "Fix", "Update" — not "Added" or "Adding"
- Under 72 characters for the first line
- Reference the file number when relevant: "Add adult mode spec (file 36)"
- No ticket/issue numbers needed

### Never commit these:
- `.env` or any file containing API keys
- Real student names, photos, or diagnosis information
- Files over 50MB (videos go in `/demo/` with a `.gitignore` note)
- The `node_modules/` directory

---

## When Building — Reference These Files First

Before writing any code or making any UI decision, check the relevant research file. Don't guess.

| Topic | File to read first |
|---|---|
| What to build (overall) | `ResearchDocs/33_STEP_CARDS_BUILD_PLAN.md` |
| Complete tech stack + screens | `ResearchDocs/40_TECHNICAL_BUILD_DOCUMENTATION.md` |
| Revalidated tech + literature | `ResearchDocs/41_REVALIDATED_TECH_AND_LITERATURE.md` |
| Visual design rules | `ResearchDocs/35_BUILD_REFERENCE_VISUAL_TECH_ACCESSIBILITY.md` (Parts 2, 6, 7) |
| Adult mode (Jordan flow) | `ResearchDocs/36_ADULT_MODE_FEATURE_SPEC.md` |
| Responsible AI / privacy | `ResearchDocs/32_STEP_CARDS_RESPONSIBLE_AI.md` |
| Evidence base (NCAEP) | `ResearchDocs/31_STEP_CARDS_RESEARCH.md` |
| ADHD mechanisms | `ResearchDocs/27_ADHD_MECHANISMS_PRODUCT_MAP.md` |
| Deep mechanisms (RSD, time blindness) | `ResearchDocs/28_DEEP_MECHANISMS_RESEARCH.md` |
| Partner needs (AZACS) | `ResearchDocs/29_AZACS_VISIT_DEBRIEF_OCT29.md` |
| Partner needs (First Place AZ) | `ResearchDocs/22_VISIT_DEBRIEF_OCT27.md` |
| Deliverables spec | `ResearchDocs/02_DELIVERABLES.md` |
| Revised build plan | `ResearchDocs/38_REVISED_PLAN_AND_EXEC_SUMMARY.md` |

---

## Build Rules (Non-Negotiable)

### Privacy
- No real student names anywhere in code, comments, or sample data
- No diagnoses stored or sent to any API
- No API keys committed — `.env` is gitignored, period
- Speech input sent to Google (Web Speech API) — no student identifiers in the audio context
- LLM calls contain only the instruction text — never a student name or profile

### Attribution in code
If an AI tool (Cursor, Copilot, Claude) wrote a function or block, add this comment above it:
```js
// AI-generated — reviewed and tested by [your name]
```
This is required by the challenge rules. Not a penalty — a honesty requirement. Code reviewers check Nov 7–9.

### No feature creep
The MVP is scoped in file 33 and file 40. Do not add features not in those files without a team decision. Time is the constraint.

### Browser target
Chrome 90+ desktop. Web Speech API does not work in Firefox. Add a visible banner if the user is not on Chrome/Edge.

### Accessibility baseline
Every PR must not reduce the accessibility score. Run `axe` or Chrome Lighthouse accessibility audit before calling anything done.

---

## Work Division — Who Owns What

| Area | Owner | Do not touch without asking |
|---|---|---|
| AI prompts (`/prompts/` or `api/`) | Naman | The JSON shapes, system prompt text |
| Student/teacher UI screens | Manan | Card layout, color system, tap interactions |
| Adult mode UI | Manan + Naman | Naman owns the API call, Manan owns the screen |
| Slides (Google Slides) | Anand | Layout, fonts, colors are locked by template rules |
| Business Model Canvas | Anand | — |
| Written responses (Airtable) | Dipesh | Partner insights, exec summary, roadmap |
| README | Dipesh | — |
| Prompt PDF | Naman | — |
| ResearchDocs | Dipesh | Research files, plans, specs |

---

## Submission Checklist (Run on Nov 5)

- [ ] Every URL in the submission form opens without login
- [ ] GitHub repo is public and has no API keys
- [ ] README explains how to run the app locally
- [ ] Prompt PDF is readable and organized by call
- [ ] Google Slides are set to "Anyone with link can view"
- [ ] Slides have NOT been edited after submission URL was locked
- [ ] BMC template is the Strategyzer template from the Presenter Packet
- [ ] Team names appear alphabetically on slide 1: Anand Kumar, Dipesh Gupta, Manan Batra, Naman Dewan
- [ ] One person has done a final access check from a device NOT logged into any team account
- [ ] Submit before 11:59 PM MT on Nov 5
