import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { ClassHeader } from "@/components/app/ClassHeader";
import { supabase } from "@/integrations/supabase/client";
import { classQuery, studentsQuery, type StudentRow } from "@/lib/queries";
import {
  AVATARS,
  FADING_OPTIONS,
  HELP_CHOICES,
  READING_LEVELS,
  avatarGlyph,
  type FadingPace,
  type ReadingLevel,
} from "@/lib/step-cards/types";

export const Route = createFileRoute("/_authenticated/classes/$classId_/students")({
  head: () => ({
    meta: [
      { title: "Students — Step Cards" },
      { name: "description", content: "Add students by nickname and set their reading level." },
      { property: "og:title", content: "Students — Step Cards" },
      { property: "og:description", content: "Add students by nickname and set their reading level." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { classId } = Route.useParams();
  const { data: cls } = useQuery(classQuery(classId));
  const { data: students, isLoading } = useQuery(studentsQuery(classId));

  if (!cls) return <p className="text-muted-foreground">Loading class…</p>;

  return (
    <div className="space-y-8">
      <ClassHeader classId={classId} name={cls.name} joinCode={cls.join_code} current="students" />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <AddStudent classId={classId} />
        <section aria-labelledby="roster-heading">
          <h2 id="roster-heading" className="font-display text-xl font-semibold">
            Students {students ? `(${students.length})` : ""}
          </h2>
          {isLoading && <p className="mt-3 text-muted-foreground">Loading…</p>}
          {students?.length === 0 && <p className="mt-3 text-muted-foreground">No students yet. Add the first one.</p>}
          <ul className="mt-4 space-y-3">
            {students?.map((s) => <StudentRowEditor key={s.id} student={s} />)}
          </ul>
        </section>
      </div>
    </div>
  );
}

function ReadingLevelPicker({ value, onChange, name }: { value: ReadingLevel; onChange: (v: ReadingLevel) => void; name: string }) {
  return (
    <fieldset>
      <legend className="field-label">Reading level</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {READING_LEVELS.map((l) => (
          <label
            key={l.value}
            className={`flex min-h-11 cursor-pointer flex-col rounded-lg border px-3 py-2 ${
              value === l.value ? "border-primary bg-primary-soft" : "border-border bg-card"
            }`}
          >
            <span className="flex items-center gap-2">
              <input type="radio" name={name} value={l.value} checked={value === l.value} onChange={() => onChange(l.value)} className="accent-[var(--color-primary)]" />
              <span className="font-bold">{l.label}</span>
            </span>
            <span className="pl-6 text-sm text-muted-foreground">{l.hint}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function AddStudent({ classId }: { classId: string }) {
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState<ReadingLevel>("grade4");
  const [picturesOnly, setPicturesOnly] = useState(false);
  const [avatar, setAvatar] = useState<string>("circle");

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("students")
        .insert({ class_id: classId, nickname: nickname.trim(), reading_level: level, pictogram_only: picturesOnly, avatar });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setNickname("");
      queryClient.invalidateQueries({ queryKey: ["students", classId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) add.mutate();
      }}
      className="surface flex flex-col gap-5 self-start p-6"
    >
      <h2 className="font-display text-xl font-semibold">Add a student</h2>
      <p className="notice-info">Use a nickname or first initial. Never enter full names, photos or diagnoses.</p>
      <div>
        <label htmlFor="nickname" className="field-label">Nickname</label>
        <input id="nickname" className="field" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={24} placeholder="For example: Leo" />
      </div>
      <ReadingLevelPicker value={level} onChange={setLevel} name="new-level" />
      <fieldset>
        <legend className="field-label">Symbol to find their name</legend>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setAvatar(a.value)}
              aria-pressed={avatar === a.value}
              aria-label={a.label}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border text-xl ${
                avatar === a.value ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {a.glyph}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input type="checkbox" checked={picturesOnly} onChange={(e) => setPicturesOnly(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--color-primary)]" />
        <span>
          <span className="font-bold">Show pictures only</span>
          <span className="block text-sm text-muted-foreground">Words are hidden on their screen but still read aloud.</span>
        </span>
      </label>
      {add.error && <p className="notice-error">{add.error.message}</p>}
      <button type="submit" className="btn-primary" disabled={!nickname.trim() || add.isPending}>
        {add.isPending ? "Adding…" : "Add student"}
      </button>
    </form>
  );
}

function StudentRowEditor({ student }: { student: StudentRow }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [level, setLevel] = useState<ReadingLevel>(student.reading_level);
  const [picturesOnly, setPicturesOnly] = useState(student.pictogram_only);
  const [fading, setFading] = useState<"off" | FadingPace>(
    student.fading_enabled ? ((student.fading_pace as FadingPace) ?? "standard") : "off",
  );
  const fadingLabel = FADING_OPTIONS.find((f) => f.value === (student.fading_enabled ? student.fading_pace : "off"))?.label;
  const choiceLabel = HELP_CHOICES.find((c) => c.value === student.help_choice)?.teacherLabel;
  const routines = Object.values((student.completion_history ?? {}) as Record<string, number>).reduce((a, b) => a + b, 0);
  const levelLabel = READING_LEVELS.find((l) => l.value === student.reading_level)?.label;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["students", student.class_id] });
  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("students").update({
          reading_level: level,
          pictogram_only: picturesOnly,
          fading_enabled: fading !== "off",
          ...(fading !== "off" ? { fading_pace: fading } : {}),
        }).eq("id", student.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setEditing(false);
      refresh();
    },
  });
  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("students").delete().eq("id", student.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  return (
    <li className="surface p-4">
      <div className="flex flex-wrap items-center gap-4">
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-xl text-primary">
          {avatarGlyph(student.avatar)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{student.nickname}</p>
          <p className="text-sm text-muted-foreground">
            {levelLabel}
            {student.pictogram_only ? " · Pictures only" : ""}
            {` · Fading: ${fadingLabel?.toLowerCase() ?? "usual pace"}`} · {routines} routine{routines === 1 ? "" : "s"} finished
            {choiceLabel ? ` · ${choiceLabel}` : ""}
          </p>
        </div>
        {!editing && (
          <button type="button" className="btn-outline text-sm" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
      </div>
      {editing && (
        <div className="mt-4 space-y-4 border-t border-border pt-4">
          <ReadingLevelPicker value={level} onChange={setLevel} name={`level-${student.id}`} />
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input type="checkbox" checked={picturesOnly} onChange={(e) => setPicturesOnly(e.target.checked)} className="h-5 w-5 accent-[var(--color-primary)]" />
            <span className="font-bold">Show pictures only</span>
          </label>
          <fieldset>
            <legend className="field-label">Fewer cards as they learn a routine</legend>
            <p className="mb-2 text-sm text-muted-foreground">
              Cards fade towards one summary card as a routine is learned. Finished runs at home count too.
              {student.help_choice !== "same" ? ` ${student.nickname} ${choiceLabel?.toLowerCase()}, which changes this for their next cards.` : ""}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {FADING_OPTIONS.map((f) => (
                <label
                  key={f.value}
                  className={`flex min-h-11 cursor-pointer flex-col rounded-lg border px-3 py-2 ${
                    fading === f.value ? "border-primary bg-primary-soft" : "border-border bg-card"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`fading-${student.id}`}
                      checked={fading === f.value}
                      onChange={() => setFading(f.value)}
                      className="accent-[var(--color-primary)]"
                    />
                    <span className="font-bold">{f.label}</span>
                  </span>
                  <span className="pl-6 text-sm text-muted-foreground">{f.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {save.error && <p className="notice-error">{save.error.message}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => save.mutate()} disabled={save.isPending}>
              Save changes
            </button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
            {!confirmRemove ? (
              <button type="button" className="btn-ghost ml-auto text-destructive-foreground" onClick={() => setConfirmRemove(true)}>
                Remove student
              </button>
            ) : (
              <span className="ml-auto flex flex-wrap items-center gap-2">
                <span className="text-sm">Remove {student.nickname} and their progress?</span>
                <button type="button" className="btn bg-destructive font-bold text-primary-foreground" onClick={() => remove.mutate()}>
                  Yes, remove
                </button>
                <button type="button" className="btn-ghost" onClick={() => setConfirmRemove(false)}>
                  Keep
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
