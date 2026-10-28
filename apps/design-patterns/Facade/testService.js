class EmailService {
  sendMail(to, message) {
    console.log(`Enviando o email para ${to}: ${message}`)
  }
}

class SMSService {
  sendSMS(to, message) {
    console.log(`Enviando o SMS para ${to}: ${message}`)
  }
}

class PushNotificationService {
  sendPushNotification(to, message) {
    console.log(`Enviando a notificação para ${to}: ${message}`)
  }
}

const emailService = new EmailService()
const smsService = new SMSService()
const pushService = new PushNotificationService()

emailService.sendMail('user@example.com', "Seu pedido foi enviado")
smsService.sendSMS('+0123456789', "Seu pedido foi enviado")
pushService.sendPushNotification('user123', "Seu pedido foi enviado")