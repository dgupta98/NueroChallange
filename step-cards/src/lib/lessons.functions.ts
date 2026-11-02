import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { enrichStepsWithPictograms, fetchPictogramUrls } from "./step-cards/arasaac";
import { getRoutineKey } from "./step-cards/fading";
import { stepsForStudent } from "./step-cards/personalize";
import type { ReadingLevel, Step } from "./step-cards/types";

const CLASSROOM_PROMPT = `You are an assistive technology system helping a special education teacher support autistic and ADHD students in a classroom. The teacher has just spoken an instruction aloud.

Break the instruction into numbered, plain-language steps a student can follow one action at a time.

Research-based cap: a routine of cards MUST be 2 to 6 steps. More than 6 cards overloads working memory for the students we serve and defeats the fading practice we rely on. If the full instruction clearly has more than 6 real actions, split it into separate ROUTINE PARTS — each part a distinct short routine of 2–6 steps that can stand on its own (e.g. "Set up station" / "Make sandwich" / "Clean up").

OUTPUT (JSON ONLY):
{
  "title": "<overall short title, max 6 words, sentence case>",
  "parts": [
    { "title": "<part title, max 6 words>", "steps": [ { "n": 1, "text": "…", "icon_keyword": "…", "timer_seconds": null }, … ] },
    …
  ]
}

RULES:
1. parts: 1 part for most instructions. Add more parts (up to 4) ONLY when the instruction truly spans separate stages that each have their own goal. Never split just to show off — short instructions stay as 1 part.
2. Each part has 2 to 6 steps. Never more than 6. Steps number from 1 inside each part.
3. Each step is ONE physical action. Never combine two actions in one step.
4. Start each step with a specific action verb: Wash, Brush, Rinse, Pour, Measure, Pick up, Put, Mix, Wait. NOT vague verbs like "Get" or "Do".
5. Plain language: short words, simple sentences. Maximum 8 words per step.
6. Concrete nouns only: "the soap" not "the item". "your toothbrush" not "it".
7. Numbers as numerals: "2 cups" not "two cups".
8. Only add a "what to do when finished" step (e.g. "Return to your seat") if the instruction implies the student has left their place and needs to return. Do NOT add it for self-contained actions.
9. Do NOT add praise, safety warnings, or steps not implied by the instruction.
10. icon_keyword: the action of THAT step as "verb object" in 1-2 plain English words, used to find a picture in the ARASAAC symbol library (e.g. "Rinse your hands" → "rinse hands", "Coil the cable" → "cable", "Sit down at your desk" → "sit down"). Use the object alone when the verb is vague (put, get, take). Never abstract words or numbers.
11. No idioms, metaphors or sarcasm. Active voice only.
12. timer_seconds: only when the teacher says or clearly implies how long a step lasts (e.g. "scrub for 20 seconds", "read quietly for 5 minutes"), give that length in seconds. Otherwise null.
13. Each part title names what that part accomplishes (e.g. "Measure ingredients", "Mix the dough", "Clean up"). Different from the overall title.`;

const REWRITE_PROMPT = `You are an assistive technology system rewriting classroom steps for a student's reading level.

READING LEVELS:
- grade2: 1-3 words per step. Verb + noun only. ("Wash hands", "Wait")
- grade4: 4-6 words. Simple sentences. ("Put your tray on the shelf")
- pictogram_only: 1-2 words maximum. Single noun or verb.

RULES:
1. Do NOT change what the step asks. Same action, different words.
2. Do NOT add or remove steps. Keep the same number and order of steps.
3. Do NOT add praise or encouragement.
4. Keep icon_keyword from the original unchanged.`;

// n is optional — model sometimes omits it; we always override it from array index anyway
const stepSchema = z.object({ n: z.number().optional(), text: z.string(), icon_keyword: z.string() });
const baseStepSchema = stepSchema.extend({ timer_seconds: z.number().nullable().optional() });
const partSchema = z.object({ title: z.string(), steps: z.array(baseStepSchema) });
const baseSchema = z.object({
  title: z.string(),
  // Accept either a top-level steps array (model's older shape) or a parts array
  steps: z.array(baseStepSchema).optional(),
  parts: z.array(partSchema).optional(),
});
const rewriteSchema = z.object({ steps: z.array(stepSchema) });

export const createLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ classId: z.string().uuid(), instruction: z.string().trim().min(3).max(1500) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: cls } = await supabase.from("classes").select("id").eq("id", data.classId).maybeSingle();
    if (!cls) throw new Error("We couldn't find that class.");

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, reading_level, completion_history, fading_enabled, fading_pace, help_choice")
      .eq("class_id", data.classId)
      .order("created_at");
    if (studentsError) throw new Error("Couldn't load the students in this class.");

    const { generateJson } = await import("./ai.server");
    const base = await generateJson(baseSchema, CLASSROOM_PROMPT, data.instruction);

    // Accept legacy single-steps shape or new parts shape. Collapse to a parts array.
    const rawParts: { title: string; steps: typeof baseStepSchema._type[] }[] =
      base.parts?.length
        ? base.parts
        : base.steps?.length
        ? [{ title: base.title, steps: base.steps }]
        : [];
    if (!rawParts.length) throw new Error("Couldn't turn that into steps. Try saying it a different way.");

    const partsCount = Math.min(rawParts.length, 4);
    const parts = rawParts.slice(0, partsCount).map((p, pIdx) => {
      const steps: Step[] = (p.steps ?? []).slice(0, 6).map((s, i) => ({
        ...s,
        n: i + 1,
        timer_seconds: s.timer_seconds && s.timer_seconds >= 5 ? Math.min(Math.round(s.timer_seconds), 1800) : null,
      }));
      const partTitle = partsCount === 1
        ? base.title
        : `${base.title} · Part ${pIdx + 1} of ${partsCount}: ${p.title}`;
      return { title: partTitle, steps };
    });

    // One rewrite per (part × reading level); plus pictograms per part — all in parallel
    const levels = [...new Set(students.map((s) => s.reading_level as ReadingLevel))].filter((l) => l !== "grade6");
    const enrichedPromises = parts.map((p) =>
      enrichStepsWithPictograms(p.steps, `${p.title} ${data.instruction}`),
    );
    const rewritePromises = parts.flatMap((p) =>
      levels.map((level) =>
        generateJson(
          rewriteSchema,
          REWRITE_PROMPT,
          JSON.stringify({ reading_level: level, steps: p.steps.map(({ n, text, icon_keyword }) => ({ n, text, icon_keyword })) }),
        ).catch(() => null),
      ),
    );
    const [enrichedBases, ...rewriteFlat] = await Promise.all([Promise.all(enrichedPromises), ...rewritePromises]);
    const rewritesPerPart: Partial<Record<ReadingLevel, Step[]>>[] = parts.map((_, pIdx) => {
      const slice = rewriteFlat.slice(pIdx * levels.length, (pIdx + 1) * levels.length);
      const rw: Partial<Record<ReadingLevel, Step[]>> = {};
      levels.forEach((level, i) => {
        const r = slice[i];
        if (r) rw[level] = r.steps.map((s, idx) => ({ ...s, n: s.n ?? idx + 1 }));
      });
      return rw;
    });

    // Shared routine_key for all parts, so completion counts belong to one routine family
    const routineKey = getRoutineKey(base.title);

    const createdIds: string[] = [];
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i]!;
      const enrichedBase = enrichedBases[i]!;
      const rewrites = rewritesPerPart[i]!;
      const partRoutineKey = partsCount === 1 ? routineKey : `${routineKey}:p${i + 1}`;

      const { data: lesson, error: lessonError } = await supabase
        .from("lessons")
        .insert({
          class_id: data.classId,
          created_by: userId,
          title: part.title,
          instruction: data.instruction,
          routine_key: partRoutineKey,
          status: "review",
        })
        .select("id")
        .single();
      if (lessonError || !lesson) throw new Error("Couldn't save the new cards. Please try again.");
      createdIds.push(lesson.id);

      const cards = students.map((s) => ({
        lesson_id: lesson.id,
        class_id: data.classId,
        student_id: s.id,
        steps: stepsForStudent(enrichedBase, rewrites, {
            reading_level: s.reading_level as ReadingLevel,
            completion_history: s.completion_history,
            fading_enabled: s.fading_enabled,
            fading_pace: s.fading_pace,
            help_choice: s.help_choice,
          }, partRoutineKey) as unknown as never,
      }));
      if (cards.length > 0) {
        const { error: cardsError } = await supabase.from("lesson_cards").insert(cards);
        if (cardsError) throw new Error("Couldn't save the new cards. Please try again.");
      }
    }

    return {
      lessonId: createdIds[0]!,
      previewSteps: enrichedBases[0]!,
      partCount: parts.length,
      partIds: createdIds,
    };
  });

/** Make a lesson live for students. Ends any other live lesson in the same class. */
export const approveLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ lessonId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: lesson } = await supabase.from("lessons").select("id, class_id").eq("id", data.lessonId).maybeSingle();
    if (!lesson) throw new Error("We couldn't find that lesson.");
    const now = new Date().toISOString();
    await supabase
      .from("lessons")
      .update({ status: "ended", ended_at: now })
      .eq("class_id", lesson.class_id)
      .eq("status", "live")
      .neq("id", lesson.id);
    const { error } = await supabase.from("lessons").update({ status: "live", approved_at: now }).eq("id", lesson.id);
    if (error) throw new Error("Couldn't send the cards. Please try again.");
    return { ok: true };
  });

/** Delete a lesson and all its cards. Only the teacher who created it can do this. */
export const deleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ lessonId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: lesson } = await supabase.from("lessons").select("id, created_by").eq("id", data.lessonId).maybeSingle();
    if (!lesson) throw new Error("Lesson not found.");
    if (lesson.created_by !== context.userId) throw new Error("Only the teacher who created this can delete it.");
    await supabase.from("lesson_cards").delete().eq("lesson_id", data.lessonId);
    const { error } = await supabase.from("lessons").delete().eq("id", data.lessonId);
    if (error) throw new Error("Couldn't delete the instruction. Please try again.");
    return { ok: true };
  });

/** Permanently delete a class and all its data. Only the owning teacher can do this. */
export const deleteClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ classId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: cls } = await supabase.from("classes").select("id, teacher_id").eq("id", data.classId).maybeSingle();
    if (!cls) throw new Error("Class not found.");
    if (cls.teacher_id !== context.userId) throw new Error("Only the class teacher can delete it.");
    // Delete in dependency order (lesson_cards → lessons → student_devices → students → class)
    const { data: lessonIds } = await supabase.from("lessons").select("id").eq("class_id", data.classId);
    if (lessonIds?.length) {
      await supabase.from("lesson_cards").delete().in("lesson_id", lessonIds.map((l) => l.id));
    }
    await supabase.from("lessons").delete().eq("class_id", data.classId);
    await supabase.from("student_devices").delete().eq("class_id", data.classId);
    await supabase.from("students").delete().eq("class_id", data.classId);
    const { error } = await supabase.from("classes").delete().eq("id", data.classId);
    if (error) throw new Error("Couldn't delete the class. Please try again.");
    return { ok: true };
  });

/**
 * Generate lesson_cards for any students in the class who don't have one yet.
 * Safe to call at any lesson status. Re-uses existing cards as the step template
 * when possible; falls back to re-calling the AI if no cards exist at all.
 */
export const generateMissingCards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ lessonId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, class_id, instruction, title, routine_key")
      .eq("id", data.lessonId)
      .maybeSingle();
    if (!lesson) throw new Error("We couldn't find that lesson.");

    const [{ data: students }, { data: existingCards }] = await Promise.all([
      supabase.from("students").select("id, reading_level, completion_history, fading_enabled, fading_pace, help_choice").eq("class_id", lesson.class_id).order("created_at"),
      supabase.from("lesson_cards").select("student_id, steps").eq("lesson_id", data.lessonId),
    ]);

    const haveCard = new Set((existingCards ?? []).map((c) => c.student_id));
    const newStudents = (students ?? []).filter((s) => !haveCard.has(s.id));
    if (!newStudents.length) return { ok: true, generated: 0 };

    // Derive base steps: prefer an existing grade6 card, else re-call AI
    let enrichedBase: Step[];
    if (existingCards?.length) {
      const template = existingCards.find((c) => {
        const s = (students ?? []).find((st) => st.id === c.student_id);
        return s?.reading_level === "grade6";
      }) ?? existingCards[0]!;
      enrichedBase = template.steps as unknown as Step[];
    } else {
      const { generateJson } = await import("./ai.server");
      const base = await generateJson(baseSchema, CLASSROOM_PROMPT, lesson.instruction);
      const steps = base.steps?.length ? base.steps : base.parts?.[0]?.steps;
      if (!steps?.length) throw new Error("Couldn't regenerate the steps. Try again.");
      const raw: Step[] = steps.slice(0, 6).map((s, i) => ({
        ...s,
        n: i + 1,
        timer_seconds: s.timer_seconds && s.timer_seconds >= 5 ? Math.min(Math.round(s.timer_seconds), 1800) : null,
      }));
      enrichedBase = await enrichStepsWithPictograms(raw, `${base.title} ${lesson.instruction}`);
    }

    // Rewrites for any new reading levels not covered by existing cards
    const existingLevels = new Set((students ?? []).filter((s) => haveCard.has(s.id)).map((s) => s.reading_level as ReadingLevel));
    const newLevels = [...new Set(newStudents.map((s) => s.reading_level as ReadingLevel))].filter(
      (l) => l !== "grade6" && !existingLevels.has(l),
    );
    const rewrites: Partial<Record<ReadingLevel, Step[]>> = {};
    if (newLevels.length) {
      const forRewrite = enrichedBase.map(({ n, text, icon_keyword }) => ({ n, text, icon_keyword }));
      const { generateJson } = await import("./ai.server");
      const results = await Promise.all(
        newLevels.map((level) =>
          generateJson(rewriteSchema, REWRITE_PROMPT, JSON.stringify({ reading_level: level, steps: forRewrite })).catch(() => null),
        ),
      );
      newLevels.forEach((level, i) => {
        const r = results[i];
        if (r) rewrites[level] = r.steps.map((s, idx) => ({ ...s, n: s.n ?? idx + 1 }));
      });
    }

    const routineKey = lesson.routine_key ?? "";
    const cards = newStudents.map((s) => ({
      lesson_id: lesson.id,
      class_id: lesson.class_id,
      student_id: s.id,
      steps: stepsForStudent(enrichedBase, rewrites, {
        reading_level: s.reading_level as ReadingLevel,
        completion_history: s.completion_history,
        fading_enabled: s.fading_enabled,
        fading_pace: s.fading_pace,
        help_choice: s.help_choice,
      }, routineKey) as unknown as never,
    }));

    const { error } = await supabase.from("lesson_cards").insert(cards);
    if (error) throw new Error("Couldn't generate the cards. Please try again.");
    return { ok: true, generated: cards.length };
  });

/** Search the symbol library again for one step, after the teacher changed its words. */
export const findPictures = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ text: z.string().trim().min(1).max(160), keyword: z.string().trim().max(60).optional() }).parse(data),
  )
  .handler(async ({ data }) => {
    const urls = await fetchPictogramUrls(data.keyword || undefined, data.text);
    return { urls };
  });
