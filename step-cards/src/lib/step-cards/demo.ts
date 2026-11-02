/**
 * Shared demo school constants. The demo rows are created once in the database;
 * these constants let the sign-in and join pages offer one-tap demo access.
 * The demo account only ever contains made-up nicknames and lessons.
 */

// ── Teachers ──────────────────────────────────────────────────────────────────

export const DEMO_TEACHER = {
  email: "demo.teacher@stepcards.app",
  password: "StepCards-demo-2026",
  name: "Ms. Rivera",
  school: "Desert Bloom Academy (demo)",
} as const;

export const DEMO_TEACHER_2 = {
  email: "demo.teacher2@stepcards.app",
  password: "StepCards-demo-2026",
  name: "Mr. Chen",
  school: "Sunrise Learning Center (demo)",
} as const;

// ── Class codes ───────────────────────────────────────────────────────────────

export const DEMO_CLASS_CODES_1 = ["STEP42", "BAKE42", "SKY234"] as const;
export const DEMO_CLASS_CODES_2 = ["COOK42", "ART234", "LIFE42"] as const;
/** All demo class codes across both teachers. */
export const DEMO_CLASS_CODES = [...DEMO_CLASS_CODES_1, ...DEMO_CLASS_CODES_2] as const;

// ── Demo students with one-tap login ──────────────────────────────────────────

export const DEMO_STUDENTS = [
  {
    nickname: "Leo",
    about: "Early reader, loves trains and dinosaurs. Pictures on every card.",
    teacher: "Ms. Rivera" as const,
  },
  {
    nickname: "Mia",
    about: "Confident reader, loves the sea and space. Her morning cards have faded to one.",
    teacher: "Ms. Rivera" as const,
  },
  {
    nickname: "Alex",
    about: "Pictogram learner in Mr. Chen's class. Big bright pictures guide every step.",
    teacher: "Mr. Chen" as const,
  },
  {
    nickname: "River",
    about: "Strong reader, very independent. Art class is their favourite routine.",
    teacher: "Mr. Chen" as const,
  },
] as const;

/** Extra classmates in Ms. Rivera's demo school — visible in class data but have no one-tap login. */
export const DEMO_CLASSMATES_1 = [
  { nickname: "Cam", reading_level: "grade4" as const, avatar: "star" as const },
  { nickname: "Sam", reading_level: "grade2" as const, avatar: "square" as const },
  { nickname: "Jin", reading_level: "grade6" as const, avatar: "sun" as const },
] as const;

/** Extra classmates in Mr. Chen's demo school — visible in class data but have no one-tap login. */
export const DEMO_CLASSMATES_2 = [
  { nickname: "Mel", reading_level: "grade4" as const, avatar: "triangle" as const },
  { nickname: "Kai", reading_level: "grade2" as const, avatar: "heart" as const },
  { nickname: "Fen", reading_level: "grade6" as const, avatar: "circle" as const },
] as const;

export type DemoStudentName = (typeof DEMO_STUDENTS)[number]["nickname"];

export function isDemoStudentName(value: string): value is DemoStudentName {
  return DEMO_STUDENTS.some((s) => s.nickname === value);
}

/** Returns the class codes a given demo student belongs to. */
export function demoClassCodesFor(nickname: DemoStudentName): readonly string[] {
  const s = DEMO_STUDENTS.find((d) => d.nickname === nickname);
  if (!s) return [];
  return s.teacher === "Ms. Rivera" ? DEMO_CLASS_CODES_1 : DEMO_CLASS_CODES_2;
}
