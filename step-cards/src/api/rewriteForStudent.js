import { callLLM } from './_base.js'

const SYSTEM_PROMPT = `You are an assistive technology system rewriting classroom steps for a specific student's reading level.

READING LEVELS:
- grade2: 1-3 words per step. Verb + noun only. ("Get tray", "Wash hands", "Wait")
- grade4: 4-6 words. Simple sentences. ("Get your tray from the shelf")
- grade6: Return steps unchanged.
- pictogram_only: 1-2 words maximum. Single noun or verb.

RULES:
1. Do NOT change what the step asks. Same action, different words.
2. Do NOT add or remove steps.
3. Do NOT add praise or encouragement.
4. Keep icon_keyword from the original unchanged.
5. Return student_id exactly as received.

Return valid JSON only.
Schema: { "student_id": "string", "steps": [{ "n": 1, "text": "text", "icon_keyword": "keyword" }] }`

export async function rewriteForStudent(baseSteps, student) {
  const userMessage = {
    student_id: student.id,
    reading_level: student.readingLevel,
    steps: baseSteps.steps,
  }
  return callLLM(SYSTEM_PROMPT, userMessage)
}
