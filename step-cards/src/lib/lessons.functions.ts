import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { enrichStepsWithPictograms, fetchPictogramUrls } from "./step-cards/arasaac";
import { getRoutineKey } from "./step-cards/fading";
import { stepsForStudent } from "./step-cards/personalize";
import type { ReadingLevel, Step } from "./step-cards/types";

const CLASSROOM_PROMPT = `You are an assistive technology system helping a special education teacher support autistic and ADHD students in a classroom. The teacher has just spoken an instruction aloud.

Break the instruction into numbered, plain-language steps a student can follow one action at a time.

RULES:
1. Each step is ONE physical action. Never combine two actions in one step.
2. Start each step with a specific action verb: Wash, Brush, Rinse, Pour, Measure, Pick up, Put, Mix, Wait. NOT vague verbs like "Get" or "Do".
3. Plain language: short words, simple sentences. Maximum 8 words per step.
4. Concrete nouns only: "the soap" not "the item". "your toothbrush" not "it".
5. Numbers as numerals: "2 cups" not "two cups".
6. Only add a "what to do when finished" step (e.g. "Return to your seat") if the instruction implies the student has left their place and needs to return. Do NOT add it for self-contained actions.
7. Return between 2 and 6 steps. If the instruction implies well-known sub-steps (e.g. "wash hands" implies wet → soap → scrub → rinse → dry), expand them, but never drop an action the teacher said. If expanding would go past 6 steps, expand less.
8. Do NOT add praise, safety warnings, or steps not implied by the instruction.
9. icon_keyword: the action of THAT step as "verb object" in 1-2 plain English words, used to find a picture in the ARASAAC symbol library (e.g. "Rinse your hands" → "rinse hands", "Coil the cable" → "cable", "Sit down at your desk" → "sit down"). Use the object alone when the verb is vague (put, get, take). Never abstract words or numbers.
10. No idioms, metaphors or sarcasm. Active voice only.
11. timer_seconds: only when the teacher says or clearly implies how long a step lasts (e.g. "scrub for 20 seconds", "read quietly for 5 minutes"), give that length in seconds. Otherwise null.

title: short title, max 6 words, sentence case. Number steps from 1.`;

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

const stepSchema = z.object({ n: z.number(), text: z.string(), icon_keyword: z.string() });
const baseStepSchema = stepSchema.extend({ timer_seconds: z.number().nullable() });
const baseSchema = z.object({ title: z.string(), steps: z.array(baseStepSchema) });
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
    if (!students?.length) throw new Error("Add at least one student to this class first.");

    const { generateJson } = await import("./ai.server");
    const base = await generateJson(baseSchema, CLASSROOM_PROMPT, data.instruction);
    if (!base.steps.length) throw new Error("Couldn't turn that into steps. Try saying it a different way.");
    const baseSteps: Step[] = base.steps.slice(0, 6).map((s, i) => ({
      ...s,
      n: i + 1,
      // Keep timers within a sensible classroom range (5 s – 30 min)
      timer_seconds: s.timer_seconds && s.timer_seconds >= 5 ? Math.min(Math.round(s.timer_seconds), 1800) : null,
    }));
    const forRewrite = baseSteps.map(({ n, text, icon_keyword }) => ({ n, text, icon_keyword }));

    // One rewrite per reading level in the class (confident readers get the base steps)
    const levels = [...new Set(students.map((s) => s.reading_level as ReadingLevel))].filter((l) => l !== "grade6");
    const [enrichedBase, ...rewriteResults] = await Promise.all([
      enrichStepsWithPictograms(baseSteps, `${base.title} ${data.instruction}`),
      ...levels.map((level) =>
        generateJson(rewriteSchema, REWRITE_PROMPT, JSON.stringify({ reading_level: level, steps: forRewrite })).catch(
          () => null,
        ),
      ),
    ]);
    const rewrites: Partial<Record<ReadingLevel, Step[]>> = {};
    levels.forEach((level, i) => {
      const r = rewriteResults[i];
      if (r) rewrites[level] = r.steps;
    });

    const routineKey = getRoutineKey(base.title);
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .insert({
        class_id: data.classId,
        created_by: userId,
        title: base.title,
        instruction: data.instruction,
        routine_key: routineKey,
        status: "review",
      })
      .select("id")
      .single();
    if (lessonError || !lesson) throw new Error("Couldn't save the new cards. Please try again.");

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
        }, routineKey) as unknown as never,
    }));
    const { error: cardsError } = await supabase.from("lesson_cards").insert(cards);
    if (cardsError) throw new Error("Couldn't save the new cards. Please try again.");

    return { lessonId: lesson.id };
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
