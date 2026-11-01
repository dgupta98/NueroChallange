import { FALLBACK_IDS } from '../data/fallbackPictograms'

const ARASAAC_BASE = 'https://api.arasaac.org/v1'

export async function fetchPictogramUrl(keyword) {
  if (!keyword) return null
  const k = keyword.toLowerCase().trim()
  if (FALLBACK_IDS[k]) return `${ARASAAC_BASE}/pictograms/${FALLBACK_IDS[k]}?color=true`
  try {
    const res = await fetch(`${ARASAAC_BASE}/pictograms/en/search/${encodeURIComponent(k)}`)
    if (!res.ok) return null
    const results = await res.json()
    if (!Array.isArray(results) || results.length === 0) return null
    return `${ARASAAC_BASE}/pictograms/${results[0]._id}?color=true`
  } catch {
    return null
  }
}

export async function enrichStepsWithPictograms(steps) {
  const urls = await Promise.all(steps.map(s => fetchPictogramUrl(s.icon_keyword)))
  return steps.map((s, i) => ({ ...s, pictogramUrl: urls[i] }))
}
