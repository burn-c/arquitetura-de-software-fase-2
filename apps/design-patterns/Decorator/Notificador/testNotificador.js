
class Notificador {
  enviar(mensagem) {
    console.log(`Enviando mensagem por email: ${mensagem}`);
  }
}

class NotificadorSMS extends Notificador {
  enviar(mensagem) {
    super.enviar(mensagem)
    console.log(`Enviando mensagem por SMS: ${mensagem}`);
  }
}

class NotificadorSlack extends Notificador {
  enviar(mensagem) {
    super.enviar(mensagem)
    console.log(`Enviando mensagem por Slack: ${mensagem}`);
  }
}

const notificador = new NotificadorSMS();

notificador.enviar("Sistema em manutenção!")