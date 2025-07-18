"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRGeneratorProps {
  data?: string
  title?: string
  size?: number
}

export function QRGenerator({ data = "", title = "QR Generator", size = 200 }: QRGeneratorProps) {
  const [qrData, setQrData] = useState(data)
  const [generatedQR, setGeneratedQR] = useState("")
  const { toast } = useToast()

  const generateQR = () => {
    if (!qrData.trim()) {
      toast({
        title: "Greška",
        description: "Molimo unesite podatke za QR kod",
        variant: "destructive",
      })
      return
    }

    // U stvarnoj aplikaciji, koristiti pravu QR biblioteku
    const qrCode = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <rect x="20" y="20" width="20" height="20" fill="black"/>
        <rect x="60" y="20" width="20" height="20" fill="black"/>
        <rect x="100" y="20" width="20" height="20" fill="black"/>
        <rect x="140" y="20" width="20" height="20" fill="black"/>
        <rect x="20" y="60" width="20" height="20" fill="black"/>
        <rect x="100" y="60" width="20" height="20" fill="black"/>
        <rect x="20" y="100" width="20" height="20" fill="black"/>
        <rect x="60" y="100" width="20" height="20" fill="black"/>
        <rect x="140" y="100" width="20" height="20" fill="black"/>
        <rect x="20" y="140" width="20" height="20" fill="black"/>
        <rect x="60" y="140" width="20" height="20" fill="black"/>
        <rect x="100" y="140" width="20" height="20" fill="black"/>
        <rect x="140" y="140" width="20" height="20" fill="black"/>
        <text x="${size / 2}" y="${size - 10}" textAnchor="middle" fontSize="8" fill="black">${qrData}</text>
      </svg>
    `)}`

    setGeneratedQR(qrCode)
    toast({
      title: "Uspjeh",
      description: "QR kod je generisan",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData)
    toast({
      title: "Kopirano",
      description: "Podatci su kopirani u clipboard",
    })
  }

  const downloadQR = () => {
    if (!generatedQR) return

    const link = document.createElement("a")
    link.download = `qr-${qrData.replace(/[^a-zA-Z0-9]/g, "_")}.svg`
    link.href = generatedQR
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Generiši QR kod za praćenje</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-data">Podatci za QR kod</Label>
          <div className="flex gap-2">
            <Input
              id="qr-data"
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder="Unesite podatke..."
            />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={generateQR} className="w-full">
          Generiši QR Kod
        </Button>

        {generatedQR && (
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-white rounded-lg border">
              <img src={generatedQR || "/placeholder.svg"} alt="QR Code" className="mx-auto" />
            </div>
            <Button variant="outline" onClick={downloadQR} className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Preuzmi QR Kod
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
