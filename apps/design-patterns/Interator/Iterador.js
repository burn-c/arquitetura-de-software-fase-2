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

  hasPrevious() {
    return this.indice > 0;
  }

  previous() {
    this.indice--;
    return this.colecao[this.indice];
  }
}

module.exports = Iterador;
