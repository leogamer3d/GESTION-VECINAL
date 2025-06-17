import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

interface CommunicationServiceConfig {
  awsRegion: string
  sesSourceEmail: string
  snsTopicArn: string
}

interface EmailOptions {
  to: string[]
  subject: string
  body: string
}

interface WhatsAppOptions {
  phoneNumber: string
  message: string
}

export class CommunicationService {
  private sesClient: SESClient
  private snsClient: SNSClient
  private sesSourceEmail: string
  private snsTopicArn: string

  constructor(config: CommunicationServiceConfig) {
    this.sesClient = new SESClient({ region: config.awsRegion })
    this.snsClient = new SNSClient({ region: config.awsRegion })
    this.sesSourceEmail = config.sesSourceEmail
    this.snsTopicArn = config.snsTopicArn
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const { to, subject, body } = options

    const params = {
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Body: {
          Text: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: this.sesSourceEmail,
    }

    const command = new SendEmailCommand(params)

    try {
      await this.sesClient.send(command)
      console.log("Email sent successfully to:", to)
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }

  async sendWhatsApp(options: WhatsAppOptions): Promise<void> {
    const { phoneNumber, message } = options

    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    }

    const command = new PublishCommand(params)

    try {
      await this.snsClient.send(command)
      console.log("WhatsApp message sent successfully to:", phoneNumber)
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
      throw error
    }
  }
}
