import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function PilanaForm({ onSuccess, paket }: { onSuccess?: () => void; paket?: any }) {
  const [paketKod, setPaketKod] = useState("")
  const [datum, setDatum] = useState("")
  const [status, setStatus] = useState("")
  const [korisnik, setKorisnik] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (paket) {
      setPaketKod(paket.paket_kod || "")
      setDatum(paket.datum ? paket.datum.slice(0, 10) : "")
      setStatus(paket.status || "")
      setKorisnik(paket.korisnik || "")
    } else {
      setPaketKod("")
      setDatum("")
      setStatus("")
      setKorisnik("")
    }
  }, [paket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    let errorRes
    if (paket && paket.id) {
      // Update
      const { error } = await supabase.from("pilana").update({
        paket_kod: paketKod,
        datum,
        status,
        korisnik,
      }).eq("id", paket.id)
      errorRes = error
    } else {
      // Insert
      const { error } = await supabase.from("pilana").insert({
        paket_kod: paketKod,
        datum,
        status,
        korisnik,
      })
      errorRes = error
    }
    setLoading(false)
    if (errorRes) {
      setError("Greška pri spremanju paketa")
    } else {
      if (onSuccess) onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Paket kod</label>
        <input value={paketKod} onChange={e => setPaketKod(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Datum</label>
        <input type="date" value={datum} onChange={e => setDatum(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <input value={status} onChange={e => setStatus(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Korisnik</label>
        <input value={korisnik} onChange={e => setKorisnik(e.target.value)} className="input" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (paket ? "Spremanje..." : "Kreiranje...") : (paket ? "Spremi izmjene" : "Kreiraj paket")}
      </button>
    </form>
  )
} 