const Notificador = require('./Notificador');
const NotificadorDecorator = require('./NotificadorDecorator');
const SMS = require('./SMSDecorator');
const Slack = require('./SlackDecorator');

const notificadorBase = new Notificador();

const notificadorSMS = new SMS(notificadorBase)

const notificadorSlack = new Slack(notificadorSMS)

const notificadorSlack2 = new Slack(notificadorSlack)

notificadorSlack2.enviar('Sistema em manutenção!')
