# Revised 3-Day Plan + Executive Summary Submission Text
**Author: Dipesh | Date: Oct 31, 2026**

> Compressed from 5 days to 3 content days so Tuesday is finalization and Wednesday is demo recording + submission. This file also contains the executive summary submission text (ready to paste into Airtable).

---

## Revised Build & Delivery Plan

**Constraint:** All content and code must be complete by end of Monday Nov 3.
**Tuesday Nov 4:** Finalization only — no new writing, no new code. Test, record, review.
**Wednesday Nov 5:** Demo recording (backup video), final check, submit before 11:59 PM MT.

---

### Saturday Nov 1 — Build Foundation

| Who | Task | Done when |
|---|---|---|
| **Naman** | Repo setup. Speech → JSON steps working end to end. System prompt written and tested. | AI returns valid JSON from a spoken instruction |
| **Manan** | Scaffold the React app. Teacher view + student card view rendering from hardcoded JSON. | Cards show on screen without the AI being live |
| **Anand** | Start slides in the required 5-slide template. Slide 1 (title) and Slide 2 (user personas Leo + Jordan) drafted. | Two slides ready for team review |
| **Dipesh** | Executive summary written (→ this file). Roadmap first draft written (→ file 39). Adult mode spec confirmed with Naman (file 36 is live — read it). | Two written responses drafted |

---

### Sunday Nov 2 — Core Features Complete

| Who | Task | Done when |
|---|---|---|
| **Naman** | Per-student versions (LLM call 2 — reading level rewrite). Adult mode LLM call (JSON spec in file 36) working. ARASAAC pictograms fetching for each step. | Three student versions render from one instruction; Jordan flow returns steps + ambiguous terms + clarifying question |
| **Manan** | Student tap-to-complete, "Help me" button (teacher notification), teacher approval flow. Pictograms rendering on cards. Quiet completion screen. | Full school demo path works end to end |
| **Anand** | Slides 3 (problem), 4 (solution + demo), 5 (what's next) drafted. BMC cells filled. | All 5 slides drafted; BMC at least 6 of 9 cells complete |
| **Dipesh** | Review adult mode as Naman builds — catch anything that doesn't match file 36 spec. Roadmap finalized (file 39). Fact-check pass on all claims that will appear in written responses and slides (file 34 list). | Roadmap submission text complete. No unverified claims in any deliverable. |

---

### Monday Nov 3 — Polish, Accessibility, Everything Done

| Who | Task | Done when |
|---|---|---|
| **Naman** | Fading rule live (cards reduce on second and third run of same routine). Prompt PDF drafted (all three system prompts + JSON spec + guardrails). | Fading works; prompt PDF is a complete readable document |
| **Manan** | Accessibility pass: WCAG AA color contrast, Atkinson Hyperlegible font, 22px step text, keyboard navigation, `prefers-reduced-motion`. Adult mode UI working. Pre-recorded backup demo recorded (school flow + Jordan flow). | App passes visual accessibility check; backup video exists |
| **Anand** | Slides finalized (no more edits after tonight — rules say don't edit after submitting). BMC complete (all 9 cells). Pitch script written for the 5-minute timer. | Slides locked. BMC done. Script timed to 5 minutes. |
| **Dipesh** | Partner research insights reviewed (file 37 — already done). Executive summary final review. README drafted for GitHub. Written responses (all 3) ready to paste into Airtable. | Three submission texts ready. README ready. |

---

### Tuesday Nov 4 — Finalize Only

**No new features. No new writing. Review and harden.**

| Who | Task |
|---|---|
| **Everyone** | Read all three written responses together. Flag anything that doesn't match the app as built. Fix it. |
| **Naman + Manan** | Run the full demo path on the exact device + browser + network that will be used at Launchpad. Fix anything that breaks. |
| **Manan** | Confirm backup demo video is clear, 90 seconds, shows both Leo and Jordan flows. |
| **Anand** | Check pitch URL is set to "Anyone with link can view." Check slides auto-advance on timer. Run 5-minute rehearsal. |
| **Dipesh** | Check every URL in the submission opens without login. Confirm GitHub repo is public and has no API keys. Final access check from a device not logged into anyone's accounts. |

---

### Wednesday Nov 5 — Submit

| Time | Task | Who |
|---|---|---|
| Morning | Final demo recording if backup from Nov 3 needs a retake. | Manan |
| Late morning | README final text in GitHub repo. Prompt PDF confirmed. | Naman + Dipesh |
| Afternoon | One person fills the Airtable submission form: GitHub URL, Google Slides URL, BMC, prompt PDF, written responses. | Dipesh |
| Before 4 PM MT | **Team access check.** Every link opens from a logged-out browser or phone. | Everyone |
| Before 11:59 PM MT | **Submit.** | Dipesh |

---

## What's Still Outstanding After This File

| Item | Owner | Status |
|---|---|---|
| Executive summary | Dipesh | Done — see below in this file |
| Partner research insights | Dipesh | Done — file 37 |
| Future roadmap | Dipesh | Next — file 39 |
| Adult mode spec | Dipesh | Done — file 36 |
| README | Dipesh | Write Nov 3 |
| AI pipeline + prompts | Naman | Build Nov 1–3 |
| Student + teacher UI | Manan | Build Nov 1–3 |
| Slides | Anand | Build Nov 1–3 |
| BMC | Anand | Build Nov 2–3 |

---

---

# EXECUTIVE SUMMARY — SUBMISSION TEXT

*Paste this into the Airtable submission form field "Executive Summary."*
*Concise overview of solution, target audience, and primary impact.*

---

**Executive Summary**

Step Cards is an AI-powered web app that turns spoken classroom instructions into personalized picture step cards for autistic students — and extends the same engine to help neurodivergent adults navigate verbal instructions at work.

The core problem is working memory failure under multi-step verbal demand. When a teacher says, "Get your tray, wash your hands, measure two cups of flour, then wait for me," students with ADHD and autism often follow the first step correctly and then freeze — not because they weren't listening, but because holding four sequential steps in working memory while also beginning the physical task exceeds what their neurological architecture reliably supports. Existing tools don't solve this. Visual schedule apps require an adult to build every routine by hand, ahead of time — they cannot handle an instruction a teacher gives live. AI task-breakers are text tools designed for one adult sitting alone. No product in the market generates per-student versions of a live spoken instruction in real time.

Step Cards fills that gap. A teacher speaks an instruction. The app uses the Web Speech API to capture it, sends it to a language model that breaks it into ordered, plain-language steps, and simultaneously generates a version for each student calibrated to their reading level. Pictograms from the ARASAAC free AAC symbol library appear alongside each step. The teacher reviews and approves in one tap. Cards appear on student devices. Each student taps through their steps independently; a private "Help me" tap on any step notifies the teacher without public embarrassment. When a student completes the same routine successfully across multiple sessions, the app fades the number of visible steps — moving from four cards to two cards to one summary card — teaching independence rather than building dependence.

The design is grounded in four evidence-based practices verified by the 2020 NCAEP report (National Clearinghouse on Autism Evidence and Practice, UNC Frank Porter Graham Institute): task analysis, visual supports, prompting with systematic fading, and technology-aided instruction and intervention. These are among 28 verified EBPs for autistic children and youth drawn from studies spanning 1990–2017.

Our primary partner is Arizona Autism Charter Schools (AZACS), a Phoenix campus serving autistic students in hands-on, multi-step classes including cooking, robotics, drone building, and coding. A site visit on October 29 confirmed that multi-step verbal instructions in live class settings are a daily challenge — and that any tool must feed the existing daily parent journal rather than replace it. Cards export to that journal, extending school practice into the home.

The adult stage of Step Cards serves residents at First Place AZ, a supported-living community for neurodivergent adults. Program director Josh Munoz confirmed directly that no existing tool gives residents a way to see their own skill development. In the adult mode, a resident pastes or speaks a manager's verbal instruction, and the same AI engine returns numbered plain-language steps, flags ambiguous terms with plain definitions, and suggests one clarifying question the worker could ask. Completed instructions build into a shift log — a private record of what the resident handled independently that becomes preparation for 90-day employment reviews.

The impact of Step Cards compounds across time: a student who learns to follow multi-step instructions at school, with support that gradually fades, carries that skill into independent living and first employment. One AI engine, one design language, one continuous human story from classroom to first job.

---

*Solution built by Team Kaleidoscope: Anand Kumar, Dipesh Gupta, Manan Batra, Naman Dewan. Scottsdale Launchpad. Arizona State University.*
