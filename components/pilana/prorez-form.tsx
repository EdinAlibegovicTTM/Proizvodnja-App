"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, Package, QrCode, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

interface StavkaProizvoda {
  id: string
  proizvod: string
  kolicina: number
  radniNalog?: string
  napomena?: string
}

interface ProrezFormProps {
  qrData?: string
  onClearQR?: () => void
}

export function ProrezForm({ qrData, onClearQR }: ProrezFormProps) {
  const { toast } = useToast()
  const [datum, setDatum] = useState(new Date())
  const [qrKodPaketa, setQrKodPaketa] = useState(qrData || "")
  const [akcija, setAkcija] = useState<"nova-stavka" | "ispravka-stavke">("nova-stavka")
  const [stavke, setStavke] = useState<StavkaProizvoda[]>([])
  const [napomena, setNapomena] = useState("")

  // Mock podatci
  const proizvodi = [
    "Grede 10x10x300",
    "Grede 8x8x250",
    "Daske 2.5x15x400",
    "Daske 3x20x400",
    "Fosna 2x10x300",
    "Okorci 2x5x200",
  ]

  const radniNalozi = [
    { id: "RN-2024-001", naziv: "Grede za Drvo Export", proizvodi: ["Grede 10x10x300", "Daske 2.5x15x400"] },
    { id: "RN-2024-002", naziv: "Daske za Gradnja Plus", proizvodi: ["Daske 2.5x15x400"] },
    { id: "RN-2024-003", naziv: "Fosna za Mebel Stil", proizvodi: ["Fosna 2x10x300"] },
  ]

  useEffect(() => {
    if (qrData) {
      setQrKodPaketa(qrData)
      // Simulacija učitavanja postojećih stavki paketa
      if (qrData === "PKT-2024-001") {
        setStavke([
          { id: "1", proizvod: "Grede 10x10x300", kolicina: 25, radniNalog: "RN-2024-001" },
          { id: "2", proizvod: "Daske 2.5x15x400", kolicina: 50, radniNalog: "RN-2024-001" },
        ])
        setAkcija("ispravka-stavke")
      }
    }
  }, [qrData])

  const dodajStavku = () => {
    const novaStavka: StavkaProizvoda = {
      id: Date.now().toString(),
      proizvod: "",
      kolicina: 1,
    }
    setStavke([...stavke, novaStavka])
  }

  const ukloniStavku = (id: string) => {
    setStavke(stavke.filter((s) => s.id !== id))
  }

  const updateStavka = (id: string, field: keyof StavkaProizvoda, value: any) => {
    setStavke(
      stavke.map((stavka) => {
        if (stavka.id === id) {
          const updatedStavka = { ...stavka, [field]: value }

          // Auto-predlog radnih naloga na osnovu proizvoda
          if (field === "proizvod") {
            const predlogNalozi = radniNalozi.filter((rn) => rn.proizvodi.includes(value))
            if (predlogNalozi.length > 0) {
              updatedStavka.radniNalog = predlogNalozi[0].id
            }
          }

          return updatedStavka
        }
        return stavka
      }),
    )
  }

  const handleSave = () => {
    if (!qrKodPaketa || stavke.length === 0) {
      toast({
        title: "Greška",
        description: "Molimo unesite QR kod paketa i dodajte najmanje jednu stavku",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Uspjeh",
      description: `Paket ${qrKodPaketa} je sačuvan sa ${stavke.length} stavki`,
    })

    // Reset forme
    setStavke([])
    setNapomena("")
    if (onClearQR) onClearQR()
    setQrKodPaketa("")
    setAkcija("nova-stavka")
  }

  const zavrsiPaket = () => {
    if (!qrKodPaketa) {
      toast({
        title: "Greška",
        description: "Molimo unesite QR kod paketa",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Paket završen",
      description: `Paket ${qrKodPaketa} je završen i prebačen na skladište`,
    })

    // Reset forme
    setStavke([])
    setNapomena("")
    if (onClearQR) onClearQR()
    setQrKodPaketa("")
    setAkcija("nova-stavka")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Prorez Proizvoda
            </CardTitle>
            <CardDescription>Unos proizvoda u paket sa QR kod praćenjem</CardDescription>
          </div>
          {qrData && onClearQR && (
            <Button variant="outline" onClick={onClearQR}>
              <X className="h-4 w-4 mr-2" />
              Očisti QR
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zaglavlje */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Datum</Label>
            <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">{formatDate(datum)}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-kod">QR Kod Paketa</Label>
            <div className="flex gap-2">
              <Input
                id="qr-kod"
                value={qrKodPaketa}
                onChange={(e) => setQrKodPaketa(e.target.value)}
                placeholder="PKT-2024-001"
              />
              <Button variant="outline" size="icon">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Akcija</Label>
            <Select value={akcija} onValueChange={(value: any) => setAkcija(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nova-stavka">Nova stavka</SelectItem>
                <SelectItem value="ispravka-stavke">Ispravka stavke</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {qrKodPaketa && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <QrCode className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Paket: {qrKodPaketa}</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {akcija === "nova-stavka" ? "Dodavanje novih proizvoda u paket" : "Ispravljanje postojećih stavki paketa"}
            </p>
          </div>
        )}

        <Separator />

        {/* Stavke proizvoda */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Proizvodi u Paketu</h3>
            <Button onClick={dodajStavku}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj Proizvod
            </Button>
          </div>

          <div className="space-y-4">
            {stavke.map((stavka) => (
              <Card key={stavka.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Proizvod</Label>
                    <Select
                      value={stavka.proizvod}
                      onValueChange={(value) => updateStavka(stavka.id, "proizvod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberite proizvod" />
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
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Radni Nalog</Label>
                    <Select
                      value={stavka.radniNalog || ""}
                      onValueChange={(value) => updateStavka(stavka.id, "radniNalog", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberite nalog" />
                      </SelectTrigger>
                      <SelectContent>
                        {radniNalozi
                          .filter((rn) => !stavka.proizvod || rn.proizvodi.includes(stavka.proizvod))
                          .map((rn) => (
                            <SelectItem key={rn.id} value={rn.id}>
                              {rn.id} - {rn.naziv}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Napomena</Label>
                    <Input
                      value={stavka.napomena || ""}
                      onChange={(e) => updateStavka(stavka.id, "napomena", e.target.value)}
                      placeholder="Opciono..."
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => ukloniStavku(stavka.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Predlog radnih naloga */}
                {stavka.proizvod && (
                  <div className="mt-2 flex gap-2">
                    {radniNalozi
                      .filter((rn) => rn.proizvodi.includes(stavka.proizvod))
                      .map((rn) => (
                        <Badge
                          key={rn.id}
                          variant={stavka.radniNalog === rn.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => updateStavka(stavka.id, "radniNalog", rn.id)}
                        >
                          {rn.id}
                        </Badge>
                      ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Napomena */}
        <div className="space-y-2">
          <Label htmlFor="napomena">Napomena</Label>
          <Textarea
            id="napomena"
            value={napomena}
            onChange={(e) => setNapomena(e.target.value)}
            placeholder="Dodatne napomene o paketu..."
            rows={3}
          />
        </div>

        <Separator />

        {/* Akcije */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sačuvaj Stavke
          </Button>
          <Button onClick={zavrsiPaket}>
            <Package className="h-4 w-4 mr-2" />
            Završi Paket
          </Button>
        </div>

        {/* Informacije */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Informacije:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Jedan paket može sadržavati više različitih proizvoda</li>
            <li>• Možete dodati više unosa istog proizvoda</li>
            <li>• Radni nalog se automatski predlaže na osnovu proizvoda</li>
            <li>• Završeni paket se automatski prebacuje na skladište</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
