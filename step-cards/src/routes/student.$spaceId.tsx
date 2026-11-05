import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { StepCardView, speak } from "@/components/cards/StepCardView";
import { BreakScreen } from "@/components/student/BreakScreen";
import { BreakOffer, FeelingCheckIn } from "@/components/student/FeelingCheckIn";
import { NowNextLater } from "@/components/student/NowNextLater";
import { ChooseTimer, StepTimer } from "@/components/student/StepTimer";
import { useDisplayPrefs } from "@/hooks/use-display-prefs";
import { playFinished, playStepDone } from "@/lib/sounds";
import { suggestsBreak, type FeelingValue } from "@/lib/step-cards/feelings";
import { StudentTopBar } from "@/components/student/StudentTopBar";
import { getStudentState, leaveDevice, practicedAtHome, setHelpChoice, studentAction } from "@/lib/student.functions";
import { HELP_CHOICES, type HelpChoice } from "@/lib/step-cards/types";
import { StickerBook, StickerImage, StickerPicker } from "@/components/student/Stickers";
import { collectionCounts, findCategory, legacySticker, stickerById } from "@/lib/step-cards/stickers";
import { forgetSpace, loadSpace, updateSpace, type StudentSpace } from "@/lib/step-cards/student-spaces";

export const Route = createFileRoute("/student/$spaceId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My cards — Step Cards" },
      { name: "description", content: "Your step cards, one at a time." },
      { property: "og:title", content: "My cards — Step Cards" },
      { property: "og:description", content: "Your step cards, one at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SpacePage,
});

function SpacePage() {
  const { spaceId } = Route.useParams();
  const [space, setSpace] = useState<StudentSpace | null | undefined>(undefined);
  useEffect(() => setSpace(loadSpace(spaceId)), [spaceId]);

  if (space === undefined) return null;
  if (!space)
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="surface max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">This class isn't on this tablet</h1>
          <p className="mt-2 text-muted-foreground">Go back to your classes, or join with the code from your teacher.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/student" className="btn-primary btn-lg">My classes</Link>
            <Link to="/join" className="btn-outline btn-lg">Join a class</Link>
          </div>
        </div>
      </div>
    );
  return <Space space={space} onTheme={(t) => setSpace({ ...space, stickerTheme: t })} />;
}

type Tab = "cards" | "finished" | "stickers";

function localMidnightIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function Space({ space, onTheme }: { space: StudentSpace; onTheme: (t: string) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchState = useServerFn(getStudentState);
  const act = useServerFn(studentAction);
  const leave = useServerFn(leaveDevice);
  const saveChoice = useServerFn(setHelpChoice);
  const markHome = useServerFn(practicedAtHome);
  const [tab, setTab] = useState<Tab>("cards");
  const { readAloud, sounds } = useDisplayPrefs();
  const [offerBreak, setOfferBreak] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const theme = findCategory(space.stickerTheme).id;
  const [changingSticker, setChangingSticker] = useState(false);
  const [replayStep, setReplayStep] = useState<number | null>(null);
  const since = useMemo(localMidnightIso, []);

  const stateKey = ["student-state", space.token];
  const actionKey = ["student-action", space.token];
  // Pause checking for updates while a tap is being saved, so the card never jumps back
  const saving = useIsMutating({ mutationKey: actionKey }) > 0;
  const { data, error, isLoading } = useQuery({
    queryKey: stateKey,
    queryFn: () => fetchState({ data: { token: space.token, since } }),
    refetchInterval: saving ? false : 3000,
    retry: 1,
  });

  const action = useMutation({
    // Taps are sent one after another so a quick Done then Help me never overlap
    scope: { id: `student-actions-${space.token}` },
    mutationKey: actionKey,
    mutationFn: (vars: {
      cardId: string;
      action: "done" | "help" | "cancel_help" | "break" | "end_break" | "pick_sticker" | "feeling";
      stickerId?: string;
      feeling?: FeelingValue;
    }) =>
      act({ data: { token: space.token, ...vars } }),
    onMutate: async (vars) => {
      // Respond instantly: research says no delay on Done or Help me
      await queryClient.cancelQueries({ queryKey: stateKey });
      const prev = queryClient.getQueryData<typeof data>(stateKey);
      if (prev?.card) {
        const card = { ...prev.card };
        if (vars.action === "done") {
          if (sounds) (card.currentStep + 1 >= card.steps.length ? playFinished : playStepDone)();
          card.currentStep = Math.min(card.currentStep + 1, card.steps.length);
          card.helpStep = null;
          card.helpOnTheWay = false;
          card.completed = card.currentStep >= card.steps.length;
          card.breakStartedAt = null;
        } else if (vars.action === "feeling") {
          card.feeling = vars.feeling ?? null;
        } else if (vars.action === "pick_sticker") {
          card.stickerId = vars.stickerId ?? null;
        } else if (vars.action === "break") {
          card.breakStartedAt = new Date().toISOString();
        } else if (vars.action === "end_break") {
          card.breakStartedAt = null;
        } else if (vars.action === "help") {
          card.helpStep = card.currentStep + 1;
          card.helpOnTheWay = false;
        } else {
          card.helpStep = null;
          card.helpOnTheWay = false;
        }
        queryClient.setQueryData(stateKey, { ...prev, card });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(stateKey, ctx.prev);
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: actionKey }) <= 1) queryClient.invalidateQueries({ queryKey: stateKey });
    },
  });

  const choice = useMutation({
    mutationKey: actionKey,
    mutationFn: (c: HelpChoice) => saveChoice({ data: { token: space.token, choice: c } }),
    onMutate: (c) => {
      const prev = queryClient.getQueryData<typeof data>(stateKey);
      if (prev) queryClient.setQueryData(stateKey, { ...prev, helpChoice: c });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(stateKey, ctx.prev);
    },
  });
  const home = useMutation({
    mutationKey: actionKey,
    mutationFn: (cardId: string) => markHome({ data: { token: space.token, cardId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: stateKey }),
  });

  async function removeFromTablet() {
    await leave({ data: { token: space.token } }).catch(() => undefined);
    forgetSpace(space.id);
    navigate({ to: "/student" });
  }

  const card = data?.card;
  const total = card?.steps.length ?? 0;
  const current = card && !card.completed ? card.steps[card.currentStep] : undefined;
  const next = card && !card.completed ? card.steps[card.currentStep + 1] : undefined;
  // Every finished set has a sticker: the one chosen, or (older cards) one from the favourite book
  const history = (data?.history ?? []).map((h) => ({
    ...h,
    sticker: stickerById(h.stickerId) ?? legacySticker(h.stickerIndex, theme),
  }));
  const counts = collectionCounts(history.map((h) => h.sticker.id));
  const latestSticker = (card?.completed ? stickerById(card.stickerId) : undefined) ?? history[0]?.sticker;
  const workingFor = stickerById(card?.stickerId);
  const showCheckIn = !!card && !card.completed && !card.breakStartedAt && card.currentStep === 0 && !card.feeling;
  const showOffer = !!card && !card.completed && !card.breakStartedAt && offerBreak && !showCheckIn;
  const showPicker =
    !!card && !card.completed && !card.breakStartedAt && !showCheckIn && !showOffer && (changingSticker || (!card.stickerId && card.currentStep === 0));

  // Read each new card out loud when the student has turned that on
  const readText = current?.text;
  useEffect(() => {
    if (readAloud && readText && !showCheckIn && !showPicker && !showOffer && !card?.breakStartedAt) speak(readText);
  }, [readAloud, readText, card?.currentStep, showCheckIn, showPicker, showOffer, card?.breakStartedAt]);

  function pickFeeling(feeling: FeelingValue) {
    if (!card) return;
    if (suggestsBreak(feeling)) setOfferBreak(true);
    action.mutate({ cardId: card.id, action: "feeling", feeling });
  }

  function pickSticker(stickerId: string, categoryId: string) {
    if (!card) return;
    updateSpace(space.id, { stickerTheme: categoryId });
    onTheme(categoryId);
    setChangingSticker(false);
    action.mutate({ cardId: card.id, action: "pick_sticker", stickerId });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "cards", label: "My cards" },
    { id: "finished", label: "Finished" },
    { id: "stickers", label: "Stickers" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <StudentTopBar
        back
        avatar={space.avatar}
        title={space.nickname}
        subtitle={data?.className || space.className}
        settingsExtra={
          !confirmLeave ? (
            <button type="button" className="btn-outline text-sm" onClick={() => setConfirmLeave(true)}>
              Remove this class from the tablet
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Remove {data?.className || space.className} from this tablet?</span>
              <button type="button" className="btn-primary text-sm" onClick={removeFromTablet}>Yes, remove</button>
              <button type="button" className="btn-ghost text-sm" onClick={() => setConfirmLeave(false)}>Keep it</button>
            </div>
          )
        }
      />

      <nav aria-label="Class sections" className="border-b border-border bg-card">
        <div role="tablist" className="mx-auto flex w-full max-w-3xl gap-1 px-4 py-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 ${tab === t.id ? "btn-selected" : "btn-ghost text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
        {isLoading && <p className="text-center text-muted-foreground">Getting your cards…</p>}

        {error && (
          <div className="notice-error flex-col items-start gap-3 text-base">
            <p>{error.message}</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/join" className="btn-outline">Join again</Link>
              <Link to="/student" className="btn-ghost">My classes</Link>
            </div>
          </div>
        )}

        {tab === "cards" && data && (
          <div className="flex flex-1 flex-col justify-center">
            {!card && (
              <div className="text-center">
                <div aria-hidden="true" className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-3xl text-primary">
                  ☾
                </div>
                <h1 className="font-display text-3xl font-semibold">No cards right now</h1>
                <p className="mt-3 text-lg text-muted-foreground">When your teacher sends cards, they will appear here.</p>
                <Link to="/student" className="btn-outline btn-lg mt-6">Back to my classes</Link>
              </div>
            )}

            {card && card.completed && replayStep === null && (
              <div className="text-center">
                {latestSticker ? (
                  <div className="mx-auto mb-6 flex w-fit flex-col items-center gap-2 rounded-2xl bg-success-soft p-4">
                    <StickerImage sticker={latestSticker} size={128} />
                    <p className="font-bold">New sticker: {latestSticker.name}</p>
                  </div>
                ) : (
                  <div aria-hidden="true" className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-soft text-4xl text-success-foreground">
                    ✓
                  </div>
                )}
                <h1 className="font-display text-4xl font-semibold">Done.</h1>
                <p className="mt-3 text-lg text-muted-foreground">{data.lesson?.title} is finished.</p>
                {data.stepsOnOwnToday > 0 && (
                  <p className="mt-2 text-lg">
                    You did {data.stepsOnOwnToday} step{data.stepsOnOwnToday === 1 ? "" : "s"} on your own today.
                  </p>
                )}
                {data.lesson?.thenActivity && (
                  <p className="mx-auto mt-5 max-w-sm rounded-xl border border-primary/30 bg-primary-soft px-5 py-3 text-xl font-bold">
                    Now: {data.lesson.thenActivity}
                  </p>
                )}
                {latestSticker && <p className="sr-only">A new sticker is in your sticker book.</p>}
                <HelpChoicePicker value={data.helpChoice} onChange={(c) => choice.mutate(c)} />
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link to="/student" className="btn-primary btn-lg">Back to my classes</Link>
                  <button type="button" className="btn-outline btn-lg" onClick={() => setTab("stickers")}>
                    See my stickers
                  </button>
                  <button type="button" className="btn-outline btn-lg" onClick={() => setReplayStep(0)}>
                    <span aria-hidden="true">↺</span> Replay steps
                  </button>
                </div>
              </div>
            )}

            {card && card.completed && replayStep !== null && card.steps[replayStep] && (
              <div className="space-y-5">
                <div className="rounded-xl border border-primary/30 bg-primary-soft px-4 py-2 text-center text-sm font-medium text-primary">
                  Reviewing — {data.lesson?.title}
                </div>
                <div>
                  <div
                    className="mx-auto mt-1 flex max-w-sm gap-1.5"
                    role="progressbar"
                    aria-valuenow={replayStep + 1}
                    aria-valuemin={1}
                    aria-valuemax={card.steps.length}
                    aria-label={`Step ${replayStep + 1} of ${card.steps.length}`}
                  >
                    {card.steps.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2.5 flex-1 rounded-full ${i < replayStep ? "bg-success" : i === replayStep ? "bg-primary" : "bg-secondary"}`}
                      />
                    ))}
                  </div>
                </div>
                <StepCardView
                  step={card.steps[replayStep]}
                  index={replayStep}
                  total={card.steps.length}
                  variant="student"
                  pictogramOnly={data.pictogramOnly}
                  active
                >
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn-outline btn-lg flex-1"
                      disabled={replayStep === 0}
                      onClick={() => setReplayStep((s) => Math.max(0, (s ?? 1) - 1))}
                      aria-label="Previous step"
                    >
                      ← Back
                    </button>
                    {replayStep < card.steps.length - 1 ? (
                      <button
                        type="button"
                        className="btn-primary btn-lg flex-1"
                        onClick={() => setReplayStep((s) => (s ?? 0) + 1)}
                        aria-label="Next step"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-success btn-lg flex-1"
                        onClick={() => setReplayStep(null)}
                        aria-label="Finished reviewing"
                      >
                        Done ✓
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-ghost w-full text-muted-foreground"
                    onClick={() => setReplayStep(null)}
                  >
                    ✕ Stop replaying
                  </button>
                </StepCardView>
              </div>
            )}

            {showCheckIn && <FeelingCheckIn saving={action.isPending} onPick={pickFeeling} />}

            {showOffer && card && (
              <BreakOffer
                onBreak={() => {
                  setOfferBreak(false);
                  action.mutate({ cardId: card.id, action: "break" });
                }}
                onStart={() => setOfferBreak(false)}
              />
            )}

            {showPicker && (
              <StickerPicker
                startCategory={theme}
                counts={counts}
                current={card?.stickerId}
                saving={action.isPending}
                onPick={(st, cat) => pickSticker(st.id, cat)}
                onCancel={card?.stickerId ? () => setChangingSticker(false) : undefined}
              />
            )}

            {card && current && card.breakStartedAt && (
              <BreakScreen
                startedAt={card.breakStartedAt}
                saving={action.isPending}
                onReady={() => action.mutate({ cardId: card.id, action: "end_break" })}
              />
            )}

            {card && current && !card.breakStartedAt && !showPicker && !showCheckIn && !showOffer && (
              <div className="space-y-5">
                <div className="flex items-center justify-center gap-3">
                  {workingFor ? (
                    <>
                      <StickerImage sticker={workingFor} size={44} />
                      <p className="text-muted-foreground">
                        Working for: <span className="font-bold text-foreground">{workingFor.name}</span>
                      </p>
                      <button type="button" className="btn-ghost text-sm" onClick={() => setChangingSticker(true)}>
                        Change
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn-ghost text-sm" onClick={() => setChangingSticker(true)}>
                      Pick a sticker to work for
                    </button>
                  )}
                </div>
                <NowNextLater
                  now={current}
                  next={next}
                  index={card.currentStep}
                  pictogramOnly={data.pictogramOnly}
                  later={data.lesson?.thenActivity || (workingFor ? `${workingFor.name} sticker` : "All done")}
                  laterPicture={
                    !data.lesson?.thenActivity && workingFor ? (
                      <StickerImage sticker={workingFor} size={56} />
                    ) : (
                      <span aria-hidden="true" className="text-3xl text-primary">★</span>
                    )
                  }
                />
                <div>
                  <p className="text-center text-lg font-bold">{data.lesson?.title}</p>
                  <div
                    className="mx-auto mt-3 flex max-w-sm gap-1.5"
                    role="progressbar"
                    aria-valuenow={card.currentStep + 1}
                    aria-valuemin={1}
                    aria-valuemax={total}
                    aria-label={`Step ${card.currentStep + 1} of ${total}`}
                  >
                    {card.steps.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2.5 flex-1 rounded-full ${i < card.currentStep ? "bg-success" : i === card.currentStep ? "bg-primary" : "bg-secondary"}`}
                      />
                    ))}
                  </div>
                </div>

                <StepCardView key={card.currentStep} step={current} index={card.currentStep} total={total} variant="student" pictogramOnly={data.pictogramOnly} active>
                  {current.timer_seconds ? (
                    <StepTimer key={`timer-${card.currentStep}`} seconds={current.timer_seconds} />
                  ) : (
                    <ChooseTimer key={`choose-${card.currentStep}`} />
                  )}
                  <button
                    type="button"
                    className="btn-success btn-lg w-full text-xl"
                    onClick={() => action.mutate({ cardId: card.id, action: "done" })}
                    aria-label={`Done with step ${card.currentStep + 1}`}
                  >
                    Done <span aria-hidden="true">✓</span>
                  </button>
                  {card.helpStep ? (
                    <div className="notice-help flex-col items-center gap-2 text-center text-base" role="status">
                      <p className="font-bold">
                        <span aria-hidden="true">✋ </span>
                        {card.helpOnTheWay ? "Your teacher is coming." : "Your teacher knows you'd like help."}
                      </p>
                      <button type="button" className="btn-ghost text-sm" onClick={() => action.mutate({ cardId: card.id, action: "cancel_help" })}>
                        I'm OK now
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="btn-help btn-lg w-full" onClick={() => action.mutate({ cardId: card.id, action: "help" })}>
                      <span aria-hidden="true">✋</span> Help me
                    </button>
                  )}
                  <button type="button" className="btn-ghost w-full text-muted-foreground" onClick={() => action.mutate({ cardId: card.id, action: "break" })}>
                    <span aria-hidden="true">☁</span> I need a break
                  </button>
                </StepCardView>

                <div className="flex flex-wrap justify-center gap-2">
                  <button type="button" className="btn-ghost" aria-expanded={showAll} onClick={() => setShowAll((s) => !s)}>
                    {showAll ? "Hide my steps" : "See all my steps"}
                  </button>
                </div>

                {showAll && (
                  <ol className="space-y-2" aria-label="All steps">
                    {card.steps.map((s, i) => (
                      <li key={i}>
                        <StepCardView step={s} index={i} total={total} variant="compact" done={i < card.currentStep} active={i === card.currentStep} />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {action.error && <p className="notice-error mt-4">{action.error.message}</p>}
          </div>
        )}

        {tab === "finished" && data && (
          <section aria-labelledby="finished-heading">
            <h1 id="finished-heading" className="font-display text-3xl font-semibold">Finished cards</h1>
            <p className="mt-2 text-lg text-muted-foreground">Did you do these steps at home too? Tap “We practiced at home”.</p>
            {home.error && <p className="notice-error mt-3">{home.error.message}</p>}
            {history.length === 0 ? (
              <p className="mt-3 text-lg text-muted-foreground">Cards you finish will be listed here.</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="surface flex flex-wrap items-center gap-4 p-4">
                    <span className="shrink-0 rounded-xl bg-success-soft p-1">
                      <StickerImage sticker={h.sticker} size={48} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold">{h.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {h.steps} step{h.steps === 1 ? "" : "s"} ·{" "}
                        {new Date(h.completedAt).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                        {h.homePracticeCount > 0 ? ` · practiced at home ${h.homePracticeCount === 1 ? "once" : `${h.homePracticeCount} times`}` : ""}
                      </p>
                    </div>
                    {h.homePracticedRecently ? (
                      <span className="chip border-success/40 bg-success-soft text-success-foreground">
                        <span aria-hidden="true">⌂</span> Practiced at home
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn-outline text-sm"
                        onClick={() => home.mutate(h.id)}
                        disabled={home.isPending && home.variables === h.id}
                      >
                        We practiced at home
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "stickers" && data && <StickerBook counts={counts} startCategory={theme} />}
      </main>
    </div>
  );
}

/** The student's own say in how much help their next cards give. */
function HelpChoicePicker({ value, onChange }: { value: HelpChoice; onChange: (c: HelpChoice) => void }) {
  const hint =
    value === "more" ? "Your next cards will show every step." : value === "less" ? "Your next cards may show fewer steps." : "";
  return (
    <fieldset className="mx-auto mt-8 max-w-md text-center">
      <legend className="mx-auto text-lg font-bold">Next time, I'd like…</legend>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {HELP_CHOICES.map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={value === c.value}
            onClick={() => onChange(c.value)}
            className={value === c.value ? "btn-selected" : "btn-outline"}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-6 text-muted-foreground" role="status">{hint}</p>
    </fieldset>
  );
}
