export interface Consulta {
  data: Date;
  medico: string;
}

export interface Exame {
  nomeExame: string;
  resultado: string;
}

interface PacienteDTO {
  nome: string;
  dataNasc: Date;
  historico: string;
  alergia: string;
  endereço: string;
  telefone: string;
  email: string;

  // 1. A interface declara que as listas são APENAS LEITURA por fora
  readonly consultas: ReadonlyArray<Consulta>;
  readonly exames: ReadonlyArray<Exame>;

  agendarConsulta(data: Date, medico: string): void;
  adicionarExame(nomeExame: string, resultado: string): void;
}

// Opção para o construtor: apenas os dados necessários para criar um paciente, sem métodos e listas de consultas/exames.
type CriarPacienteDTO = Omit<PacienteDTO, "consultas" | "exames" | "agendarConsulta" | "adicionarExame">;

class Paciente implements PacienteDTO {
  // 1. Declarar as propriedades obrigatoriamente
  nome: string;
  dataNasc: Date;
  historico: string;
  alergia: string;
  endereço: string;
  telefone: string;
  email: string;

  // Propriedades privadas realmente privadas, não acessíveis de fora da classe
  #consultas: { data: Date; medico: string }[] = [];
  #exames: { nomeExame: string; resultado: string }[] = [];

  // 2. Construtor recebendo um objeto (limpo e sem confusão de ordem de argumentos)
  constructor(dados: CriarPacienteDTO) {
    this.nome = dados.nome;
    this.dataNasc = dados.dataNasc;
    this.historico = dados.historico;
    this.alergia = dados.alergia;
    this.endereço = dados.endereço;
    this.telefone = dados.telefone;
    this.email = dados.email;
  }

  // 3. Métodos no corpo da classe (fora do constructor)
  agendarConsulta(data: Date, medico: string): void {
    this.#consultas.push({ data, medico });
    console.log(`Consulta agendada para ${this.nome} em ${data.toLocaleDateString()} com o médico ${medico}.`);
  }

  adicionarExame(nomeExame: string, resultado: string): void {
    this.#exames.push({ nomeExame, resultado });
    console.log(`Exame ${nomeExame} adicionado para ${this.nome} com resultado: ${resultado}.`);
  }

  // 4. Getters para acessar as listas privadas de fora da classe, retornando cópias para evitar alterações externas
  get consultas(): ReadonlyArray<Consulta> {
    return [...this.#consultas];
  }

  get exames(): ReadonlyArray<Exame> {
    return [...this.#exames];
  }
}

const paciente1 = new Paciente({
  nome: "João Silva",
  dataNasc: new Date("1990-05-15"),
  historico: "Sem histórico relevante.",
  alergia: "Nenhuma alergia conhecida.",
  endereço: "Rua das Flores, 123, São Paulo, SP",
  telefone: "(11) 98765-4321",
  email: "joao.silva@email.com"
});

paciente1.agendarConsulta(new Date("2023-06-15"), "Dra. Maria Santos");
paciente1.adicionarExame("Eletrocardiograma", "Normal");
