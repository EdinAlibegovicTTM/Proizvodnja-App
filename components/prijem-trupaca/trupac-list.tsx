"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TreePine, Eye, Edit, QrCode, Calendar, Ruler } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { exportToPDF, exportToExcel, printTable, exportToCSV } from '@/lib/export-helpers'
import { advancedPrint, logPrintActivity } from '@/lib/print-helpers'

interface Trupac {
  id: number
  qrKod: string
  brojPlocice: string
  bojaPlocice: string
  klasaTrupca: string
  duzinaTrupca: number
  precnikTrupca: number
  m3: number
  datumPrijema: Date
  sumarija: string
  status: string
}

interface TrupacListProps {
  trupci: Trupac[]
}

export function TrupacList({ trupci }: TrupacListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "na-stanju":
        return "default"
      case "u-doradi":
        return "secondary"
      case "prorezano":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "na-stanju":
        return "Na stanju"
      case "u-doradi":
        return "U doradi"
      case "prorezano":
        return "Prorezano"
      default:
        return status
    }
  }

  const getBojaPlociceColor = (boja: string) => {
    switch (boja) {
      case "plava":
        return "bg-blue-500"
      case "crvena":
        return "bg-red-500"
      case "zelena":
        return "bg-green-500"
      case "žuta":
        return "bg-yellow-500"
      case "bijela":
        return "bg-white border-gray-300"
      case "crna":
        return "bg-black"
      default:
        return "bg-gray-500"
    }
  }

  if (trupci.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nema trupaca</h3>
          <p className="text-muted-foreground">Još uvijek nema unesenih trupaca.</p>
        </CardContent>
      </Card>
    )
  }

  // Dugmad za export i print
  const columns = [
    'qrKod',
    'brojPlocice',
    'bojaPlocice',
    'klasaTrupca',
    'duzinaTrupca',
    'precnikTrupca',
    'm3',
    'datumPrijema',
    'sumarija',
    'status',
  ]
  const columnLabels = [
    'QR kod',
    'Broj pločice',
    'Boja pločice',
    'Klasa',
    'Dužina (cm)',
    'Prečnik (cm)',
    'm³',
    'Datum prijema',
    'Šumarija',
    'Status',
  ]

  const handleExportPDF = () => {
    exportToPDF({
      data: trupci,
      columns,
      fileName: 'trupci.pdf',
      header: 'Izvještaj - Prijem trupaca',
    })
  }
  const handleExportExcel = () => {
    exportToExcel({
      data: trupci,
      columns,
      fileName: 'trupci.xlsx',
    })
  }
  const handleExportCSV = () => {
    exportToCSV({
      data: trupci,
      columns,
      columnLabels,
      fileName: 'trupci.csv',
    })
  }
  const handlePrint = async () => {
    // Generisanje HTML sadržaja za print
    const content = `
      <html>
        <head>
          <title>Prijem Trupaca</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Prijem Trupaca</h1>
          <table>
            <thead>
              <tr>
                ${columnLabels.map(label => `<th>${label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${trupci.map(item => `
                <tr>
                  <td>${item.qrKod || ''}</td>
                  <td>${item.brojPlocice || ''}</td>
                  <td>${item.bojaPlocice || ''}</td>
                  <td>${item.klasaTrupca || ''}</td>
                  <td>${item.duzinaTrupca || ''}</td>
                  <td>${item.precnikTrupca || ''}</td>
                  <td>${item.m3 || ''}</td>
                  <td>${item.datumPrijema ? formatDate(item.datumPrijema) : ''}</td>
                  <td>${item.sumarija || ''}</td>
                  <td>${getStatusText(item.status) || ''}</td>
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
        module: 'prijem_trupaca',
        action: 'print_list',
        data: { count: trupci.length }
      }
    })
    
    // Logovanje aktivnosti
    await logPrintActivity({
      module: 'prijem_trupaca',
      action: 'print_list',
      method: result.method,
      jobId: result.jobId,
      user: 'current_user',
      timestamp: new Date(),
      success: result.success,
      details: { count: trupci.length }
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
      {trupci.map((trupac) => (
        <Card key={trupac.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5" />
                  {trupac.qrKod}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(trupac.datumPrijema)}
                  </span>
                  <span>{trupac.sumarija}</span>
                  <span>Pločica: {trupac.brojPlocice}</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(trupac.status)}>{getStatusText(trupac.status)}</Badge>
                <Button variant="ghost" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Osnovni podatci */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Boja pločice:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border ${getBojaPlociceColor(trupac.bojaPlocice)}`} />
                    <span className="capitalize">{trupac.bojaPlocice}</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Klasa: </span>
                  <Badge variant="outline">Klasa {trupac.klasaTrupca}</Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {trupac.duzinaTrupca}cm × ⌀{trupac.precnikTrupca}cm
                  </span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Zapremina: </span>
                  <span className="font-semibold">{trupac.m3} m³</span>
                </div>
              </div>

              {/* Akcije */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Status: <span className="font-medium">{getStatusText(trupac.status)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Pregled
                  </Button>
                  {trupac.status === "na-stanju" && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Uredi
                    </Button>
                  )}
                  {trupac.status === "na-stanju" && <Button size="sm">Stavi u Doradu</Button>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
