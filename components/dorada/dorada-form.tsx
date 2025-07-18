"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { logActivityToSupabase } from "@/lib/utils"

export function DoradaForm({ onSuccess, proces }: { onSuccess?: () => void; proces?: any }) {
  const [datum, setDatum] = useState("")
  const [masina, setMasina] = useState("")
  const [radnik, setRadnik] = useState("")
  const [noviPaket, setNoviPaket] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (proces) {
      setDatum(proces.datum ? proces.datum.slice(0, 10) : "")
      setMasina(proces.masina || "")
      setRadnik(proces.radnik || "")
      setNoviPaket(proces.novi_paket || "")
      setStatus(proces.status || "")
    } else {
      setDatum("")
      setMasina("")
      setRadnik("")
      setNoviPaket("")
      setStatus("")
    }
  }, [proces])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    let errorRes
    let actionType = proces && proces.id ? "izmjena" : "kreiranje"
    if (proces && proces.id) {
      // Update
      const { error } = await supabase.from("dorada").update({
        datum,
        masina,
        radnik,
        novi_paket: noviPaket,
        status,
      }).eq("id", proces.id)
      errorRes = error
    } else {
      // Insert
      const { error } = await supabase.from("dorada").insert({
        datum,
        masina,
        radnik,
        novi_paket: noviPaket,
        status,
      })
      errorRes = error
    }
    // Logovanje aktivnosti
    await logActivityToSupabase({
      action: `dorada:${actionType}`,
      user: radnik || "n/a",
      details: { datum, masina, radnik, novi_paket: noviPaket, status },
    })
    setLoading(false)
    if (errorRes) {
      setError("Greška pri spremanju procesa")
    } else {
      if (onSuccess) onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Datum</label>
        <input type="date" value={datum} onChange={e => setDatum(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Mašina</label>
        <input value={masina} onChange={e => setMasina(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Radnik</label>
        <input value={radnik} onChange={e => setRadnik(e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Novi paket</label>
        <input value={noviPaket} onChange={e => setNoviPaket(e.target.value)} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <input value={status} onChange={e => setStatus(e.target.value)} className="input" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (proces ? "Spremanje..." : "Kreiranje...") : (proces ? "Spremi izmjene" : "Kreiraj proces")}
      </button>
    </form>
  )
}
