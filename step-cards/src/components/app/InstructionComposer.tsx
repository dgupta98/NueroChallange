import { useEffect, useState } from "react";

import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface Props {
  initialText?: string;
  busy: boolean;
  disabled?: boolean;
  error?: string | null;
  onSubmit: (instruction: string) => void;
}

export function InstructionComposer({ initialText = "", busy, disabled, error, onSubmit }: Props) {
  const { transcript, listening, isSupported, error: micError, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const [text, setText] = useState(initialText);

  useEffect(() => setText(initialText), [initialText]);
  useEffect(() => {
    if (transcript) {
      setText(transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);

  const canSubmit = text.trim().length >= 3 && !busy && !disabled;

  return (
    <form
      className="surface p-6 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit(text.trim());
      }}
    >
      <label htmlFor="instruction" className="font-display text-xl font-semibold">
        Give an instruction
      </label>
      <p className="mt-1 text-muted-foreground">Say it the way you would to the class. Each student gets their own cards to check first.</p>
      <textarea
        id="instruction"
        rows={3}
        className="field mt-4 resize-y py-3"
        placeholder="For example: Get your tray, wash your hands, measure 2 cups of flour, then wait for me."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1500}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isSupported && (
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={listening ? "btn-help" : "btn-outline"}
            aria-pressed={listening}
          >
            <span aria-hidden="true">{listening ? "■" : "🎤"}</span>
            {listening ? "Stop listening" : "Speak instead"}
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {busy ? "Making cards…" : "Make cards"}
        </button>
        {listening && <span className="text-sm text-help-foreground">Listening… speak now.</span>}
      </div>
      {isSupported === false && (
        <p className="mt-3 text-sm text-muted-foreground">Voice input works in Chrome and Edge. You can always type.</p>
      )}
      {micError && <p className="notice-error mt-3">The microphone didn't work ({micError}). You can type the instruction instead.</p>}
      {busy && (
        <p className="notice-info mt-4" role="status">
          Writing steps for each reading level and finding pictures. This usually takes a few seconds.
        </p>
      )}
      {error && <p className="notice-error mt-4" role="alert">{error}</p>}
    </form>
  );
}
