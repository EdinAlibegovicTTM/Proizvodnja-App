"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FileText, QrCode, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatDate, logActivityToSupabase } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface StavkaOtpremnice {
  id: string
  proizvod: string
  kolicina: number
  jedinicaMjere: string
  cijena: number
  ukupno: number
}

interface OtpremnicaFormProps {
  onSuccess?: () => void
}

export function OtpremnicaForm({ onSuccess }: OtpremnicaFormProps) {
  const { toast } = useToast()
  const [datum, setDatum] = useState(new Date())
  const [kupac, setKupac] = useState("")
  const [brojOtpremnice, setBrojOtpremnice] = useState(`OTP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`)
  const [stavke, setStavke] = useState<StavkaOtpremnice[]>([])
  const [saFinansijskimPodatcima, setSaFinansijskimPodatcima] = useState(true)
  const [depozit, setDepozit] = useState(0)
  const [statusNaplate, setStatusNaplate] = useState("isporučeno-nenaplaćeno")
  const [preuzeo, setPreuzeo] = useState("")
  const [prevoznik, setPrevoznik] = useState("")
  const [napomena, setNapomena] = useState("")

  const kupci = [
    "Drvo Export d.o.o.",
    "Gradnja Plus d.o.o.",
    "Mebel Stil d.o.o.",
    "Eurowood d.o.o.",
  ]

  const proizvodi = [
    "Grede 10x10x300",
    "Grede 8x8x250",
    "Daske 2.5x15x400",
    "Daske 3x20x400",
    "Fosna 2x10x300",
  ]

  const dodajStavku = () => {
    const novaStavka: StavkaOtpremnice = {
      id: Date.now().toString(),
      proizvod: "",
      kolicina: 1,
      jedinicaMjere: "kom",
      cijena: 0,
      ukupno: 0,
    }
    setStavke([...stavke, novaStavka])
  }

  const ukloniStavku = (id: string) => {
    setStavke(stavke.filter((s) => s.id !== id))
  }

  const updateStavka = (id: string, field: keyof StavkaOtpremnice, value: any) => {
    setStavke(
      stavke.map((stavka) => {
        if (stavka.id === id) {
          const updatedStavka = { ...stavka, [field]: value }
          if (field === "kolicina" || field === "cijena") {
            updatedStavka.ukupno = updatedStavka.kolicina * updatedStavka.cijena
          }
          return updatedStavka
        }
        return stavka
      }),
    )
  }

  const ukupanIznos = stavke.reduce((sum, stavka) => sum + stavka.ukupno, 0)
  const iznosZaUplatu = ukupanIznos - depozit

  const handleSave = async () => {
    if (!kupac || stavke.length === 0) {
      toast({
        title: "Greška",
        description: "Molimo odaberite kupca i dodajte stavke",
        variant: "destructive",
      })
      return
    }

    // Snimi u Supabase
    const { error } = await supabase.from("otpremnice").insert({
      datum,
      kupac,
      brojOtpremnice,
      stavke,
      saFinansijskimPodatcima,
      depozit,
      statusNaplate,
      preuzeo,
      prevoznik,
      napomena,
      ukupanIznos,
      zaUplatu: iznosZaUplatu,
    })
    // Logovanje aktivnosti
    await logActivityToSupabase({
      action: "otpremnica:kreiranje",
      user: kupac || "n/a",
      details: { datum, brojOtpremnice, stavke, ukupanIznos, zaUplatu: iznosZaUplatu },
    })
    if (error) {
      toast({
        title: "Greška pri snimanju",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Uspjeh",
      description: `Otpremnica ${brojOtpremnice} je kreirana`,
    })

    // Reset forme
    setKupac("")
    setBrojOtpremnice(`OTP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`)
    setStavke([])
    setDepozit(0)
    setPreuzeo("")
    setPrevoznik("")
    setNapomena("")
    if (onSuccess) onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Nova Otpremnica
        </CardTitle>
        <CardDescription>Kreiranje otpremnice na osnovu ponude, radnog naloga ili QR skeniranja</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Osnovni podatci */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Datum</Label>
            <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
              {formatDate(datum)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kupac</Label>
            <Select value={kupac} onValueChange={setKupac}>
              <SelectTrigger>
                <SelectValue placeholder="Odaberite kupca" />
              </SelectTrigger>
              <SelectContent>
                {kupci.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="broj-otpremnice">Broj Otpremnice</Label>
            <Input
              id="broj-otpremnice"
              value={brojOtpremnice}
              onChange={(e) => setBrojOtpremnice(e.target.value)}
              placeholder="OTP-2024-001"
            />
          </div>
        </div>

        {/* Opcije */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="finansijski-podatci"
            checked={saFinansijskimPodatcima}
            onCheckedChange={(checked) => setSaFinansijskimPodatcima(checked as boolean)}
          />
          <Label htmlFor="finansijski-podatci">Uključi finansijske podatke</Label>
        </div>

        <Separator />

        {/* Stavke */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Stavke Otpremnice</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Skeniraj QR
              </Button>
              <Button onClick={dodajStavku}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj Stavku
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {stavke.map((stavka) => (
              <Card key={stavka.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Proizvod</Label>
                    <Select value={stavka.proizvod} onValueChange={(value) => updateStavka(stavka.id, "proizvod", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberite" />
                      </SelectTrigger>
                      <SelectContent>
                        {proizvodi.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Količina</Label>
                    <Input
                      type="number"
                      value={stavka.kolicina}
                      onChange={(e) => updateStavka(stavka.id, "kolicina", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jedinica</Label>
                    <Select
                      value={stavka.jedinicaMjere}
                      onValueChange={(value) => updateStavka(stavka.id, "jedinicaMjere", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kom">kom</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="m²">m²</SelectItem>
                        <SelectItem value="m³">m³</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {saFinansijskimPodatcima && (
                    <>
                      <div className="space-y-2">
                        <Label>Cijena (€)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={stavka.cijena}
                          onChange={(e) => updateStavka(stavka.id, "cijena", Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ukupno</Label>
                        <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                          {formatCurrency(stavka.ukupno)}
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => ukloniStavku(stavka.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Finansijski podaci */}
        {saFinansijskimPodatcima && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depozit">Depozit (€)</Label>
                <Input
                  id="depozit"
                  type="number"
                  step="0.01"
                  value={depozit}
                  onChange={(e) => setDepozit(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Status Naplate</Label>
                <Select value={statusNaplate} onValueChange={setStatusNaplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="naplaćeno">Naplaćeno</SelectItem>
                    <SelectItem value="isporučeno-nenaplaćeno">Isporučeno nenaplaćeno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Ukupan Iznos</p>
                  <p className="text-2xl font-bold">{formatCurrency(ukupanIznos)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Depozit</p>
                  <p className="text-xl font-semibold text-orange-600">{formatCurrency(depozit)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Za Uplatu</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(iznosZaUplatu)}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dodatni podatci */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preuzeo">Preuzeo</Label>
            <Input
              id="preuzeo"
              value={preuzeo}
              onChange={(e) => setPreuzeo(e.target.value)}
              placeholder="Ime i prezime"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prevoznik">Prevoznik</Label>
            <Input
              id="prevoznik"
              value={prevoznik}
              onChange={(e) => setPrevoznik(e.target.value)}
              placeholder="Naziv prevoznika"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="napomena">Napomena</Label>
          <Input
            id="napomena"
            value={napomena}
            onChange={(e) => setNapomena(e.target.value)}
            placeholder="Unesite napomenu"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Sačuvaj Otpremnicu
        </Button>
      </CardContent>
    </Card>
  )
}
