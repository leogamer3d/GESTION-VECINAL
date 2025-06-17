import { type NextRequest, NextResponse } from "next/server"

// Configuración para Resend (puedes cambiar por SendGrid, Nodemailer, etc.)
const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { to, from, fromName, subject, html, attachments } = await request.json()

    // Validar datos requeridos
    if (!to || !from || !subject || !html) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Si tienes Resend configurado
    if (RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${fromName} <${from}>`,
          to: [to],
          subject: subject,
          html: html,
          attachments: attachments,
        }),
      })

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`)
      }

      const result = await response.json()
      return NextResponse.json({ success: true, id: result.id })
    }

    // Fallback: Simular envío exitoso (para desarrollo)
    console.log("📧 Email simulado enviado:", {
      to,
      from: `${fromName} <${from}>`,
      subject,
      hasAttachments: attachments?.length > 0,
    })

    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      id: `sim_${Date.now()}`,
      message: "Email enviado exitosamente (modo simulación)",
    })
  } catch (error) {
    console.error("Error enviando email:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
