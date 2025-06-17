"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, AlertTriangle, Edit, Trash2, Loader2 } from "lucide-react"
import { useMultas } from "@/hooks/use-multas"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorMessage } from "./error-message"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const categorias = [
  "Pagos",
  "Convivencia",
  "Áreas Comunes",
  "Mascotas",
  "Estacionamiento",
  "Seguridad",
  "Limpieza",
  "Otro",
]

export function MultasManagement() {
  const { multas, loading, error, createMulta, updateMulta, deleteMulta, refetch } = useMultas()

  const [showDialog, setShowDialog] = useState(false)
  const [editingMulta, setEditingMulta] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    monto: "",
    categoria: "",
    activa: true,
  })

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.monto || !formData.categoria) return

    setSubmitting(true)
    try {
      const multaData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        monto: Number.parseInt(formData.monto),
        categoria: formData.categoria,
        activa: formData.activa,
      }

      if (editingMulta) {
        await updateMulta(editingMulta.id, multaData)
      } else {
        await createMulta(multaData)
      }

      setFormData({
        nombre: "",
        descripcion: "",
        monto: "",
        categoria: "",
        activa: true,
      })
      setEditingMulta(null)
      setShowDialog(false)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (multa: any) => {
    setEditingMulta(multa)
    setFormData({
      nombre: multa.nombre,
      descripcion: multa.descripcion,
      monto: multa.monto.toString(),
      categoria: multa.categoria,
      activa: multa.activa,
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta multa?")) {
      try {
        await deleteMulta(id)
      } catch (error) {
        console.error("Error al eliminar:", error)
      }
    }
  }

  const toggleMultaStatus = async (id: string, activa: boolean) => {
    try {
      await updateMulta(id, { activa })
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    }
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Configuración de Multas
          </CardTitle>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600/80 hover:bg-orange-700/80 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Multa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>{editingMulta ? "Editar" : "Crear"} Multa</DialogTitle>
                <DialogDescription>
                  {editingMulta ? "Modifica la configuración de la multa" : "Crea una nueva multa para el sistema"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nombre de la Multa</Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Pago Tardío"
                  />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Describe cuándo se aplica esta multa..."
                  />
                </div>
                <div>
                  <Label>Monto ($)</Label>
                  <Input
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="250"
                  />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Multa Activa</Label>
                  <Switch
                    checked={formData.activa}
                    onCheckedChange={(checked) => setFormData({ ...formData, activa: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.nombre || !formData.monto || !formData.categoria || submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingMulta ? "Actualizar" : "Crear"} Multa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <LoadingSpinner text="Cargando multas..." />}

        {!loading && multas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multas.map((multa) => (
              <div key={multa.id} className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{multa.nombre}</h3>
                    <p className="text-sm text-slate-600 mt-1">{multa.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={multa.activa}
                      onCheckedChange={(checked) => toggleMultaStatus(multa.id, checked)}
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(multa)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(multa.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">{multa.categoria}</Badge>
                    <Badge
                      variant={multa.activa ? "default" : "secondary"}
                      className={multa.activa ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {multa.activa ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-orange-600">${multa.monto.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
