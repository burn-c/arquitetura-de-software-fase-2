class Subject {
  constructor() {
    this.observers = [];
  }

  adicionarObserver(observer) {
    throw new Error('O método adicionarObserver precisa ser implementado');
  }

  removerObserver(observer) {
    throw new Error('O método removerObserver precisa ser implementado');
  }

  notificarObservers(produto) {
    throw new Error('O método notificarObservers precisa ser implementado');
  }
}

module.exports = Subject;
