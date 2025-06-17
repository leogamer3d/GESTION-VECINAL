"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Users, HomeIcon } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { YearManager } from "./year-manager"
import { CasaManager } from "./casa-manager"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorMessage } from "./error-message"
import { useIngresos, useEgresos, useCasas, useYears } from "@/hooks/use-data"

const monthlyData = [
  { mes: "Ene", ingresos: 45000, egresos: 32000 },
  { mes: "Feb", ingresos: 52000, egresos: 28000 },
  { mes: "Mar", ingresos: 48000, egresos: 35000 },
  { mes: "Abr", ingresos: 61000, egresos: 42000 },
  { mes: "May", ingresos: 55000, egresos: 38000 },
  { mes: "Jun", ingresos: 67000, egresos: 45000 },
]

export function Dashboard() {
  const { data: availableYears, loading: loadingYears } = useYears()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const {
    data: ingresos,
    loading: loadingIngresos,
    error: errorIngresos,
    refetch: refetchIngresos,
  } = useIngresos(selectedYear)

  const {
    data: egresos,
    loading: loadingEgresos,
    error: errorEgresos,
    refetch: refetchEgresos,
  } = useEgresos(selectedYear)

  const { data: casas, loading: loadingCasas, error: errorCasas, refetch: refetchCasas } = useCasas()

  const loading = loadingIngresos || loadingEgresos || loadingCasas || loadingYears
  const error = errorIngresos || errorEgresos || errorCasas

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage
          message={error}
          onRetry={() => {
            refetchIngresos()
            refetchEgresos()
            refetchCasas()
          }}
        />
      </div>
    )
  }

  // Calcular métricas
  const totalIngresos = ingresos?.reduce((sum, ing) => sum + ing.monto, 0) || 0
  const totalEgresos = egresos?.reduce((sum, egr) => sum + egr.monto, 0) || 0
  const casasActivas = casas?.filter((casa) => casa.estado === "activa").length || 0
  const casasMorosas = Math.floor(casasActivas * 0.15) // Simulado

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-600">Resumen general de la gestión vecinal</p>
        </div>
        <div className="flex items-center gap-4">
          <YearManager
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            availableYears={availableYears || []}
          />
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-white/70 backdrop-blur-sm">
            Año {selectedYear}
          </Badge>
        </div>
      </div>

      {loading && <LoadingSpinner text="Cargando datos del dashboard..." />}

      {!loading && (
        <>
          {/* Métricas principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="border-l-4 border-l-green-500 bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Ingresos del Año</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">${totalIngresos.toLocaleString()}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {ingresos?.length || 0} transacciones
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Egresos del Año</CardTitle>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">${totalEgresos.toLocaleString()}</div>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {egresos?.length || 0} transacciones
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Casas Morosas</CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{casasMorosas}</div>
                <p className="text-xs text-slate-500">de {casasActivas} casas activas</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Balance</CardTitle>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  ${(totalIngresos - totalEgresos).toLocaleString()}
                </div>
                <p className="text-xs text-blue-600">Diferencia anual</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <Card className="min-w-0">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Ingresos vs Egresos (Últimos 6 meses)</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                      labelFormatter={(label) => `Mes: ${label}`}
                    />
                    <Bar dataKey="ingresos" fill="#3b82f6" name="Ingresos" />
                    <Bar dataKey="egresos" fill="#ef4444" name="Egresos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transacciones recientes */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Transacciones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ingresos?.slice(0, 4).map((ingreso) => (
                    <div key={ingreso.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{ingreso.tipo}</p>
                          <p className="text-sm text-slate-500">{ingreso.casa}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+${ingreso.monto.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{ingreso.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Total Casas</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-slate-900">{casas?.length || 0}</div>
                <p className="text-sm text-slate-500">{casasActivas} activas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="text-center">
                <HomeIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Casas al Día</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-slate-900">{casasActivas - casasMorosas}</div>
                <p className="text-sm text-slate-500">
                  {Math.round(((casasActivas - casasMorosas) / casasActivas) * 100)}% del total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader className="text-center">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Balance Actual</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-slate-900">
                  ${(totalIngresos - totalEgresos).toLocaleString()}
                </div>
                <p className="text-sm text-slate-500">Disponible</p>
              </CardContent>
            </Card>
          </div>

          {/* Gestión de casas */}
          <CasaManager />
        </>
      )}
    </div>
  )
}