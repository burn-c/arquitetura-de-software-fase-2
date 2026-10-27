
class Caminhao {
  entregar() {
    console.log('Entrega realizada por caminhão!');
  }
}

class Navio {
  entregar() {
    console.log('Entrega realizada por navio!');
  }
}

const tipoDeTransporte = "caminhão"

let transporte;

if (tipoDeTransporte === "caminhão") {
  transporte = new Caminhao()
} else if (tipoDeTransporte === "navio") {
  transporte = new Navio()
}

transporte.entregar()