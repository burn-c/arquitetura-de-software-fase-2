const ColecaoUsuarios = require('./ColecaoUsuarios');
const ColecaoProdutos = require('./ColecaoProdutos');

const usuarios = new ColecaoUsuarios();
usuarios.adicionar({ nome: 'Carlos', idade: 21 });
usuarios.adicionar({ nome: 'Ana', idade: 23 });
usuarios.adicionar({ nome: 'Beto', idade: 25 });

const iteradorUsuarios = usuarios.criarIterador();

// console.log("Iterando usuários: ")

// while (iteradorUsuarios.hasNext()) {
//   console.log(iteradorUsuarios.next())
// }

// console.log("Iterando usuários ao contrário: ")

// while (iteradorUsuarios.hasPrevious()) {
//   console.log(iteradorUsuarios.previous())
// }

const produtos = new ColecaoProdutos();
produtos.adicionar({ nome: 'Geladeira', valor: 3500 });
produtos.adicionar({ nome: 'Lava-louça', valor: 2000 });
produtos.adicionar({ nome: 'Máquina de lavar', valor: 2100 });

const iteradorProdutos = produtos.criarIterador();

console.log("Iterando Produtos: ")

while (iteradorProdutos.hasNext()) {
  console.log(iteradorProdutos.next())
}

console.log("Iterando Produtos ao contrário: ")

while (iteradorProdutos.hasPrevious()) {
  console.log(iteradorProdutos.previous())
}
