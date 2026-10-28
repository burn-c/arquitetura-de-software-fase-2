const TextoDecorator = require('./TextoDecorator');

class SublinhadoDecorator extends TextoDecorator {
  renderizar() {
    return `<u>${super.renderizar()}</u>`
  }
}

module.exports = SublinhadoDecorator;
