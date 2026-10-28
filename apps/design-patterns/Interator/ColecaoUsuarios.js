const Iterador = require("./Iterador");

class ColecaoUsuarios {
  constructor() {
    this.usuarios = [];
  }

  adicionar(usuario) {
    this.usuarios.push(usuario);
  }

  criarIterador() {
    return new Iterador(this.usuarios);
  }
}

module.exports = ColecaoUsuarios;
