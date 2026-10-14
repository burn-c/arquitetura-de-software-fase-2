interface MedicoDTO {
  id: string;
  crm: string;
  nome: string;
  especialidades: ReadonlyArray<string>;
  telefone: string;
  horarioAtendimento: ReadonlyArray<string>;
}

type CriarMedicoDTO = Omit<MedicoDTO, "especialidades" | "horarioAtendimento"> & {
  especialidades: string[];
  horarioAtendimento: string[];
};

export class Medico implements MedicoDTO {
  id: string;
  crm: string;
  nome: string;
  telefone: string;

  #especialidades: string[];
  #horarioAtendimento: string[];

  constructor(dados: CriarMedicoDTO) {
    this.id = dados.id;
    this.crm = dados.crm;
    this.nome = dados.nome;
    this.telefone = dados.telefone;
    this.#especialidades = dados.especialidades;
    this.#horarioAtendimento = dados.horarioAtendimento;
  }

  adicionarEspecialidade(especialidade: string): void {
    this.#especialidades.push(especialidade);
    console.log(`Especialidade ${especialidade} adicionada ao Dr(a). ${this.nome}.`);
  }

  get especialidades(): ReadonlyArray<string> {
    return [...this.#especialidades];
  }

  get horarioAtendimento(): ReadonlyArray<string> {
    return [...this.#horarioAtendimento];
  }
}

const medico1 = new Medico({
  id: "med-001",
  crm: "CRM-SP 123456",
  nome: "Maria Santos",
  especialidades: ["Cardiologia"],
  telefone: "(11) 91234-5678",
  horarioAtendimento: ["Seg-Sex 08:00-17:00"],
});

medico1.adicionarEspecialidade("Clínica Geral");

console.log(`Dr(a). ${medico1.nome} (${medico1.crm})`);
console.log(`Especialidades: ${medico1.especialidades.join(", ")}`);
console.log(`Atendimento: ${medico1.horarioAtendimento.join(", ")}`);
