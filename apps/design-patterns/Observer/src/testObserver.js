class Loja {
  constructor() {
    this.produtoDisponivel = false;
  }

  notificarClientes() {
    if (this.produtoDisponivel) {
      console.log("Notificando clientes sobre chegada de produto!");
      console.log("Cliente A: Produto disponível!");
      console.log("Cliente B: Produto disponível!");
    }
  }

  receberNovoProduto() {
    console.log("O produto chegou à loja!");
    this.produtoDisponivel = true;
    this.notificarClientes();
  }
}

const loja = new Loja();

loja.notificarClientes()