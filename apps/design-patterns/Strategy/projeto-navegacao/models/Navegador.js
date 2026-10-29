class Navegador {
  setEstrategia(estrategia) {
    this.estrategia = estrategia;
  }

  calcularRota(origem, destino) {
    if (!this.estrategia) {
      console.log("Nenhuma estratégia foi definida!");
      return;
    }
    this.estrategia.calcular(origem, destino);
  }
}

module.exports = Navegador;
