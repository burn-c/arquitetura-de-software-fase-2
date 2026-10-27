const Transporte = require("./Transporte");

class Navio extends Transporte {
  entregar() {
    console.log('Entrega realizada por navio!');
  }
}

module.exports = Navio;