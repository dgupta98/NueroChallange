import { useDisplayPrefs, type FontSize } from "@/hooks/use-display-prefs";

const SIZES: { value: FontSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

function Switch({ label, on, onChange, hint }: { label: string; on: boolean; onChange: (on: boolean) => void; hint?: string }) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <span className="text-sm font-bold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
          on ? "border-primary bg-primary" : "border-border-strong bg-secondary"
        }`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-card shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
      </button>
      <span className="text-sm text-muted-foreground">{on ? "On" : "Off"}{hint ? ` · ${hint}` : ""}</span>
    </div>
  );
}

/** Text size + calm mode (and, for students, read-aloud and soft sounds). Shown inline, never as a pop-up. */
export function DisplayControls({ className = "", student = false }: { className?: string; student?: boolean }) {
  const { fontSize, calmMode, readAloud, sounds, setFontSize, setCalmMode, setReadAloud, setSounds } = useDisplayPrefs();
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Text size">
        <span className="text-sm font-bold">Text size</span>
        {SIZES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFontSize(s.value)}
            aria-pressed={fontSize === s.value}
            className={`${fontSize === s.value ? "btn-selected" : "btn-outline"} px-3 text-sm`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <Switch label="Calm colors" on={calmMode} onChange={setCalmMode} />
      {student && (
        <>
          <Switch label="Read each card out loud" on={readAloud} onChange={setReadAloud} />
          <Switch label="Soft sounds" on={sounds} onChange={setSounds} hint="a quiet note when you tap Done" />
        </>
      )}
    </div>
  );
}
