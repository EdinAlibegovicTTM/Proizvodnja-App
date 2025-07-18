"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { TreePine, Save, QrCode, X, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate, calculateVolume } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface PrijemFormProps {
  qrData?: string
  onClearQR?: () => void
  onSuccess?: () => void
}

export function PrijemForm({ qrData, onClearQR, onSuccess }: PrijemFormProps) {
  const { toast } = useToast()

  // Zaglavlje (ne resetuje se)
  const [datumPrijema, setDatumPrijema] = useState(new Date())
  const [sumarija, setSumarija] = useState("Šumarija Banja Luka")
  const [podruznica, setPodruznica] = useState("Podruznica 1")
  const [odjelBroj, setOdjelBroj] = useState("001")
  const [prevoznik, setPrevoznik] = useState("Transport d.o.o.")
  const [brojOtpremnice, setBrojOtpremnice] = useState("OTP-2024-001")

  // Unos trupca
  const [qrKod, setQrKod] = useState(qrData || "")
  const [brojPlocice, setBrojPlocice] = useState("")
  const [bojaPlocice, setBojaPlocice] = useState("")
  const [klasaTrupca, setKlasaTrupca] = useState("")
  const [duzinaTrupca, setDuzinaTrupca] = useState<number>(0)
  const [precnikTrupca, setPrecnikTrupca] = useState<number>(0)
  const [m3, setM3] = useState<number>(0)
  const [brojStavkeOtpremnice, setBrojStavkeOtpremnice] = useState<number>(1)

  // Kontrola tačnosti (opciono)
  const [proveravaTacnost, setProveravaTacnost] = useState(false)
  const [izmjerenaDuzina, setIzmjerenaDuzina] = useState<number>(0)
  const [izmjereniPrecnik, setIzmjereniPrecnik] = useState<number>(0)
  const [izmjereniM3, setIzmjereniM3] = useState<number>(0)
  const [razlikaM3, setRazlikaM3] = useState<number>(0)

  const bojePlocica = ["plava", "crvena", "zelena", "žuta", "bijela", "crna"]
  const klaseTrupaca = ["I", "II", "III", "IV"]

  useEffect(() => {
    if (qrData) {
      setQrKod(qrData)
    }
  }, [qrData])

  // Auto kalkulacija m³
  useEffect(() => {
    if (duzinaTrupca > 0 && precnikTrupca > 0) {
      const volume = calculateVolume(duzinaTrupca, precnikTrupca)
      setM3(Number(volume.toFixed(3)))
    }
  }, [duzinaTrupca, precnikTrupca])

  // Auto kalkulacija izmjerenog m³
  useEffect(() => {
    if (izmjerenaDuzina > 0 && izmjereniPrecnik > 0) {
      const volume = calculateVolume(izmjerenaDuzina, izmjereniPrecnik)
      setIzmjereniM3(Number(volume.toFixed(3)))
    }
  }, [izmjerenaDuzina, izmjereniPrecnik])

  // Kalkulacija razlike
  useEffect(() => {
    if (izmjereniM3 > 0 && m3 > 0) {
      setRazlikaM3(Number((izmjereniM3 - m3).toFixed(3)))
    }
  }, [izmjereniM3, m3])

  const handleSave = async () => {
    if (!qrKod || !brojPlocice || !bojaPlocice || !klasaTrupca || duzinaTrupca <= 0 || precnikTrupca <= 0) {
      toast({
        title: "Greška",
        description: "Molimo popunite sva obavezna polja",
        variant: "destructive",
      })
      return
    }

    // Snimi u Supabase
    const { error } = await supabase.from("trupci").insert({
      qrKod,
      brojPlocice,
      bojaPlocice,
      klasaTrupca,
      duzinaTrupca,
      precnikTrupca,
      m3,
      datumPrijema,
      sumarija,
      podruznica,
      odjelBroj,
      prevoznik,
      brojOtpremnice,
      brojStavkeOtpremnice,
      status: "na-stanju"
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
      description: `Trupac ${qrKod} je snimljen u skladište trupaca`,
    })

    // Reset samo unosa trupca, zaglavlje ostaje
    setQrKod("")
    setBrojPlocice("")
    setBojaPlocice("")
    setKlasaTrupca("")
    setDuzinaTrupca(0)
    setPrecnikTrupca(0)
    setM3(0)
    setBrojStavkeOtpremnice(brojStavkeOtpremnice + 1)
    setProveravaTacnost(false)
    setIzmjerenaDuzina(0)
    setIzmjereniPrecnik(0)
    setIzmjereniM3(0)
    setRazlikaM3(0)
    if (onClearQR) onClearQR()
    if (onSuccess) onSuccess()
  }

  const resetZaglavlje = () => {
    setDatumPrijema(new Date())
    setSumarija("")
    setPodruznica("")
    setOdjelBroj("")
    setPrevoznik("")
    setBrojOtpremnice("")
    setBrojStavkeOtpremnice(1)
    toast({
      title: "Zaglavlje resetovano",
      description: "Zaglavlje forme je resetovano",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Prijem Trupaca
            </CardTitle>
            <CardDescription>Unos trupaca sa otpremnice dobavljača</CardDescription>
          </div>
          <div className="flex gap-2">
            {qrData && onClearQR && (
              <Button variant="outline" onClick={onClearQR}>
                <X className="h-4 w-4 mr-2" />
                Očisti QR
              </Button>
            )}
            <Button variant="outline" onClick={resetZaglavlje}>
              Reset Zaglavlje
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zaglavlje - ne resetuje se */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">Zaglavlje Otpremnice (ne resetuje se)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Datum Prijema</Label>
              <div className="h-10 px-3 py-2 bg-white dark:bg-gray-800 rounded-md flex items-center">
                {formatDate(datumPrijema)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sumarija">Šumarija</Label>
              <Input
                id="sumarija"
                value={sumarija}
                onChange={(e) => setSumarija(e.target.value)}
                placeholder="Šumarija..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="podruznica">Podružnica</Label>
              <Input
                id="podruznica"
                value={podruznica}
                onChange={(e) => setPodruznica(e.target.value)}
                placeholder="Podružnica..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="odjel-broj">Odjel Broj</Label>
              <Input
                id="odjel-broj"
                value={odjelBroj}
                onChange={(e) => setOdjelBroj(e.target.value)}
                placeholder="001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prevoznik">Prevoznik</Label>
              <Input
                id="prevoznik"
                value={prevoznik}
                onChange={(e) => setPrevoznik(e.target.value)}
                placeholder="Prevoznik..."
              />
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
        </div>

        <Separator />

        {/* Unos trupca */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Unos Trupca</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qr-kod">QR Kod Trupca</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-kod"
                  value={qrKod}
                  onChange={(e) => setQrKod(e.target.value)}
                  placeholder="TRP-2024-001"
                />
                <Button variant="outline" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="broj-plocice">Broj Pločice</Label>
              <Input
                id="broj-plocice"
                value={brojPlocice}
                onChange={(e) => setBrojPlocice(e.target.value)}
                placeholder="001"
              />
            </div>

            <div className="space-y-2">
              <Label>Boja Pločice</Label>
              <Select value={bojaPlocice} onValueChange={setBojaPlocice}>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberite boju" />
                </SelectTrigger>
                <SelectContent>
                  {bojePlocica.map((boja) => (
                    <SelectItem key={boja} value={boja}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            boja === "plava"
                              ? "bg-blue-500"
                              : boja === "crvena"
                                ? "bg-red-500"
                                : boja === "zelena"
                                  ? "bg-green-500"
                                  : boja === "žuta"
                                    ? "bg-yellow-500"
                                    : boja === "bijela"
                                      ? "bg-white border-gray-300"
                                      : "bg-black"
                          }`}
                        />
                        {boja}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Klasa Trupca</Label>
              <Select value={klasaTrupca} onValueChange={setKlasaTrupca}>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberite klasu" />
                </SelectTrigger>
                <SelectContent>
                  {klaseTrupaca.map((klasa) => (
                    <SelectItem key={klasa} value={klasa}>
                      Klasa {klasa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duzina">Dužina Trupca (cm)</Label>
              <Input
                id="duzina"
                type="number"
                value={duzinaTrupca || ""}
                onChange={(e) => setDuzinaTrupca(Number(e.target.value))}
                placeholder="300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precnik">Prečnik Trupca (cm)</Label>
              <Input
                id="precnik"
                type="number"
                value={precnikTrupca || ""}
                onChange={(e) => setPrecnikTrupca(Number(e.target.value))}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label>M³ (auto-računa)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{m3}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="broj-stavke">Broj Stavke</Label>
              <Input
                id="broj-stavke"
                type="number"
                value={brojStavkeOtpremnice}
                onChange={(e) => setBrojStavkeOtpremnice(Number(e.target.value))}
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* Kontrola tačnosti */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="proverava-tacnost"
              checked={proveravaTacnost}
              onCheckedChange={(checked) => setProveravaTacnost(checked as boolean)}
            />
            <Label htmlFor="proverava-tacnost">Proverava tačnost podataka</Label>
          </div>

          {proveravaTacnost && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium mb-4 text-yellow-900 dark:text-yellow-100">Kontrola Tačnosti</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="izmjerena-duzina">Izmjerena Dužina (cm)</Label>
                  <Input
                    id="izmjerena-duzina"
                    type="number"
                    value={izmjerenaDuzina || ""}
                    onChange={(e) => setIzmjerenaDuzina(Number(e.target.value))}
                    placeholder="300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="izmjereni-precnik">Izmjereni Prečnik (cm)</Label>
                  <Input
                    id="izmjereni-precnik"
                    type="number"
                    value={izmjereniPrecnik || ""}
                    onChange={(e) => setIzmjereniPrecnik(Number(e.target.value))}
                    placeholder="25"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Izmjereni M³</Label>
                  <div className="h-10 px-3 py-2 bg-white dark:bg-gray-800 rounded-md flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{izmjereniM3}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Razlika M³</Label>
                  <div
                    className={`h-10 px-3 py-2 rounded-md flex items-center gap-2 ${
                      razlikaM3 > 0
                        ? "bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                        : razlikaM3 < 0
                          ? "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                          : "bg-muted"
                    }`}
                  >
                    <span className="font-medium">
                      {razlikaM3 > 0 ? "+" : ""}
                      {razlikaM3}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Akcije */}
        <div className="flex justify-end gap-4">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Snimi Trupac
          </Button>
        </div>

        {/* Informacije */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Informacije:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Zaglavlje se ne resetuje pri unosu svakog trupca</li>
            <li>• M³ se automatski računa na osnovu dužine i prečnika</li>
            <li>• Kontrola tačnosti je opciona za provjeru podataka</li>
            <li>• Trupci se snimaju u skladište trupaca</li>
            <li>• Broj stavke se automatski uvećava</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
