import { FALLBACK_IDS } from '../data/fallbackPictograms'

const ARASAAC_BASE = 'https://api.arasaac.org/v1'
const MAX_VARIATIONS = 3

// Returns an array of up to MAX_VARIATIONS pictogram URLs (minimum 1 item when found).
// Falls back to a single-item array for known keywords in the fallback list.
export async function fetchPictogramUrls(keyword) {
  if (!keyword) return []
  const k = keyword.toLowerCase().trim()
  if (FALLBACK_IDS[k]) return [`${ARASAAC_BASE}/pictograms/${FALLBACK_IDS[k]}?color=true`]
  try {
    const res = await fetch(`${ARASAAC_BASE}/pictograms/en/search/${encodeURIComponent(k)}`)
    if (!res.ok) return []
    const results = await res.json()
    if (!Array.isArray(results) || results.length === 0) return []
    return results
      .slice(0, MAX_VARIATIONS)
      .map(r => `${ARASAAC_BASE}/pictograms/${r._id}?color=true`)
  } catch {
    return []
  }
}

// Legacy single-URL helper kept for backward compatibility.
export async function fetchPictogramUrl(keyword) {
  const urls = await fetchPictogramUrls(keyword)
  return urls[0] ?? null
}

export async function enrichStepsWithPictograms(steps) {
  const urlArrays = await Promise.all(steps.map(s => fetchPictogramUrls(s.icon_keyword)))
  return steps.map((s, i) => ({
    ...s,
    pictogramUrls: urlArrays[i],
    // Keep backward-compat single URL pointing at the first variation
    pictogramUrl: urlArrays[i][0] ?? null,
  }))
}
