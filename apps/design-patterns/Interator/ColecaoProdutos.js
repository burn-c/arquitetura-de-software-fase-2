const Iterador = require("./Iterador");

class ColecaoProdutos {
  constructor() {
    this.produtos = [];
  }

  adicionar(produto) {
    this.produtos.push(produto);
  }

  criarIterador() {
    return new Iterador(this.produtos);
  }
}

module.exports = ColecaoProdutos;
