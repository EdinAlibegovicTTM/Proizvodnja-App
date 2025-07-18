import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import * as XLSX from 'xlsx'

// Tip za podatke: niz objekata (npr. [{ime: '...', prezime: '...'}, ...])
export type ExportData = Array<Record<string, any>>

// PDF export
export async function exportToPDF({
  data,
  columns,
  fileName = 'export.pdf',
  logoUrl,
  header,
  footer,
}: {
  data: ExportData
  columns: string[]
  fileName?: string
  logoUrl?: string
  header?: string
  footer?: string
}) {
  // Dohvati postavke iz localStorage ako nisu proslijeđene
  let settings: any = {}
  if (typeof window !== 'undefined') {
    try { settings = JSON.parse(localStorage.getItem('exportSettings') || '{}') } catch {}
  }
  logoUrl = logoUrl || settings.logoUrl
  header = header || settings.header
  footer = footer || settings.footer

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  const { width, height } = page.getSize()
  let y = height - 40

  // Logo
  if (logoUrl) {
    try {
      const imgBytes = await fetch(logoUrl).then(r => r.arrayBuffer())
      const ext = logoUrl.split('.').pop()?.toLowerCase()
      let img
      if (ext === 'png') img = await pdfDoc.embedPng(imgBytes)
      else img = await pdfDoc.embedJpg(imgBytes)
      page.drawImage(img, { x: 40, y: y - 60, width: 80, height: 60 })
      y -= 70
    } catch {}
  }

  // Header
  if (header) {
    page.drawText(header, { x: 140, y: y, size: 18, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) })
    y -= 30
  }

  // Tabela
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const colWidth = (width - 80) / columns.length
  y -= 20
  // Zaglavlja
  columns.forEach((col, i) => {
    page.drawText(col, { x: 40 + i * colWidth, y, size: 12, font, color: rgb(0,0,0) })
  })
  y -= 18
  // Podaci
  data.forEach(row => {
    columns.forEach((col, i) => {
      const value = row[col] !== undefined ? String(row[col]) : ''
      page.drawText(value, { x: 40 + i * colWidth, y, size: 10, font, color: rgb(0.2,0.2,0.2) })
    })
    y -= 15
    if (y < 60) { y = height - 60; pdfDoc.addPage([595.28, 841.89]) }
  })

  // Footer
  if (footer) {
    page.drawText(footer, { x: 40, y: 30, size: 10, font })
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Excel export
export function exportToExcel({
  data,
  columns,
  fileName = 'export.xlsx',
}: {
  data: ExportData
  columns: string[]
  fileName?: string
}) {
  const wsData = [columns, ...data.map(row => columns.map(col => row[col]))]
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Podaci')
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// CSV export
export function exportToCSV({
  data,
  columns,
  columnLabels,
  fileName = 'export.csv',
}: {
  data: ExportData
  columns: string[]
  columnLabels: string[]
  fileName?: string
}) {
  const rows = [columnLabels]
  data.forEach(row => {
    rows.push(columns.map(col => {
      let val = row[col]
      if (val === undefined || val === null) return ''
      val = String(val)
      // Escape CSV specijalne znakove
      if (val.includes('"') || val.includes(',') || val.includes('\n')) {
        val = '"' + val.replace(/"/g, '""') + '"'
      }
      return val
    }))
  })
  const csv = rows.map(r => r.join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Print helper - otvara novi prozor s tabelom i pokreće print preview
export function printTable({ data, columns, columnLabels, title }: {
  data: ExportData
  columns: string[]
  columnLabels: string[]
  title?: string
}) {
  // Dohvati postavke iz localStorage
  let settings: any = {}
  if (typeof window !== 'undefined') {
    try { settings = JSON.parse(localStorage.getItem('exportSettings') || '{}') } catch {}
  }
  title = title || settings.header || ''
  const footer = settings.footer || ''
  const logoUrl = settings.logoUrl
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write('<html><head><title>' + (title || 'Print') + '</title>')
  win.document.write('<style>body{font-family:sans-serif;padding:24px;} table{border-collapse:collapse;width:100%;margin-top:16px;} th,td{border:1px solid #ccc;padding:6px 10px;text-align:left;} th{background:#f3f3f3;} .footer{margin-top:32px;font-size:12px;color:#888;} .logo{height:48px;margin-bottom:12px;}</style>')
  win.document.write('</head><body>')
  if (logoUrl) win.document.write('<img src="' + logoUrl + '" class="logo" />')
  if (title) win.document.write('<h2>' + title + '</h2>')
  win.document.write('<table><thead><tr>')
  columnLabels.forEach(label => win.document.write('<th>' + label + '</th>'))
  win.document.write('</tr></thead><tbody>')
  data.forEach(row => {
    win.document.write('<tr>')
    columns.forEach(col => win.document.write('<td>' + (row[col] !== undefined ? row[col] : '') + '</td>'))
    win.document.write('</tr>')
  })
  win.document.write('</tbody></table>')
  if (footer) win.document.write('<div class="footer">' + footer + '</div>')
  win.document.write('</body></html>')
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
} 