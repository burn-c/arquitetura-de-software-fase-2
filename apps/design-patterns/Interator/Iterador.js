class Iterador {
  constructor(colecao) {
    this.colecao = colecao;
    this.indice = 0;
  }

  hasNext() {
    return this.indice < this.colecao.length;
  }

  next() {
    const item = this.colecao[this.indice];
    this.indice++;
    return item;
  }
}

module.exports = Iterador;
