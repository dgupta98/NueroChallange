// AI-generated — reviewed and tested by Naman Dewan
// Vercel serverless function: proxies LLM requests to Groq so the API key
// stays server-side and is never exposed to the browser in production.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export default async function handler(req, res) {
  // CORS headers — allow the same origin (Vercel deployment)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const key = process.env.GROQ_API_KEY
  if (!key) {
    res.status(500).json({ error: 'GROQ_API_KEY not configured on server' })
    return
  }

  try {
    const upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await upstream.json()
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(502).json({ error: `Upstream error: ${err.message}` })
  }
}
