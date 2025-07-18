"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PilanaForm } from "@/components/pilana/pilana-form"
import { PilanaList } from "@/components/pilana/pilana-list"

export default function PilanaPage() {
  const [refreshPaketi, setRefreshPaketi] = useState(0)
  const [selectedPaket, setSelectedPaket] = useState<any>(null)

  const handlePaketSuccess = () => {
    setRefreshPaketi((r) => r + 1)
    setSelectedPaket(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">Pilana - Prorez Proizvoda</h1>
          <p className="text-muted-foreground">Unos proizvodnje na pilani sa QR kod praćenjem</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <PilanaForm onSuccess={handlePaketSuccess} paket={selectedPaket} />
          </div>
          <div>
            <PilanaList refresh={refreshPaketi} onEdit={setSelectedPaket} />
          </div>
        </div>
      </main>
    </div>
  )
}
