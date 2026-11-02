/**
 * Shared demo school. The demo rows are created once in the database; these
 * constants let the sign-in and join pages offer one-tap demo access.
 * The demo account only ever contains made-up nicknames and lessons.
 */
export const DEMO_TEACHER = {
  email: "demo.teacher@stepcards.app",
  password: "StepCards-demo-2026",
  name: "Ms. Rivera",
  school: "Desert Bloom Academy (demo)",
} as const;

export const DEMO_CLASS_CODES = ["STEP42", "BAKE42", "SKY234"] as const;

export const DEMO_STUDENTS = [
  { nickname: "Leo", about: "Early reader, loves trains and dinosaurs. Pictures on every card." },
  { nickname: "Mia", about: "Confident reader, loves the sea and space. Her morning cards have faded to one." },
] as const;

/** Extra classmates in the demo school — visible in class data but have no one-tap login buttons. */
export const DEMO_CLASSMATES = [
  { nickname: "Cam", reading_level: "grade4" as const, avatar: "rocket" as const },
  { nickname: "Sam", reading_level: "grade2" as const, avatar: "tree" as const },
  { nickname: "Jin", reading_level: "grade6" as const, avatar: "sun" as const },
] as const;

export type DemoStudentName = (typeof DEMO_STUDENTS)[number]["nickname"];

export function isDemoStudentName(value: string): value is DemoStudentName {
  return DEMO_STUDENTS.some((s) => s.nickname === value);
}
