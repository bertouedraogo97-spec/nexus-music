export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const KEY = process.env.GROQ_API_KEY;
  if (!KEY) return res.status(500).json({ error: "Clé Groq manquante" });
  const { prompt, system } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt manquant" });
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        messages: [
          { role: "system", content: system || "Tu es NEXUS-MUSIC CORE, une IA musicale créative." },
          { role: "user", content: prompt }
        ],
      }),
    });
    if (!r.ok) { const e = await r.json(); return res.status(r.status).json({ error: e.error?.message || "Erreur Groq" }); }
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
