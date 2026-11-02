# Screenshot Shotlist — Live App → Slide Deck
**Owner: Manan (authenticated session on live app) | Date: Nov 2, 2026**
**Live app:** https://nuero-challange.vercel.app/
**Save location:** `_For Presenters/Presentation/screenshots/`
**Target: 10 shots, PNG, 1920×1080 or 2× that for retina. Each slide uses 1–4 of these.**

**Status (Nov 2): 6 public-page shots already captured and committed:**
- `01_landing_home.png` — hero "Say it once." + sample step cards (Slides 1, 5)
- `02_how_it_works.png` — full teacher/student/org workflow (Slide 2, 3)
- `03_impact_story.png` — Meet Leo, partner quotes, demo tour (Slides 2, 4)
- `04_research_evidence.png` — NCAEP EBPs + partner research (Slide 4)
- `05_student_join.png` — class code entry + demo student picker (Slide 1 or 5)
- `06_auth_signin.png` — teacher sign-in (optional context only)

**Still to capture (Manan — needs sign-in with `demo.teacher@stepcards.app` / `StepCards-demo-2026`):**
See shots 7–13 below. These are the authenticated teacher dashboard + student runtime views; Firecrawl can't drive the sign-in flow, so grab them from a logged-in Chrome window.

**Setup before shooting:**
1. Open Chrome, incognito disabled, resize window to 1440×900 (standard laptop).
2. Sign in with magic link to the demo teacher account.
3. Confirm demo data loaded (classes "Cooking Club", "Robotics Pod" with Alex, River, Mel, Kai, Fen populated — if empty, run `scripts/add-demo-content.js` locally and re-seed).
4. Use Chrome DevTools **device toolbar off** (we want desktop view).
5. Hide bookmarks bar (Cmd+Shift+B). Set zoom to 100%.
6. Capture with **Cmd+Shift+4 then Space then click window** (macOS native, PNG, no shadow: hold Option while clicking).

---

## SHOT 1 — Teacher dashboard home
**File:** `01_teacher_dashboard.png`
**Where:** Slide 1 (background) and Slide 3 (grid)
**URL:** `/` (post-login teacher home)
**What's in frame:** Class list ("Cooking Club", "Robotics Pod"), student counts per class, "Add new instruction" composer visible.
**Framing:** Full browser window including the Step Cards logo header.

## SHOT 2 — Instruction composer with speech-to-text in progress
**File:** `02_composer_speech.png`
**Where:** Slide 3
**URL:** `/classes/<classId>` (class detail with composer open)
**What's in frame:** Composer textarea showing a partially transcribed instruction (e.g., "wash your hands then open the fridge and take..."), red/pulse mic indicator active.
**How to stage:** Click the mic button, speak a long instruction, screenshot while recording.

## SHOT 3 — Multi-part lesson preview (teacher review before approve)
**File:** `03_multipart_preview.png`
**Where:** Slide 3 (hero shot — the headline feature)
**URL:** `/classes/<classId>/lessons/<lessonId>`
**What's in frame:** Lesson title ending in "· Part 1 of 2: <subtitle>", 4–6 numbered step cards with pictograms, "Approve for class" button visible.
**How to stage:** Submit the 9-step cooking instruction from the pitch script; screenshot the first part preview.

## SHOT 4 — Per-student reading-level comparison (side-by-side)
**File:** `04_reading_levels.png`
**Where:** Slide 3
**URL:** `/classes/<classId>/lessons/<lessonId>` with "View as student" cycled across 3 students
**What's in frame:** One figure containing three mini-screens — pictogram_only, grade2 (4-word sentences), grade6 (full sentence) — of the same step.
**How to stage:** Take 3 individual screenshots and combine in a 3-column grid in the slide itself (easier than Photoshopping).

## SHOT 5 — Student card view (mid-routine)
**File:** `05_student_card.png`
**Where:** Slide 1 (hero), Slide 4
**URL:** `/student/<spaceId>` (student token link)
**What's in frame:** Single large step card with pictogram + text + "I need help" button + timer (if applicable).
**How to stage:** Open the student share link in a second browser window; advance to step 2 of 4.

## SHOT 6 — Sticker celebration (routine finished)
**File:** `06_sticker_celebration.png`
**Where:** Slide 4
**URL:** `/student/<spaceId>` after completing all cards
**What's in frame:** "You finished!" screen with the earned sticker, large and centered.

## SHOT 7 — Student sticker book
**File:** `07_sticker_book.png`
**Where:** Slide 4
**URL:** `/student/<spaceId>?tab=stickers`
**What's in frame:** Grid of earned stickers organized by category, ×N count badges visible.

## SHOT 8 — Teacher students page (list + per-student counts)
**File:** `08_teacher_students_list.png`
**Where:** Slide 3
**URL:** `/classes/<classId>/students`
**What's in frame:** Student table with avatar, name, reading level, counts (finished / in progress / help), View + Edit buttons.

## SHOT 9 — Per-student drill-down (NEW Nov 2 feature)
**File:** `09_student_drilldown.png`
**Where:** Slide 3 (hero), Slide 4
**URL:** `/classes/<classId>/students` with one student's row expanded
**What's in frame:** The expanded detail panel showing: sticker book grid with color icons, finished routines list with sticker thumbnails + dates + help chips, in-progress routines ("Step X of N").
**How to stage:** Tap "View" on Alex. This is the money shot — the thing that makes teachers say "oh I need this."

## SHOT 10 — Adult mode (worker view)
**File:** `10_adult_mode.png`
**Where:** Slide 2 (connector), Slide 3
**URL:** `/adult` (adult mode page)
**What's in frame:** Pasted manager instruction + numbered steps + "ambiguous terms" callout + suggested clarifying question.
**How to stage:** Paste a realistic workplace instruction (e.g., "take the delivery from the back, log it in the sheet by the register, then let me know if anything looks off"). Screenshot the result.

---

## BONUS SHOTS (nice to have, not required)

- **11.** `11_qr_code.png` — QR code pointing to https://nuero-challange.vercel.app/ for Slide 5 ask section. Generate at qr-code-generator.com, PNG, 400×400, black on white.
- **12.** `12_team.png` — Team photo if we have one; otherwise skip (not required by challenge).
- **13.** `13_architecture_diagram.png` — Diagram showing: Teacher browser → Web Speech → Groq Qwen3-32B → Supabase → Student browser. Only if slide space allows.

---

## PLACEMENT MAP (which shot goes on which slide)

| Slide | Shots |
|---|---|
| 1 (Title + problem) | 01 (bg, low opacity) or 05 |
| 2 (Partner research) | 10 (shows the engine spans classroom → adult) |
| 3 (Solution + demo) | 02, 03, 05, 09 — the 4-shot grid |
| 4 (Evidence + impact) | 06, 07, 09 |
| 5 (Business + ask) | 11 (QR code) |

---

## NAMING + FILE HYGIENE

- All PNG, lowercase, numbered prefix (`01_...png`).
- Width ≥ 1920px for crisp 1080p projection; 2560px+ if captured on retina.
- No real student names in the frame — demo data uses Alex / River / Mel / Kai / Fen.
- No real email addresses visible (hide the top-right profile menu if it shows the demo account email).
- Save a `screenshots/raw/` subfolder with the originals; put cropped/annotated versions directly in `screenshots/`.

Once Manan has shot all 10, Anand drops them into the slide placeholders and ships the deck to Google Slides.
