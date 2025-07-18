"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, FileText, Eye, Edit, QrCode } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PonudaForm } from "@/components/ponude/ponuda-form"
import { formatDate, formatCurrency } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PonudaList } from "@/components/ponude/ponuda-list"

export default function PonudePage() {
  const { user, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !hasPermission("ponude")) {
      router.push("/dashboard")
    }
  }, [user, hasPermission, router])

  if (!user || !hasPermission("ponude")) {
    return null // ili prikaz "Nemate pristup ovoj stranici"
  }

  const [activeTab, setActiveTab] = useState("lista")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPonuda, setSelectedPonuda] = useState<any>(null)
  const [refreshPonude, setRefreshPonude] = useState(0)

  const handlePonudaSuccess = () => {
    setRefreshPonude((r) => r + 1)
    setSelectedPonuda(null)
  }

  // Mock podatci - u stvarnoj aplikaciji iz baze
  const ponude = [
    {
      id: 1,
      brojPonude: "PON-2024-001",
      qrKod: "QR-PON-2024-001",
      datum: new Date("2024-01-15"),
      kupac: { naziv: "Drvo Export d.o.o.", rabat: 5 },
      ukupanIznos: 15420.5,
      status: "potvrđena",
      rokIsporuke: new Date("2024-02-15"),
      stavke: [
        { proizvod: "Grede 10x10x300", kolicina: 50, cijena: 25.5 },
        { proizvod: "Daske 2.5x15x400", kolicina: 100, cijena: 12.75 },
      ],
    },
    {
      id: 2,
      brojPonude: "PON-2024-002",
      qrKod: "QR-PON-2024-002",
      datum: new Date("2024-01-16"),
      kupac: { naziv: "Gradnja Plus d.o.o.", rabat: 3 },
      ukupanIznos: 8750.0,
      status: "na-čekanju",
      rokIsporuke: new Date("2024-02-20"),
      stavke: [{ proizvod: "Fosna 2x10x300", kolicina: 200, cijena: 8.5 }],
    },
    {
      id: 3,
      brojPonude: "PON-2024-003",
      qrKod: "QR-PON-2024-003",
      datum: new Date("2024-01-17"),
      kupac: { naziv: "Mebel Stil d.o.o.", rabat: 8 },
      ukupanIznos: 22100.0,
      status: "odbijena",
      rokIsporuke: new Date("2024-02-10"),
      stavke: [
        { proizvod: "Grede 8x8x250", kolicina: 80, cijena: 18.25 },
        { proizvod: "Daske 3x20x400", kolicina: 120, cijena: 15.5 },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "potvrđena":
        return "default"
      case "na-čekanju":
        return "secondary"
      case "odbijena":
        return "destructive"
      default:
        return "outline"
    }
  }

  const filteredPonude = ponude.filter(
    (ponuda) =>
      ponuda.brojPonude.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ponuda.kupac.naziv.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ponude</h1>
          <p className="text-muted-foreground">Upravljanje ponudama i kreiranje radnih naloga</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="lista">Lista Ponuda</TabsTrigger>
              <TabsTrigger value="nova">Nova Ponuda</TabsTrigger>
              <TabsTrigger value="statistike">Statistike</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži ponude..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={() => setActiveTab("nova")}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ponuda
              </Button>
            </div>
          </div>

          <TabsContent value="lista" className="space-y-6">
            <div className="grid gap-4">
              {filteredPonude.map((ponuda) => (
                <Card key={ponuda.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {ponuda.brojPonude}
                        </CardTitle>
                        <CardDescription>
                          {ponuda.kupac.naziv} • {formatDate(ponuda.datum)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>
                          {ponuda.status.charAt(0).toUpperCase() + ponuda.status.slice(1)}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ukupan iznos</p>
                        <p className="text-lg font-semibold">{formatCurrency(ponuda.ukupanIznos)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rok isporuke</p>
                        <p className="font-medium">{formatDate(ponuda.rokIsporuke)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Stavki</p>
                        <p className="font-medium">{ponuda.stavke.length}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Rabat: {ponuda.kupac.rabat}% • QR: {ponuda.qrKod}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Pregled
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Uredi
                        </Button>
                        {ponuda.status === "potvrđena" && <Button size="sm">Kreiraj Radni Nalog</Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nova">
            <PonudaForm onSuccess={handlePonudaSuccess} ponuda={selectedPonuda} />
          </TabsContent>

          <TabsContent value="statistike">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ukupno Ponuda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ponude.length}</div>
                  <p className="text-sm text-muted-foreground">Ovaj mjesec</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Potvrđene Ponude</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {ponude.filter((p) => p.status === "potvrđena").length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((ponude.filter((p) => p.status === "potvrđena").length / ponude.length) * 100)}%
                    uspješnosti
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ukupna Vrijednost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatCurrency(ponude.reduce((sum, p) => sum + p.ukupanIznos, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">Sve ponude</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
