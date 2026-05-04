// api/lookup.js
// Vercel serverless function — proxies company lookup to Claude API
// Your ANTHROPIC_API_KEY lives here on the server, never exposed to the browser.
//
// Deploy: set ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { companyName } = req.body
  if (!companyName || typeof companyName !== 'string' || companyName.length > 200) {
    return res.status(400).json({ error: 'Invalid company name' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: 'You are a business data assistant. Respond with only a raw JSON object — no markdown, no backticks, no explanation.',
        messages: [{
          role: 'user',
          content: `Using your training knowledge, provide data about the company "${companyName}". Respond with ONLY this JSON object:
{"revenue":null,"employees":null,"industry":null,"financeHeadcount":null,"userCount":null,"countries":null,"entities":null,"currentERP":null,"regulatoryFlags":[],"confidence":"low","notes":""}

Rules:
- revenue: annual revenue USD millions, integer
- employees: total headcount, integer
- industry: e.g. "Financial Services", "Healthcare", "Technology"
- financeHeadcount: ~2-4% of employees, integer
- userCount: ~70% of financeHeadcount, integer
- countries: integer
- entities: estimated legal entities, integer
- currentERP: known ERP system string or null
- regulatoryFlags: array from only: ["SOX (Public Company)","FINRA / SEC (Broker-Dealer)","OCC / Banking","HIPAA"]
- confidence: "high" | "medium" | "low"
- notes: one sentence about the company`
        }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', response.status, err)
      return res.status(502).json({ error: 'Upstream API error' })
    }

    const data = await response.json()
    const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || ''

    // Parse JSON from response
    const clean = text.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim()
    const start = clean.indexOf('{')
    const end   = clean.lastIndexOf('}') + 1
    if (start === -1 || end <= 1) {
      return res.status(200).json(null)
    }

    const parsed = JSON.parse(clean.slice(start, end))
    return res.status(200).json(parsed)

  } catch (err) {
    console.error('Lookup error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
