import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Step } from "@/lib/step-cards/types";

export type ClassRow = Database["public"]["Tables"]["classes"]["Row"];
export type StudentRow = Database["public"]["Tables"]["students"]["Row"];
export type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
export type CardRow = Omit<Database["public"]["Tables"]["lesson_cards"]["Row"], "steps"> & { steps: Step[] };

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, display_name").eq("id", userId).maybeSingle();
      fail(error);
      return data;
    },
  });

export const membershipsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["memberships", userId],
    queryFn: async () => {
      const { data, error } = await supabase
          .from("organization_members")
          .select("org_id, role, organizations(id, name, invite_code)")
          .eq("user_id", userId);
      fail(error);
      return data;
    },
  });

export const myClassesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["classes", "mine", userId],
    queryFn: async () => {
      const { data, error } = await supabase
          .from("classes")
          .select("*, students(count), lessons(id, status)")
          .eq("teacher_id", userId)
          .order("created_at", { ascending: false });
      fail(error);
      return data;
    },
  });

export const classQuery = (classId: string) =>
  queryOptions({
    queryKey: ["class", classId],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("*").eq("id", classId).maybeSingle();
      fail(error);
      return data;
    },
  });

export const studentsQuery = (classId: string) =>
  queryOptions({
    queryKey: ["students", classId],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").eq("class_id", classId).order("created_at");
      fail(error);
      return data;
    },
  });

export const lessonsQuery = (classId: string) =>
  queryOptions({
    queryKey: ["lessons", classId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").eq("class_id", classId).order("created_at", { ascending: false }).limit(20);
      fail(error);
      return data;
    },
  });

export const lessonQuery = (lessonId: string) =>
  queryOptions({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*, classes(id, name, join_code)").eq("id", lessonId).maybeSingle();
      fail(error);
      return data;
    },
  });

export const cardsQuery = (lessonId: string) =>
  queryOptions({
    queryKey: ["cards", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lesson_cards").select("*").eq("lesson_id", lessonId);
      fail(error);
      return (data ?? []) as unknown as CardRow[];
    },
  });

/** All cards for this class (across all lessons). Used for the students-page overview. */
export const classCardsQuery = (classId: string) =>
  queryOptions({
    queryKey: ["class-cards", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_cards")
        .select("id, lesson_id, student_id, current_step, completed_at, sticker_id, help_count, steps")
        .eq("class_id", classId);
      fail(error);
      return (data ?? []) as unknown as Pick<CardRow, "id" | "lesson_id" | "student_id" | "current_step" | "completed_at" | "sticker_id" | "help_count" | "steps">[];
    },
  });
