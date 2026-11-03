# Gemini Prompt — Fill the Business Model Canvas Image
**Owner: Anand (runs it) · Author: Dipesh · Date: Nov 2, 2026**

Use **Gemini 2.5 Flash Image (a.k.a. "Nano Banana")** at https://gemini.google.com — it handles text-in-image way better than Gemini 2.5 Pro. If Nano Banana isn't visible in your model picker, open https://aistudio.google.com and pick `gemini-2.5-flash-image` from the top-right dropdown.

---

## 1. Image to upload

Upload **one** file: `_For Presenters/Business Model Canvas/BMC_Blank.png`

Full path on your Mac:
```
/Users/dipgupmac/Downloads/NorthAmericaChallange/_For Presenters/Business Model Canvas/BMC_Blank.png
```

This is the official challenge template with 9 empty cells. I just converted it from the Challenge PDF so Gemini can see where each box is.

---

## 2. Paste this exact prompt into Gemini (with the image attached)

```
You are an image editor. I'm attaching a Business Model Canvas template PNG with
nine labelled cells and a header. Your job: produce a NEW image that keeps the
template's exact visual layout, colors, fonts, cell boundaries, and sizes —
but replaces the sample "WORKED EXAMPLE" bullets inside each cell with the
Step Cards content below.

RULES — follow all of these:
1. Do NOT redraw the layout from scratch. Keep every box line, column width,
   row height, and the orange tab underlines on each cell heading exactly where
   they already are in the input image.
2. Keep the header line "North American AI Challenge for Neurodiverse Learning"
   unchanged.
3. Change the subheader line from
     "Business Model Canvas | WORKED EXAMPLE | Throughline, an AI tool for
      the college-to-career transition."
   to
     "Business Model Canvas | STEP CARDS | Spoken instruction into picture steps
      for autistic and ADHD students."
4. Inside every cell, replace the existing bullets with the new bullets below.
   Use the SAME font family, SAME font size, SAME dark-grey text color as the
   template. Keep the small square bullet points.
5. At the bottom, change
     "Venture name: Throughline   Team: Sample   Version: 1"
   to
     "Venture name: Step Cards   Team: Kaleidoscope   Version: 1.0"
6. Remove the italic footer sentence that starts "This is a sample only, …" —
   the fillable version does not need it.
7. Final output: one landscape PNG at the same aspect ratio as the input,
   render-quality text (no blur, no misspellings). All nine cells must be
   legible when the image is placed on a 1920×1080 slide.
8. Do NOT add any logos, watermarks, or decorative elements the template
   doesn't already have.

CONTENT PER CELL — copy verbatim, keep the small square bullets, one bullet per
line, no extra paragraphs:

════════ 1. KEY PARTNERS (far left column) ════════
• Arizona Autism Charter Schools (AZACS) — pilot classroom and teacher feedback
• First Place AZ / Josh Munoz — adult-stage validation and employment context
• ARASAAC — 35,000+ free CC BY-NC-SA pictograms (author: Sergio Palao)
• Groq — Qwen3-32B LLM inference
• Supabase — Postgres, Auth, Realtime, RLS backend
• Vercel — hosting (TanStack Start SSR)
• ASU / Spark Center — challenge framework, mentors, launchpad

════════ 2. KEY ACTIVITIES (second column, top) ════════
• Groq Qwen3-32B instruction breakdown + part-splitting
• Per-student reading-level rewrite (parallel LLM calls)
• ARASAAC pictogram fetch per step keyword
• Fading algorithm: card count shrinks as mastery grows
• Teacher approval loop before any card reaches a student
• Per-student progress drill-down (sticker book + help taps)

════════ 3. KEY RESOURCES (second column, bottom) ════════
• Groq API (Qwen3-32B) — ~$0.001 per instruction, ~1–2s latency
• Supabase (Postgres + Auth + Realtime + RLS) — free tier covers pilot
• ARASAAC pictogram library (free, CC BY-NC-SA)
• Web Speech API (free, Chrome/Edge built-in)
• NCAEP 2020 evidence base — 4 verified EBPs implemented
• AZACS + First Place AZ partner access

════════ 4. VALUE PROPOSITIONS (centre column — the heart) ════════
• Spoken instruction → per-student picture step cards in seconds
• Long instructions auto-split into multi-part lessons (Part 1 of 2…)
• Support fades as the student masters each routine (NCAEP fading)
• Teacher-facing sticker book doubles as a progress record
• Same engine scales classroom → first job (adult mode)
• No existing tool handles instructions that were never planned

════════ 5. CUSTOMER RELATIONSHIPS (fourth column, top) ════════
• Six-week embedded pilot at AZACS
• Published outcome report (steps-done-independently, pre vs post)
• Replication guide so any school can run the same pilot
• App-based: no ongoing support needed for daily use
• Post-shift log for adult users (worker consent only)

════════ 6. CHANNELS (fourth column, bottom) ════════
• Direct AZACS pilot → Arizona Dept of Education → CEC teacher networks
• First Place AZ Transition Academy for adult stage
• ASU Scottsdale Launchpad + Grand Final demos
• Live app at nuero-challange.vercel.app (no login for marketing site)
• AZ DES Vocational Rehabilitation program partnership

════════ 7. CUSTOMER SEGMENTS (far right column) ════════
• Special education teachers at autism charter schools (AZACS)
• Autistic and ADHD students, ages 8–18
• Neurodivergent adults 18–30 in first employment (First Place AZ)
• Parents (daily family journal integration)
• School principals + special-ed department heads
• Employment program coordinators + employer accessibility leads

════════ 8. COST STRUCTURE (bottom-left) ════════
• Groq Qwen3-32B: ~$0.001 per instruction, negligible at pilot volume
• Supabase + Vercel: free tier covers pilot
• ARASAAC pictograms: free (CC BY-NC-SA)
• Development: team time + grants
• Marginal cost per additional school ≈ $1/day

════════ 9. REVENUE STREAMS (bottom-right) ════════
• Stage 1 — Grants: IDEA (assistive tech), NSF SBIR, Autism Speaks
• Stage 2 — Per-teacher SaaS: $200–500/teacher/year (vs Goally $300+/device)
• Stage 3 — Institutional licensing: First Place AZ, employer DEI programs
• AZ DES Vocational Rehabilitation contract (state-level)
• Non-revenue value: reduce economic cost of neurodivergent unemployment

Return ONLY the final filled-in BMC image. Nothing else.
```

---

## 3. If Gemini's output has issues

**Text is blurry or misspelled:**
Reply: "The text in cell [name] is blurry/misspelled. Re-render that cell at full resolution. Keep every other cell identical."

**It redrew the layout instead of filling it:**
Reply: "You redrew the box layout. Use the EXACT box positions and sizes from the uploaded image. Only replace the text inside each cell."

**It cut off a cell:**
Reply: "The [cell name] cell is clipped. Expand only that cell's text block vertically to fit all bullets, keeping the box border exactly where the template shows it."

**Fallback if image generation keeps failing:**
Open `NA AI CHALLENGE_BMC_Fillable.pdf` in Adobe Acrobat (or Preview on Mac → "Fill out form"). It's a fillable form — paste each cell's bullets manually. The copy-ready bullets are already in `ResearchDocs/43_BUSINESS_MODEL_CANVAS.md` at the bottom under "Shortest version for the PDF."

---

## 4. After you get the image

Save it as:
```
_For Presenters/Business Model Canvas/BMC_Step_Cards_Filled.png
```

Also export a PDF version for the Airtable submission form:
- Open the PNG in Preview → File → Export as PDF → save as `BMC_Step_Cards_Filled.pdf` in the same folder.

The submission form wants a PDF upload, not an image.

---

## 5. How to attach images to the PowerPoint

**You already have 6 live-app screenshots** at:
```
_For Presenters/Presentation/screenshots/
├── 01_landing_home.png         ← Slide 2 (title) background OR Slide 5 (solution)
├── 02_how_it_works.png         ← Slide 5 (solution)
├── 03_impact_story.png         ← Slide 3 (user) or Slide 4 (problem)
├── 04_research_evidence.png    ← Slide 4 (problem) or Slide 6 (what's next)
├── 05_student_join.png         ← Slide 5 (solution)
└── 06_auth_signin.png          ← optional
```

### In PowerPoint / Keynote

1. Open `_For Presenters/Presentation/Step_Cards_Deck.pptx` (I generated this from the template with all the Step Cards text already in it — challenge-compliant: no font/size/color/layout changes).
2. Navigate to the slide you want to decorate.
3. **Insert → Picture → Picture from File…** (PowerPoint) or **Insert → Image → Choose…** (Keynote).
4. Pick the screenshot from `_For Presenters/Presentation/screenshots/`.
5. Resize so the picture fits **inside** the body placeholder area — do NOT overlap the title bar or cover the orange underline. Keep the aspect ratio locked (hold Shift while dragging a corner).
6. Right-click the image → **Send to Back** so your text sits on top if you want an overlay. Otherwise leave it alongside the text — the template body placeholder is wide enough to park a 400×250 image on the right half of the slide.

### Challenge rule reminder

> "You are NOT allowed to alter the preset slide layout, font sizes, or colors."

Inserting a picture is fine — pictures aren't a layout change. **Do not** resize the title placeholder or the body placeholder to make room. Just float the picture over empty whitespace inside the body area.

### Suggested placement (one picture per slide, right side)

| Slide | Image | Where to drop it |
|---|---|---|
| 2 Title | — | leave blank (template has its own logo slot) |
| 3 User | `03_impact_story.png` | bottom-right quadrant, ~500 px wide |
| 4 Problem | `04_research_evidence.png` | bottom-right quadrant, ~500 px wide |
| 5 Solution | `01_landing_home.png` + `02_how_it_works.png` side by side | centre-right, two columns |
| 6 What's next | `05_student_join.png` | bottom-right quadrant, ~500 px wide |

### Attaching the filled BMC

After Gemini produces `BMC_Step_Cards_Filled.png`:
- The BMC is a **separate submission artifact** — upload the PDF directly to the Airtable form.
- You do NOT need to embed the BMC image inside the PPTX. The pitch deck and the BMC are two independent uploads.
- If you want a judge-facing visual reference on Slide 6, you *can* drop a small thumbnail of the BMC image on the slide, but it is not required.

---

## 6. Final sanity check before saving

- [ ] Deck still has exactly 6 slides (slide 1 is the Instructions page — do not delete it)
- [ ] No fonts changed
- [ ] No colors changed
- [ ] Images are PNGs under 2 MB each (compress with [tinypng.com](https://tinypng.com) if any file is bigger — large deck files sometimes get rejected by Airtable)
- [ ] Save as `Step_Cards_Deck_Final.pptx` and ALSO export to PDF for backup
- [ ] Upload to Google Slides, set share to "Anyone with link can view", verify from an incognito window
