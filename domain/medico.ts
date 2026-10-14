export interface HorarioAtendimento {
  dias: ReadonlyArray<string>;
  horario: string;
}

interface MedicoDTO {
  id: string;
  crm: string;
  nome: string;
  especialidades: ReadonlyArray<string>;
  telefone: string;
  horarioAtendimento: HorarioAtendimento;
}

type CriarMedicoDTO = Omit<MedicoDTO, "especialidades"> & {
  especialidades: string[];
};

export class Medico implements MedicoDTO {
  id: string;
  crm: string;
  nome: string;
  telefone: string;

  #especialidades: string[];
  #horarioAtendimento: HorarioAtendimento;

  constructor(dados: CriarMedicoDTO) {
    this.id = dados.id;
    this.crm = dados.crm;
    this.nome = dados.nome;
    this.telefone = dados.telefone;
    this.#especialidades = dados.especialidades;
    this.#horarioAtendimento = {
      dias: [...dados.horarioAtendimento.dias],
      horario: dados.horarioAtendimento.horario,
    };
  }

  adicionarEspecialidade(especialidade: string): void {
    this.#especialidades.push(especialidade);
    console.log(`Especialidade ${especialidade} adicionada ao Dr(a). ${this.nome}.`);
  }

  get especialidades(): ReadonlyArray<string> {
    return [...this.#especialidades];
  }

  get horarioAtendimento(): HorarioAtendimento {
    return {
      dias: [...this.#horarioAtendimento.dias],
      horario: this.#horarioAtendimento.horario,
    };
  }
}

if (import.meta.main) {
  const medico1 = new Medico({
    id: "med-001",
    crm: "CRM-SP 123456",
    nome: "Maria Santos",
    especialidades: ["Cardiologia"],
    telefone: "(11) 91234-5678",
    horarioAtendimento: { dias: ["Segunda", "Quarta"], horario: "08:00-17:00" },
  });

  medico1.adicionarEspecialidade("Clínica Geral");

  console.log(`Dr(a). ${medico1.nome} (${medico1.crm})`);
  console.log(`Especialidades: ${medico1.especialidades.join(", ")}`);
  console.log(
    `Atendimento: ${medico1.horarioAtendimento.dias.join(", ")} das ${medico1.horarioAtendimento.horario}`,
  );
}
