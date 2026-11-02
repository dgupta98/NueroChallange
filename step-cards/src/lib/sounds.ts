/**
 * Soft, optional sounds made in the browser (no audio files). Off by default;
 * students turn them on in Settings. Quiet sine tones only — no buzzers.
 */
let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, volume = 0.06) {
  const a = audio();
  if (!a) return;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const t = a.currentTime + start;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** A single soft note when a step is done. */
export function playStepDone() {
  tone(660, 0, 0.35);
}

/** Two gentle rising notes when all cards are finished or a timer ends. */
export function playFinished() {
  tone(523, 0, 0.5);
  tone(784, 0.18, 0.7);
}
