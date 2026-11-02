import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type FontSize = "small" | "medium" | "large";

interface Saved {
  fontSize: FontSize;
  calmMode: boolean;
  readAloud: boolean;
  sounds: boolean;
}

interface DisplayPrefs extends Saved {
  setFontSize: (size: FontSize) => void;
  setCalmMode: (on: boolean) => void;
  setReadAloud: (on: boolean) => void;
  setSounds: (on: boolean) => void;
}

const KEY = "stepCards_display_v2";
const DisplayPrefsContext = createContext<DisplayPrefs | null>(null);

export function DisplayPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Saved>({ fontSize: "medium", calmMode: false, readAloud: false, sounds: false });
  const [loaded, setLoaded] = useState(false);

  // Read saved preferences after hydration so server and client HTML match
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Saved>;
      setPrefs((p) => ({
        fontSize: saved.fontSize ?? p.fontSize,
        calmMode: typeof saved.calmMode === "boolean" ? saved.calmMode : p.calmMode,
        readAloud: typeof saved.readAloud === "boolean" ? saved.readAloud : p.readAloud,
        sounds: typeof saved.sounds === "boolean" ? saved.sounds : p.sounds,
      }));
    } catch {
      // ignore unreadable storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-fontsize", prefs.fontSize);
    document.body.setAttribute("data-calm", prefs.calmMode ? "true" : "false");
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      // storage unavailable
    }
  }, [prefs, loaded]);

  const setFontSize = useCallback((fontSize: FontSize) => setPrefs((p) => ({ ...p, fontSize })), []);
  const setCalmMode = useCallback((calmMode: boolean) => setPrefs((p) => ({ ...p, calmMode })), []);
  const setReadAloud = useCallback((readAloud: boolean) => setPrefs((p) => ({ ...p, readAloud })), []);
  const setSounds = useCallback((sounds: boolean) => setPrefs((p) => ({ ...p, sounds })), []);

  return (
    <DisplayPrefsContext.Provider value={{ ...prefs, setFontSize, setCalmMode, setReadAloud, setSounds }}>
      {children}
    </DisplayPrefsContext.Provider>
  );
}

export function useDisplayPrefs() {
  const ctx = useContext(DisplayPrefsContext);
  if (!ctx) throw new Error("useDisplayPrefs must be used inside DisplayPrefsProvider");
  return ctx;
}
