"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { pdfService } from "@/lib/pdf-service"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useIngresos, useEgresos } from "@/hooks/use-data"

const monthlyData = [
  { mes: "Jul", ingresos: 45000, egresos: 32000, balance: 13000 },
  { mes: "Ago", ingresos: 52000, egresos: 28000, balance: 24000 },
  { mes: "Sep", ingresos: 48000, egresos: 35000, balance: 13000 },
  { mes: "Oct", ingresos: 61000, egresos: 42000, balance: 19000 },
  { mes: "Nov", ingresos: 55000, egresos: 38000, balance: 17000 },
  { mes: "Dic", ingresos: 67000, egresos: 45000, balance: 22000 },
]

const expensesByCategory = [
  { name: "Mantenimiento", value: 35, color: "#ef4444" },
  { name: "Servicios", value: 25, color: "#f97316" },
  { name: "Seguridad", value: 20, color: "#eab308" },
  { name: "Limpieza", value: 12, color: "#22c55e" },
  { name: "Jardinería", value: 8, color: "#3b82f6" },
]

export function ReportesView() {
  const [exportingPDF, setExportingPDF] = useState(false)
  const [selectedYear] = useState(new Date().getFullYear().toString())
  const { data: ingresos } = useIngresos(selectedYear)
  const { data: egresos } = useEgresos(selectedYear)

  const handleExportPDF = async () => {
    setExportingPDF(true)
    try {
      const totalIngresos = ingresos?.reduce((sum, ing) => sum + ing.monto, 0) || 67000
      const totalEgresos = egresos?.reduce((sum, egr) => sum + egr.monto, 0) || 45000

      const reportData = {
        periodo: "Enero 2024",
        ingresos: totalIngresos,
        egresos: totalEgresos,
      }

      const pdfBlob = await pdfService.generateReport(reportData)
      pdfService.downloadBlob(pdfBlob, `reporte-enero-2024.txt`)
    } catch (error) {
      console.error("Error al generar reporte:", error)
    } finally {
      setExportingPDF(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Reportes Mensuales</h1>
          <p className="text-sm sm:text-base text-slate-600">Análisis financiero y estadísticas de la comunidad</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="enero-2024">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enero-2024">Enero 2024</SelectItem>
              <SelectItem value="diciembre-2023">Diciembre 2023</SelectItem>
              <SelectItem value="noviembre-2023">Noviembre 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleExportPDF} disabled={exportingPDF}>
            {exportingPDF && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$67,000</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$45,000</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              +8% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Balance Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$22,000</div>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3" />
              +18% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tasa de Cobranza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">84%</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">38 de 45 casas al día</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de 6 meses */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Financiera (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" />
                <Bar dataKey="egresos" fill="#ef4444" name="Egresos" />
                <Bar dataKey="balance" fill="#3b82f6" name="Balance" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalles por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expensesByCategory.map((category) => (
              <div key={category.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{category.name}</h3>
                  <Badge style={{ backgroundColor: category.color, color: "white" }}>{category.value}%</Badge>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  ${((45000 * category.value) / 100).toLocaleString()}
                </div>
                <p className="text-sm text-slate-500">del total de egresos</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de morosidad */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">38</div>
              <p className="text-green-700 font-medium">Casas al Día</p>
              <p className="text-sm text-green-600">84% del total</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">7</div>
              <p className="text-orange-700 font-medium">Casas Morosas</p>
              <p className="text-sm text-orange-600">16% del total</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">$17,500</div>
              <p className="text-red-700 font-medium">Monto Pendiente</p>
              <p className="text-sm text-red-600">Por cobrar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Generar Reporte Completo</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Exportar a Excel</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Análisis Comparativo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}