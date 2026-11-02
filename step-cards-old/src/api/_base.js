// AI-generated — reviewed and tested by Naman Dewan
const GROQ_DIRECT = 'https://api.groq.com/openai/v1/chat/completions'
const PROXY_PATH = '/api/chat'

// Extract JSON from model output that may contain reasoning text or markdown fences
function extractJSON(raw) {
  if (!raw || !raw.trim()) throw new Error('Empty response from model')

  // Try direct parse first
  try { return JSON.parse(raw) } catch (_) { /* fall through */ }

  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()) } catch (_) { /* fall through */ }
  }

  // Find the outermost {...} block — works when model wraps JSON in reasoning text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(raw.slice(start, end + 1)) } catch (_) { /* fall through */ }
  }

  throw new Error('Could not extract valid JSON from model response')
}

// Groq's free tier allows 1,000 output tokens per minute for this model and counts max_tokens
// against it up front, so keep max_tokens close to real use (steps JSON is ~150-300 tokens).
const MAX_RETRIES = 3

// Seconds to wait before retrying a 429: the retry-after header, else "try again in 1.92s" in the body
function retryDelay(res, text) {
  const header = Number(res.headers.get('retry-after'))
  if (header > 0) return header
  const match = text.match(/try again in ([\d.]+)s/)
  return match ? Math.ceil(Number(match[1])) : 5
}

export async function callLLM(systemPrompt, userMessage, { temperature = 0.1, maxTokens = 600 } = {}) {
  const isDev = import.meta.env.DEV

  const body = JSON.stringify({
    model: import.meta.env.VITE_LLM_MODEL || 'qwen/qwen3.8-27b',
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      // /no_think disables Qwen3 chain-of-thought reasoning, saving all tokens for the JSON output
      { role: 'user', content: '/no_think ' + (typeof userMessage === 'string' ? userMessage : JSON.stringify(userMessage)) },
    ],
  })

  let res
  for (let attempt = 0; ; attempt++) {
    if (isDev) {
      const key = import.meta.env.VITE_GROQ_API_KEY
      if (!key) throw new Error('VITE_GROQ_API_KEY not set in .env.local')
      res = await fetch(GROQ_DIRECT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body,
      })
    } else {
      res = await fetch(PROXY_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    }
    if (res.ok) break
    const err = await res.text()
    if (res.status !== 429 || attempt >= MAX_RETRIES) {
      throw new Error(`LLM API ${res.status}: ${err}`)
    }
    await new Promise(resolve => setTimeout(resolve, retryDelay(res, err) * 1000))
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content ?? ''
  return extractJSON(raw)
}

export function validateSteps(json) {
  if (!json?.steps || !Array.isArray(json.steps) || json.steps.length === 0) {
    throw new Error('Invalid steps response from LLM')
  }
  return json
}
