import { feelingById, feelingImage, teacherShouldNotice } from "@/lib/step-cards/feelings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { StepCardView } from "@/components/cards/StepCardView";
import { supabase } from "@/integrations/supabase/client";
import { approveLesson, deleteLesson, findPictures, generateMissingCards } from "@/lib/lessons.functions";
import { cardsQuery, lessonQuery, studentsQuery, type CardRow, type StudentRow } from "@/lib/queries";
import { formatCode } from "@/lib/step-cards/codes";
import { independence } from "@/lib/step-cards/metrics";
import { TIMER_OPTIONS, avatarGlyph, formatSeconds, type Step } from "@/lib/step-cards/types";

export const Route = createFileRoute("/_authenticated/lessons/$lessonId")({
  head: () => ({
    meta: [
      { title: "Cards — Step Cards" },
      { name: "description", content: "Check, send and follow your students' step cards." },
      { property: "og:title", content: "Cards — Step Cards" },
      { property: "og:description", content: "Check, send and follow your students' step cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: lesson, isLoading } = useQuery(lessonQuery(lessonId));
  const classId = lesson?.class_id ?? "";
  const { data: students } = useQuery({ ...studentsQuery(classId), enabled: !!classId });
  const { data: cards } = useQuery(cardsQuery(lessonId));
  const stepsFromState = useRouterState({ select: (s) => (s.location.state as { previewSteps?: Step[] } | null)?.previewSteps });
  const [previewSteps, setPreviewSteps] = useState<Step[] | undefined>(undefined);
  // Client-only: persist/read preview steps via sessionStorage (safe from SSR)
  useEffect(() => {
    if (stepsFromState?.length) {
      setPreviewSteps(stepsFromState);
      try { sessionStorage.setItem(`preview_steps_${lessonId}`, JSON.stringify(stepsFromState)); } catch {}
    } else {
      try {
        const raw = sessionStorage.getItem(`preview_steps_${lessonId}`);
        if (raw) setPreviewSteps(JSON.parse(raw) as Step[]);
      } catch {}
    }
  }, [lessonId, stepsFromState]);

  // Live updates from student devices
  useEffect(() => {
    const channel = supabase
      .channel(`lesson-cards-${lessonId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "lesson_cards", filter: `lesson_id=eq.${lessonId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["cards", lessonId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [lessonId, queryClient]);

  if (isLoading) return <p className="text-muted-foreground">Loading cards…</p>;
  if (!lesson) return <p className="notice-error">We couldn't find these cards.</p>;

  const cls = lesson.classes as { id: string; name: string; join_code: string } | null;
  const studentById = new Map((students ?? []).map((s) => [s.id, s]));
  const rows = (cards ?? [])
    .map((c) => ({ card: c, student: studentById.get(c.student_id) }))
    .filter((r): r is { card: CardRow; student: StudentRow } => !!r.student)
    .sort((a, b) => a.student.nickname.localeCompare(b.student.nickname));

  return (
    <div className="space-y-8">
      <Link to="/classes/$classId" params={{ classId }} className="btn-ghost -ml-3 text-muted-foreground">
        ← {cls?.name ?? "Class"}
      </Link>
      <div>
        <p className="eyebrow">
          {lesson.status === "review" ? "Step 1 of 2: check the cards" : lesson.status === "live" ? "Live class board" : "Finished"}
        </p>
        <h1 className="display-lg mt-1">{lesson.title}</h1>
        <p className="mt-2 text-muted-foreground prose-width">“{lesson.instruction}”</p>
      </div>

      {lesson.status === "review" && (
        <ReviewView
          lessonId={lessonId}
          classId={classId}
          rows={rows}
          thenActivity={lesson.then_activity}
          {...(previewSteps ? { previewSteps } : {})}
        />
      )}
      {lesson.status !== "review" && (
        <BoardView
          lessonId={lessonId}
          classId={classId}
          live={lesson.status === "live"}
          rows={rows}
          joinCode={cls?.join_code ?? ""}
          thenActivity={lesson.then_activity}
          title={lesson.title}
          instruction={lesson.instruction}
        />
      )}
    </div>
  );
}

function ReviewView({
  lessonId,
  classId,
  rows,
  thenActivity,
  previewSteps,
}: {
  lessonId: string;
  classId: string;
  rows: { card: CardRow; student: StudentRow }[];
  thenActivity: string;
  previewSteps?: Step[];
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const approve = useServerFn(approveLesson);
  const noStudents = rows.length === 0;

  const send = useMutation({
    mutationFn: () => approve({ data: { lessonId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lessons", classId] });
    },
  });
  const discard = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", classId] });
      navigate({ to: "/classes/$classId", params: { classId } });
    },
  });

  return (
    <div className="space-y-6">
      {noStudents ? (
        <>
          {previewSteps?.length ? (
            <>
              <p className="notice-info text-base">
                Here's what your cards look like. Add students to this class to send personalised versions — each student gets their own reading level.
              </p>
              <PreviewCards steps={previewSteps} />
            </>
          ) : (
            <p className="notice-info text-base">
              Cards are ready. Add students to this class and they'll each get a personalised version.
            </p>
          )}
          <div className="notice-subtle flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/50 p-4 text-sm">
            <p className="text-muted-foreground"><strong>No students yet.</strong> Add them to send personalised cards — each student gets their own reading level.</p>
            <Link to="/classes/$classId/students" params={{ classId }} className="btn-outline text-sm shrink-0">
              Add students
            </Link>
          </div>
        </>
      ) : (
        <p className="notice-info text-base">
          Each student has their own version. Check them, change any words or pictures, then send. Students see nothing until you do.
        </p>
      )}

      <StudentCardsEditor lessonId={lessonId} rows={rows} />

      <ThenEditor lessonId={lessonId} initial={thenActivity} />

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-lift)]">
        <button type="button" className="btn-primary btn-lg" onClick={() => send.mutate()} disabled={send.isPending}>
          {send.isPending ? "Saving…" : noStudents ? "Save instruction" : `Send cards to ${rows.length} student${rows.length === 1 ? "" : "s"}`}
        </button>
        <button type="button" className="btn-ghost" onClick={() => discard.mutate()} disabled={discard.isPending}>
          Discard and start again
        </button>
        {send.error && <p className="notice-error w-full">{send.error.message}</p>}
      </div>
    </div>
  );
}

/** Read-only grid of step cards shown when the teacher has no students yet. */
function PreviewCards({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {steps.map((step, i) => (
        <li key={i}>
          <StepCardView step={step} index={i} total={steps.length} variant="preview" />
        </li>
      ))}
    </ol>
  );
}

/** One tab per student, each with their own editable cards. Used before and after sending. */
function StudentCardsEditor({ lessonId, rows }: { lessonId: string; rows: { card: CardRow; student: StudentRow }[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = rows.find((r) => r.student.id === activeId) ?? rows[0];
  return (
    <>
      <div role="tablist" aria-label="Students" className="flex flex-wrap gap-2 border-b border-border pb-3">
        {rows.map(({ student }) => (
          <button
            key={student.id}
            role="tab"
            aria-selected={active?.student.id === student.id}
            onClick={() => setActiveId(student.id)}
            className={active?.student.id === student.id ? "btn-selected" : "btn-outline"}
          >
            <span aria-hidden="true">{avatarGlyph(student.avatar)}</span> {student.nickname}
          </button>
        ))}
      </div>
      {active && <CardEditor key={active.card.id} card={active.card} student={active.student} lessonId={lessonId} />}
    </>
  );
}

/** The title and the words of the instruction, editable at any time. */
function LessonDetailsEditor({ lessonId, title, instruction }: { lessonId: string; title: string; instruction: string }) {
  const queryClient = useQueryClient();
  const [t, setT] = useState(title);
  const [ins, setIns] = useState(instruction);
  const dirty = t.trim() !== title || ins.trim() !== instruction;
  const save = useMutation({
    mutationFn: async () => {
      if (!t.trim()) throw new Error("Give the cards a name.");
      const { error } = await supabase.from("lessons").update({ title: t.trim(), instruction: ins.trim() }).eq("id", lessonId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] }),
  });
  return (
    <section aria-labelledby="details-heading" className="surface-quiet space-y-3 p-5">
      <h2 id="details-heading" className="font-display text-lg font-semibold">Name and instruction</h2>
      <div>
        <label htmlFor="lesson-title" className="field-label">Name students see</label>
        <input id="lesson-title" className="field" value={t} maxLength={80} onChange={(e) => setT(e.target.value)} />
      </div>
      <div>
        <label htmlFor="lesson-instruction" className="field-label">Your instruction (for your records and reuse)</label>
        <textarea id="lesson-instruction" className="field min-h-20" value={ins} maxLength={1000} onChange={(e) => setIns(e.target.value)} />
      </div>
      <button type="button" className="btn-outline" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? "Saving…" : dirty ? "Save" : "Saved"}
      </button>
      {save.error && <p className="notice-error">{save.error.message}</p>}
    </section>
  );
}

const THEN_IDEAS = ["Free reading", "Play time", "Snack", "Drawing", "Computer time", "Go outside"];

/** First–then board: the activity students see after the cards. Optional. */
function ThenEditor({ lessonId, initial }: { lessonId: string; initial: string }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(initial);
  const save = useMutation({
    mutationFn: async (next: string) => {
      const { error } = await supabase.from("lessons").update({ then_activity: next.trim() }).eq("id", lessonId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] }),
  });
  const savedValue = (queryClient.getQueryData<{ then_activity?: string }>(["lesson", lessonId])?.then_activity ?? initial).trim();
  const dirty = value.trim() !== savedValue;

  return (
    <section aria-labelledby="then-heading" className="surface-quiet space-y-3 p-5">
      <div>
        <h2 id="then-heading" className="font-display text-lg font-semibold">First, then (optional)</h2>
        <p className="text-sm text-muted-foreground">
          Tell students what comes after these cards. They see “First: these cards → Then: …” and “Now: …” when they finish.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-56 flex-1">
          <label htmlFor="then-activity" className="field-label">Then</label>
          <input
            id="then-activity"
            className="field"
            value={value}
            maxLength={40}
            placeholder="For example: Free reading"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="button" className="btn-outline" onClick={() => save.mutate(value)} disabled={!dirty || save.isPending}>
          {save.isPending ? "Saving…" : dirty ? "Save" : value.trim() ? "Saved" : "Nothing set"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {THEN_IDEAS.map((idea) => (
          <button key={idea} type="button" className="chip hover:border-primary" onClick={() => setValue(idea)}>
            {idea}
          </button>
        ))}
      </div>
      {save.error && <p className="notice-error">{save.error.message}</p>}
    </section>
  );
}

function CardEditor({ card, student, lessonId }: { card: CardRow; student: StudentRow; lessonId: string }) {
  const queryClient = useQueryClient();
  const [steps, setSteps] = useState<Step[]>(card.steps);
  const [saved, setSaved] = useState(true);
  const lookUp = useServerFn(findPictures);
  const [searching, setSearching] = useState<number | null>(null);
  const [searchNote, setSearchNote] = useState<{ i: number; text: string } | null>(null);

  async function newPictures(i: number) {
    const s = steps[i];
    if (!s) return;
    setSearching(i);
    setSearchNote(null);
    try {
      const { urls } = await lookUp({ data: { text: s.text, keyword: s.icon_keyword } });
      if (urls.length) update(i, { pictogramUrls: urls, pictogramUrl: urls[0] });
      else setSearchNote({ i, text: "No good match found. Try different words, or keep the number." });
    } catch {
      setSearchNote({ i, text: "Couldn't search for pictures right now." });
    } finally {
      setSearching(null);
    }
  }

  const save = useMutation({
    mutationFn: async (next: Step[]) => {
      const renumbered = next.map((s, i) => ({ ...s, n: i + 1 }));
      // A student part-way through keeps their place, even if steps were removed
      const patch: { steps: never; current_step?: number } = { steps: renumbered as unknown as never };
      if (!card.completed_at && card.current_step > renumbered.length - 1) patch.current_step = Math.max(0, renumbered.length - 1);
      const { error } = await supabase.from("lesson_cards").update(patch).eq("id", card.id);
      if (error) throw new Error(error.message);
      return renumbered;
    },
    onSuccess: (renumbered) => {
      setSteps(renumbered);
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["cards", lessonId] });
    },
  });

  function update(i: number, patch: Partial<Step>) {
    setSaved(false);
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function cyclePicture(i: number, dir: 1 | -1) {
    const s = steps[i];
    const urls = s?.pictogramUrls ?? [];
    if (!s || urls.length < 2) return;
    const idx = Math.max(0, urls.indexOf(s.pictogramUrl ?? ""));
    update(i, { pictogramUrl: urls[(idx + dir + urls.length) % urls.length] });
  }

  return (
    <section aria-label={`Cards for ${student.nickname}`} className="space-y-4">
      <p className="text-muted-foreground">
        {student.nickname} will see {steps.length} card{steps.length === 1 ? "" : "s"}
        {student.pictogram_only ? " with pictures only (words are read aloud)" : ""}.
        {steps[0]?.isSummaryCard ? " They've done this routine often, so it's faded to one summary card." : ""}
      </p>
      <ol className="grid gap-4 md:grid-cols-2">
        {steps.map((step, i) => (
          <li key={i}>
            <StepCardView step={step} index={i} total={steps.length} variant="preview" pictogramOnly={student.pictogram_only}>
              <label className="sr-only" htmlFor={`step-${card.id}-${i}`}>Words for step {i + 1}</label>
              <input id={`step-${card.id}-${i}`} className="field" value={step.text} onChange={(e) => update(i, { text: e.target.value })} maxLength={120} />
              <div className="flex flex-wrap justify-center gap-2">
                {(step.pictogramUrls?.length ?? 0) > 1 && (
                  <>
                    <button type="button" className="btn-outline text-sm" onClick={() => cyclePicture(i, -1)}>← Other picture</button>
                    <button type="button" className="btn-outline text-sm" onClick={() => cyclePicture(i, 1)}>Next picture →</button>
                  </>
                )}
                <button type="button" className="btn-ghost text-sm" onClick={() => newPictures(i)} disabled={searching === i}>
                  {searching === i ? "Searching…" : "Find pictures for these words"}
                </button>
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="btn-ghost text-sm"
                    onClick={() => {
                      setSaved(false);
                      setSteps((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                  >
                    Remove step
                  </button>
                )}
              </div>
              {searchNote?.i === i && <p className="notice-info text-sm">{searchNote.text}</p>}
              {!step.isSummaryCard && (
                <div className="flex items-center justify-center gap-2">
                  <label htmlFor={`timer-${card.id}-${i}`} className="text-sm font-bold">
                    Timer
                  </label>
                  <select
                    id={`timer-${card.id}-${i}`}
                    className="field w-auto py-1.5"
                    value={step.timer_seconds ?? 0}
                    onChange={(e) => update(i, { timer_seconds: Number(e.target.value) || null })}
                  >
                    {[...new Set([...TIMER_OPTIONS, step.timer_seconds ?? 0])]
                      .sort((a, b) => a - b)
                      .map((t) => (
                        <option key={t} value={t}>
                          {t === 0 ? "No timer" : formatSeconds(t)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </StepCardView>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-outline" onClick={() => save.mutate(steps)} disabled={saved || save.isPending}>
          {save.isPending ? "Saving…" : saved ? "All changes saved" : `Save changes for ${student.nickname}`}
        </button>
        {save.error && <p className="notice-error">{save.error.message}</p>}
      </div>
    </section>
  );
}

function BoardView({
  lessonId,
  classId,
  live,
  rows,
  joinCode,
  thenActivity,
  title,
  instruction,
}: {
  lessonId: string;
  classId: string;
  live: boolean;
  rows: { card: CardRow; student: StudentRow }[];
  joinCode: string;
  thenActivity: string;
  title: string;
  instruction: string;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: allStudents } = useQuery({ ...studentsQuery(classId), enabled: !!classId });
  const stats = useMemo(() => independence(rows.map((r) => r.card)), [rows]);
  const sorted = [...rows].sort((a, b) => Number(!!b.card.help_step) - Number(!!a.card.help_step));
  const removeFn = useServerFn(deleteLesson);
  const remove = useMutation({
    mutationFn: () => removeFn({ data: { lessonId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", classId] });
      navigate({ to: "/classes/$classId", params: { classId } });
    },
  });
  const genCards = useServerFn(generateMissingCards);
  const generate = useMutation({
    mutationFn: () => genCards({ data: { lessonId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["students", classId] });
    },
  });
  const studentsWithoutCards = (allStudents ?? []).filter((s) => !rows.some((r) => r.student.id === s.id));

  const end = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("lessons").update({ status: "ended", ended_at: new Date().toISOString() }).eq("id", lessonId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lessons", classId] });
    },
  });
  const helped = useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase.from("lesson_cards").update({ help_step: null, help_requested_at: null, help_ack_at: null }).eq("id", cardId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards", lessonId] }),
  });
  // Lets the student see "Your teacher is coming" without anyone else knowing
  const onMyWay = useMutation({
    mutationFn: async (cardId: string) => {
      const { error } = await supabase.from("lesson_cards").update({ help_ack_at: new Date().toISOString() }).eq("id", cardId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cards", lessonId] }),
  });

  return (
    <div className="space-y-6">
      {live && (
        <p className="notice-success text-base">
          <span>
            Cards are live. Students open the Join page and type{" "}
            <strong className="font-display whitespace-nowrap tracking-widest">{formatCode(joinCode)}</strong>. This board updates by itself.
            {thenActivity ? ` After the cards, students see “Now: ${thenActivity}”.` : ""}
          </span>
        </p>
      )}

      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="surface p-4">
          <dt className="text-sm text-muted-foreground">Finished</dt>
          <dd className="font-display text-2xl font-semibold">{stats.routinesFinished} of {rows.length}</dd>
        </div>
        <div className="surface p-4">
          <dt className="text-sm text-muted-foreground">Steps done</dt>
          <dd className="font-display text-2xl font-semibold">{stats.stepsCompleted}</dd>
        </div>
        <div className="surface p-4">
          <dt className="text-sm text-muted-foreground">Done without help</dt>
          <dd className="font-display text-2xl font-semibold">{stats.independentPct === null ? "—" : `${stats.independentPct}%`}</dd>
        </div>
      </dl>

      {studentsWithoutCards.length > 0 && (
        <div className="notice-info flex flex-wrap items-center justify-between gap-3 text-sm">
          <p>
            <strong>{studentsWithoutCards.length} student{studentsWithoutCards.length === 1 ? "" : "s"} don't have cards yet</strong>
            {" "}({studentsWithoutCards.map((s) => s.nickname).join(", ")}).
          </p>
          <button type="button" className="btn-outline text-sm shrink-0" onClick={() => generate.mutate()} disabled={generate.isPending}>
            {generate.isPending ? "Generating…" : "Generate their cards"}
          </button>
          {generate.error && <p className="notice-error w-full">{generate.error.message}</p>}
        </div>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {sorted.map(({ card, student }) => {
          const total = card.steps.length;
          const done = !!card.completed_at;
          const needsHelp = !!card.help_step && !done;
          const pct = total ? Math.round((card.current_step / total) * 100) : 0;
          return (
            <li
              key={card.id}
              className={`surface flex flex-col gap-3 p-5 ${needsHelp ? "border-2 border-help bg-help-soft" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-lg text-primary">
                  {avatarGlyph(student.avatar)}
                </span>
                <p className="flex-1 text-lg font-bold">{student.nickname}</p>
                {done && <span className="chip border-success/40 bg-success-soft text-success-foreground"><span aria-hidden="true">✓</span> Done</span>}
                {!done && card.break_started_at && (
                  <span className="chip"><span aria-hidden="true">☁</span> On a break</span>
                )}
              </div>
              {feelingById(card.feeling) && (
                <p className={`flex items-center gap-2 text-sm ${teacherShouldNotice(card.feeling) ? "font-bold" : "text-muted-foreground"}`}>
                  <img src={feelingImage(feelingById(card.feeling)!.pictogramId)} alt="" width={28} height={28} className="h-7 w-7" />
                  Feeling {feelingById(card.feeling)!.label.toLowerCase()}
                  {teacherShouldNotice(card.feeling) ? " · maybe check in" : ""}
                </p>
              )}
              {needsHelp ? (
                <p className="font-bold text-help-foreground">
                  <span aria-hidden="true">✋ </span>
                  {card.help_ack_at ? `You're on your way · step ${card.help_step}` : `Needs help with step ${card.help_step}`}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  {done ? "All steps finished" : card.current_step === 0 ? "On step 1" : `On step ${card.current_step + 1} of ${total}`}
                </p>
              )}
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={card.current_step} aria-valuemin={0} aria-valuemax={total} aria-label={`${student.nickname}: ${card.current_step} of ${total} steps`}>
                <div className={`h-full rounded-full ${done ? "bg-success" : "bg-primary"}`} style={{ width: `${pct}%` }} />
              </div>
              {card.home_practice_count > 0 && (
                <p className="text-sm text-muted-foreground">
                  <span aria-hidden="true">⌂ </span>Practiced at home {card.home_practice_count === 1 ? "once" : `${card.home_practice_count} times`}
                </p>
              )}
              {needsHelp && live && (
                <div className="flex flex-wrap gap-2">
                  {!card.help_ack_at && (
                    <button type="button" className="btn-outline flex-1" onClick={() => onMyWay.mutate(card.id)} disabled={onMyWay.isPending}>
                      I'm on my way
                    </button>
                  )}
                  <button type="button" className="btn-help flex-1" onClick={() => helped.mutate(card.id)} disabled={helped.isPending}>
                    I've helped {student.nickname}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button type="button" className="btn-outline" aria-expanded={editing} onClick={() => setEditing((e) => !e)}>
          {editing ? "Close editing" : "Change these cards"}
        </button>
        <Link to="/lessons/$lessonId/print" params={{ lessonId }} className="btn-outline">
          Print take-home cards
        </Link>
        {live &&
          (!confirmEnd ? (
            <button type="button" className="btn-secondary" onClick={() => setConfirmEnd(true)}>
              Finish these cards
            </button>
          ) : (
            <span className="flex flex-wrap items-center gap-2">
              <span>Students will see a calm “all done” screen.</span>
              <button type="button" className="btn-primary" onClick={() => end.mutate()} disabled={end.isPending}>
                Yes, finish
              </button>
              <button type="button" className="btn-ghost" onClick={() => setConfirmEnd(false)}>
                Keep going
              </button>
            </span>
          ))}
        <Link to="/classes/$classId" params={{ classId }} className="btn-ghost">
          Give another instruction
        </Link>
      </div>

      {editing && (
        <section aria-labelledby="edit-heading" className="space-y-6">
          <div>
            <h2 id="edit-heading" className="font-display text-2xl font-semibold">Change these cards</h2>
            <p className="mt-1 text-muted-foreground">
              {live
                ? "Changes reach each student's tablet within a few seconds. Students keep their place."
                : "These cards are finished. Changes show in students' finished list and on the take-home sheet."}
            </p>
          </div>
          <LessonDetailsEditor lessonId={lessonId} title={title} instruction={instruction} />
          <StudentCardsEditor lessonId={lessonId} rows={rows} />
          <ThenEditor lessonId={lessonId} initial={thenActivity} />
        </section>
      )}

      <section className="border-t border-border pt-6">
        <h2 className="font-display text-base font-semibold text-destructive">Delete instruction</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently removes this instruction and all student cards. This cannot be undone.
        </p>
        {!confirmDelete ? (
          <button
            type="button"
            className="btn-outline mt-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm"
            onClick={() => setConfirmDelete(true)}
          >
            Delete instruction
          </button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium">Delete <strong>{title}</strong> and all its cards?</p>
            <button
              type="button"
              className="btn-primary bg-destructive hover:bg-destructive/90 text-sm"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {remove.isPending ? "Deleting…" : "Yes, delete permanently"}
            </button>
            <button type="button" className="btn-ghost text-sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
            {remove.error && <p className="notice-error w-full">{remove.error.message}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
