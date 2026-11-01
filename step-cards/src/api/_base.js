// AI-generated — reviewed and tested by Naman Dewan
const GROQ_DIRECT = 'https://api.groq.com/openai/v1/chat/completions'
const PROXY_PATH = '/api/chat'

export async function callLLM(systemPrompt, userMessage, { temperature = 0.1, maxTokens = 1200 } = {}) {
  const isDev = import.meta.env.DEV

  const body = JSON.stringify({
    model: import.meta.env.VITE_LLM_MODEL || 'openai/gpt-oss-20b',
    temperature,
    response_format: { type: 'json_object' },
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: typeof userMessage === 'string' ? userMessage : JSON.stringify(userMessage) },
    ],
  })

  let res
  if (isDev) {
    const key = import.meta.env.VITE_GROQ_API_KEY
    if (!key) throw new Error('VITE_GROQ_API_KEY not set in .env')
    res = await fetch(GROQ_DIRECT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body,
    })
  } else {
    res = await fetch(PROXY_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  }

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM API ${res.status}: ${err}`)
  }

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}

export function validateSteps(json) {
  if (!json?.steps || !Array.isArray(json.steps) || json.steps.length === 0) {
    throw new Error('Invalid steps response from LLM')
  }
  return json
}
