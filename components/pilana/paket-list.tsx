"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Eye, Edit, QrCode, User, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { exportToPDF, exportToExcel, printTable, exportToCSV } from '@/lib/export-helpers'
import { advancedPrint, logPrintActivity } from '@/lib/print-helpers'

interface Paket {
  id: number
  qrKod: string
  datum: Date
  radniNalog?: string
  status: string
  proizvodi: { naziv: string; kolicina: number }[]
  korisnik: string
}

interface PaketListProps {
  paketi: Paket[]
}

export function PaketList({ paketi }: PaketListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktivan":
        return "default"
      case "završen":
        return "secondary"
      case "na-skladištu":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "aktivan":
        return "Aktivan"
      case "završen":
        return "Završen"
      case "na-skladištu":
        return "Na skladištu"
      default:
        return status
    }
  }

  if (paketi.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nema paketa</h3>
          <p className="text-muted-foreground">Još uvijek nema kreiranih paketa za pilanu.</p>
        </CardContent>
      </Card>
    )
  }

  // Dugmad za export i print
  const columns = [
    'qrKod',
    'datum',
    'radniNalog',
    'status',
    'korisnik',
  ]
  const columnLabels = [
    'QR kod',
    'Datum',
    'Radni nalog',
    'Status',
    'Korisnik',
  ]

  const handleExportPDF = () => {
    exportToPDF({
      data: paketi,
      columns,
      fileName: 'paketi.pdf',
      header: 'Izvještaj - Paketi',
    })
  }
  const handleExportExcel = () => {
    exportToExcel({
      data: paketi,
      columns,
      fileName: 'paketi.xlsx',
    })
  }
  const handleExportCSV = () => {
    exportToCSV({
      data: paketi,
      columns,
      columnLabels,
      fileName: 'paketi.csv',
    })
  }
  const handlePrint = async () => {
    // Generisanje HTML sadržaja za print
    const content = `
      <html>
        <head>
          <title>Paketi</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Paketi</h1>
          <table>
            <thead>
              <tr>
                ${columnLabels.map(label => `<th>${label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${paketi.map(item => `
                <tr>
                  <td>${item.qrKod || ''}</td>
                  <td>${formatDate(item.datum)}</td>
                  <td>${item.radniNalog || ''}</td>
                  <td>${getStatusText(item.status)}</td>
                  <td>${item.korisnik || ''}</td>
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
        module: 'paketi',
        action: 'print_list',
        data: { count: paketi.length }
      }
    })
    
    // Logovanje aktivnosti
    await logPrintActivity({
      module: 'paketi',
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
        <Card key={paket.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {paket.qrKod}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(paket.datum)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {paket.korisnik}
                  </span>
                  {paket.radniNalog && <span>Nalog: {paket.radniNalog}</span>}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(paket.status)}>{getStatusText(paket.status)}</Badge>
                <Button variant="ghost" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Proizvodi u paketu */}
              <div>
                <h4 className="font-medium mb-2">Proizvodi u paketu:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {paket.proizvodi.map((proizvod, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{proizvod.naziv}</span>
                      <Badge variant="outline">{proizvod.kolicina} kom</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Akcije */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Ukupno proizvoda: {paket.proizvodi.reduce((sum, p) => sum + p.kolicina, 0)} kom
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Pregled
                  </Button>
                  {paket.status === "aktivan" && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Uredi
                    </Button>
                  )}
                  {paket.status === "aktivan" && <Button size="sm">Završi Paket</Button>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
