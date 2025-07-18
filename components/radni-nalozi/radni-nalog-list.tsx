import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { exportToPDF, exportToExcel, printTable, exportToCSV } from '@/lib/export-helpers'
import { advancedPrint, logPrintActivity } from '@/lib/print-helpers'

export function RadniNalogList({ refresh, onEdit }: { refresh?: number; onEdit?: (nalog: any) => void }) {
  const [nalozi, setNalozi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [localRefresh, setLocalRefresh] = useState(0)

  useEffect(() => {
    const fetchNalozi = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("radni_nalozi").select("*").order("created_at", { ascending: false })
      if (error) {
        setError("Greška pri dohvaćanju radnih naloga")
      } else {
        setNalozi(data || [])
      }
      setLoading(false)
    }
    fetchNalozi()
  }, [refresh, localRefresh])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati ovaj radni nalog?")) return
    const { error } = await supabase.from("radni_nalozi").delete().eq("id", id)
    if (!error) setLocalRefresh(r => r + 1)
    else alert("Greška pri brisanju naloga")
  }

  if (loading) return <div>Učitavanje...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!nalozi.length) return <div>Nema radnih naloga.</div>

  // Dugmad za export i print
  const columns = [
    'broj_naloga',
    'status',
    'created_at',
    'prioritet',
  ]
  const columnLabels = [
    'Broj naloga',
    'Status',
    'Datum',
    'Prioritet',
  ]

  const handleExportPDF = () => {
    exportToPDF({
      data: nalozi,
      columns,
      fileName: 'radni-nalozi.pdf',
      header: 'Izvještaj - Radni nalozi',
    })
  }
  const handleExportExcel = () => {
    exportToExcel({
      data: nalozi,
      columns,
      fileName: 'radni-nalozi.xlsx',
    })
  }
  const handleExportCSV = () => {
    exportToCSV({
      data: nalozi,
      columns,
      columnLabels,
      fileName: 'radni-nalozi.csv',
    })
  }
  const handlePrint = async () => {
    // Generisanje HTML sadržaja za print
    const content = `
      <html>
        <head>
          <title>Radni Nalozi</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Radni Nalozi</h1>
          <table>
            <thead>
              <tr>
                ${columnLabels.map(label => `<th>${label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${nalozi.map(item => `
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
        module: 'radni_nalozi',
        action: 'print_list',
        data: { count: nalozi.length }
      }
    })
    
    // Logovanje aktivnosti
    await logPrintActivity({
      module: 'radni_nalozi',
      action: 'print_list',
      method: result.method,
      jobId: result.jobId,
      user: 'current_user',
      timestamp: new Date(),
      success: result.success,
      details: { count: nalozi.length }
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
      {nalozi.map((nalog) => (
        <div key={nalog.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold">{nalog.broj_naloga}</div>
            <div className="text-sm text-muted-foreground">{nalog.status}</div>
            <div className="text-xs">{nalog.created_at?.slice(0, 10)}</div>
            <div className="text-xs">Prioritet: {nalog.prioritet}</div>
          </div>
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <button onClick={() => handleDelete(nalog.id)} className="ml-4 text-red-600 hover:underline text-sm">Obriši</button>
            <button onClick={() => onEdit && onEdit(nalog)} className="ml-2 text-blue-600 hover:underline text-sm">Uredi</button>
          </div>
        </div>
      ))}
    </div>
  )
} 