class Navegador {
  calcularRota(tipo, origem, destino) {
    if (tipo === 'carro') {
      console.log(`Calculando rota de carro de ${origem} até ${destino}.`);
    } else if (tipo === 'caminhada') {
      console.log(`Calculando rota de caminhada de ${origem} até ${destino}.`);
    } else if (tipo === 'transportePublico') {
      console.log(`Calculando rota de transporte público de ${origem} até ${destino}.`);
    } else {
      console.log('Tipo de rota é desconhecido.');
    }
  }
}

const navegador = new Navegador();

navegador.calcularRota('carro', 'Universidade', 'Aeroporto');
navegador.calcularRota('caminhada', 'Universidade', 'Aeroporto');
navegador.calcularRota('transportePublico', 'Shopping Center', 'Casa');
navegador.calcularRota('navio', 'Rio de Janeiro', 'Santos');