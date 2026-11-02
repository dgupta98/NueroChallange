import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { isValidCode, normalizeCode } from "./step-cards/codes";
import { FEELING_VALUES } from "./step-cards/feelings";
import { stepsOnOwn, stickerById } from "./step-cards/stickers";
import type { HelpChoice, Step } from "./step-cards/types";

/** A family can mark the same finished card as practiced at home at most once in this window. */
const HOME_PRACTICE_GAP_MS = 12 * 3600_000;

/*
 * Student endpoints. Students never sign in: a class code lets a device pick a
 * nickname, and the device then holds a random token. Only a hash of the token
 * is stored. Every call re-checks the token on the server.
 */

async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function deviceFor(token: string) {
  const db = await admin();
  const { data: device } = await db
    .from("student_devices")
    .select("id, student_id, class_id, last_seen_at")
    .eq("token_hash", await hashToken(token))
    .maybeSingle();
  if (!device) throw new Error("This device isn't linked to a class any more. Please join again.");
  return { db, device };
}

const codeInput = z.object({ code: z.string().max(12) });

export const lookupClass = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => codeInput.parse(data))
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    if (!isValidCode(code)) throw new Error("That code doesn't look right. Codes have 6 letters and numbers.");
    const db = await admin();
    const { data: cls } = await db.from("classes").select("id, name").eq("join_code", code).maybeSingle();
    if (!cls) throw new Error("We couldn't find a class with that code. Check it with your teacher.");
    const { data: students } = await db
      .from("students")
      .select("id, nickname, avatar")
      .eq("class_id", cls.id)
      .order("nickname");
    return { className: cls.name, students: students ?? [] };
  });

export const claimStudent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ code: z.string().max(12), studentId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    const db = await admin();
    const { data: cls } = await db.from("classes").select("id, name").eq("join_code", code).maybeSingle();
    if (!cls) throw new Error("We couldn't find that class.");
    const { data: student } = await db
      .from("students")
      .select("id, nickname, avatar")
      .eq("id", data.studentId)
      .eq("class_id", cls.id)
      .maybeSingle();
    if (!student) throw new Error("We couldn't find that name in this class.");
    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
    const { error } = await db
      .from("student_devices")
      .insert({ student_id: student.id, class_id: cls.id, token_hash: await hashToken(token) });
    if (error) throw new Error("Couldn't link this device. Please try again.");
    return { token, studentId: student.id, nickname: student.nickname, avatar: student.avatar, className: cls.name };
  });

/**
 * Demo only: link this tablet to every demo class the chosen demo student is in.
 * It works like typing each demo class code and tapping the name, and only
 * ever touches the demo school.
 */
export const demoStudentSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ nickname: z.enum(["Leo", "Mia"]) }).parse(data))
  .handler(async ({ data }) => {
    const { DEMO_CLASS_CODES } = await import("./step-cards/demo");
    const db = await admin();
    const { data: classes } = await db.from("classes").select("id, name, join_code").in("join_code", [...DEMO_CLASS_CODES]);
    const spaces: { token: string; studentId: string; nickname: string; avatar: string; className: string }[] = [];
    for (const code of DEMO_CLASS_CODES) {
      const cls = classes?.find((c) => c.join_code === code);
      if (!cls) continue;
      const { data: student } = await db
        .from("students")
        .select("id, nickname, avatar")
        .eq("class_id", cls.id)
        .eq("nickname", data.nickname)
        .maybeSingle();
      if (!student) continue;
      const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
      const { error } = await db
        .from("student_devices")
        .insert({ student_id: student.id, class_id: cls.id, token_hash: await hashToken(token) });
      if (!error) spaces.push({ token, studentId: student.id, nickname: student.nickname, avatar: student.avatar, className: cls.name });
    }
    if (!spaces.length) throw new Error("The demo classes aren't available right now.");
    return spaces;
  });

const tokenInput = z.object({ token: z.string().min(32).max(128) });

export const getStudentState = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenInput.extend({ since: z.string().datetime().optional() }).parse(data))
  .handler(async ({ data }) => {
    const { db, device } = await deviceFor(data.token);
    if (Date.now() - new Date(device.last_seen_at).getTime() > 60_000) {
      await db.from("student_devices").update({ last_seen_at: new Date().toISOString() }).eq("id", device.id);
    }
    const [{ data: student }, { data: cls }, { data: lesson }] = await Promise.all([
      db.from("students").select("nickname, avatar, pictogram_only, help_choice").eq("id", device.student_id).maybeSingle(),
      db.from("classes").select("name").eq("id", device.class_id).maybeSingle(),
      db
        .from("lessons")
        .select("id, title, then_activity")
        .eq("class_id", device.class_id)
        .eq("status", "live")
        .order("approved_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (!student) throw new Error("This device isn't linked to a class any more. Please join again.");

    let card: null | {
      id: string;
      steps: Step[];
      currentStep: number;
      helpStep: number | null;
      helpOnTheWay: boolean;
      completed: boolean;
      breakStartedAt: string | null;
      stickerId: string | null;
      feeling: string | null;
    } = null;
    if (lesson) {
      const { data: c } = await db
        .from("lesson_cards")
        .select("id, steps, current_step, help_step, help_ack_at, completed_at, break_started_at, sticker_id, feeling")
        .eq("lesson_id", lesson.id)
        .eq("student_id", device.student_id)
        .maybeSingle();
      if (c)
        card = {
          id: c.id,
          steps: (c.steps as unknown as Step[]) ?? [],
          currentStep: c.current_step,
          helpStep: c.help_step,
          helpOnTheWay: !!c.help_ack_at,
          completed: !!c.completed_at,
          breakStartedAt: c.break_started_at,
          stickerId: c.sticker_id,
          feeling: c.feeling,
        };
    }

    // Finished cards for the sticker book, and steps done on their own today
    const since = data.since ?? new Date(Date.now() - 12 * 3600_000).toISOString();
    const [{ data: finished, count: finishedCount }, { data: today }] = await Promise.all([
      db
        .from("lesson_cards")
        .select("id, completed_at, steps, help_count, home_practice_count, home_practiced_at, sticker_id, lessons(title)", { count: "exact" })
        .eq("student_id", device.student_id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(200),
      db.from("lesson_cards").select("current_step, help_count").eq("student_id", device.student_id).gte("updated_at", since),
    ]);
    const total = finishedCount ?? finished?.length ?? 0;
    const history = (finished ?? []).map((f, i) => ({
      id: f.id,
      title: (f.lessons as { title: string } | null)?.title ?? "Cards",
      completedAt: f.completed_at as string,
      steps: ((f.steps as unknown as Step[]) ?? []).length,
      stickerId: f.sticker_id,
      homePracticeCount: f.home_practice_count,
      homePracticedRecently: !!f.home_practiced_at && Date.now() - new Date(f.home_practiced_at).getTime() < HOME_PRACTICE_GAP_MS,
      // Position since the very first finished set, so each keeps its sticker
      stickerIndex: total - 1 - i,
    }));

    return {
      history,
      stepsOnOwnToday: stepsOnOwn(today ?? []),
      nickname: student.nickname,
      avatar: student.avatar,
      pictogramOnly: student.pictogram_only,
      helpChoice: (student.help_choice as HelpChoice) ?? "same",
      className: cls?.name ?? "",
      lesson: lesson ? { id: lesson.id, title: lesson.title, thenActivity: lesson.then_activity } : null,
      card,
    };
  });

export const studentAction = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    tokenInput
      .extend({
        cardId: z.string().uuid(),
        action: z.enum(["done", "help", "cancel_help", "break", "end_break", "pick_sticker", "feeling"]),
        stickerId: z.string().max(60).optional(),
        feeling: z.enum(FEELING_VALUES).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { db, device } = await deviceFor(data.token);
    const { data: card } = await db
      .from("lesson_cards")
      .select("id, lesson_id, student_id, steps, current_step, help_count, completed_at")
      .eq("id", data.cardId)
      .maybeSingle();
    if (!card || card.student_id !== device.student_id) throw new Error("These cards belong to someone else.");
    const { data: lesson } = await db.from("lessons").select("status, routine_key").eq("id", card.lesson_id).maybeSingle();
    if (lesson?.status !== "live") throw new Error("Your teacher has finished these cards.");
    if (card.completed_at) return { ok: true };

    const total = ((card.steps as unknown as Step[]) ?? []).length;
    const now = new Date().toISOString();

    if (data.action === "help") {
      await db
        .from("lesson_cards")
        .update({ help_step: card.current_step + 1, help_requested_at: now, help_ack_at: null, help_count: card.help_count + 1 })
        .eq("id", card.id);
      return { ok: true };
    }
    if (data.action === "pick_sticker") {
      if (!stickerById(data.stickerId)) throw new Error("That sticker isn't in the sticker book.");
      await db.from("lesson_cards").update({ sticker_id: data.stickerId ?? null }).eq("id", card.id);
      return { ok: true };
    }
    if (data.action === "feeling") {
      if (!data.feeling) throw new Error("Pick how you feel, or tap Skip.");
      await db.from("lesson_cards").update({ feeling: data.feeling, feeling_at: now }).eq("id", card.id);
      return { ok: true };
    }
    if (data.action === "break") {
      await db.from("lesson_cards").update({ break_started_at: now }).eq("id", card.id);
      return { ok: true };
    }
    if (data.action === "end_break") {
      await db.from("lesson_cards").update({ break_started_at: null }).eq("id", card.id);
      return { ok: true };
    }
    if (data.action === "cancel_help") {
      await db.from("lesson_cards").update({ help_step: null, help_requested_at: null, help_ack_at: null }).eq("id", card.id);
      return { ok: true };
    }

    const next = Math.min(card.current_step + 1, total);
    const finished = next >= total;
    // Only advance from the step we read, so a double tap can't skip a card
    const { data: advanced } = await db
      .from("lesson_cards")
      .update({
        current_step: next,
        help_step: null,
        help_requested_at: null,
        help_ack_at: null,
        break_started_at: null,
        completed_at: finished ? now : null,
      })
      .eq("id", card.id)
      .eq("current_step", card.current_step)
      .select("id");
    if (!advanced?.length) return { ok: true };

    if (finished && lesson.routine_key) {
      const { data: student } = await db.from("students").select("completion_history").eq("id", device.student_id).maybeSingle();
      const history = (student?.completion_history ?? {}) as Record<string, number>;
      history[lesson.routine_key] = (history[lesson.routine_key] ?? 0) + 1;
      await db.from("students").update({ completion_history: history }).eq("id", device.student_id);
    }
    return { ok: true };
  });

export const leaveDevice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenInput.parse(data))
  .handler(async ({ data }) => {
    const db = await admin();
    await db.from("student_devices").delete().eq("token_hash", await hashToken(data.token));
    return { ok: true };
  });

/** One quick look at every class saved on this tablet, for the student home screen. */
export const getSpacesSummary = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ tokens: z.array(z.string().min(32).max(128)).max(12) }).parse(data))
  .handler(async ({ data }) => {
    const db = await admin();
    const results = await Promise.all(
      data.tokens.map(async (token) => {
        const { data: device } = await db
          .from("student_devices")
          .select("student_id, class_id")
          .eq("token_hash", await hashToken(token))
          .maybeSingle();
        if (!device) return { token, linked: false as const };
        const [{ data: cls }, { data: lesson }] = await Promise.all([
          db.from("classes").select("name").eq("id", device.class_id).maybeSingle(),
          db
            .from("lessons")
            .select("id, title")
            .eq("class_id", device.class_id)
            .eq("status", "live")
            .order("approved_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);
        let waiting = false;
        if (lesson) {
          const { data: c } = await db
            .from("lesson_cards")
            .select("completed_at")
            .eq("lesson_id", lesson.id)
            .eq("student_id", device.student_id)
            .maybeSingle();
          waiting = !!c && !c.completed_at;
        }
        return { token, linked: true as const, className: cls?.name ?? "", lessonTitle: waiting ? lesson?.title ?? null : null };
      }),
    );
    return results;
  });

/** The student's own choice for their next cards: more help, the same, or less help. */
export const setHelpChoice = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenInput.extend({ choice: z.enum(["more", "same", "less"]) }).parse(data))
  .handler(async ({ data }) => {
    const { db, device } = await deviceFor(data.token);
    const { error } = await db.from("students").update({ help_choice: data.choice }).eq("id", device.student_id);
    if (error) throw new Error("Couldn't save that. Please try again.");
    return { ok: true };
  });

/**
 * "We practiced this at home": a family tap on a finished card. It counts as one
 * more run of the routine, so cards can fade sooner when it is practiced at home.
 */
export const practicedAtHome = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenInput.extend({ cardId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { db, device } = await deviceFor(data.token);
    const { data: card } = await db
      .from("lesson_cards")
      .select("id, lesson_id, student_id, completed_at, home_practice_count, home_practiced_at")
      .eq("id", data.cardId)
      .maybeSingle();
    if (!card || card.student_id !== device.student_id) throw new Error("These cards belong to someone else.");
    if (!card.completed_at) throw new Error("Finish these cards first.");
    if (card.home_practiced_at && Date.now() - new Date(card.home_practiced_at).getTime() < HOME_PRACTICE_GAP_MS) return { ok: true };

    const { data: updated } = await db
      .from("lesson_cards")
      .update({ home_practice_count: card.home_practice_count + 1, home_practiced_at: new Date().toISOString() })
      .eq("id", card.id)
      .eq("home_practice_count", card.home_practice_count)
      .select("id");
    if (!updated?.length) return { ok: true };

    const { data: lesson } = await db.from("lessons").select("routine_key").eq("id", card.lesson_id).maybeSingle();
    if (lesson?.routine_key) {
      const { data: student } = await db.from("students").select("completion_history").eq("id", device.student_id).maybeSingle();
      const history = (student?.completion_history ?? {}) as Record<string, number>;
      history[lesson.routine_key] = (history[lesson.routine_key] ?? 0) + 1;
      await db.from("students").update({ completion_history: history }).eq("id", device.student_id);
    }
    return { ok: true };
  });
