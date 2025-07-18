import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function RadniNalogForm({ onSuccess, nalog }: { onSuccess?: () => void; nalog?: any }) {
  const [brojNaloga, setBrojNaloga] = useState("")
  const [status, setStatus] = useState("na-čekanju")
  const [prioritet, setPrioritet] = useState("srednji")
  const [opis, setOpis] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (nalog) {
      setBrojNaloga(nalog.broj_naloga || "")
      setStatus(nalog.status || "na-čekanju")
      setPrioritet(nalog.prioritet || "srednji")
      setOpis(nalog.opis || "")
    } else {
      setBrojNaloga("")
      setStatus("na-čekanju")
      setPrioritet("srednji")
      setOpis("")
    }
  }, [nalog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    let errorRes
    if (nalog && nalog.id) {
      // Update
      const { error } = await supabase.from("radni_nalozi").update({
        broj_naloga: brojNaloga,
        status,
        prioritet,
        opis,
      }).eq("id", nalog.id)
      errorRes = error
    } else {
      // Insert
      const { error } = await supabase.from("radni_nalozi").insert({
        broj_naloga: brojNaloga,
        status,
        prioritet,
        opis,
      })
      errorRes = error
    }
    setLoading(false)
    if (errorRes) {
      setError("Greška pri spremanju naloga")
    } else {
      if (onSuccess) onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Broj naloga</label>
        <input value={brojNaloga} onChange={e => setBrojNaloga(e.target.value)} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="input">
          <option value="prioritet">Prioritet</option>
          <option value="u-obradi">U obradi</option>
          <option value="na-čekanju">Na čekanju</option>
          <option value="pauzirano">Pauzirano</option>
          <option value="otkazano">Otkazano</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Prioritet</label>
        <select value={prioritet} onChange={e => setPrioritet(e.target.value)} className="input">
          <option value="visok">Visok</option>
          <option value="srednji">Srednji</option>
          <option value="nizak">Nizak</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Opis</label>
        <textarea value={opis} onChange={e => setOpis(e.target.value)} className="input" rows={2} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (nalog ? "Spremanje..." : "Kreiranje...") : (nalog ? "Spremi izmjene" : "Kreiraj nalog")}
      </button>
    </form>
  )
} 