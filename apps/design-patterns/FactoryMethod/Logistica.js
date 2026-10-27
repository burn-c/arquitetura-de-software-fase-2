const Caminhao = require("./transporte/Caminhao")
const Navio = require("./transporte/Navio")

const tipoDeTransporte = "caminhão"

let transporte;

if (tipoDeTransporte === "caminhão") {
  transporte = new Caminhao()
} else if (tipoDeTransporte === "navio") {
  transporte = new Navio()
}

transporte.entregar()