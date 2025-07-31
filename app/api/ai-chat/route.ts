import { NextRequest, NextResponse } from "next/server"
import { askDeepSeek } from "@/lib/deepseek"

export async function POST(req: NextRequest) {
  try {
    const { prompt, system } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: "Nedostaje prompt" }, { status: 400 })
    }
    const answer = await askDeepSeek(prompt, { system })
    return NextResponse.json({ answer })
  } catch {
    return NextResponse.json({ error: "Greška pri obradi zahtjeva" }, { status: 500 })
  }
} 