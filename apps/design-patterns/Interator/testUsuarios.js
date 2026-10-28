class ColecaoUsuarios {
  constructor() {
    this.usuarios = [];
  }

  adicionar(usuario) {
    this.usuarios.push(usuario);
  }

  obterTodos() {
    for (let i = 0; i < this.usuarios.length; i++) {
      console.log(this.usuarios[i]);
    }
  }
}

const usuarios = new ColecaoUsuarios();
usuarios.adicionar({ nome: 'Carlos', idade: 21 });
usuarios.adicionar({ nome: 'Ana', idade: 23 });
usuarios.adicionar({ nome: 'Beto', idade: 25 });

usuarios.obterTodos();