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
    const r = await fetch("https://api.replicate.com/v1/models/meta/musicgen/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${KEY}`, "Prefer": "wait=60" },
      body: JSON.stringify({ input: { prompt, model_version: "stereo-large", output_format: "mp3", duration: 30, temperature: 1, top_k: 250, top_p: 0, classifier_free_guidance: 3, continuation: false } }),
    });
    if (!r.ok) { const e = await r.json(); return res.status(r.status).json({ error: e.detail || "Erreur" }); }
    const p = await r.json();
    if (p.status === "succeeded") { const url = Array.isArray(p.output) ? p.output[0] : p.output; return res.status(200).json({ url }); }
    return res.status(202).json({ id: p.id });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
