const Notificador = require("./Notificador");

class NotificadorDecorator extends Notificador {
  constructor(notificador) {
    super()
    this.notificador = notificador
  }

  enviar(mensagem) {
    this.notificador.enviar(mensagem);
  }
}

module.exports = NotificadorDecorator;
