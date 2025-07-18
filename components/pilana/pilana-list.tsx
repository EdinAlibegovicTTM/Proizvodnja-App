import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { exportToPDF, exportToExcel, printTable, exportToCSV } from '@/lib/export-helpers'
import { advancedPrint, logPrintActivity } from '@/lib/print-helpers'

export function PilanaList({ refresh, onEdit }: { refresh?: number; onEdit?: (paket: any) => void }) {
  const [paketi, setPaketi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [localRefresh, setLocalRefresh] = useState(0)

  useEffect(() => {
    const fetchPaketi = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("pilana").select("*").order("datum", { ascending: false })
      if (error) {
        setError("Greška pri dohvaćanju paketa")
      } else {
        setPaketi(data || [])
      }
      setLoading(false)
    }
    fetchPaketi()
  }, [refresh, localRefresh])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati ovaj paket/prorez?")) return
    const { error } = await supabase.from("pilana").delete().eq("id", id)
    if (!error) setLocalRefresh(r => r + 1)
    else alert("Greška pri brisanju paketa")
  }

  if (loading) return <div>Učitavanje...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!paketi.length) return <div>Nema paketa.</div>

  // Dugmad za export i print
  const columns = [
    'paket_kod',
    'status',
    'datum',
    'korisnik',
  ]
  const columnLabels = [
    'Paket kod',
    'Status',
    'Datum',
    'Korisnik',
  ]

  const handleExportPDF = () => {
    exportToPDF({
      data: paketi,
      columns,
      fileName: 'pilana.pdf',
      header: 'Izvještaj - Pilana',
    })
  }
  const handleExportExcel = () => {
    exportToExcel({
      data: paketi,
      columns,
      fileName: 'pilana.xlsx',
    })
  }
  const handleExportCSV = () => {
    exportToCSV({
      data: paketi,
      columns,
      columnLabels,
      fileName: 'pilana.csv',
    })
  }
  const handlePrint = async () => {
    // Generisanje HTML sadržaja za print
    const content = `
      <html>
        <head>
          <title>Pilana</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Pilana</h1>
          <table>
            <thead>
              <tr>
                ${columnLabels.map(label => `<th>${label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${paketi.map(item => `
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
        module: 'pilana',
        action: 'print_list',
        data: { count: paketi.length }
      }
    })
    
    // Logovanje aktivnosti
    await logPrintActivity({
      module: 'pilana',
      action: 'print_list',
      method: result.method,
      jobId: result.jobId,
      user: 'current_user',
      timestamp: new Date(),
      success: result.success,
      details: { count: paketi.length }
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
      {paketi.map((paket) => (
        <div key={paket.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold">{paket.paket_kod}</div>
            <div className="text-sm text-muted-foreground">{paket.status}</div>
            <div className="text-xs">{paket.datum?.slice(0, 10)}</div>
            <div className="text-xs">Korisnik: {paket.korisnik}</div>
          </div>
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <button onClick={() => handleDelete(paket.id)} className="ml-4 text-red-600 hover:underline text-sm">Obriši</button>
            <button onClick={() => onEdit && onEdit(paket)} className="ml-2 text-blue-600 hover:underline text-sm">Uredi</button>
          </div>
        </div>
      ))}
    </div>
  )
} 