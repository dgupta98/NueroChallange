import { useCallback, useEffect, useRef, useState } from "react";

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSR(): (new () => SR) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

/** Whether the browser supports speech input; null until known (after hydration). */
export function useSpeechSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(!!getSR()), []);
  return supported;
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SR | null>(null);
  const isSupported = useSpeechSupport() === true;

  const startListening = useCallback(() => {
    const Ctor = getSR();
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      setTranscript(e.results[0]?.[0]?.transcript ?? "");
      setListening(false);
    };
    recognition.onerror = (e) => {
      setError(e.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setError(null);
    recognition.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { transcript, listening, error, isSupported, startListening, stopListening, setTranscript };
}
