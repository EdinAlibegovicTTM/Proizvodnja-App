"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { TreePine, QrCode, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QRScanner } from "@/components/qr/qr-scanner"
import { PrijemForm } from "@/components/prijem-trupaca/prijem-form"
import { TrupacList } from "@/components/prijem-trupaca/trupac-list"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface Trupac {
  id: number
  qrKod: string
  brojPlocice: string
  bojaPlocice: string
  klasaTrupca: string
  duzinaTrupca: number
  precnikTrupca: number
  m3: number
  datumPrijema: Date
  sumarija: string
  status: string
}

export default function PrijemTrupacaPage() {
  const { user, hasPermission } = useAuth()
  const router = useRouter()

  // Svi hooks moraju biti na početku
  const [activeTab, setActiveTab] = useState("prijem")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [selectedQRData, setSelectedQRData] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [trupci, setTrupci] = useState<Trupac[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!user || !hasPermission("prijem-trupaca")) {
      router.push("/dashboard")
    }
  }, [user, hasPermission, router])

  useEffect(() => {
    const fetchTrupci = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("trupci").select("*").order("datumPrijema", { ascending: false })
      if (error) {
        setError("Greška pri dohvaćanju trupaca")
        setTrupci([])
      } else {
        setTrupci(data || [])
        setError("")
      }
      setLoading(false)
    }
    fetchTrupci()
  }, [refresh])

  if (!user || !hasPermission("prijem-trupaca")) {
    return null // ili prikaz "Nemate pristup ovoj stranici"
  }

  const handleQRScan = (data: string) => {
    setSelectedQRData(data)
    setShowQRScanner(false)
    setActiveTab("prijem")
  }

  const handleSuccess = () => {
    setRefresh(r => r + 1)
    setActiveTab("lista")
  }

  const filteredTrupci = trupci.filter(
    (trupac) =>
      trupac.qrKod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trupac.brojPlocice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trupac.sumarija?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Statistike
  const ukupno = trupci.length
  const ukupnoM3 = trupci.reduce((sum, t) => sum + (t.m3 || 0), 0)
  const uDoradi = trupci.filter((t) => t.status === "u-doradi").length
  const prosjecanPrecnik = trupci.length ? Math.round(trupci.reduce((sum, t) => sum + (t.precnikTrupca || 0), 0) / trupci.length) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TreePine className="h-8 w-8" />
            Prijem Trupaca
          </h1>
          <p className="text-muted-foreground">Unos trupaca sa otpremnice sa kalkulacijom m³</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="prijem">Prijem Trupaca</TabsTrigger>
              <TabsTrigger value="lista">Lista Trupaca</TabsTrigger>
              <TabsTrigger value="prorez">Prorez Trupaca</TabsTrigger>
              <TabsTrigger value="statistike">Statistike</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži trupce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={() => setShowQRScanner(true)}>
                <QrCode className="h-4 w-4 mr-2" />
                Skeniraj QR
              </Button>
            </div>
          </div>
          <TabsContent value="prijem">
            <PrijemForm qrData={selectedQRData} onClearQR={() => setSelectedQRData("")} onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="lista">
            {loading ? (
              <div>Učitavanje...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <TrupacList trupci={filteredTrupci} />
            )}
          </TabsContent>
          <TabsContent value="prorez">
            <Card>
              <CardHeader>
                <CardTitle>Prorez Trupaca</CardTitle>
                <CardDescription>Dnevni rad na pilani sa trupcima</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modul za prorez trupaca će biti implementiran ovdje...</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="statistike">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ukupno Trupaca</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ukupno}</div>
                  <p className="text-sm text-muted-foreground">Na stanju</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ukupno m³</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{ukupnoM3.toFixed(3)}</div>
                  <p className="text-sm text-muted-foreground">Kubni metri</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>U Doradi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{uDoradi}</div>
                  <p className="text-sm text-muted-foreground">Trupaca</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Prosječan Prečnik</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{prosjecanPrecnik}</div>
                  <p className="text-sm text-muted-foreground">cm</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        {/* QR Scanner Modal */}
        {showQRScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
            title="Skeniraj QR Kod Trupca"
            description="Skenirajte QR kod trupca za unos podataka"
          />
        )}
      </main>
    </div>
  )
}
