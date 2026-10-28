const TextoDecorator = require('./TextoDecorator');

class ItalicoDecorator extends TextoDecorator {
  renderizar() {
    return `<i>${super.renderizar()}</i>`
  }
}

module.exports = ItalicoDecorator;
