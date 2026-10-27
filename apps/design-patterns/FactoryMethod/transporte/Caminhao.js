const Transporte = require("./Transporte");

class Caminhao extends Transporte {
  entregar() {
    console.log('Entrega realizada por caminhão!');
  }
}

module.exports = Caminhao;