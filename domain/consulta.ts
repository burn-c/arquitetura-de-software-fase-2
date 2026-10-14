type StatusConsulta = "agendada" | "realizada" | "cancelada";

interface ConsultaDTO {
  id: string;
  data: Date;
  pacienteId: string;
  medicoId: string;
  motivo: string;
  status: StatusConsulta;
  observacoes?: string;
}

// Opção para o construtor: status é opcional e assume "agendada" por padrão.
type CriarConsultaDTO = Omit<ConsultaDTO, "status"> & { status?: StatusConsulta };

export class Consulta implements ConsultaDTO {
  id: string;
  data: Date;
  pacienteId: string;
  medicoId: string;
  motivo: string;
  observacoes?: string;

  #status: StatusConsulta;

  constructor(dados: CriarConsultaDTO) {
    this.id = dados.id;
    this.data = dados.data;
    this.pacienteId = dados.pacienteId;
    this.medicoId = dados.medicoId;
    this.motivo = dados.motivo;
    this.observacoes = dados.observacoes;
    this.#status = dados.status ?? "agendada";
  }

  realizar(): void {
    if (this.#status !== "agendada") {
      throw new Error("Apenas consultas agendadas podem ser realizadas.");
    }

    this.#status = "realizada";
    console.log(`Consulta ${this.id} marcada como realizada.`);
  }

  cancelar(): void {
    if (this.#status === "realizada") {
      throw new Error("Uma consulta já realizada não pode ser cancelada.");
    }

    this.#status = "cancelada";
    console.log(`Consulta ${this.id} cancelada.`);
  }

  get status(): StatusConsulta {
    return this.#status;
  }
}

const consulta1 = new Consulta({
  id: "con-001",
  data: new Date("2023-06-15"),
  pacienteId: "123",
  medicoId: "med-001",
  motivo: "Consulta cardiológica de rotina",
  observacoes: "Paciente em jejum.",
});

console.log(`Status inicial: ${consulta1.status}`);
consulta1.realizar();
console.log(`Status final: ${consulta1.status}`);
