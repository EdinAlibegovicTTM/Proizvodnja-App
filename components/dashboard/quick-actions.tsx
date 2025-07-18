"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, QrCode, Users, Package, Calculator } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Nova Ponuda",
      description: "Kreiraj novu ponudu",
      icon: FileText,
      action: () => console.log("Nova ponuda"),
    },
    {
      title: "Radni Nalog",
      description: "Kreiraj radni nalog",
      icon: Package,
      action: () => console.log("Radni nalog"),
    },
    {
      title: "Skeniraj QR",
      description: "Skeniraj QR kod",
      icon: QrCode,
      action: () => console.log("QR skener"),
    },
    {
      title: "Novi Korisnik",
      description: "Dodaj korisnika",
      icon: Users,
      action: () => console.log("Novi korisnik"),
    },
    {
      title: "Blagajna",
      description: "Otvori blagajnu",
      icon: Calculator,
      action: () => console.log("Blagajna"),
    },
    {
      title: "Izvještaj",
      description: "Generiši izvještaj",
      icon: Plus,
      action: () => console.log("Izvještaj"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brze Akcije</CardTitle>
        <CardDescription>Najčešće korišćene funkcije za brži pristup</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col gap-2 p-4 bg-transparent"
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="text-xs font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
