"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Download, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { pdfService } from "@/lib/pdf-service"
import { useIngresos, useEgresos } from "@/hooks/use-data"

const yearlyData = [
  { mes: "Ene", ingresos: 45000, egresos: 32000, balance: 13000, acumulado: 13000 },
  { mes: "Feb", ingresos: 52000, egresos: 28000, balance: 24000, acumulado: 37000 },
  { mes: "Mar", ingresos: 48000, egresos: 35000, balance: 13000, acumulado: 50000 },
  { mes: "Abr", ingresos: 61000, egresos: 42000, balance: 19000, acumulado: 69000 },
  { mes: "May", ingresos: 55000, egresos: 38000, balance: 17000, acumulado: 86000 },
  { mes: "Jun", ingresos: 67000, egresos: 45000, balance: 22000, acumulado: 108000 },
  { mes: "Jul", ingresos: 58000, egresos: 41000, balance: 17000, acumulado: 125000 },
  { mes: "Ago", ingresos: 63000, egresos: 39000, balance: 24000, acumulado: 149000 },
  { mes: "Sep", ingresos: 59000, egresos: 44000, balance: 15000, acumulado: 164000 },
  { mes: "Oct", ingresos: 65000, egresos: 47000, balance: 18000, acumulado: 182000 },
  { mes: "Nov", ingresos: 61000, egresos: 43000, balance: 18000, acumulado: 200000 },
  { mes: "Dic", ingresos: 69000, egresos: 48000, balance: 21000, acumulado: 221000 },
]

const quarterlyComparison = [
  { trimestre: "Q1 2023", ingresos: 135000, egresos: 98000, balance: 37000 },
  { trimestre: "Q2 2023", ingresos: 142000, egresos: 105000, balance: 37000 },
  { trimestre: "Q3 2023", ingresos: 158000, egresos: 118000, balance: 40000 },
  { trimestre: "Q4 2023", ingresos: 165000, egresos: 125000, balance: 40000 },
]

export function BalanceView() {
  const [selectedYear] = useState(new Date().getFullYear().toString())
  const [exportingPDF, setExportingPDF] = useState(false)
  const { data: ingresos, loading: ingresosLoading } = useIngresos(selectedYear)
  const { data: egresos, loading: egresosLoading } = useEgresos(selectedYear)

  const loading = ingresosLoading || egresosLoading

  const totalIngresos = ingresos?.reduce((sum, ingreso) => sum + ingreso.monto, 0) || 67000
  const totalEgresos = egresos?.reduce((sum, egreso) => sum + egreso.monto, 0) || 45000
  const balance = totalIngresos - totalEgresos

  const handleExportBalance = async () => {
    setExportingPDF(true)
    try {
      const balanceData = {
        año: selectedYear,
        totalIngresos,
        totalEgresos,
        monthlyData: yearlyData,
        ingresosPorCategoria: [
          { categoria: "Cuotas Mensuales", total: totalIngresos * 0.85 },
          { categoria: "Multas", total: totalIngresos * 0.1 },
          { categoria: "Eventos", total: totalIngresos * 0.05 },
        ],
        egresosPorCategoria: [
          { categoria: "Mantenimiento", total: totalEgresos * 0.35 },
          { categoria: "Servicios", total: totalEgresos * 0.25 },
          { categoria: "Seguridad", total: totalEgresos * 0.2 },
          { categoria: "Limpieza", total: totalEgresos * 0.12 },
          { categoria: "Jardinería", total: totalEgresos * 0.08 },
        ],
        estadisticas: {
          promedioCobranza: 84,
          mejorMes: "Diciembre",
          totalTransacciones: (ingresos?.length || 0) + (egresos?.length || 0),
        },
        observaciones: "Balance anual generado automáticamente por el sistema de gestión vecinal.",
      }

      const pdfBlob = await pdfService.generateAnnualBalance(balanceData)
      pdfService.downloadBlob(pdfBlob, `balance-anual-${selectedYear}.txt`)
    } catch (error) {
      console.error("Error al generar balance:", error)
    } finally {
      setExportingPDF(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Balance Financiero</h1>
          <p className="text-sm sm:text-base text-slate-600">Resumen de ingresos y egresos del año {selectedYear}</p>
        </div>
        <Button onClick={handleExportBalance} disabled={exportingPDF} className="bg-blue-600 hover:bg-blue-700">
          {exportingPDF && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Download className="h-4 w-4 mr-2" />
          Exportar Balance
        </Button>
      </div>

      {/* Métricas anuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$660,000</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +15% vs año anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Egresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$472,000</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              +8% vs año anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Balance Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$188,000</div>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3" />
              +28% vs año anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Promedio Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$15,667</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">Balance promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de balance acumulado */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Acumulado 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
              <Area
                type="monotone"
                dataKey="acumulado"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Balance Acumulado"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparación mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Egresos Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={3} name="Ingresos" />
              <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={3} name="Egresos" />
              <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Balance" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análisis trimestral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análisis Trimestral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quarterlyComparison.map((quarter, index) => (
                <div key={quarter.trimestre} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-slate-900">{quarter.trimestre}</h3>
                    <Badge variant={index === quarterlyComparison.length - 1 ? "default" : "secondary"}>
                      {index === quarterlyComparison.length - 1 ? "Último" : "Histórico"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Ingresos</p>
                      <p className="font-semibold text-green-600">${quarter.ingresos.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Egresos</p>
                      <p className="font-semibold text-red-600">${quarter.egresos.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Balance</p>
                      <p className="font-semibold text-blue-600">${quarter.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proyecciones */}
        <Card>
          <CardHeader>
            <CardTitle>Proyecciones y Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Meta Anual de Ahorro</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">$200,000</span>
                  <Badge className="bg-blue-100 text-blue-800">94% alcanzado</Badge>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Proyección Fin de Año</h3>
                <div className="text-2xl font-bold text-green-600">$221,000</div>
                <p className="text-sm text-green-700">Basado en tendencia actual</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">Fondo de Emergencia</h3>
                <div className="text-2xl font-bold text-orange-600">$50,000</div>
                <p className="text-sm text-orange-700">Recomendado: 3 meses de gastos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Ejecutivo 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Puntos Destacados</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Crecimiento del 15% en ingresos vs año anterior
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Balance positivo en todos los meses
                </li>
                <li className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  Control efectivo de gastos operativos
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Mejora en tasa de cobranza del 12%
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Recomendaciones</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Mantener el fondo de emergencia en $50,000</li>
                <li>• Considerar inversiones a plazo fijo para excedentes</li>
                <li>• Implementar plan de reducción de morosidad</li>
                <li>• Evaluar incremento de cuotas para 2025</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}