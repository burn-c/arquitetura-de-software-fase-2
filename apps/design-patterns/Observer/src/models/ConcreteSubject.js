const Subject = require('./Subject');

class Loja extends Subject {
  adicionarObserver(observer) {
    this.observers.push(observer);
  }

  removerObserver(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notificarObservers(produto) {
    for (const observer of this.observers) {
      observer.atualizar(produto);
    }
  }

  receberNovoProduto(produto) {
    console.log(`Novo produto chegou à loja: ${produto}`);
    this.notificarObservers(produto);
  }
}

module.exports = Loja;
