"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Settings,
  Factory,
  CreditCard,
  BarChart3,
  Package,
  FileText,
  QrCode,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { DashboardHeader } from "./dashboard-header"
import { StatsCard } from "./stats-card"
import { QuickActions } from "./quick-actions"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // Svi hooks moraju biti na početku
  const [selectedModule, setSelectedModule] = useState("overview")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null // ili prikaz "Nemate pristup ovoj stranici"
  }

  // Osnovne statistike
  const stats = [
    {
      title: "Aktivni Radni Nalozi",
      value: "24",
      change: "+12% od prošlog mjeseca",
      icon: FileText,
      trend: "up" as const,
      color: "blue" as const,
    },
    {
      title: "Dnevna Proizvodnja",
      value: "156 m³",
      change: "+8% od prošlog mjeseca",
      icon: TrendingUp,
      trend: "up" as const,
      color: "green" as const,
    },
    {
      title: "Ponude na Čekanju",
      value: "7",
      change: "-3% od prošlog mjeseca",
      icon: Package,
      trend: "down" as const,
      color: "orange" as const,
    },
    {
      title: "Mjesečni Prihod",
      value: "€45,230",
      change: "+15% od prošlog mjeseca",
      icon: CreditCard,
      trend: "up" as const,
      color: "purple" as const,
    },
  ]

  // Moduli
  const modules = [
    {
      id: "users",
      name: "Korisnici",
      description: "Upravljanje korisnicima i dozvolama",
      icon: Users,
      count: 12,
    },
    {
      id: "production",
      name: "Proizvodnja",
      description: "Ponude, radni nalozi, pilana, dorada",
      icon: Factory,
      count: 24,
    },
    {
      id: "treasury",
      name: "Blagajna",
      description: "Finansijsko upravljanje",
      icon: CreditCard,
      count: 8,
    },
    {
      id: "reports",
      name: "Izvještaji",
      description: "Analitika i izvještaji",
      icon: BarChart3,
      count: 15,
    },
    {
      id: "settings",
      name: "Podešavanja",
      description: "Konfiguracija sistema",
      icon: Settings,
    },
    {
      id: "audit",
      name: "Audit Trail",
      description: "Log aktivnosti korisnika",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Dobrodošli u centralni panel za upravljanje sistemom</p>
        </div>

        {/* Statistike */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <Tabs value={selectedModule} onValueChange={setSelectedModule} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Pregled</TabsTrigger>
            <TabsTrigger value="users">Korisnici</TabsTrigger>
            <TabsTrigger value="production">Proizvodnja</TabsTrigger>
            <TabsTrigger value="treasury">Blagajna</TabsTrigger>
            <TabsTrigger value="reports">Izvještaji</TabsTrigger>
            <TabsTrigger value="settings">Podešavanja</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Moduli */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <module.icon className="h-4 w-4" />
                      {module.name}
                    </CardTitle>
                    {module.count && <Badge>{module.count}</Badge>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Brze akcije */}
            <QuickActions />

            {/* Nedavne aktivnosti */}
            <Card>
              <CardHeader>
                <CardTitle>Nedavne Aktivnosti</CardTitle>
                <CardDescription>Pregled najnovijih aktivnosti u sistemu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Nova ponuda kreirana",
                      user: "Marko Petrović",
                      time: "prije 5 minuta",
                      status: "success",
                    },
                    {
                      action: "Radni nalog završen",
                      user: "Ana Jovanović",
                      time: "prije 15 minuta",
                      status: "success",
                    },
                    {
                      action: "Upozorenje - nisko stanje",
                      user: "Sistem",
                      time: "prije 30 minuta",
                      status: "warning",
                    },
                    {
                      action: "Novi korisnik registrovan",
                      user: "Admin",
                      time: "prije 1 sat",
                      status: "info",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {activity.status === "info" && <QrCode className="h-4 w-4 text-blue-500" />}
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Upravljanje Korisnicima</CardTitle>
                <CardDescription>Dodajte i upravljajte korisnicima sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modul za upravljanje korisnicima će biti implementiran ovdje.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle>Proizvodnja</CardTitle>
                <CardDescription>Upravljanje ponudama, radnim nalozima i proizvodnjom</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modul za proizvodnju će biti implementiran ovdje.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treasury">
            <Card>
              <CardHeader>
                <CardTitle>Blagajna</CardTitle>
                <CardDescription>Finansijsko upravljanje i praćenje</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modul za blagajnu će biti implementiran ovdje.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Izvještaji</CardTitle>
                <CardDescription>Generiši i pregledaj izvještaje</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modul za izvještaje će biti implementiran ovdje.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Podešavanja Sistema</CardTitle>
                <CardDescription>Konfigurišite sistem i postavke</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modul za podešavanja će biti implementiran ovdje.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
