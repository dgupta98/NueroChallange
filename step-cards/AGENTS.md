<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Public marketing pages are top-level routes using `PublicLayout`; staff screens live under `src/routes/_authenticated/` (client-only gate, `AppShell`); student screens (`/join`, `/student`) are public and never require an account.
- Pure Step Cards rules (fading, personalisation, join codes, independence metric) live in `src/lib/step-cards/` with tests next to them — keep business rules there, not in components.
- AI calls only happen in server functions (`src/lib/lessons.functions.ts`) that lazy-import `src/lib/ai.server.ts` (Lovable AI Gateway, Responses API, strict structured output); one rewrite per reading level, pictograms fetched server-side and stored on the card.
- Students sign out of a whole tablet from the top bar (`StudentTopBar`): every saved device token is unlinked on the server and local classes are cleared.
- A tablet can hold several student classes ("spaces"), stored as a list in localStorage by `src/lib/step-cards/student-spaces.ts`; `/student` lists them and `/student/$spaceId` is one class, so students can always go back.
- Pictograms are chosen by `src/lib/step-cards/arasaac.ts`: hand-checked IDs for verb+object pairs first (`data.ts`), then ARASAAC search results scored by exact keyword match with the lesson as context; no match shows the step number rather than a wrong picture.
- Fading = teacher's on/off + pace (`students.fading_pace`) combined with the student's own more/less help choice (`students.help_choice`) via `effectivePace` in `fading.ts`; home-practice taps count as a routine run.
- Student motivation follows the research: before a set of cards the student picks a sticker to work for from category sticker books (`stickers.ts`, hand-checked ARASAAC pictures, stored as `lesson_cards.sticker_id`); finishing adds it to their book, "steps on your own" framing — never points, streaks, leaderboards or anything taken away.
- Students authenticate with a random device token from `src/lib/student.functions.ts`; only its SHA-256 hash is stored in `student_devices` (no RLS policies, service role only) — this keeps students account-free while staff data stays behind RLS.
- Staff access is enforced by RLS through security-definer helpers `is_org_member`, `is_org_admin`, `can_access_class`; org roles live only in `organization_members`, never on profiles.
- Student data is nickname + reading level + pictogram preference only — no real names, photos, diagnoses or ages, per the COPPA rules in the team research.
- The teacher board uses Realtime on `lesson_cards`; the student screen polls every 3s and pauses polling while a tap is saving, with taps serialized by a mutation scope.
- Display preferences (text size, calm colors) are a root-level provider writing `data-fontsize`/`data-calm` on `<body>`; styles read them via CSS variables.
- Shared buttons, fields and inline notices are `@utility` classes in `src/styles.css` on semantic oklch tokens — never hardcode colors, never use pop-up/toast notifications.
- The demo school (teacher, classes STEP42/BAKE42/SKY234, students Leo and Mia) is static data inserted once; `src/lib/step-cards/demo.ts` holds its public login and codes, and `demoStudentSignIn` only links devices to those demo classes — never seed or reset data from app code.
- Student feelings check-in is stored per card (`lesson_cards.feeling`), rules in `feelings.ts`; student read-aloud/sounds are device preferences in the display-prefs provider, sounds are generated in `src/lib/sounds.ts` (no audio files). No photo capture: the user chose not to collect images.
