const NotificadorDecorator = require("./NotificadorDecorator");

class SMSDecorator extends NotificadorDecorator {
  enviar(mensagem) {
    super.enviar(mensagem)
    console.log(`Enviando mensagem por SMS: ${mensagem}`);
  }
}

module.exports = SMSDecorator;
