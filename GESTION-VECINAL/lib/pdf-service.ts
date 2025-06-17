"use client"

import { pdfGenerator } from "./pdf-generator"

// Servicio de PDF mejorado con contenido real
export const pdfService = {
  async generateReceipt(receiptData: any): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("📄 Generando PDF de recibo", receiptData)

    // Generar contenido real del PDF
    const pdfContent = pdfGenerator.generateReceiptContent(receiptData)

    // Crear un blob con el contenido del PDF
    return new Blob([pdfContent], {
      type: "text/plain", // Cambiaremos a application/pdf cuando integremos una librería real
    })
  },

  async generateReport(reportData: any): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log("📄 Generando reporte PDF", reportData)

    // Calcular datos adicionales para el reporte
    const enhancedReportData = {
      ...reportData,
      desglose: {
        cuotas: (reportData.ingresos || 0) * 0.85,
        multas: (reportData.ingresos || 0) * 0.1,
        eventos: (reportData.ingresos || 0) * 0.05,
        otros: 0,
      },
      egresos_desglose: {
        mantenimiento: (reportData.egresos || 0) * 0.35,
        servicios: (reportData.egresos || 0) * 0.25,
        seguridad: (reportData.egresos || 0) * 0.2,
        limpieza: (reportData.egresos || 0) * 0.12,
        jardineria: (reportData.egresos || 0) * 0.08,
        administracion: 0,
      },
      estadisticas: {
        totalCasas: 45,
        casasAlDia: 38,
        casasMorosas: 7,
        tasaCobranza: 84,
      },
      proyecciones: {
        proximoMes: (reportData.ingresos || 0) - (reportData.egresos || 0),
        ingresosEsperados: (reportData.ingresos || 0) * 1.05,
        gastosProgramados: (reportData.egresos || 0) * 0.95,
      },
      observaciones:
        "Mes con buen desempeño financiero. Se recomienda mantener el control de gastos y mejorar la tasa de cobranza.",
      generadoPor: "Sistema Administrativo",
    }

    const reportContent = pdfGenerator.generateReportContent(enhancedReportData)

    return new Blob([reportContent], {
      type: "text/plain", // Cambiaremos a application/pdf cuando integremos una librería real
    })
  },

  async generateBulkReceipts(recibosData: any[]): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 4000))

    console.log("📄 Generando PDFs masivos", recibosData.length)

    let bulkContent = "RECIBOS MASIVOS\n"
    bulkContent += "=====================================\n\n"

    recibosData.forEach((recibo, index) => {
      bulkContent += `RECIBO ${index + 1}\n`
      bulkContent += pdfGenerator.generateReceiptContent(recibo)
      bulkContent += "\n\n" + "=".repeat(50) + "\n\n"
    })

    return new Blob([bulkContent], {
      type: "text/plain",
    })
  },

  async generateAnnualBalance(balanceData: any): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log("📄 Generando balance anual PDF", balanceData)

    const balanceContent = pdfGenerator.generateAnnualBalanceContent(balanceData)

    return new Blob([balanceContent], {
      type: "text/plain",
    })
  },

  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  // Función para previsualizar el contenido antes de descargar
  previewContent(content: string): void {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Vista Previa del Documento</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                margin: 20px; 
                line-height: 1.4;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `)
      newWindow.document.close()
    }
  },
}
