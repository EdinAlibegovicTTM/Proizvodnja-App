"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function PonudaForm({ onSuccess, ponuda }: { onSuccess?: () => void; ponuda?: any }) {
  const [brojPonude, setBrojPonude] = useState("")
  const [kupac, setKupac] = useState("")
  const [status, setStatus] = useState("na-čekanju")
  const [ukupnaCijena, setUkupnaCijena] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (ponuda) {
      setBrojPonude(ponuda.broj_ponude || "")
      setKupac(ponuda.kupac || "")
      setStatus(ponuda.status || "na-čekanju")
      setUkupnaCijena(ponuda.ukupna_cijena ? String(ponuda.ukupna_cijena) : "")
    } else {
      setBrojPonude("")
      setKupac("")
      setStatus("na-čekanju")
      setUkupnaCijena("")
    }
  }, [ponuda])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    let errorRes
    if (ponuda && ponuda.id) {
      // Update
      const { error } = await supabase.from("ponude").update({
        broj_ponude: brojPonude,
        kupac,
        status,
        ukupna_cijena: ukupnaCijena ? Number(ukupnaCijena) : null,
      }).eq("id", ponuda.id)
      errorRes = error
    } else {
      // Insert
      const { error } = await supabase.from("ponude").insert({
        broj_ponude: brojPonude,
        kupac,
        status,
        ukupna_cijena: ukupnaCijena ? Number(ukupnaCijena) : null,
      })
      errorRes = error
    }
    setLoading(false)
    if (errorRes) {
      setError("Greška pri spremanju ponude")
    } else {
      if (onSuccess) onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Broj ponude</label>
        <input value={brojPonude} onChange={e => setBrojPonude(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Kupac</label>
        <input value={kupac} onChange={e => setKupac(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="input">
          <option value="na-čekanju">Na čekanju</option>
          <option value="potvrđena">Potvrđena</option>
          <option value="odbijena">Odbijena</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Ukupna cijena</label>
        <input type="number" value={ukupnaCijena} onChange={e => setUkupnaCijena(e.target.value)} className="input" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (ponuda ? "Spremanje..." : "Kreiranje...") : (ponuda ? "Spremi izmjene" : "Kreiraj ponudu")}
      </button>
    </form>
  )
}
