"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreditCard, Search, Plus, TrendingUp, TrendingDown, Vault } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OtpremnicaForm } from "@/components/blagajna/otpremnica-form"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/use-supabase"

interface Otpremnica {
  id: string
  brojOtpremnice: string
  kupac: string
  datum: string
  ukupanIznos: number
  depozit: number
  zaUplatu: number
  preuzeo: string
  prevoznik: string
  statusNaplate: string
}

export default function BlagajnaPage() {
  const { user, hasPermission } = useAuth()
  const router = useRouter()
  const supabase = useSupabase()
  
  // Svi hooks moraju biti na početku
  const [activeTab, setActiveTab] = useState("otpremnice")
  const [searchTerm, setSearchTerm] = useState("")
  const [otpremnice, setOtpremnice] = useState<Otpremnica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (!user || !hasPermission("blagajna")) {
      router.push("/dashboard")
    }
  }, [user, hasPermission, router])

  useEffect(() => {
    const fetchOtpremnice = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("otpremnice").select("*").order("datum", { ascending: false })
      if (error) {
        setError("Greška pri dohvaćanju otpremnica")
        setOtpremnice([])
      } else {
        setOtpremnice(data || [])
        setError("")
      }
      setLoading(false)
    }
    fetchOtpremnice()
  }, [refresh, supabase])

  if (!user || !hasPermission("blagajna")) {
    return null // ili prikaz "Nemate pristup ovoj stranici"
  }

  const handleSuccess = () => {
    setRefresh(r => r + 1)
    setActiveTab("otpremnice")
  }

  const blagajnaStavke = [
    {
      id: 1,
      datum: new Date("2024-01-15"),
      tip: "ulaz",
      iznos: 13420.5,
      opis: "Naplaćena otpremnica OTP-2024-001",
      otpremnica: "OTP-2024-001",
    },
    {
      id: 2,
      datum: new Date("2024-01-15"),
      tip: "izlaz",
      iznos: 500.0,
      opis: "Gorivo za vozila",
      kome: "Petrol stanica",
      poNalogu: "Direktor",
      svrha: "Gorivo",
    },
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case "naplaćeno":
        return "Naplaćeno"
      case "isporučeno-nenaplaćeno":
        return "Nenaplaćeno"
      default:
        return status
    }
  }

  const filteredOtpremnice = otpremnice.filter(
    (otp) =>
      otp.brojOtpremnice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      otp.kupac?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Statistike
  const nenaplaceno = otpremnice.filter((o) => o.statusNaplate === "isporučeno-nenaplaćeno").length
  const ukupanUlaz = blagajnaStavke.filter((s) => s.tip === "ulaz").reduce((sum, s) => sum + s.iznos, 0)
  const ukupanIzlaz = blagajnaStavke.filter((s) => s.tip === "izlaz").reduce((sum, s) => sum + s.iznos, 0)
  const stanjeBlagajne = ukupanUlaz - ukupanIzlaz

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Blagajna
          </h1>
          <p className="text-muted-foreground">Finansijsko upravljanje i praćenje transakcija</p>
        </div>

        {/* Pregled stanja */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stanje Blagajne</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stanjeBlagajne)}</div>
              <p className="text-xs text-muted-foreground">Trenutno stanje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ukupan Ulaz</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(ukupanUlaz)}</div>
              <p className="text-xs text-muted-foreground">Ovaj mjesec</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ukupan Izlaz</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(ukupanIzlaz)}</div>
              <p className="text-xs text-muted-foreground">Ovaj mjesec</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nenaplaćeno</CardTitle>
              <Vault className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {nenaplaceno}
              </div>
              <p className="text-xs text-muted-foreground">Otpremnica</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="otpremnice">Otpremnice</TabsTrigger>
              <TabsTrigger value="blagajna">Blagajna</TabsTrigger>
              <TabsTrigger value="sef">Sef</TabsTrigger>
              <TabsTrigger value="izvještaji">Izvještaji</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={() => setActiveTab("otpremnice") /* ili modal za novu otpremnicu */}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Otpremnica
              </Button>
            </div>
          </div>

          <TabsContent value="otpremnice" className="space-y-6">
            {/* Lista otpremnica */}
            <div className="space-y-4">
              {loading ? (
                <div>Učitavanje...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                filteredOtpremnice.map((otpremnica) => (
                  <Card key={otpremnica.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{otpremnica.brojOtpremnice}</CardTitle>
                          <CardDescription>
                            {otpremnica.kupac} • {formatDate(otpremnica.datum)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>
                            {getStatusText(otpremnica.statusNaplate)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Ukupan iznos</p>
                          <p className="text-lg font-semibold">{formatCurrency(otpremnica.ukupanIznos)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Depozit</p>
                          <p className="font-medium">{formatCurrency(otpremnica.depozit)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Za uplatu</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(otpremnica.zaUplatu)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preuzeo</p>
                          <p className="font-medium">{otpremnica.preuzeo}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Prevoznik: {otpremnica.prevoznik}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Pregled</Button>
                          <Button variant="outline" size="sm">Uredi</Button>
                          {otpremnica.statusNaplate === "isporučeno-nenaplaćeno" && (
                            <Button size="sm">Označi kao Naplaćeno</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {/* Nova otpremnica */}
            <OtpremnicaForm onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="blagajna">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* <BlagajnaForm /> */}
              <Card>
                <CardHeader>
                  <CardTitle>Nedavne Transakcije</CardTitle>
                  <CardDescription>Pregled nedavnih stavki blagajne</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blagajnaStavke.map((stavka) => (
                      <div key={stavka.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {stavka.tip === "ulaz" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{stavka.opis}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(stavka.datum)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${stavka.tip === "ulaz" ? "text-green-600" : "text-red-600"}`}>
                            {stavka.tip === "ulaz" ? "+" : "-"}
                            {formatCurrency(stavka.iznos)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sef">
            {/* <SefForm /> */}
            <Card>
              <CardHeader>
                <CardTitle>Sef</CardTitle>
                <CardDescription>Modul za sef nije implementiran.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">Ovdje će biti prikaz sef transakcija i upravljanje sefom.</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="izvještaji">
            <Card>
              <CardHeader>
                <CardTitle>Finansijski Izvještaji</CardTitle>
                <CardDescription>Generiši različite finansijske izvještaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <span>Dnevni Izvještaj</span>
                    <span className="text-xs text-muted-foreground">Dnevne transakcije</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <span>Mjesečni Izvještaj</span>
                    <span className="text-xs text-muted-foreground">Mjesečni pregled</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                    <span>Nenaplaćene Otpremnice</span>
                    <span className="text-xs text-muted-foreground">Lista dugovanja</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
