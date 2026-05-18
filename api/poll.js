export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  const KEY = process.env.REPLICATE_API_TOKEN;
  if (!KEY) return res.status(500).json({ error: "Clé manquante" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "ID manquant" });
  try {
    const r = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { "Authorization": `Bearer ${KEY}` },
    });
    const d = await r.json();
    if (d.status === "succeeded") {
      const url = Array.isArray(d.output) ? d.output[0] : d.output;
      return res.status(200).json({ status: "succeeded", url });
    }
    if (d.status === "failed" || d.status === "canceled") {
      return res.status(200).json({ status: "failed", error: d.error || "Échoué" });
    }
    return res.status(200).json({ status: d.status });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
