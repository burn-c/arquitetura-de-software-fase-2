const Observer = require('./Observer');

class Cliente extends Observer {
  #nome;

  constructor(nome) {
    super();
    this.#nome = nome;
  }

  atualizar(produto) {
    console.log(`${this.#nome}, o produto ${produto} está disponível!`);
  }
}

module.exports = Cliente;
