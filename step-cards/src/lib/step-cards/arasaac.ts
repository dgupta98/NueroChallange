import { FALLBACK_IDS } from "./data";
import type { Step } from "./types";

const ARASAAC_BASE = "https://api.arasaac.org/v1";
const MAX_VARIATIONS = 3;
/** Only look at the top of each search: ARASAAC search is fuzzy and lower results drift off-topic. */
const RESULTS_PER_QUERY = 25;

const FILLER = new Set(["the", "a", "an", "your", "you", "one's", "ones", "my", "his", "her", "their", "on", "of", "to", "in", "at", "with", "for", "and", "some"]);
const VAGUE_VERBS = new Set(["get", "do", "make", "go", "have", "take", "use", "put", "pick", "up"]);

export interface ArasaacResult {
  _id?: number;
  keywords?: { keyword?: string }[];
}

/** Lower-case words without filler ("Dry the hands" → ["dry", "hands"]). */
export function meaningfulWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z'\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w));
}

function norm(text: string) {
  return meaningfulWords(text).join(" ");
}

/** The searches to run for one step: the keyword, then the step's own verb, then single words. */
export function queriesFor(keyword: string | undefined, stepText = ""): string[] {
  const k = norm(keyword ?? "");
  const verb = meaningfulWords(stepText)[0];
  const out = [k];
  if (verb && !VAGUE_VERBS.has(verb)) out.push(verb);
  out.push(...k.split(" "));
  return [...new Set(out.filter(Boolean))].slice(0, 4);
}

/**
 * Known-good picture for a step, when we have one. Verb + object pairs from the
 * step's own words come first ("Rinse your hands" → "rinse hands"), because a
 * verb alone is ambiguous (rinse a plate, rinse your mouth…).
 */
export function fallbackFor(keyword: string | undefined, stepText = ""): number | undefined {
  const k = norm(keyword ?? "");
  // Skip vague verbs: "Get your hands wet" → ["hands", "wet"]
  const words = meaningfulWords(stepText).filter((w) => !VAGUE_VERBS.has(w));
  const candidates: string[] = [];
  if (k.includes(" ")) candidates.push(k);
  for (let i = 0; i < words.length; i++)
    for (let j = i + 1; j < words.length; j++) candidates.push(`${words[i]} ${words[j]}`, `${words[j]} ${words[i]}`);
  candidates.push(k);
  for (const c of candidates) if (c && FALLBACK_IDS[c]) return FALLBACK_IDS[c];
  return undefined;
}

/**
 * Score one search result against what the step is about. 0 means "not a match":
 * we would rather show the step number than a confusing picture.
 */
export function scoreResult(result: ArasaacResult, keyword: string, verb?: string): number {
  const k = norm(keyword);
  const kWords = k.split(" ").filter(Boolean);
  let best = 0;
  for (const raw of result.keywords ?? []) {
    const kw = norm(raw.keyword ?? "");
    if (!kw) continue;
    const kwWords = kw.split(" ");
    let s = 0;
    if (kw === k) s = 100;
    else if (kWords.length > 1 && kWords.every((w) => kwWords.includes(w))) s = 80 - kwWords.length;
    else if (verb && kw === verb) s = 60;
    else if (kWords.length && kw === kWords[0]) s = 55;
    else if (kWords.includes(kw)) s = 50;
    else if (kWords.length > 1 && kwWords[0] === kWords[0] && kwWords.length <= 3) s = 30;
    if (s > best) best = s;
  }
  return best;
}

/** Pick up to 3 picture IDs from search results, best match first. */
export function rankPictograms(
  resultsByQuery: ArasaacResult[][],
  keyword: string,
  verb?: string,
  context: string[] = [],
): number[] {
  // Word stems from the step and lesson ("hands" → "hand") that make a picture more likely to fit
  const stems = [...new Set(context.map((w) => w.replace(/s$/, "")).filter((w) => w.length >= 4))];
  const scored: { id: number; score: number; order: number }[] = [];
  let order = 0;
  for (const results of resultsByQuery) {
    for (const r of results.slice(0, RESULTS_PER_QUERY)) {
      order += 1;
      if (!r._id) continue;
      let score = scoreResult(r, keyword, verb);
      if (score > 0 && stems.length) {
        const kwWords = (r.keywords ?? []).flatMap((k) => meaningfulWords(k.keyword ?? ""));
        if (kwWords.some((w) => stems.some((st) => w.startsWith(st)))) score += 15;
      }
      if (score > 0) scored.push({ id: r._id, score, order });
    }
  }
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return [...new Set(scored.map((s) => s.id))].slice(0, MAX_VARIATIONS);
}

async function search(query: string): Promise<ArasaacResult[]> {
  try {
    const res = await fetch(`${ARASAAC_BASE}/pictograms/en/search/${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as ArasaacResult[]) : [];
  } catch {
    return [];
  }
}

const url = (id: number) => `${ARASAAC_BASE}/pictograms/${id}?color=true`;

/** Up to 3 pictogram image URLs for a step (empty when nothing fits well). */
export async function fetchPictogramUrls(keyword?: string, stepText = "", context = ""): Promise<string[]> {
  if (!keyword && !stepText) return [];
  const queries = queriesFor(keyword || stepText, stepText);
  const verb = meaningfulWords(stepText)[0];
  const results = await Promise.all(queries.map(search));
  const contextWords = meaningfulWords(`${stepText} ${context}`).filter((w) => w !== verb);
  const ranked = rankPictograms(results, keyword || stepText, verb && !VAGUE_VERBS.has(verb) ? verb : undefined, contextWords);
  const known = fallbackFor(keyword, stepText);
  const ids = known ? [known, ...ranked.filter((id) => id !== known)] : ranked;
  return ids.slice(0, MAX_VARIATIONS).map(url);
}

/** Find pictures for every step. `context` is the lesson title, used to break ties. */
export async function enrichStepsWithPictograms(steps: Step[], context = ""): Promise<Step[]> {
  const urlArrays = await Promise.all(steps.map((s) => fetchPictogramUrls(s.icon_keyword, s.text, context)));
  return steps.map((s, i) => {
    const urls = urlArrays[i] ?? [];
    return { ...s, pictogramUrls: urls, pictogramUrl: urls[0] ?? null };
  });
}
