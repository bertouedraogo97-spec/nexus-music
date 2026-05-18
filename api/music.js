export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const KEY = process.env.REPLICATE_API_TOKEN;
  if (!KEY) return res.status(500).json({ error: "Clé manquante" });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt manquant" });
  try {
    const r = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${KEY}` },
      body: JSON.stringify({
        version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
        input: { prompt, duration: 30, output_format: "mp3" }
      }),
    });
    if (!r.ok) { const e = await r.json(); return res.status(r.status).json({ error: e.detail || "Erreur" }); }
    const p = await r.json();
    if (p.status === "succeeded") {
      const url = Array.isArray(p.output) ? p.output[0] : p.output;
      return res.status(200).json({ url });
    }
    return res.status(202).json({ id: p.id });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
