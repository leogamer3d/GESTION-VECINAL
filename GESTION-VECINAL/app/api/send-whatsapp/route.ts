import { type NextRequest, NextResponse } from "next/server"

// Configuración para Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { to, from, message } = await request.json()

    // Validar datos requeridos
    if (!to || !from || !message) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Formatear números de teléfono
    const formattedTo = to.startsWith("+") ? to : `+${to.replace(/\D/g, "")}`
    const formattedFrom = from.startsWith("+") ? from : `+${from.replace(/\D/g, "")}`

    // Si tienes Twilio configurado
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

      const response = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${formattedFrom}`,
          To: `whatsapp:${formattedTo}`,
          Body: message,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Twilio API error: ${error}`)
      }

      const result = await response.json()
      return NextResponse.json({ success: true, sid: result.sid })
    }

    // Fallback: Simular envío exitoso (para desarrollo)
    console.log("📱 WhatsApp simulado enviado:", {
      to: formattedTo,
      from: formattedFrom,
      message: message.substring(0, 100) + "...",
    })

    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      sid: `sim_${Date.now()}`,
      message: "WhatsApp enviado exitosamente (modo simulación)",
    })
  } catch (error) {
    console.error("Error enviando WhatsApp:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
