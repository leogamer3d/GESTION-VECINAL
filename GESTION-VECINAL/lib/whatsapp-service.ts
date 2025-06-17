"use client"

interface WhatsAppConfig {
  whatsappNumber: string
}

// Servicio de WhatsApp real usando Twilio API
export const whatsappService = {
  async sendMessage(phone: string, message: string, config: WhatsAppConfig): Promise<boolean> {
    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phone,
          from: config.whatsappNumber,
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al enviar WhatsApp: ${response.statusText}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("Error enviando WhatsApp:", error)
      throw error
    }
  },

  async sendBulkMessages(
    phones: string[],
    message: string,
    config: WhatsAppConfig,
  ): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const phone of phones) {
      try {
        await this.sendMessage(phone, message, config)
        success++
      } catch (error) {
        failed++
        console.error(`Error enviando a ${phone}:`, error)
      }

      // Pausa entre envíos para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return { success, failed }
  },

  async sendReceipt(phone: string, receiptData: any, config: WhatsAppConfig): Promise<boolean> {
    const message = this.generateReceiptMessage(receiptData)
    return this.sendMessage(phone, message, config)
  },

  generateReceiptMessage(receiptData: any): string {
    return `🏠 *Recibo de Cuotas*

📋 *Detalles:*
• Casa: ${receiptData.casa}
• Período: ${receiptData.mes} ${receiptData.año}
• Fecha límite: ${receiptData.fechaLimite}

💰 *Total a pagar: $${receiptData.total?.toLocaleString() || "0"}*

📄 El recibo detallado ha sido enviado por email.

Gracias por su pago puntual. 🙏

Para consultas, responda a este mensaje.`
  },

  async sendNotification(phone: string, message: string, config: WhatsAppConfig): Promise<boolean> {
    const formattedMessage = `🏠 *Notificación Residencial*

${message}

Para más información, contáctenos.`

    return this.sendMessage(phone, formattedMessage, config)
  },
}
