export default async function handler(req, res) {
  // Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const apiKey = (
      process.env.VITE_DEEPSEEK_API_KEY ||
      process.env.DEEPSEEK_API_KEY ||
      'E+eiYNFfE7PTk5MeVjYi4Q=='
    ).trim();

    const targets = [
      'https://api-cdn.deploy.com/api/v1/chat/completions',
      'https://api.deploy.com/api/v1/chat/completions',
    ];

    let lastError = null;

    for (const targetUrl of targets) {
      try {
        const upstreamRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: data.model || 'deepseek-ai/deepseek-v4.1-flash-1017',
            messages: data.messages || [],
            temperature: data.temperature ?? 0.6,
            max_tokens: data.max_tokens ?? 1000,
          }),
        });

        if (upstreamRes.ok) {
          const json = await upstreamRes.json();
          const content =
            json.choices?.[0]?.message?.content ||
            json.choices?.[0]?.message?.reasoning_content ||
            '';
          return res.status(200).json({ text: content, raw: json });
        } else {
          const errText = await upstreamRes.text();
          lastError = `Upstream ${upstreamRes.status}: ${errText}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    return res.status(502).json({ error: lastError || 'Failed to reach AI provider' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
