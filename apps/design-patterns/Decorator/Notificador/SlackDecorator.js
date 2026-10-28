const NotificadorDecorator = require("./NotificadorDecorator");

class SlackDecorator extends NotificadorDecorator {
  enviar(mensagem) {
    super.enviar(mensagem)
    console.log(`Enviando mensagem por Slack: ${mensagem}`);
  }
}

module.exports = SlackDecorator;
