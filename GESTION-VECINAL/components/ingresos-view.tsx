"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Loader2 } from "lucide-react"
import { useIngresos, useCasas } from "@/hooks/use-data"
import { useIncomeCategories } from "@/hooks/use-categories"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorMessage } from "./error-message"

export function IngresosView() {
  const [selectedYear] = useState(new Date().getFullYear().toString())
  const { data: ingresos, loading, error, create, update, delete: deleteIngreso, refetch } = useIngresos(selectedYear)
  const { data: casas } = useCasas()
  const { categories: incomeCategories } = useIncomeCategories()

  const [formData, setFormData] = useState({
    tipo: "",
    casa: "",
    monto: "",
    fecha: "",
    descripcion: "",
  })
  const [editingIngreso, setEditingIngreso] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.tipo || !formData.casa || !formData.monto || !formData.fecha) return

    setSubmitting(true)
    try {
      if (editingIngreso) {
        await update(editingIngreso.id, {
          tipo: formData.tipo,
          casa: formData.casa,
          monto: Number.parseInt(formData.monto),
          fecha: formData.fecha,
          estado: editingIngreso.estado,
        })
      } else {
        await create({
          tipo: formData.tipo,
          casa: formData.casa,
          monto: Number.parseInt(formData.monto),
          fecha: formData.fecha,
          estado: "Pendiente",
        })
      }

      setFormData({ tipo: "", casa: "", monto: "", fecha: "", descripcion: "" })
      setEditingIngreso(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (ingreso: any) => {
    setEditingIngreso(ingreso)
    setFormData({
      tipo: ingreso.tipo,
      casa: ingreso.casa,
      monto: ingreso.monto.toString(),
      fecha: ingreso.fecha,
      descripcion: "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este ingreso?")) {
      try {
        await deleteIngreso(id)
      } catch (error) {
        console.error("Error al eliminar:", error)
      }
    }
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Gestión de Ingresos</h1>
          <p className="text-sm sm:text-base text-slate-600">Administra los ingresos de la comunidad</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ingreso
        </Button>
      </div>

      {/* Formulario de nuevo ingreso */}
      {showForm && (
        <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle>{editingIngreso ? "Editar" : "Registrar Nuevo"} Ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de Ingreso</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.filter(cat => cat.active).map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="casa">Casa</Label>
                <Select value={formData.casa} onValueChange={(value) => setFormData({ ...formData, casa: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar casa" />
                  </SelectTrigger>
                  <SelectContent>
                    {casas?.map((casa) => (
                      <SelectItem key={casa.id} value={casa.nombre}>
                        {casa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monto">Monto</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
                disabled={!formData.tipo || !formData.casa || !formData.monto || !formData.fecha || submitting}
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingIngreso ? "Actualizar" : "Guardar"} Ingreso
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingIngreso(null)
                  setFormData({ tipo: "", casa: "", monto: "", fecha: "", descripcion: "" })
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && <LoadingSpinner text="Cargando ingresos..." />}

      {!loading && ingresos && (
        <>
          {/* Filtros y búsqueda */}
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar por casa o tipo..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="cuota">Cuota Mensual</SelectItem>
                    <SelectItem value="multa">Multa</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de ingresos */}
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle>Historial de Ingresos ({selectedYear})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Casa</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Monto</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresos.map((ingreso) => (
                      <tr key={ingreso.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-900">{ingreso.fecha}</td>
                        <td className="py-3 px-4 text-slate-900">{ingreso.tipo}</td>
                        <td className="py-3 px-4 text-slate-900">{ingreso.casa}</td>
                        <td className="py-3 px-4 text-slate-900 font-semibold">${ingreso.monto.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={ingreso.estado === "Pagado" ? "default" : "secondary"}
                            className={
                              ingreso.estado === "Pagado"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {ingreso.estado}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(ingreso)}>
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(ingreso.id)}
                              className="text-red-600"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Total Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${ingresos.reduce((sum, ing) => sum + ing.monto, 0).toLocaleString()}
                </div>
                <p className="text-sm text-slate-500">Este año</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Pagos Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  $
                  {ingresos
                    .filter((ing) => ing.estado === "Pendiente")
                    .reduce((sum, ing) => sum + ing.monto, 0)
                    .toLocaleString()}
                </div>
                <p className="text-sm text-slate-500">
                  {ingresos.filter((ing) => ing.estado === "Pendiente").length} pendientes
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Transacciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{ingresos.length}</div>
                <p className="text-sm text-slate-500">Total registradas</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}