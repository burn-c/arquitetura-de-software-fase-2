const Texto = require('./Texto');

class TextoDecorator extends Texto {
  constructor(texto) {
    super();
    this.texto = texto;
  }

  renderizar() {
    return this.texto.renderizar();
  }
}

module.exports = TextoDecorator;
