// groqgok/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'API key not set' });
    return;
  }

  try {
    const groqRes = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: message }],
      }),
    });
    const data = await groqRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Groq API error' });
  }
}
