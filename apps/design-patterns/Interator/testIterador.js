const ColecaoUsuarios = require('./ColecaoUsuarios');

const usuarios = new ColecaoUsuarios();
usuarios.adicionar({ nome: 'Carlos', idade: 21 });
usuarios.adicionar({ nome: 'Ana', idade: 23 });
usuarios.adicionar({ nome: 'Beto', idade: 25 });

const iteradorUsuarios = usuarios.criarIterador();

console.log("Iterando usuários: ")

while (iteradorUsuarios.hasNext()) {
  console.log(iteradorUsuarios.next())
}
