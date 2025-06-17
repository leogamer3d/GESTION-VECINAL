"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, MapPin, Users } from "lucide-react"

const eventos = [
  {
    id: 1,
    titulo: "Reunión de Consorcio",
    fecha: "2024-01-20",
    hora: "19:00",
    lugar: "Salón de Eventos",
    tipo: "reunion",
    participantes: 25,
    estado: "confirmado",
  },
  {
    id: 2,
    titulo: "Fiesta de Cumpleaños - Casa 15",
    fecha: "2024-01-22",
    hora: "16:00",
    lugar: "Área de Parrillas",
    tipo: "evento",
    participantes: 30,
    estado: "pendiente",
  },
  {
    id: 3,
    titulo: "Mantenimiento Piscina",
    fecha: "2024-01-25",
    hora: "08:00",
    lugar: "Área de Piscina",
    tipo: "mantenimiento",
    participantes: 3,
    estado: "confirmado",
  },
  {
    id: 4,
    titulo: "Clase de Yoga",
    fecha: "2024-01-27",
    hora: "07:00",
    lugar: "Jardín Central",
    tipo: "actividad",
    participantes: 12,
    estado: "confirmado",
  },
]

const tiposEvento = {
  reunion: { color: "bg-blue-100 text-blue-800", label: "Reunión" },
  evento: { color: "bg-green-100 text-green-800", label: "Evento Social" },
  mantenimiento: { color: "bg-orange-100 text-orange-800", label: "Mantenimiento" },
  actividad: { color: "bg-purple-100 text-purple-800", label: "Actividad" },
}

export function CalendarioView() {
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [eventosList, setEventosList] = useState(eventos)
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    fecha: "",
    hora: "",
    lugar: "",
    participantes: "",
    descripcion: "",
  })
  const [editingEvento, setEditingEvento] = useState(null)

  const handleSubmit = () => {
    const newEvento = {
      id: Math.max(...eventosList.map((e) => e.id)) + 1,
      titulo: formData.titulo,
      fecha: formData.fecha,
      hora: formData.hora,
      lugar: formData.lugar,
      tipo: formData.tipo,
      participantes: Number.parseInt(formData.participantes),
      estado: "pendiente",
    }
    setEventosList([...eventosList, newEvento])
    setFormData({ titulo: "", tipo: "", fecha: "", hora: "", lugar: "", participantes: "", descripcion: "" })
    setShowForm(false)
  }

  const handleEdit = (evento) => {
    setEditingEvento(evento)
    setFormData({
      titulo: evento.titulo,
      tipo: evento.tipo,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      participantes: evento.participantes.toString(),
      descripcion: "",
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setEventosList(eventosList.filter((e) => e.id !== id))
  }

  const handleChangeStatus = (id, newStatus) => {
    setEventosList(eventosList.map(evento => 
      evento.id === id ? { ...evento, estado: newStatus } : evento
    ))
  }

  // Generar calendario simple
  const generateCalendar = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = eventosList.filter((evento) => evento.fecha === dateStr)
      days.push({ day, date: dateStr, events: dayEvents })
    }

    return days
  }

  const calendarDays = generateCalendar()
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const today = new Date()

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">Calendario de Eventos</h1>
          <p className="text-sm sm:text-base text-slate-600">Gestión de eventos y fechas importantes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {/* Formulario de nuevo evento */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Programar Nuevo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo">Título del Evento</Label>
                <Input
                  placeholder="Nombre del evento"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Evento</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reunion">Reunión</SelectItem>
                    <SelectItem value="evento">Evento Social</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="actividad">Actividad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lugar">Lugar</Label>
                <Select value={formData.lugar} onValueChange={(value) => setFormData({ ...formData, lugar: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar lugar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salón de Eventos">Salón de Eventos</SelectItem>
                    <SelectItem value="Área de Parrillas">Área de Parrillas</SelectItem>
                    <SelectItem value="Área de Piscina">Área de Piscina</SelectItem>
                    <SelectItem value="Jardín Central">Jardín Central</SelectItem>
                    <SelectItem value="Cancha Deportiva">Cancha Deportiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="participantes">Participantes Estimados</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.participantes}
                  onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  placeholder="Detalles del evento..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
                disabled={!formData.titulo || !formData.tipo || !formData.fecha || !formData.hora}
              >
                {editingEvento ? "Actualizar" : "Programar"} Evento
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingEvento(null)
                  setFormData({
                    titulo: "",
                    tipo: "",
                    fecha: "",
                    hora: "",
                    lugar: "",
                    participantes: "",
                    descripcion: "",
                  })
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-slate-600 text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[80px] p-1 border border-slate-200 rounded cursor-pointer hover:bg-slate-50 ${
                    day?.day === today.getDate() ? "bg-blue-50 border-blue-300" : ""
                  }`}
                  onClick={() => day && setSelectedDate(day.date)}
                >
                  {day && (
                    <>
                      <div className="font-medium text-sm text-slate-900 mb-1">{day.day}</div>
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((evento) => (
                          <div key={evento.id} className={`text-xs p-1 rounded ${tiposEvento[evento.tipo].color}`}>
                            {evento.titulo.length > 15 ? evento.titulo.substring(0, 15) + "..." : evento.titulo}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-slate-500">+{day.events.length - 2} más</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de eventos próximos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventosList.map((evento) => (
                <div key={evento.id} className="p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-900 text-sm">{evento.titulo}</h3>
                    <Badge className={tiposEvento[evento.tipo].color}>{tiposEvento[evento.tipo].label}</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {evento.fecha}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {evento.hora}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {evento.lugar}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {evento.participantes} personas
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={
                        evento.estado === "confirmado" 
                          ? "bg-green-100 text-green-800" 
                          : evento.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : evento.estado === "cancelado"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {evento.estado === "confirmado" 
                        ? "Confirmado" 
                        : evento.estado === "pendiente"
                        ? "Pendiente"
                        : evento.estado === "cancelado"
                        ? "Cancelado"
                        : "Finalizado"}
                    </Badge>
                    <Select value={evento.estado} onValueChange={(value) => handleChangeStatus(evento.id, value)}>
                      <SelectTrigger className="w-20 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                        <SelectItem value="finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="outline" onClick={() => handleEdit(evento)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDelete(evento.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de uso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Eventos Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12</div>
            <p className="text-xs text-slate-500">+3 vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Lugar Más Usado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-900">Salón de Eventos</div>
            <p className="text-xs text-slate-500">40% de las reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Participación Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">18</div>
            <p className="text-xs text-slate-500">personas por evento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Ingresos por Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$8,400</div>
            <p className="text-xs text-slate-500">Este mes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Pencil, Trash } from "lucide-react"