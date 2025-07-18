"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Package, QrCode, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { DashboardHeader } from "./dashboard-header"
import { useAuth } from "@/components/auth-provider"

export function UserDashboard() {
  const { user, hasPermission } = useAuth()

  const userStats = [
    {
      title: "Moji Radni Nalozi",
      value: "8",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Završeni Danas",
      value: "3",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Na Čekanju",
      value: "2",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Prioritetni",
      value: "1",
      icon: AlertCircle,
      color: "red",
    },
  ]

  const availableModules = [
    {
      id: "ponude",
      name: "Ponude",
      icon: FileText,
      description: "Kreiranje i upravljanje ponudama",
      permission: "ponude",
    },
    {
      id: "radni-nalozi",
      name: "Radni Nalozi",
      icon: Package,
      description: "Pregled i rad sa radnim nalozima",
      permission: "radni-nalozi",
    },
    {
      id: "pilana",
      name: "Pilana",
      icon: QrCode,
      description: "Unos proizvodnje na pilani",
      permission: "pilana",
    },
    {
      id: "dorada",
      name: "Dorada",
      icon: Package,
      description: "Proces dorade proizvoda",
      permission: "dorada",
    },
    {
      id: "prijem-trupaca",
      name: "Prijem trupaca",
      icon: QrCode,
      description: "Unos i evidencija trupaca",
      permission: "prijem-trupaca",
    },
    {
      id: "blagajna",
      name: "Blagajna",
      icon: Package,
      description: "Finansijska evidencija i otpremnice",
      permission: "blagajna",
    },
    {
      id: "izvještaji",
      name: "Izvještaji",
      icon: FileText,
      description: "Prikaz i analiza izvještaja",
      permission: "izvještaji",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dobrodošli, {user?.username}!</h1>
          <p className="text-muted-foreground">Vaš radni prostor za upravljanje proizvodnjom</p>
        </div>

        {/* Korisničke statistike */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dostupni moduli */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableModules.map(
            (module) =>
              hasPermission(module.permission) && (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <module.icon className="h-5 w-5" />
                      {module.name}
                    </CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Otvori {module.name}</Button>
                  </CardContent>
                </Card>
              ),
          )}
        </div>

        {/* Nedavni radni nalozi */}
        <Card>
          <CardHeader>
            <CardTitle>Nedavni Radni Nalozi</CardTitle>
            <CardDescription>Pregled vaših najnovijih radnih naloga</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "RN-2024-001",
                  naziv: "Grede 10x10x300",
                  status: "U obradi",
                  prioritet: "Visok",
                  datum: "15.01.2024",
                },
                {
                  id: "RN-2024-002",
                  naziv: "Daske 2.5x15x400",
                  status: "Na čekanju",
                  prioritet: "Srednji",
                  datum: "14.01.2024",
                },
                {
                  id: "RN-2024-003",
                  naziv: "Fosna 2x10x300",
                  status: "Završen",
                  prioritet: "Nizak",
                  datum: "13.01.2024",
                },
              ].map((nalog) => (
                <div key={nalog.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{nalog.id}</p>
                      <p className="text-sm text-muted-foreground">{nalog.naziv}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        nalog.status === "Završen" ? "default" : nalog.status === "U obradi" ? "secondary" : "outline"
                      }
                    >
                      {nalog.status}
                    </Badge>
                    <Badge
                      variant={
                        nalog.prioritet === "Visok"
                          ? "destructive"
                          : nalog.prioritet === "Srednji"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {nalog.prioritet}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{nalog.datum}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
