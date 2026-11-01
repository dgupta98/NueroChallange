const API_BASE = 'https://api.openai.com/v1/chat/completions'

export async function callLLM(systemPrompt, userMessage, { temperature = 0.1, maxTokens = 600 } = {}) {
  const key = import.meta.env.VITE_OPENAI_KEY
  if (!key) throw new Error('VITE_OPENAI_KEY not set in .env')

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_LLM_MODEL || 'gpt-4o-mini',
      temperature,
      response_format: { type: 'json_object' },
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: typeof userMessage === 'string' ? userMessage : JSON.stringify(userMessage) },
      ],
    }),
  })

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
