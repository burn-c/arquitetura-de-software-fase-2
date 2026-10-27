const LogisticaTerrestre = require("./logistica/LogisticaTerrestre");
const LogisticaMaritima = require("./logistica/LogisticaMaritima");

const tipoDeLogistica = "terrestre"
let transporte;

if (tipoDeLogistica === "terrestre") {
  transporte = new LogisticaTerrestre();
} else if (tipoDeLogistica === "maritima") {
  transporte = new LogisticaMaritima();
}

transporte.entregarCarga()
