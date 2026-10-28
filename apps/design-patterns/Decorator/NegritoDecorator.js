const TextoDecorator = require('./TextoDecorator');

class NegritoDecorator extends TextoDecorator {
  renderizar() {
    return `<b>${super.renderizar()}</b>`
  }
}

module.exports = NegritoDecorator;
