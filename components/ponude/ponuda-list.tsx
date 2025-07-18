"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { exportToPDF, exportToExcel, printTable, exportToCSV } from '@/lib/export-helpers'
import { advancedPrint, logPrintActivity } from '@/lib/print-helpers'

export function PonudaList({ refresh, onEdit }: { refresh?: number; onEdit?: (ponuda: any) => void }) {
  const [ponude, setPonude] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [localRefresh, setLocalRefresh] = useState(0)

  useEffect(() => {
    const fetchPonude = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("ponude").select("*").order("datum", { ascending: false })
      if (error) {
        setError("Greška pri dohvaćanju ponuda")
      } else {
        setPonude(data || [])
      }
      setLoading(false)
    }
    fetchPonude()
  }, [refresh, localRefresh])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati ovu ponudu?")) return
    const { error } = await supabase.from("ponude").delete().eq("id", id)
    if (!error) setLocalRefresh(r => r + 1)
    else alert("Greška pri brisanju ponude")
  }

  if (loading) return <div>Učitavanje...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!ponude.length) return <div>Nema ponuda.</div>

  // Dugmad za export i print
  const columns = [
    'broj_ponude',
    'kupac',
    'status',
    'datum',
    'ukupna_cijena',
  ]
  const columnLabels = [
    'Broj ponude',
    'Kupac',
    'Status',
    'Datum',
    'Ukupno (KM)',
  ]

  const handleExportPDF = () => {
    exportToPDF({
      data: ponude,
      columns,
      fileName: 'ponude.pdf',
      header: 'Izvještaj - Ponude',
    })
  }
  const handleExportExcel = () => {
    exportToExcel({
      data: ponude,
      columns,
      fileName: 'ponude.xlsx',
    })
  }
  const handleExportCSV = () => {
    exportToCSV({
      data: ponude,
      columns,
      columnLabels,
      fileName: 'ponude.csv',
    })
  }
  const handlePrint = async () => {
    // Generisanje HTML sadržaja za print
    const content = `
      <html>
        <head>
          <title>Ponude</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Ponude</h1>
          <table>
            <thead>
              <tr>
                ${columnLabels.map(label => `<th>${label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${ponude.map(item => `
                <tr>
                  ${columns.map(col => `<td>${item[col] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    
    // Napredni print s logovanjem
    const result = await advancedPrint(content, {
      context: {
        module: 'ponude',
        action: 'print_list',
        data: { count: ponude.length }
      }
    })
    
    // Logovanje aktivnosti
    await logPrintActivity({
      module: 'ponude',
      action: 'print_list',
      method: result.method,
      jobId: result.jobId,
      user: 'current_user', // Ovde bi se dohvatio stvarni korisnik
      timestamp: new Date(),
      success: result.success,
      details: { count: ponude.length }
    })
    
    if (result.success) {
      console.log(result.message)
    } else {
      console.error(result.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button onClick={handleExportPDF} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export u PDF</button>
        <button onClick={handleExportExcel} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Export u Excel</button>
        <button onClick={handleExportCSV} className="px-3 py-1 bg-yellow-600 text-white rounded text-sm">Export u CSV</button>
        <button onClick={handlePrint} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Printaj</button>
      </div>
      {ponude.map((ponuda) => (
        <div key={ponuda.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold">{ponuda.broj_ponude}</div>
            <div className="text-sm text-muted-foreground">{ponuda.kupac}</div>
            <div className="text-xs text-muted-foreground">{ponuda.status}</div>
            <div className="text-xs">{ponuda.datum?.slice(0, 10)}</div>
          </div>
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <span className="font-semibold">Ukupno:</span> {ponuda.ukupna_cijena ?? "-"} KM
            <button onClick={() => handleDelete(ponuda.id)} className="ml-4 text-red-600 hover:underline text-sm">Obriši</button>
            <button onClick={() => onEdit && onEdit(ponuda)} className="ml-2 text-blue-600 hover:underline text-sm">Uredi</button>
          </div>
        </div>
      ))}
    </div>
  )
}
