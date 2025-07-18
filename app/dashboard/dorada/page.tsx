"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, QrCode, Search, Play, Pause } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QRScanner } from "@/components/qr/qr-scanner"
import { DoradaForm } from "@/components/dorada/dorada-form"
import { DoradaList } from "@/components/dorada/dorada-list"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DoradaPage() {
  const { user, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !hasPermission("dorada")) {
      router.push("/dashboard")
    }
  }, [user, hasPermission, router])

  if (!user || !hasPermission("dorada")) {
    return null // ili prikaz "Nemate pristup ovoj stranici"
  }

  const [activeTab, setActiveTab] = useState("dorada")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [selectedQRData, setSelectedQRData] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [procesi, setProcesi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [editProces, setEditProces] = useState<any | null>(null)

  useEffect(() => {
    const fetchProcesi = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("dorada").select("*").order("datum", { ascending: false })
      if (error) {
        setError("Greška pri dohvaćanju procesa dorade")
        setProcesi([])
      } else {
        setProcesi(data || [])
        setError("")
      }
      setLoading(false)
    }
    fetchProcesi()
  }, [refresh])

  const handleQRScan = (data: string) => {
    setSelectedQRData(data)
    setShowQRScanner(false)
    setActiveTab("dorada")
  }

  const handleSuccess = () => {
    setRefresh(r => r + 1)
    setEditProces(null)
    setActiveTab("procesi")
  }

  const handleEdit = (proces: any) => {
    setEditProces(proces)
    setActiveTab("dorada")
  }

  const filteredProcesi = procesi.filter(
    (proces) =>
      proces.masina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proces.radnik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proces.novi_paket?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Statistike
  const ukupno = procesi.length
  const aktivni = procesi.filter((p) => p.status === "u-toku").length
  const zavrseni = procesi.filter((p) => p.status === "završen").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Dorada Proizvoda
          </h1>
          <p className="text-muted-foreground">Proces dorade proizvoda na različitim mašinama</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dorada">{editProces ? "Uredi Doradu" : "Nova Dorada"}</TabsTrigger>
              <TabsTrigger value="procesi">Lista Procesa</TabsTrigger>
              <TabsTrigger value="masine">Mašine</TabsTrigger>
              <TabsTrigger value="statistike">Statistike</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži procese..."
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
          <TabsContent value="dorada">
            <DoradaForm
              onSuccess={handleSuccess}
              proces={editProces}
            />
          </TabsContent>
          <TabsContent value="procesi">
            {loading ? (
              <div>Učitavanje...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <DoradaList refresh={refresh} onEdit={handleEdit} />
            )}
          </TabsContent>

          <TabsContent value="masine">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["CML", "Višelisni", "Četverostrana", "Strečerica", "Lakirnica"].map((masina) => (
                <Card key={masina} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {masina}
                    </CardTitle>
                    <CardDescription>Status mašine i trenutni rad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge>
                          {masina === "CML" ? "U radu" : "Slobodna"}
                        </Badge>
                      </div>
                      {masina === "CML" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Radnik:</span>
                            <span>Ana Jovanović</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Početak:</span>
                            <span>08:00</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Paket:</span>
                            <span>DOR-2024-002</span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button>
                          <Play className="h-4 w-4 mr-1" />
                          {masina === "CML" ? "Nastavi" : "Pokreni"}
                        </Button>
                        {masina === "CML" && (
                          <Button>
                            <Pause className="h-4 w-4 mr-1" />
                            Pauza
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistike">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ukupno Procesa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ukupno}</div>
                  <p className="text-sm text-muted-foreground">Danas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aktivni Procesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{aktivni}</div>
                  <p className="text-sm text-muted-foreground">U toku</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Završeni Procesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{zavrseni}</div>
                  <p className="text-sm text-muted-foreground">Kompletno</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Produktivnost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">87%</div>
                  <p className="text-sm text-muted-foreground">Efikasnost mašina</p>
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
            title="Skeniraj QR Kod Sirovine"
            description="Skenirajte QR kod paketa sirovine za doradu"
          />
        )}
      </main>
    </div>
  )
}
