export async function askDeepSeek(prompt: string, options?: { system?: string }) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        options?.system ? { role: "system", content: options.system } : null,
        { role: "user", content: prompt },
      ].filter(Boolean),
      stream: false,
    }),
  })
  if (!response.ok) {
    throw new Error("Greška pri komunikaciji sa DeepSeek AI")
  }
  const data = await response.json()
  return data.choices?.[0]?.message?.content || "Nema odgovora."
} 