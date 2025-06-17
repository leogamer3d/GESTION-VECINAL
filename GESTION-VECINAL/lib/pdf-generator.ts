"use client"

// Generador de PDF mejorado con contenido real
export const pdfGenerator = {
  generateReceiptContent(receiptData: any): string {
    const currentDate = new Date().toLocaleDateString("es-MX")

    return `
RECIBO DE CUOTAS MENSUALES
=========================================

INFORMACIÓN DEL RESIDENCIAL
---------------------------
${receiptData.residencialInfo?.nombre || "Mi Residencial"}
${receiptData.residencialInfo?.direccion || "Calle Principal #123"}
Tel: ${receiptData.residencialInfo?.telefono || "+52 555 0000"}
Email: ${receiptData.residencialInfo?.email || "admin@residencial.com"}

INFORMACIÓN DEL PROPIETARIO
---------------------------
Casa: ${receiptData.casa}
Propietario: ${receiptData.propietario}
Email: ${receiptData.email || "No especificado"}
Teléfono: ${receiptData.telefono || "No especificado"}

DETALLE DE CUOTAS - ${receiptData.mes || "Mes Actual"}
---------------------------
Cuota Mensual:           $${receiptData.cuotaMensual?.toLocaleString() || "0"}
Multas:                  $${receiptData.multas?.toLocaleString() || "0"}
Eventos Especiales:      $${receiptData.eventos?.toLocaleString() || "0"}
                        -------------------------
TOTAL A PAGAR:          $${receiptData.total?.toLocaleString() || "0"}

INFORMACIÓN DE PAGO
---------------------------
Fecha de Emisión: ${currentDate}
Fecha Límite: ${receiptData.fechaLimite || "No especificada"}
Estado: ${receiptData.estado || "Pendiente"}

INSTRUCCIONES DE PAGO
---------------------------
• Realizar el pago antes de la fecha límite
• Conservar este recibo como comprobante
• En caso de dudas, contactar a la administración

NOTAS IMPORTANTES
---------------------------
• El pago tardío genera multas adicionales
• Este recibo es válido únicamente para el período indicado
• Favor de reportar cualquier discrepancia

=========================================
Documento generado automáticamente
${currentDate}
    `.trim()
  },

  generateReportContent(reportData: any): string {
    const currentDate = new Date().toLocaleDateString("es-MX")
    const currentTime = new Date().toLocaleTimeString("es-MX")

    return `
REPORTE FINANCIERO MENSUAL
=========================================

INFORMACIÓN GENERAL
---------------------------
Período: ${reportData.periodo || "No especificado"}
Fecha de Generación: ${currentDate} ${currentTime}
Generado por: ${reportData.generadoPor || "Sistema Administrativo"}

RESUMEN FINANCIERO
---------------------------
Total Ingresos:          $${reportData.ingresos?.toLocaleString() || "0"}
Total Egresos:           $${reportData.egresos?.toLocaleString() || "0"}
                        -------------------------
Balance Neto:           $${((reportData.ingresos || 0) - (reportData.egresos || 0)).toLocaleString()}

DESGLOSE DE INGRESOS
---------------------------
Cuotas Mensuales:        $${reportData.desglose?.cuotas?.toLocaleString() || "0"}
Multas:                  $${reportData.desglose?.multas?.toLocaleString() || "0"}
Eventos:                 $${reportData.desglose?.eventos?.toLocaleString() || "0"}
Otros Ingresos:          $${reportData.desglose?.otros?.toLocaleString() || "0"}

DESGLOSE DE EGRESOS
---------------------------
Mantenimiento:           $${reportData.egresos_desglose?.mantenimiento?.toLocaleString() || "0"}
Servicios:               $${reportData.egresos_desglose?.servicios?.toLocaleString() || "0"}
Seguridad:               $${reportData.egresos_desglose?.seguridad?.toLocaleString() || "0"}
Limpieza:                $${reportData.egresos_desglose?.limpieza?.toLocaleString() || "0"}
Jardinería:              $${reportData.egresos_desglose?.jardineria?.toLocaleString() || "0"}
Administración:          $${reportData.egresos_desglose?.administracion?.toLocaleString() || "0"}

ESTADÍSTICAS DE COBRANZA
---------------------------
Total de Casas:          ${reportData.estadisticas?.totalCasas || "0"}
Casas al Día:            ${reportData.estadisticas?.casasAlDia || "0"}
Casas Morosas:           ${reportData.estadisticas?.casasMorosas || "0"}
Tasa de Cobranza:        ${reportData.estadisticas?.tasaCobranza || "0"}%

OBSERVACIONES
---------------------------
${reportData.observaciones || "Sin observaciones especiales para este período."}

PROYECCIONES
---------------------------
Balance Proyectado (Próximo Mes): $${reportData.proyecciones?.proximoMes?.toLocaleString() || "0"}
Ingresos Esperados: $${reportData.proyecciones?.ingresosEsperados?.toLocaleString() || "0"}
Gastos Programados: $${reportData.proyecciones?.gastosProgramados?.toLocaleString() || "0"}

=========================================
Este reporte ha sido generado automáticamente
por el Sistema de Gestión Vecinal
${currentDate} - ${currentTime}
    `.trim()
  },

  generateAnnualBalanceContent(balanceData: any): string {
    const currentDate = new Date().toLocaleDateString("es-MX")
    const currentTime = new Date().toLocaleTimeString("es-MX")

    return `
BALANCE ANUAL
=========================================

INFORMACIÓN GENERAL
---------------------------
Año: ${balanceData.año || "No especificado"}
Fecha de Generación: ${currentDate} ${currentTime}
Generado por: Sistema de Gestión Vecinal

RESUMEN ANUAL
---------------------------
Total Ingresos del Año:  $${balanceData.totalIngresos?.toLocaleString() || "0"}
Total Egresos del Año:   $${balanceData.totalEgresos?.toLocaleString() || "0"}
                        -------------------------
Balance Neto Anual:     $${((balanceData.totalIngresos || 0) - (balanceData.totalEgresos || 0)).toLocaleString()}

DESGLOSE MENSUAL
---------------------------
${balanceData.monthlyData?.map((month: any) => 
  `${month.mes}: Ingresos $${month.ingresos.toLocaleString()} | Egresos $${month.egresos.toLocaleString()} | Balance $${month.balance.toLocaleString()}`
).join('\n') || 'No hay datos mensuales disponibles'}

INGRESOS POR CATEGORÍA
---------------------------
${balanceData.ingresosPorCategoria?.map((cat: any) => 
  `${cat.categoria}: $${cat.total.toLocaleString()}`
).join('\n') || 'No hay datos de categorías de ingresos'}

EGRESOS POR CATEGORÍA
---------------------------
${balanceData.egresosPorCategoria?.map((cat: any) => 
  `${cat.categoria}: $${cat.total.toLocaleString()}`
).join('\n') || 'No hay datos de categorías de egresos'}

ESTADÍSTICAS DE COBRANZA
---------------------------
Promedio de Cobranza: ${balanceData.estadisticas?.promedioCobranza || "0"}%
Mejor Mes: ${balanceData.estadisticas?.mejorMes || "N/A"}
Total de Transacciones: ${balanceData.estadisticas?.totalTransacciones || "0"}

OBSERVACIONES
---------------------------
${balanceData.observaciones || "Balance anual generado automáticamente."}

=========================================
Documento generado automáticamente
${currentDate} - ${currentTime}
    `.trim()
  },
}
