const Cliente = require('./models/ConcreteObserver');
const Loja = require('./models/ConcreteSubject');

const loja = new Loja();
const clienteA = new Cliente('Carlos');
const clienteB = new Cliente('Ana');
const clienteC = new Cliente('Beto');

loja.adicionarObserver(clienteA);
loja.adicionarObserver(clienteB);
loja.adicionarObserver(clienteC);

loja.removerObserver(clienteA);

loja.receberNovoProduto('PlayStation 5');
