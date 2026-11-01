# Partner Research Insights — Submission Text
**Author: Dipesh | Date: Oct 30, 2026**
**Deliverable:** Written Response 2 of 3 — paste directly into Airtable submission form

> These are the final paragraphs for the form field "Partner Research & Insights." 
> All claims in this section are verified against primary source notes.
> Do not use any fact-check-flagged claims — see file 34 for the list.

---

## SUBMISSION TEXT — COPY THIS INTO THE FORM

---

**Partner Research & Insights**

We partnered with two Phoenix-based organizations serving neurodivergent individuals at different life stages: Arizona Autism Charter Schools (AZACS) and First Place AZ. Together, they cover the arc from classroom to independent adult living — and both revealed the same root problem.

---

**Arizona Autism Charter Schools (AZACS) — Site Visit, October 29**

We visited AZACS's Phoenix campus on October 29, meeting a large faculty team and touring the school. What we found reshaped our design.

AZACS runs roughly one staff member for every three students. Classes are hands-on and multi-step: cooking, robotics, drone building, coding, and dance. Students interact with their own progress clearly — during our visit, students gave articulate recaps of what they were working on and why. But the class format creates a structural gap: a teacher gives one verbal instruction, and three students each need to receive it differently, right now, with no time to prepare three written versions.

The daily parent journal — worksheets sent home every day, reviewed by families — showed us something important: parents are already in the loop. They want continuity between school and home. Any tool we built needed to feed that journal, not compete with it.

Two design decisions came directly from this visit:

1. **The input is spoken, not typed.** Teachers in live multi-step classes cannot pause to type instructions into a tool. The Web Speech API lets the teacher speak naturally and the system handles the rest.

2. **Cards go home.** Because parents already review the daily journal, the app generates a printable or shareable version of the day's step cards to extend practice into the home environment. The school taught us that generalization from classroom to home is not automatic — it requires repetition in both settings.

The drone course — where students learn components, assemble, fly, and work toward a license — gave us the clearest demo scenario: precise ordering, safety-critical steps, and a clear finish state. This became our primary demo routine because it shows exactly where a spoken multi-step instruction could fail, and exactly what step cards prevent.

---

**First Place AZ — Site Tour October 27, Zoom with Program Director Josh Munoz October 29**

First Place AZ is a supported-living apartment community for autistic and neurodivergent adults aged 18 and over. We toured the facility on October 27 and followed up with a 15-minute Zoom with Josh Munoz, who runs the Transition Academy and the "Be Open Be Ready" employment readiness program.

The most important moment of the entire research process was Josh's answer to one question: "What would you specifically want changed right now for residents?"

> *"Is there something that would allow me to connect with my support therapist to say, cool, I met that skill? And also builds confidence for the repertory skills that I'm learning. Because right now I think they really do rely on the support staff — if they had a way for them to track how much they're improving in certain skills, like I would want that."*

This was not an inferred need. Josh said it directly. There is no existing product at First Place that gives residents a resident-owned view of their own skill development.

Three other findings from the visit shaped our design:

1. **ADHD and autism co-occur frequently among residents.** Josh confirmed this directly: "1st cousins — really common co-occurring condition." This meant our tool had to be designed for both, not just one. Every visual and interaction decision in Step Cards reflects this dual audience.

2. **Sensory design is non-negotiable.** First Place trialed an Amazon AWS wearable for health monitoring — it was rejected universally because of sensory discomfort with the material. This confirmed our decision to keep Step Cards entirely app-based. No hardware. No wearables. No physical triggers.

3. **The right stat.** Before this visit, our materials referenced "50% of residents lose their jobs." Josh corrected this: "About half of Be Open Be Ready graduates are employed." That is a different, and more honest, claim — employment rate, not job-loss rate. We updated all materials to reflect his wording.

The Zoom also clarified the activity scheduling app: it's called **MyClip** (not LifeLoop, which we had identified in pre-visit research). About 1,600 activities per year are scheduled through it. The app is for community and wellness activities, not skill tracking — confirming the gap Josh described.

---

**What the Two Partners Revealed Together**

Both partners are dealing with the same neurological failure point: **working memory under multi-step verbal demand.** Leo, a 12-year-old AZACS student, loses track of cooking-class instructions when he can't hold all four steps at once. Jordan, a 22-year-old First Place resident starting a job at a movie theater, loses track of his manager's closing instructions under the noise and pressure of an end-of-shift rush. Same mechanism. Different setting. Same gap.

This parallel shaped the product architecture: Step Cards is one engine — spoken or typed instruction in, numbered steps out, fades as mastered — that spans school (AZACS) to first job (First Place adult mode). The school stage came from AZACS's visit. The adult stage came from Josh's direct product ask. Neither stage would have existed without the research.

The most important product decision that emerged from both visits was also the simplest: **help-seeking must be private.** At AZACS, asking for help in front of classmates carries social risk for students who are already managing anxiety. At First Place, asking a manager to repeat themselves twice carries professional risk. The "Help me" button on each step card is one tap, visible only to the teacher or supervisor — not announced, not displayed to peers. This design decision traces directly to what we observed in both settings.

---

*Research conducted by Dipesh Gupta (First Place AZ) and Naman Dewan (AZACS). Visit notes in files 22 and 29 of team repository.*
