const Logistica = require("./Logistica");
const Caminhao = require("../transporte/Caminhao");

class LogisticaTerrestre extends Logistica {
  criarTransporte() {
    return new Caminhao();
  }
}

module.exports = LogisticaTerrestre;
