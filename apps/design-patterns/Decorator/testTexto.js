class Texto {
  constructor(conteudo) {
    this.conteudo = conteudo;
  }
  renderizar() {
    return this.conteudo;
  }
}
class TextoNegrito extends Texto {
  renderizar() {
    return `<b>${super.renderizar()}</b>`
  }
}
class TextoItalico extends Texto {
  renderizar() {
    return `<i>${super.renderizar()}</i>`
  }
}
class TextoSublinhado extends Texto {
  renderizar() {
    return `<u>${super.renderizar()}</u>`
  }
}
class TextoItalicoNegrito extends Texto {
  renderizar() {
    return `<i><b>${super.renderizar()}</b></i>`
  }
}
let texto = new TextoItalicoNegrito("Hello, Rocket!")
texto = new TextoNegrito(texto)
console.log(texto.renderizar())