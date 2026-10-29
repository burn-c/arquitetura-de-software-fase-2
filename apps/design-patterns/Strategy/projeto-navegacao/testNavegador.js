const Navegador = require('./models/Navegador');
const RotaCarro = require('./models/RotaCarro');
const RotaTransportePublico = require('./models/RotaTransportePublico');
const RotaCaminhada = require('./models/RotaCaminhada');

const navegador = new Navegador();

// Sem estratégia definida, o próprio Navegador avisa em vez de decidir com if/else.
navegador.calcularRota('Casa', 'Aeroporto');

navegador.setEstrategia(new RotaCarro());
navegador.calcularRota('Casa', 'Aeroporto');

navegador.setEstrategia(new RotaTransportePublico());
navegador.calcularRota('Aeroporto', 'Shopping Center');

navegador.setEstrategia(new RotaCaminhada());
navegador.calcularRota('Shopping Center', 'Casa');
