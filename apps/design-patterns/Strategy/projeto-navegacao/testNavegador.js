const Navegador = require('./models/Navegador');
const RotaCarro = require('./models/RotaCarro');
const RotaTransportePublico = require('./models/RotaTransportePublico');
const RotaCaminhada = require('./models/RotaCaminhada');
const RotaNavio = require('./models/RotaNavio');

const navegador = new Navegador();

navegador.setEstrategia(new RotaCarro());
navegador.calcularRota('Casa', 'Aeroporto');

navegador.setEstrategia(new RotaTransportePublico());
navegador.calcularRota('Aeroporto', 'Shopping Center');

navegador.setEstrategia(new RotaCaminhada());
navegador.calcularRota('Shopping Center', 'Casa');

navegador.setEstrategia(new RotaNavio());
navegador.calcularRota('Rio de Janeiro', 'Santos');
