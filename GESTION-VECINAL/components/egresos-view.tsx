"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Receipt, Edit, Trash2, Loader2 } from "lucide-react"
import { useEgresos } from "@/hooks/use-data"
import { useExpenseCategories } from "@/hooks/use-categories"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorMessage } from "./error-message"

export function EgresosView() {
  const [selectedYear] = useState(new Date().getFullYear().toString())
  const { data: egresos, loading, error, create, update, delete: deleteEgreso, refetch } = useEgresos(selectedYear)
  const { categories: expenseCategories } = useExpenseCategories()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    categoria: "",
    monto: "",
    proveedor: "",
    fecha: "",
    descripcion: "",
  })
  const [editingEgreso, setEditingEgreso] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.categoria || !formData.monto || !formData.proveedor || !formData.fecha) return

    setSubmitting(true)
    try {
      if (editingEgreso) {
        await update(editingEgreso.id, {
          categoria: formData.categoria,
          monto: Number.parseInt(formData.monto),
          proveedor: formData.proveedor,
          fecha: formData.fecha,
          descripcion: formData.descripcion,
        })
      } else {
        await create({
          categoria: formData.categoria,
          monto: Number.parseInt(formData.monto),
          proveedor: formData.proveedor,
          fecha: formData.fecha,
          descripcion: formData.descripcion,
        })
      }

      setFormData({ categoria: "", monto: "", proveedor: "", fecha: "", descripcion: "" })
      setEditingEgreso(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (egreso: any) => {
    setEditingEgreso(egreso)
    setFormData({
      categoria: egreso.categoria,
      monto: egreso.monto.toString(),
      proveedor: egreso.proveedor,
      fecha: egreso.fecha,
      descripcion: egreso.descripcion,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este egreso?")) {
      try {
        await deleteEgreso(id)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Gestión de Egresos</h1>
          <p className="text-sm sm:text-base text-slate-600">Administra los gastos de la comunidad</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Egreso
        </Button>
      </div>

      {/* Formulario de nuevo egreso */}
      {showForm && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{editingEgreso ? "Editar" : "Registrar Nuevo"} Egreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.filter(cat => cat.active).map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
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
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input
                  placeholder="Nombre del proveedor"
                  value={formData.proveedor}
                  onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
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
              <div className="md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  placeholder="Describe el gasto..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingEgreso ? "Actualizar" : "Guardar"} Egreso
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingEgreso(null)
                  setFormData({ categoria: "", monto: "", proveedor: "", fecha: "", descripcion: "" })
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && <LoadingSpinner text="Cargando egresos..." />}

      {!loading && egresos && (
        <>
          {/* Filtros y búsqueda */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar por descripción o proveedor..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="servicios">Servicios</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="seguridad">Seguridad</SelectItem>
                    <SelectItem value="jardineria">Jardinería</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de egresos */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Historial de Egresos ({selectedYear})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Categoría</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Descripción</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Proveedor</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Monto</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {egresos.map((egreso) => (
                      <tr key={egreso.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-900">{egreso.fecha}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-slate-700">
                            {egreso.categoria}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-900 max-w-xs truncate">{egreso.descripcion}</td>
                        <td className="py-3 px-4 text-slate-900">{egreso.proveedor}</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">-${egreso.monto.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Receipt className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(egreso)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(egreso.id)}>
                              <Trash2 className="h-4 w-4" />
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

          {/* Resumen por categorías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Mantenimiento", "Servicios", "Seguridad"].map((categoria) => {
              const totalCategoria = egresos
                .filter((egreso) => egreso.categoria === categoria)
                .reduce((sum, egreso) => sum + egreso.monto, 0)

              return (
                <Card key={categoria} className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{categoria}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">${totalCategoria.toLocaleString()}</div>
                    <p className="text-sm text-slate-500">Este año</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Total de egresos */}
          <Card className="border-l-4 border-l-red-500 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Total de Egresos del Año</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                ${egresos.reduce((sum, egreso) => sum + egreso.monto, 0).toLocaleString()}
              </div>
              <p className="text-slate-500">{selectedYear}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}