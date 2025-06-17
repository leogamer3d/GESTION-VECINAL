"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, Download, Mail, MessageSquare, Search, Loader2 } from "lucide-react"
import { emailService } from "@/lib/email-service"
import { whatsappService } from "@/lib/whatsapp-service"
import { pdfService } from "@/lib/pdf-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCommunication } from "@/hooks/use-communication"

const recibos = [
  {
    id: 1,
    casa: "Casa 1",
    propietario: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+52 555 0101",
    cuotaMensual: 2500,
    multas: 0,
    eventos: 0,
    total: 2500,
    estado: "pagado",
    fechaVencimiento: "2024-01-31",
    fechaPago: "2024-01-15",
  },
  {
    id: 2,
    casa: "Casa 2",
    propietario: "María García",
    email: "maria.garcia@email.com",
    telefono: "+52 555 0102",
    cuotaMensual: 2500,
    multas: 500,
    eventos: 1200,
    total: 4200,
    estado: "pendiente",
    fechaVencimiento: "2024-01-31",
    fechaPago: null,
  },
  {
    id: 3,
    casa: "Casa 3",
    propietario: "Carlos López",
    email: "carlos.lopez@email.com",
    telefono: "+52 555 0103",
    cuotaMensual: 2500,
    multas: 0,
    eventos: 800,
    total: 3300,
    estado: "pagado",
    fechaVencimiento: "2024-01-31",
    fechaPago: "2024-01-12",
  },
  {
    id: 4,
    casa: "Casa 4",
    propietario: "Ana Martínez",
    email: "ana.martinez@email.com",
    telefono: "+52 555 0104",
    cuotaMensual: 2500,
    multas: 250,
    eventos: 0,
    total: 2750,
    estado: "vencido",
    fechaVencimiento: "2024-01-31",
    fechaPago: null,
  },
]

export function RecibosView() {
  const [selectedRecibos, setSelectedRecibos] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const { config: commConfig, loading: commConfigLoading } = useCommunication()

  const handleSelectRecibo = (reciboId: number) => {
    setSelectedRecibos((prev) => (prev.includes(reciboId) ? prev.filter((id) => id !== reciboId) : [...prev, reciboId]))
  }

  const handleSelectAll = () => {
    if (selectedRecibos.length === recibos.length) {
      setSelectedRecibos([])
    } else {
      setSelectedRecibos(recibos.map((r) => r.id))
    }
  }

  const handleSendEmail = async (recibo: any) => {
    if (!commConfig) {
      setNotification({ type: "error", message: "Configuración de comunicaciones no disponible" })
      return
    }

    setSendingEmail(true)
    try {
      await emailService.sendReceipt(recibo.email, {
        casa: recibo.casa,
        propietario: recibo.propietario,
        mes: "Enero 2024",
        cuotaMensual: recibo.cuotaMensual,
        multas: recibo.multas,
        eventos: recibo.eventos,
        total: recibo.total,
        fechaLimite: recibo.fechaVencimiento,
        fromEmail: commConfig.emailFrom,
        fromName: commConfig.emailFromName,
        signature: commConfig.emailSignature,
      })
      setNotification({ type: "success", message: `Email enviado a ${recibo.propietario}` })
    } catch (error) {
      setNotification({ type: "error", message: "Error al enviar email" })
    } finally {
      setSendingEmail(false)
    }
  }

  const handleSendWhatsApp = async (recibo: any) => {
    if (!commConfig) {
      setNotification({ type: "error", message: "Configuración de comunicaciones no disponible" })
      return
    }

    setSendingWhatsApp(true)
    try {
      await whatsappService.sendReceipt(recibo.telefono, {
        casa: recibo.casa,
        propietario: recibo.propietario,
        mes: "Enero 2024",
        total: recibo.total,
        fechaLimite: recibo.fechaVencimiento,
        fromNumber: commConfig.whatsappNumber,
      })
      setNotification({ type: "success", message: `WhatsApp enviado a ${recibo.propietario}` })
    } catch (error) {
      setNotification({ type: "error", message: "Error al enviar WhatsApp" })
    } finally {
      setSendingWhatsApp(false)
    }
  }

  const handleDownloadPDF = async (recibo: any) => {
    setGeneratingPDF(true)
    try {
      const pdfBlob = await pdfService.generateReceipt({
        casa: recibo.casa,
        propietario: recibo.propietario,
        email: recibo.email,
        telefono: recibo.telefono,
        mes: "Enero 2024",
        cuotaMensual: recibo.cuotaMensual,
        multas: recibo.multas,
        eventos: recibo.eventos,
        total: recibo.total,
        fechaLimite: recibo.fechaVencimiento,
        estado: recibo.estado,
        residencialInfo: {
          nombre: commConfig?.emailFromName || "Mi Residencial",
          direccion: "Calle Principal #123",
          telefono: commConfig?.whatsappNumber || "+52 555 0000",
          email: commConfig?.emailFrom || "admin@residencial.com",
        },
      })
      pdfService.downloadBlob(pdfBlob, `recibo-${recibo.casa}-enero-2024.txt`)
      setNotification({ type: "success", message: "PDF generado correctamente" })
    } catch (error) {
      setNotification({ type: "error", message: "Error al generar PDF" })
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handleBulkEmail = async () => {
    setSendingEmail(true)
    try {
      const selectedReciboData = recibos.filter((r) => selectedRecibos.includes(r.id))
      const emails = selectedReciboData.map((r) => r.email)
      const result = await emailService.sendBulkReceipts(emails, { mes: "Enero 2024" })
      setNotification({
        type: "success",
        message: `${result.success} emails enviados, ${result.failed} fallaron`,
      })
    } catch (error) {
      setNotification({ type: "error", message: "Error en envío masivo" })
    } finally {
      setSendingEmail(false)
    }
  }

  const handleBulkWhatsApp = async () => {
    setSendingWhatsApp(true)
    try {
      const selectedReciboData = recibos.filter((r) => selectedRecibos.includes(r.id))
      const phones = selectedReciboData.map((r) => r.telefono)
      const result = await whatsappService.sendBulkMessages(phones, "Su recibo de cuotas está disponible")
      setNotification({
        type: "success",
        message: `${result.success} WhatsApps enviados, ${result.failed} fallaron`,
      })
    } catch (error) {
      setNotification({ type: "error", message: "Error en envío masivo" })
    } finally {
      setSendingWhatsApp(false)
    }
  }

  const handleGenerateAllPDFs = async () => {
    setGeneratingPDF(true)
    try {
      const allRecibosData = recibos.map(recibo => ({
        casa: recibo.casa,
        propietario: recibo.propietario,
        email: recibo.email,
        telefono: recibo.telefono,
        mes: "Enero 2024",
        cuotaMensual: recibo.cuotaMensual,
        multas: recibo.multas,
        eventos: recibo.eventos,
        total: recibo.total,
        fechaLimite: recibo.fechaVencimiento,
        estado: recibo.estado,
        residencialInfo: {
          nombre: commConfig?.emailFromName || "Mi Residencial",
          direccion: "Calle Principal #123",
          telefono: commConfig?.whatsappNumber || "+52 555 0000",
          email: commConfig?.emailFrom || "admin@residencial.com",
        },
      }))

      const pdfBlob = await pdfService.generateBulkReceipts(allRecibosData)
      pdfService.downloadBlob(pdfBlob, `recibos-todos-enero-2024.txt`)
      setNotification({ type: "success", message: "PDF de todos los recibos generado correctamente" })
    } catch (error) {
      setNotification({ type: "error", message: "Error al generar PDF masivo" })
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handleSendMassive = async () => {
    if (!commConfig) {
      setNotification({ type: "error", message: "Configuración de comunicaciones no disponible" })
      return
    }

    setSendingEmail(true)
    setSendingWhatsApp(true)
    try {
      // Enviar emails
      const emailPromises = recibos.map(recibo => 
        emailService.sendReceipt(recibo.email, {
          casa: recibo.casa,
          propietario: recibo.propietario,
          mes: "Enero 2024",
          cuotaMensual: recibo.cuotaMensual,
          multas: recibo.multas,
          eventos: recibo.eventos,
          total: recibo.total,
          fechaLimite: recibo.fechaVencimiento,
          fromEmail: commConfig.emailFrom,
          fromName: commConfig.emailFromName,
          signature: commConfig.emailSignature,
        })
      )

      // Enviar WhatsApps
      const whatsappPromises = recibos.map(recibo =>
        whatsappService.sendReceipt(recibo.telefono, {
          casa: recibo.casa,
          propietario: recibo.propietario,
          mes: "Enero 2024",
          total: recibo.total,
          fechaLimite: recibo.fechaVencimiento,
          fromNumber: commConfig.whatsappNumber,
        })
      )

      await Promise.allSettled([...emailPromises, ...whatsappPromises])
      
      setNotification({
        type: "success",
        message: `Envío masivo completado a ${recibos.length} destinatarios`,
      })
    } catch (error) {
      setNotification({ type: "error", message: "Error en envío masivo" })
    } finally {
      setSendingEmail(false)
      setSendingWhatsApp(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Envío de Recibos</h1>
          <p className="text-slate-600">Gestiona y envía recibos de cuotas mensuales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateAllPDFs} disabled={generatingPDF}>
            {generatingPDF && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Download className="h-4 w-4 mr-2" />
            Generar Todos
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendMassive} disabled={sendingEmail || sendingWhatsApp}>
            {(sendingEmail || sendingWhatsApp) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Send className="h-4 w-4 mr-2" />
            Enviar Masivo
          </Button>
        </div>
      </div>

      {notification && (
        <Alert variant={notification.type === "error" ? "destructive" : "default"} className="mb-4">
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Buscar por casa o propietario..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enero-2024">Enero 2024</SelectItem>
                <SelectItem value="diciembre-2023">Diciembre 2023</SelectItem>
                <SelectItem value="noviembre-2023">Noviembre 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Acciones masivas */}
      {selectedRecibos.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedRecibos.length} recibo(s) seleccionado(s)
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkEmail} disabled={sendingEmail}>
                  {sendingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por Email
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkWhatsApp} disabled={sendingWhatsApp}>
                  {sendingWhatsApp && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de recibos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recibos de Enero 2024</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox checked={selectedRecibos.length === recibos.length} onCheckedChange={handleSelectAll} />
              <Label className="text-sm">Seleccionar todos</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Seleccionar</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Casa</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Propietario</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Contacto</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Cuota</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Multas</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Eventos</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recibos.map((recibo) => (
                  <tr key={recibo.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedRecibos.includes(recibo.id)}
                        onCheckedChange={() => handleSelectRecibo(recibo.id)}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{recibo.casa}</td>
                    <td className="py-3 px-4 text-slate-900">{recibo.propietario}</td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      <div>{recibo.email}</div>
                      <div>{recibo.telefono}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-900">${recibo.cuotaMensual.toLocaleString()}</td>
                    <td className="py-3 px-4 text-red-600">
                      {recibo.multas > 0 ? `$${recibo.multas.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-blue-600">
                      {recibo.eventos > 0 ? `$${recibo.eventos.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${recibo.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          recibo.estado === "pagado"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : recibo.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-red-100 text-red-800 border-red-300"
                        }
                      >
                        {recibo.estado === "pagado"
                          ? "Pagado"
                          : recibo.estado === "pendiente"
                            ? "Pendiente"
                            : "Vencido"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendEmail(recibo)}
                          disabled={sendingEmail}
                        >
                          {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendWhatsApp(recibo)}
                          disabled={sendingWhatsApp}
                        >
                          {sendingWhatsApp ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(recibo)}
                          disabled={generatingPDF}
                        >
                          {generatingPDF ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
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

      {/* Estadísticas de envío */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Recibos Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">42</div>
            <p className="text-xs text-slate-500">de 45 totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tasa de Apertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89%</div>
            <p className="text-xs text-slate-500">emails abiertos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pagos Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">38</div>
            <p className="text-xs text-slate-500">tras envío de recibo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Recordatorios Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-slate-500">casas morosas</p>
          </CardContent>
        </Card>
      </div>

      {/* Plantillas de mensaje */}
      <Card>
        <CardHeader>
          <CardTitle>Plantillas de Mensaje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-slate-900 mb-2">Recibo Mensual</h3>
              <p className="text-sm text-slate-600 mb-4">
                Estimado(a) [NOMBRE], adjuntamos su recibo de cuotas correspondiente al mes de [MES]. El monto total es
                de $[TOTAL]. Fecha límite de pago: [FECHA_LIMITE].
              </p>
              <Button variant="outline" size="sm">
                Editar Plantilla
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-slate-900 mb-2">Recordatorio de Pago</h3>
              <p className="text-sm text-slate-600 mb-4">
                Estimado(a) [NOMBRE], le recordamos que tiene un pago pendiente de $[TOTAL] correspondiente al mes de
                [MES]. Por favor, regularice su situación.
              </p>
              <Button variant="outline" size="sm">
                Editar Plantilla
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
