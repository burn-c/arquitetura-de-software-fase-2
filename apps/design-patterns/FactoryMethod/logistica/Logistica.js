class Logistica {
  criarTransporte() {
    throw new Error("Método criarTransporte() deve ser implementado")
  }

  entregarCarga() {
    const transporte = this.criarTransporte();
    transporte.entregar();
  }
}

module.exports = Logistica;
