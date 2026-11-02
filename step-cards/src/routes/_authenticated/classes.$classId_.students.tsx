import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState, type FormEvent } from "react";

import { ClassHeader } from "@/components/app/ClassHeader";
import { supabase } from "@/integrations/supabase/client";
import { classCardsQuery, classQuery, lessonsQuery, studentsQuery, type CardRow, type LessonRow, type StudentRow } from "@/lib/queries";
import { collectionCounts, stickerById, stickerImage } from "@/lib/step-cards/stickers";
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
      { name: "description", content: "Students in this class, their reading levels, and class progress." },
      { property: "og:title", content: "Students — Step Cards" },
      { property: "og:description", content: "Students in this class, their reading levels, and class progress." },
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
  const { data: lessons } = useQuery(lessonsQuery(classId));
  const { data: cards } = useQuery(classCardsQuery(classId));

  const [showAdd, setShowAdd] = useState(false);

  if (!cls) return <p className="text-muted-foreground">Loading class…</p>;

  const liveLesson = lessons?.find((l) => l.status === "live");
  const liveCards = liveLesson ? cards?.filter((c) => c.lesson_id === liveLesson.id) ?? [] : [];
  const studentCardCounts = new Map<string, { finished: number; stickers: number }>();
  for (const c of cards ?? []) {
    const entry = studentCardCounts.get(c.student_id) ?? { finished: 0, stickers: 0 };
    if (c.completed_at) {
      entry.finished += 1;
      if (c.sticker_id) entry.stickers += 1;
    }
    studentCardCounts.set(c.student_id, entry);
  }

  return (
    <div className="space-y-8">
      <ClassHeader classId={classId} name={cls.name} joinCode={cls.join_code} current="students" />

      {/* Collapsible "add student" */}
      <section>
        {!showAdd ? (
          <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>
            + Add a student
          </button>
        ) : (
          <AddStudent classId={classId} onDone={() => setShowAdd(false)} />
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: table of students */}
        <section aria-labelledby="roster-heading">
          <h2 id="roster-heading" className="font-display text-xl font-semibold">
            Students {students ? `(${students.length})` : ""}
          </h2>
          {isLoading && <p className="mt-3 text-muted-foreground">Loading…</p>}
          {students?.length === 0 && (
            <p className="mt-3 text-muted-foreground">No students yet. Add the first one above.</p>
          )}
          {!!students?.length && (
            <StudentsTable
              students={students}
              counts={studentCardCounts}
              cards={cards ?? []}
              lessons={lessons ?? []}
            />
          )}
        </section>

        {/* Right: pie chart */}
        <section aria-labelledby="progress-heading" className="space-y-4">
          <h2 id="progress-heading" className="font-display text-xl font-semibold">
            Class progress
          </h2>
          <CompletionDonut
            liveLessonTitle={liveLesson?.title ?? null}
            total={students?.length ?? 0}
            cards={liveCards.map((c) => ({
              student_id: c.student_id,
              currentStep: c.current_step,
              total: Array.isArray(c.steps) ? (c.steps as unknown[]).length : 0,
              completed: !!c.completed_at,
            }))}
          />
          <ClassStickerSummary classId={classId} />
        </section>
      </div>
    </div>
  );
}

type OpenPanel = { id: string; mode: "view" | "edit" } | null;

/** Compact table of students: avatar, nickname, level, fading, routines finished, stickers. */
function StudentsTable({
  students,
  counts,
  cards,
  lessons,
}: {
  students: StudentRow[];
  counts: Map<string, { finished: number; stickers: number }>;
  cards: Pick<CardRow, "id" | "lesson_id" | "student_id" | "current_step" | "completed_at" | "sticker_id" | "help_count" | "steps">[];
  lessons: LessonRow[];
}) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const lessonById = new Map(lessons.map((l) => [l.id, l] as const));
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3">Student</th>
            <th className="p-3">Reading level</th>
            <th className="p-3">Fading</th>
            <th className="p-3 text-right">Finished</th>
            <th className="p-3 text-right">Stickers</th>
            <th className="p-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const c = counts.get(s.id) ?? { finished: 0, stickers: 0 };
            const level = READING_LEVELS.find((l) => l.value === s.reading_level)?.label ?? s.reading_level;
            const fading = s.fading_enabled
              ? FADING_OPTIONS.find((f) => f.value === s.fading_pace)?.label ?? "Usual pace"
              : "Off";
            const studentCards = cards.filter((card) => card.student_id === s.id);
            const isOpen = open?.id === s.id;
            return (
              <Fragment key={s.id}>
                <tr className="border-t border-border align-middle">
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-base text-primary">
                        {avatarGlyph(s.avatar)}
                      </span>
                      <span className="font-bold">{s.nickname}</span>
                      {s.pictogram_only && <span className="chip px-1.5 py-0.5 text-xs">Pictures only</span>}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{level}</td>
                  <td className="p-3 text-muted-foreground">{fading}</td>
                  <td className="p-3 text-right font-bold">{c.finished}</td>
                  <td className="p-3 text-right font-bold">{c.stickers}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex gap-1">
                      <button
                        type="button"
                        className="btn-outline text-xs"
                        aria-expanded={isOpen && open?.mode === "view"}
                        onClick={() => setOpen(isOpen && open?.mode === "view" ? null : { id: s.id, mode: "view" })}
                      >
                        {isOpen && open?.mode === "view" ? "Close" : "View"}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost text-xs"
                        aria-expanded={isOpen && open?.mode === "edit"}
                        onClick={() => setOpen(isOpen && open?.mode === "edit" ? null : { id: s.id, mode: "edit" })}
                      >
                        {isOpen && open?.mode === "edit" ? "Close" : "Edit"}
                      </button>
                    </span>
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={6} className="bg-muted/20 p-4">
                      {open?.mode === "view" ? (
                        <StudentDetail student={s} cards={studentCards} lessonById={lessonById} />
                      ) : (
                        <StudentEditor student={s} onDone={() => setOpen(null)} />
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Per-student drill-down: finished routines + their earned sticker book. */
function StudentDetail({
  student,
  cards,
  lessonById,
}: {
  student: StudentRow;
  cards: Pick<CardRow, "id" | "lesson_id" | "student_id" | "current_step" | "completed_at" | "sticker_id" | "help_count" | "steps">[];
  lessonById: Map<string, LessonRow>;
}) {
  const finished = cards
    .filter((c) => c.completed_at)
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
  const inProgress = cards.filter((c) => !c.completed_at && c.current_step > 0);
  const counts = collectionCounts(finished.map((c) => c.sticker_id));
  const kinds = Object.keys(counts).length;
  const totalStickers = Object.values(counts).reduce((a, b) => a + b, 0);
  const helpTotal = cards.reduce((sum, c) => sum + (c.help_count ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <h3 className="font-display text-lg font-semibold">{student.nickname}'s progress</h3>
        <p className="text-sm text-muted-foreground">
          {finished.length} finished · {inProgress.length} in progress · {helpTotal} help {helpTotal === 1 ? "tap" : "taps"}
        </p>
      </div>

      {/* Sticker book — unique stickers earned, with counts */}
      <div>
        <p className="field-label">
          Sticker book ({totalStickers} earned, {kinds} different)
        </p>
        {totalStickers === 0 ? (
          <p className="text-sm text-muted-foreground">No stickers yet. Stickers show up here after finished routines.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-3">
            {Object.entries(counts).map(([stickerId, n]) => {
              const sticker = stickerById(stickerId);
              if (!sticker) return null;
              return (
                <li key={stickerId} className="relative flex w-24 flex-col items-center gap-1 rounded-lg border border-success/40 bg-success-soft p-2 text-center">
                  {n > 1 && <span className="chip absolute right-1 top-1 px-1.5 py-0.5 text-xs">×{n}</span>}
                  <img src={stickerImage(sticker)} alt="" width={56} height={56} loading="lazy" className="rounded-md object-contain" />
                  <span className="text-xs font-bold leading-tight">{sticker.name}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Finished routines list */}
      {finished.length > 0 && (
        <div>
          <p className="field-label">Finished routines</p>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
            {finished.map((c) => {
              const lesson = lessonById.get(c.lesson_id);
              const sticker = stickerById(c.sticker_id);
              return (
                <li key={c.id} className="flex items-center gap-3 p-2">
                  {sticker ? (
                    <img src={stickerImage(sticker)} alt="" width={32} height={32} loading="lazy" className="rounded object-contain" />
                  ) : (
                    <span className="inline-block h-8 w-8 rounded bg-muted" aria-hidden="true" />
                  )}
                  <span className="flex-1 truncate text-sm font-bold">{lesson?.title ?? "Routine"}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.completed_at ? new Date(c.completed_at).toLocaleDateString() : ""}
                  </span>
                  {(c.help_count ?? 0) > 0 && (
                    <span className="chip px-1.5 py-0.5 text-xs">{c.help_count} help</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* In-progress routines, if any */}
      {inProgress.length > 0 && (
        <div>
          <p className="field-label">Working on now</p>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
            {inProgress.map((c) => {
              const lesson = lessonById.get(c.lesson_id);
              const total = Array.isArray(c.steps) ? c.steps.length : 0;
              return (
                <li key={c.id} className="flex items-center gap-3 p-2">
                  <span className="flex-1 truncate text-sm font-bold">{lesson?.title ?? "Routine"}</span>
                  <span className="text-xs text-muted-foreground">
                    Step {c.current_step}{total ? ` of ${total}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Donut chart of class progress on the live lesson. Pure inline SVG — no chart library. */
function CompletionDonut({
  liveLessonTitle,
  total,
  cards,
}: {
  liveLessonTitle: string | null;
  total: number;
  cards: { student_id: string; currentStep: number; total: number; completed: boolean }[];
}) {
  const done = cards.filter((c) => c.completed).length;
  const inProgress = cards.filter((c) => !c.completed && c.currentStep > 0).length;
  const notStarted = Math.max(0, total - done - inProgress);
  const slices = [
    { label: "Finished", value: done, color: "var(--color-success, #16a34a)" },
    { label: "Working on it", value: inProgress, color: "var(--color-primary, #2563eb)" },
    { label: "Not started", value: notStarted, color: "var(--color-muted-foreground, #94a3b8)" },
  ];
  const sum = slices.reduce((a, b) => a + b.value, 0);

  if (!liveLessonTitle) {
    return (
      <div className="surface p-5 text-sm text-muted-foreground">
        <p>No cards are live right now. Send cards from a class page to see class progress here.</p>
      </div>
    );
  }
  if (sum === 0) {
    return (
      <div className="surface p-5 text-sm text-muted-foreground">
        <p className="font-bold text-foreground">{liveLessonTitle}</p>
        <p className="mt-1">Waiting for students to open their cards.</p>
      </div>
    );
  }

  // Build SVG arc path for each slice
  const r = 70;
  const stroke = 24;
  const cx = 90;
  const cy = 90;
  let acc = 0;
  const arcs = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const start = (acc / sum) * Math.PI * 2 - Math.PI / 2;
      acc += s.value;
      const end = (acc / sum) * Math.PI * 2 - Math.PI / 2;
      const large = end - start > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      return { ...s, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` };
    });

  return (
    <div className="surface p-5">
      <p className="text-sm text-muted-foreground">Live now</p>
      <p className="font-bold">{liveLessonTitle}</p>
      <div className="mt-4 flex items-center gap-5">
        <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden="true">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border, #e2e8f0)" strokeWidth={stroke} />
          {arcs.map((a) => (
            <path key={a.label} d={a.d} fill="none" stroke={a.color} strokeWidth={stroke} strokeLinecap="butt" />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground" fontSize="26" fontWeight="700">
            {done}
          </text>
          <text x={cx} y={cy + 18} textAnchor="middle" className="fill-muted-foreground" fontSize="12">
            of {total} done
          </text>
        </svg>
        <ul className="space-y-2 text-sm">
          {slices.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }} />
              <span className="font-bold">{s.value}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Top stickers earned across the class — simple leaderboard-free summary. */
function ClassStickerSummary({ classId }: { classId: string }) {
  const { data: cards } = useQuery(classCardsQuery(classId));
  const earned = (cards ?? []).filter((c) => c.completed_at && c.sticker_id);
  const totalFinished = (cards ?? []).filter((c) => c.completed_at).length;
  const counts = collectionCounts(earned.map((c) => c.sticker_id));
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  if (totalFinished === 0) return null;
  return (
    <div className="surface p-5 text-sm">
      <p className="text-muted-foreground">Class sticker book</p>
      <p className="text-2xl font-bold">{totalFinished} earned</p>
      <p className="mt-1 text-muted-foreground">
        {Object.keys(counts).length} different sticker{Object.keys(counts).length === 1 ? "" : "s"} across the class.
      </p>
      {top.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {top.map(([stickerId, n]) => {
            const sticker = stickerById(stickerId);
            if (!sticker) return null;
            return (
              <li key={stickerId} className="relative inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-1">
                <img src={stickerImage(sticker)} alt="" width={28} height={28} loading="lazy" className="rounded object-contain" />
                <span className="text-xs font-bold">×{n}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AddStudent({ classId, onDone }: { classId: string; onDone: () => void }) {
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
      onDone();
    },
  });

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) add.mutate();
      }}
      className="surface flex flex-col gap-5 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Add a student</h2>
        <button type="button" className="btn-ghost text-sm" onClick={onDone}>
          Close
        </button>
      </div>
      <p className="notice-info">Use a nickname or first initial. Never enter full names, photos or diagnoses.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="nickname" className="field-label">Nickname</label>
          <input id="nickname" className="field" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={24} placeholder="For example: Leo" />
        </div>
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
      </div>
      <ReadingLevelPicker value={level} onChange={setLevel} name="new-level" />
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

function StudentEditor({ student, onDone }: { student: StudentRow; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [level, setLevel] = useState<ReadingLevel>(student.reading_level);
  const [picturesOnly, setPicturesOnly] = useState(student.pictogram_only);
  const [fading, setFading] = useState<"off" | FadingPace>(
    student.fading_enabled ? ((student.fading_pace as FadingPace) ?? "standard") : "off",
  );
  const choiceLabel = HELP_CHOICES.find((c) => c.value === student.help_choice)?.teacherLabel;

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
      refresh();
      onDone();
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
      onDone();
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">Edit {student.nickname}</h3>
        <button type="button" className="btn-ghost text-sm" onClick={onDone}>
          Close
        </button>
      </div>
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
  );
}

