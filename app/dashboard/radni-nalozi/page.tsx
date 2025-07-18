"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RadniNalogForm } from "@/components/radni-nalozi/radni-nalog-form"
import { RadniNalogList } from "@/components/radni-nalozi/radni-nalog-list"

export default function RadniNaloziPage() {
  const [refreshNalozi, setRefreshNalozi] = useState(0)
  const [selectedNalog, setSelectedNalog] = useState<any>(null)

  const handleNalogSuccess = () => {
    setRefreshNalozi((r) => r + 1)
    setSelectedNalog(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Radni Nalozi</h1>
          <p className="text-muted-foreground">Upravljanje radnim nalozima i praćenje napretka</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <RadniNalogForm onSuccess={handleNalogSuccess} nalog={selectedNalog} />
          </div>
          <div>
            <RadniNalogList refresh={refreshNalozi} onEdit={setSelectedNalog} />
          </div>
        </div>
      </main>
    </div>
  )
}
