const EstrategiaRota = require('./EstrategiaRota');

class RotaNavio extends EstrategiaRota {
  calcular(origem, destino) {
    console.log(`Calculando rota de navio de ${origem} até ${destino}.`);
  }
}

module.exports = RotaNavio;
