"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Plus, Home } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Casa {
  id: number
  numero: string
  nombre: string
  propietario: string
  estado: "activa" | "inactiva"
}

export function CasaManager() {
  const [casas, setCasas] = useState<Casa[]>([
    { id: 1, numero: "1", nombre: "Casa 1", propietario: "Juan Pérez", estado: "activa" },
    { id: 2, numero: "2", nombre: "Casa 2", propietario: "María García", estado: "activa" },
    { id: 3, numero: "3", nombre: "Casa 3", propietario: "Carlos López", estado: "activa" },
    // ... más casas
  ])

  const [editingCasa, setEditingCasa] = useState<Casa | null>(null)
  const [newCasa, setNewCasa] = useState({ numero: "", nombre: "", propietario: "" })
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleEditCasa = (casa: Casa) => {
    setEditingCasa({ ...casa })
  }

  const handleSaveEdit = () => {
    if (editingCasa) {
      setCasas(casas.map((casa) => (casa.id === editingCasa.id ? editingCasa : casa)))
      setEditingCasa(null)
    }
  }

  const handleDeleteCasa = (id: number) => {
    setCasas(casas.filter((casa) => casa.id !== id))
  }

  const handleAddCasa = () => {
    const newId = Math.max(...casas.map((c) => c.id)) + 1
    setCasas([
      ...casas,
      {
        id: newId,
        numero: newCasa.numero,
        nombre: newCasa.nombre,
        propietario: newCasa.propietario,
        estado: "activa",
      },
    ])
    setNewCasa({ numero: "", nombre: "", propietario: "" })
    setShowAddDialog(false)
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Gestión de Casas
          </CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Casa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Casa</DialogTitle>
                <DialogDescription>Ingresa los datos de la nueva casa</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Número</label>
                  <Input
                    value={newCasa.numero}
                    onChange={(e) => setNewCasa({ ...newCasa, numero: e.target.value })}
                    placeholder="Ej: 45"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={newCasa.nombre}
                    onChange={(e) => setNewCasa({ ...newCasa, nombre: e.target.value })}
                    placeholder="Ej: Casa 45"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Propietario</label>
                  <Input
                    value={newCasa.propietario}
                    onChange={(e) => setNewCasa({ ...newCasa, propietario: e.target.value })}
                    placeholder="Nombre del propietario"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCasa}>Agregar Casa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {casas.map((casa) => (
            <div key={casa.id} className="p-3 border rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{casa.nombre}</h3>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEditCasa(casa)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteCasa(casa.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-600">{casa.propietario}</p>
              <Badge variant={casa.estado === "activa" ? "default" : "secondary"}>{casa.estado}</Badge>
            </div>
          ))}
        </div>

        {/* Modal de edición */}
        {editingCasa && (
          <Dialog open={!!editingCasa} onOpenChange={() => setEditingCasa(null)}>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>Editar Casa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Número</label>
                  <Input
                    value={editingCasa.numero}
                    onChange={(e) => setEditingCasa({ ...editingCasa, numero: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={editingCasa.nombre}
                    onChange={(e) => setEditingCasa({ ...editingCasa, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Propietario</label>
                  <Input
                    value={editingCasa.propietario}
                    onChange={(e) => setEditingCasa({ ...editingCasa, propietario: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingCasa(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
