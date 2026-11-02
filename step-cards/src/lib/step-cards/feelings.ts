/**
 * Feelings check-in before a set of cards (zones-of-regulation style, kept simple).
 * Faces are one consistent ARASAAC set, checked by hand. A feeling is never
 * judged or scored: it only lets the student take a break first and lets the
 * teacher notice quietly.
 */
export type Feeling = "happy" | "calm" | "worried" | "tired" | "sad" | "cross";
export type FeelingValue = Feeling | "skipped";

export const FEELINGS: { value: Feeling; label: string; pictogramId: number }[] = [
  { value: "happy", label: "Happy", pictogramId: 35533 },
  { value: "calm", label: "Calm", pictogramId: 31310 },
  { value: "tired", label: "Tired", pictogramId: 35537 },
  { value: "worried", label: "Worried", pictogramId: 35535 },
  { value: "sad", label: "Sad", pictogramId: 35545 },
  { value: "cross", label: "Cross", pictogramId: 35539 },
];

export const FEELING_VALUES = ["happy", "calm", "worried", "tired", "sad", "cross", "skipped"] as const;

export function feelingById(value: string | null | undefined) {
  return FEELINGS.find((f) => f.value === value);
}

/** Feelings where the student is offered a calm break before starting. */
export function suggestsBreak(value: string | null | undefined) {
  return value === "worried" || value === "sad" || value === "cross" || value === "tired";
}

/** Feelings the teacher board points out quietly, so an adult can check in. */
export function teacherShouldNotice(value: string | null | undefined) {
  return value === "worried" || value === "sad" || value === "cross";
}

export const feelingImage = (id: number) => `https://api.arasaac.org/v1/pictograms/${id}?color=true`;
