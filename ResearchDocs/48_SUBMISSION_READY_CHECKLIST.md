# Submission-Ready Checklist — Nov 5, 2026
**Team Kaleidoscope | Owner: Dipesh (submits) | Deadline: Nov 5, 2026 11:59 PM MT**
**Launchpad live pitch: Nov 6, 2026 — Scottsdale SkySong**

**Rule of thumb:** If a link doesn't open on an incognito window from a device *not* logged into any team account, it fails the "every link opens without requesting access" check. Verify every URL from Dipesh's phone (logged out) before submitting.

---

## FORM FIELDS → SOURCE OF TRUTH

| Airtable field | Where the text/link lives | Status |
|---|---|---|
| Submitter name | — Dipesh Gupta | [ ] |
| Credited team mates | — Manan Batra · Naman Dewan · Dipesh Gupta · Anand Kumar (alphabetical by last name) | [ ] |
| Venture name | — Step Cards | [ ] |
| Launchpad | — ASU Scottsdale Launchpad | [ ] |
| Project URL (live app) | — https://nuero-challange.vercel.app/ | [ ] |
| GitHub repo | — https://github.com/dgupta98/NueroChallange | [ ] |
| Pitch deck (Google Slides) | — `_For Presenters/Presentation/Step_Cards_Deck.pptx` (team-updated Nov 2). Upload to Google Slides, share "Anyone with link can view" | [x] built — [ ] uploaded |
| BMC PDF | — `_For Presenters/Business Model Canvas/BMC_Step_Cards_Filled.pdf` (generated via Gemini 2.5 Flash Image using `ResearchDocs/50_GEMINI_BMC_PROMPT.md`) | [x] |
| AI prompts PDF | — Export `ResearchDocs/47_AI_PROMPTS_FOR_PDF.md` to PDF | [ ] |
| Written responses | — `ResearchDocs/45_SUBMISSION_FORM_RESPONSES.md` — paste each of the 10 fields into the matching Airtable textarea | [ ] |
| Presenter availability | — Confirm with team by Nov 4 EOD | [ ] |

---

## DELIVERABLE CHECKS

### 1. 5-slide pitch deck
- Working file: `_For Presenters/Presentation/Step_Cards_Deck.pptx` (built Nov 2 from the required template, team-updated after; see `ResearchDocs/50_GEMINI_BMC_PROMPT.md` §5 for image-insert instructions)
- [x] Deck uses `REQUIRED - NA AI Challenge 5 Slide Template (Final).pptx` as the base
- [ ] Did NOT change font size, font color, or slide layout (per template rules)
- [ ] Slide 1 title: "Step Cards"
- [ ] Slide 1 team: Manan Batra · Naman Dewan · Dipesh Gupta · Anand Kumar (alphabetical)
- [ ] Slide 1 launchpad: ASU Scottsdale Launchpad · Nov 6, 2026
- [ ] Slide 1 ASU logo intact
- [ ] Content pulled from `ResearchDocs/46_SLIDE_DECK_CONTENT.md`
- [ ] Deck uploaded to Google Slides
- [ ] Share setting: "Anyone with link can view" (NOT "comment", NOT "edit")
- [ ] Verified from a logged-out incognito window
- [ ] Frozen copy saved as `Step_Cards_Submitted_Nov5.pptx` — do NOT edit after submission

### 2. Functional MVP (live app)
- [ ] https://nuero-challange.vercel.app/ loads without login
- [ ] Teacher can sign up with magic link
- [ ] Create class → add student → speak instruction → preview cards → approve → student view works end-to-end
- [ ] Multi-part lesson works on a 9+ step instruction (test: "wash hands, open fridge, take out eggs bread butter, place on counter, crack 2 eggs into bowl, add milk, whisk, pour into pan, cook 3 minutes")
- [ ] Sticker book shows up on student side
- [ ] Teacher drill-down (students page → View) shows per-student sticker counts and finished routines
- [ ] Adult mode page loads
- [ ] No crashes on cold load
- [ ] Lighthouse accessibility score ≥ 90

### 3. Business Model Canvas (PDF)
- Working file: `_For Presenters/Business Model Canvas/BMC_Step_Cards_Filled.pdf` (plus `.jpeg` source)
- [x] Generated via Gemini 2.5 Flash Image ("Nano Banana") using the prompt in `ResearchDocs/50_GEMINI_BMC_PROMPT.md`
- [x] Used the Strategyzer template provided (via `BMC_Blank.png` converted from `NA AI CHALLENGE_BMC_Blank.pdf`) — NOT a custom BMC
- [x] All 9 cells have content, verbatim from `43_BUSINESS_MODEL_CANVAS.md`
- [x] File saved as `BMC_Step_Cards_Filled.pdf` (exported from `.jpeg` via `sips`)
- [ ] Uploaded to Airtable or shared via public Drive link

### 4. GitHub repo
- [ ] Repo is **public** (verify from incognito)
- [ ] README explains how to run the app locally (clone, env vars, `pnpm dev`)
- [ ] README credits ARASAAC + Sergio Palao (CC BY-NC-SA)
- [ ] README lists team members with GitHub handles
- [ ] No `.env` file committed (`git log --all -- '*.env' '*.env.*'` → empty)
- [ ] No real student names, photos, or diagnoses anywhere
- [ ] AI-generated functions carry `// AI-generated — reviewed and tested by <name>` comments
- [ ] Latest commit from each team member reflects their work area
- [ ] Nov 5 "freeze" tag applied: `git tag submission-nov5 && git push --tags`

### 5. AI Prompts PDF
- [ ] `ResearchDocs/47_AI_PROMPTS_FOR_PDF.md` exported as PDF (use `pandoc` or Preview)
- [ ] PDF is text-selectable (not a screenshot)
- [ ] PDF is organized by the 3 calls (CLASSROOM_PROMPT, REWRITE_PROMPT, ARASAAC)
- [ ] Prompts match what is in the deployed code at commit `submission-nov5`

### 6. Written responses (Airtable)
- [ ] All 10 fields in `45_SUBMISSION_FORM_RESPONSES.md` pasted into matching Airtable textareas
- [ ] Partner names (Maran at AZACS, Josh Munoz at First Place AZ) spelled correctly
- [ ] NCAEP 2020 cited by full name once
- [ ] Live URL mentioned in Solution and Why-We-Win responses
- [ ] No real student names
- [ ] Character counts under any Airtable field limit (check in form itself)

### 7. Live pitch (Nov 6)
- [ ] Script from `44_PITCH_SCRIPT.md` rehearsed start-to-finish ≤ 5:00
- [ ] At least 2 team members confirmed in person at Scottsdale SkySong
- [ ] Backup plan if demo fails: narrate from screenshots in deck
- [ ] Device for demo: laptop + hotspot (don't rely on venue WiFi)
- [ ] Backup slides on a USB drive AND on Google Drive

---

## SECURITY & PRIVACY FINAL SWEEP

- [ ] `rg -i "GROQ_API_KEY=" --hidden` returns only `.env.example` or docs
- [ ] `rg -i "sk-" --hidden` returns no real keys
- [ ] `rg -i "ANON_KEY=eyJ"` → not in source
- [ ] No real partner employee names in slides or responses (Maran = first name only, Josh Munoz is a public program director — OK)
- [ ] No photos of real students
- [ ] Supabase RLS enabled on `classes`, `students`, `lessons`, `cards`, `student_card_states`, `help_requests`
- [ ] Supabase anon key safe to expose (confirm via `supabase projects api-keys` — anon only, not service_role)

---

## FINAL 24-HOUR SEQUENCE (Nov 4 EOD → Nov 5 11:59 PM MT)

**Nov 4 (Wed) evening — rehearsal & freeze:**
1. Full team meeting (video). Walk through live app end-to-end on one shared screen.
2. Rehearse pitch twice, cold. Second run must land ≤ 5:00.
3. Anand finalizes BMC PDF. Dipesh exports AI prompts PDF.
4. All four team members check in Airtable form fields against `45_SUBMISSION_FORM_RESPONSES.md` for anything they'd phrase differently.

**Nov 5 (Thu) morning — access verification:**
5. Dipesh logs out of all Google/GitHub accounts on his phone.
6. Opens every URL from the submission form in incognito. Flags any that prompt for access.
7. Fixes sharing permissions on anything that fails.

**Nov 5 (Thu) afternoon — git freeze:**
8. All code work stops at 4 PM MT. From that point, only submission artifacts.
9. `git tag submission-nov5` on the exact commit that matches the live deployed app.
10. `git push --tags`. Verify tag appears on GitHub.

**Nov 5 (Thu) evening — submit:**
11. Dipesh fills Airtable form. Pastes every field from `45_SUBMISSION_FORM_RESPONSES.md`. Uploads/links each PDF.
12. Submits before 11:59 PM MT.
13. Confirms Airtable success email.
14. Posts "SUBMITTED" screenshot to team chat.

**Nov 5 (Thu) 11:30 PM MT — latest final verification cutoff:**
No more changes to the deck, prompts PDF, BMC PDF, or GitHub main branch. Challenge rules forbid edits after submission.

---

## IF SOMETHING FAILS AT SUBMISSION TIME

- **Vercel app is down:** Check Vercel dashboard. Common causes: Supabase paused due to inactivity (unpause in Supabase dashboard), Groq rate limit (regenerate key), environment variable missing (redeploy).
- **Google Slides link requires access:** Open the deck, Share → change "Restricted" to "Anyone with the link". Save. Verify from incognito.
- **GitHub repo looks empty on logged-out view:** Repo is private. Settings → Change repository visibility → Public. Verify.
- **Airtable form rejects a URL:** The URL is probably missing `https://`. Add it.
- **Submission deadline is 1 hour away and we're not done:** Submit what's working. Partial submission beats no submission. Fix broken fields with the "edit" link in the Airtable confirmation email if they allow edits — if they don't, submit a comment in the pitch Q&A at Launchpad.

---

## REFERENCES (file paths)

- `ResearchDocs/02_DELIVERABLES.md` — verbatim challenge rules
- `ResearchDocs/43_BUSINESS_MODEL_CANVAS.md` — BMC source for the fillable PDF
- `ResearchDocs/44_PITCH_SCRIPT.md` — 5-minute pitch script
- `ResearchDocs/45_SUBMISSION_FORM_RESPONSES.md` — all 10 Airtable textarea responses
- `ResearchDocs/46_SLIDE_DECK_CONTENT.md` — slide-by-slide text
- `ResearchDocs/47_AI_PROMPTS_FOR_PDF.md` — AI prompts, to be exported as PDF
- `_For Presenters/Presentation/REQUIRED - NA AI Challenge 5 Slide Template (Final).pptx` — the required template
- `_For Presenters/Business Model Canvas/NA AI CHALLENGE_BMC_Fillable.pdf` — the required BMC template
- `_For Presenters/VIEW ONLY_NA AI Challenge Rubric Overview.pdf` — judging rubric (10 criteria × 5 pts = 50)
