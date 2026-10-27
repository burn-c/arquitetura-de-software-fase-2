const Logistica = require('./Logistica');
const Navio = require('../transporte/Navio');

class LogisticaMaritima extends Logistica {
  criarTransporte() {
    return new Navio()
  }
}

module.exports = LogisticaMaritima;
