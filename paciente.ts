export interface Consulta {
  data: Date;
  medico: string;
}

export interface Exame {
  nomeExame: string;
  resultado: string;
}

interface PacienteDTO {
  id: string;
  cpf: string;
  nome: string;
  dataNasc: Date;
  genero: "Masculino" | "Feminino";
  tipoSanguineo: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  alergias: Array<string>;
  endereço: string;
  telefone: string;
  email: string;
  contatoEmergencia: string;

  historicoMedico?: Array<string>; // Histórico médico opcional, pode ser uma lista de strings descrevendo condições médicas anteriores

  // 1. A interface declara que as listas são APENAS LEITURA por fora
  readonly consultas: ReadonlyArray<Consulta>;
  readonly exames: ReadonlyArray<Exame>;

  agendarConsulta(consulta: Consulta): void;
  adicionarExame(exame: Exame): void;
}

// Opção para o construtor: apenas os dados necessários para criar um paciente, sem métodos e listas de consultas/exames.
type CriarPacienteDTO = Omit<PacienteDTO, "consultas" | "exames" | "agendarConsulta" | "adicionarExame">;

class Paciente implements PacienteDTO {
  // 1. Declarar as propriedades obrigatoriamente
  id: string;
  cpf: string;
  nome: string;
  dataNasc: Date;
  alergias: Array<string>;
  endereço: string;
  telefone: string;
  email: string;
  contatoEmergencia: string;
  genero: "Masculino" | "Feminino";
  tipoSanguineo: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  historicoMedico: Array<string>;

  // Propriedades privadas realmente privadas, não acessíveis de fora da classe
  #consultas: Consulta[] = [];
  #exames: Exame[] = [];

  // 2. Construtor recebendo um objeto (limpo e sem confusão de ordem de argumentos)
  constructor(dados: CriarPacienteDTO) {
    this.id = dados.id;
    this.cpf = dados.cpf;
    this.nome = dados.nome;
    this.dataNasc = dados.dataNasc;
    this.alergias = dados.alergias;
    this.endereço = dados.endereço;
    this.telefone = dados.telefone;
    this.email = dados.email;
    this.contatoEmergencia = dados.contatoEmergencia;
    this.genero = dados.genero;
    this.tipoSanguineo = dados.tipoSanguineo;

    this.historicoMedico = [];
    this.#consultas = [];
    this.#exames = [];
  }

  // 3. Métodos no corpo da classe (fora do constructor)
  agendarConsulta(consulta: Consulta): void {
    this.#consultas.push(consulta);

    const consultaNoMesmoHorario = this.#consultas.some((c) => c.data === consulta.data);

    if (consultaNoMesmoHorario) {
      throw new Error("Paciente já possui uma consulta agendada neste horário.");
    }

    console.log(`Consulta agendada para ${this.nome} em ${consulta.data.toLocaleDateString()} com o médico ${consulta.medico}.`);
  }

  adicionarExame(exame: Exame): void {
    this.#exames.push(exame);
    console.log(`Exame ${exame.nomeExame} adicionado para ${this.nome} com resultado: ${exame.resultado}.`);
  }

  adicionarEventoHistorico(evento: string): void {
    this.historicoMedico.push(evento);
    console.log(`Evento adicionado ao histórico médico de ${this.nome}: ${evento}`);
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
  historicoMedico: ["Hipertensão controlada", "Apendicectomia em 2010"],
  alergias: ["Nenhuma alergia conhecida."],
  endereço: "Rua das Flores, 123, São Paulo, SP",
  telefone: "(11) 98765-4321",
  email: "joao.silva@email.com",
  contatoEmergencia: "(11) 98765-4321",
  genero: "Masculino",
  tipoSanguineo: "A+",
  cpf: "123.456.789-00",
  id: "123",
});

paciente1.agendarConsulta({ 
  data: new Date("2023-06-15"), 
  medico: "Dr. João" 
});

paciente1.adicionarExame({ 
  nomeExame: "Eletrocardiograma", 
  resultado: "Normal" 
});

paciente1.adicionarEventoHistorico("Apendicectomia em 2010");
