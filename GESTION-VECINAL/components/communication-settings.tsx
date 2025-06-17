"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Save, Loader2 } from "lucide-react"
import { useCommunication } from "@/hooks/use-communication"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorMessage } from "./error-message"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CommunicationSettings() {
  const { config, loading, error, updateConfig, refetch } = useCommunication()
  const [formData, setFormData] = useState({
    emailFrom: "",
    emailFromName: "",
    whatsappNumber: "",
    emailSignature: "",
  })
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Actualizar formData cuando se carga la configuración
  useEffect(() => {
    if (config) {
      setFormData({
        emailFrom: config.emailFrom,
        emailFromName: config.emailFromName,
        whatsappNumber: config.whatsappNumber,
        emailSignature: config.emailSignature,
      })
    }
  }, [config])

  const handleSave = async () => {
    setSaving(true)
    setNotification(null)
    try {
      await updateConfig(formData)
      setNotification({ type: "success", message: "Configuración de comunicaciones guardada correctamente" })
    } catch (error) {
      setNotification({ type: "error", message: "Error al guardar la configuración" })
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />
  }

  if (loading) {
    return <LoadingSpinner text="Cargando configuración de comunicaciones..." />
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4" />
          Configuración de Comunicaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notification && (
          <Alert variant={notification.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        {/* Configuración de Email */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-slate-900 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Configuración de Email
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="emailFrom">Email Remitente</Label>
              <Input
                id="emailFrom"
                type="email"
                value={formData.emailFrom}
                onChange={(e) => setFormData({ ...formData, emailFrom: e.target.value })}
                placeholder="admin@miresidencial.com"
              />
              <p className="text-xs text-slate-500 mt-1">Email desde el cual se enviarán todos los mensajes</p>
            </div>
            <div>
              <Label htmlFor="emailFromName">Nombre del Remitente</Label>
              <Input
                id="emailFromName"
                value={formData.emailFromName}
                onChange={(e) => setFormData({ ...formData, emailFromName: e.target.value })}
                placeholder="Administración Residencial"
              />
              <p className="text-xs text-slate-500 mt-1">Nombre que aparecerá como remitente</p>
            </div>
          </div>
          <div>
            <Label htmlFor="emailSignature">Firma de Email</Label>
            <Textarea
              id="emailSignature"
              value={formData.emailSignature}
              onChange={(e) => setFormData({ ...formData, emailSignature: e.target.value })}
              placeholder="Saludos cordiales,&#10;Administración del Residencial"
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-1">Firma que se agregará al final de todos los emails</p>
          </div>
        </div>

        {/* Configuración de WhatsApp */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Configuración de WhatsApp
          </h3>
          <div>
            <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
            <Input
              id="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+52 555 1234567"
            />
            <p className="text-xs text-slate-500 mt-1">
              Número desde el cual se enviarán los mensajes de WhatsApp (incluir código de país)
            </p>
          </div>
        </div>

        {/* Vista previa */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-slate-900">Vista Previa</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="font-medium text-slate-900 mb-2">Email</h4>
              <div className="text-sm text-slate-600">
                <p>
                  <strong>De:</strong> {formData.emailFromName} &lt;{formData.emailFrom}&gt;
                </p>
                <p>
                  <strong>Asunto:</strong> Recibo de Cuotas - Enero 2024
                </p>
                <div className="mt-2 p-2 bg-white rounded border text-xs">
                  Estimado(a) [Nombre],
                  <br />
                  Adjuntamos su recibo de cuotas...
                  <br />
                  <br />
                  {formData.emailSignature.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <h4 className="font-medium text-slate-900 mb-2">WhatsApp</h4>
              <div className="text-sm text-slate-600">
                <p>
                  <strong>Desde:</strong> {formData.whatsappNumber}
                </p>
                <div className="mt-2 p-2 bg-green-100 rounded border text-xs">
                  🏠 *Recibo de Cuotas*
                  <br />
                  <br />
                  Casa: [Casa]
                  <br />
                  Mes: [Mes]
                  <br />
                  Monto: $[Total]
                  <br />
                  <br />
                  Gracias por su pago puntual.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
