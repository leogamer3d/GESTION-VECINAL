"use client"

interface EmailConfig {
  emailFrom: string
  emailFromName: string
  emailSignature: string
}

// Servicio de email real usando Resend API
export const emailService = {
  async sendReceipt(email: string, receiptData: any, config: EmailConfig): Promise<boolean> {
    try {
      const emailContent = this.generateReceiptEmail(receiptData, config)

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          from: config.emailFrom,
          fromName: config.emailFromName,
          subject: `Recibo de Cuotas - ${receiptData.mes} ${receiptData.año}`,
          html: emailContent,
          attachments: receiptData.pdfBuffer
            ? [
                {
                  filename: `recibo_${receiptData.casa}_${receiptData.mes}_${receiptData.año}.pdf`,
                  content: receiptData.pdfBuffer,
                  type: "application/pdf",
                },
              ]
            : [],
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.statusText}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("Error enviando email:", error)
      throw error
    }
  },

  async sendBulkReceipts(
    emails: string[],
    receiptData: any,
    config: EmailConfig,
  ): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const email of emails) {
      try {
        await this.sendReceipt(email, receiptData, config)
        success++
      } catch (error) {
        failed++
        console.error(`Error enviando a ${email}:`, error)
      }

      // Pequeña pausa entre envíos para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return { success, failed }
  },

  async sendNotification(email: string, subject: string, message: string, config: EmailConfig): Promise<boolean> {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          from: config.emailFrom,
          fromName: config.emailFromName,
          subject: subject,
          html: this.generateNotificationEmail(message, config),
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al enviar notificación: ${response.statusText}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("Error enviando notificación:", error)
      throw error
    }
  },

  generateReceiptEmail(receiptData: any, config: EmailConfig): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .receipt-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; color: #2563eb; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏠 Recibo de Cuotas</h1>
          <p>Residencial - ${receiptData.mes} ${receiptData.año}</p>
        </div>
        
        <div class="content">
          <p>Estimado(a) propietario(a),</p>
          
          <p>Adjuntamos el recibo correspondiente a las cuotas del mes de <strong>${receiptData.mes} ${receiptData.año}</strong>.</p>
          
          <div class="receipt-details">
            <h3>Detalles del Recibo</h3>
            <p><strong>Casa:</strong> ${receiptData.casa}</p>
            <p><strong>Período:</strong> ${receiptData.mes} ${receiptData.año}</p>
            <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Fecha límite de pago:</strong> ${receiptData.fechaLimite}</p>
            <p class="total"><strong>Total a pagar: $${receiptData.total?.toLocaleString() || "0"}</strong></p>
          </div>
          
          <p>Por favor, realice el pago antes de la fecha límite para evitar recargos.</p>
          
          <p>Si tiene alguna pregunta o necesita aclaración sobre este recibo, no dude en contactarnos.</p>
          
          <div class="footer">
            ${config.emailSignature
              .split("\n")
              .map((line) => `<p>${line}</p>`)
              .join("")}
          </div>
        </div>
      </body>
      </html>
    `
  },

  generateNotificationEmail(message: string, config: EmailConfig): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .message { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏠 Notificación Residencial</h1>
        </div>
        
        <div class="content">
          <div class="message">
            ${message
              .split("\n")
              .map((line) => `<p>${line}</p>`)
              .join("")}
          </div>
          
          <div class="footer">
            ${config.emailSignature
              .split("\n")
              .map((line) => `<p>${line}</p>`)
              .join("")}
          </div>
        </div>
      </body>
      </html>
    `
  },
}
