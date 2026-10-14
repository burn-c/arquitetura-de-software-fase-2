interface ProntuarioDTO {
  id: string;
  pacienteId: string;

  readonly diagnosticos: ReadonlyArray<string>;
  readonly tratamentos: ReadonlyArray<string>;
  readonly medicamentos: ReadonlyArray<string>;

  adicionarDiagnostico(diagnostico: string): void;
  adicionarTratamento(tratamento: string): void;
  adicionarMedicamento(medicamento: string): void;
}

// Opção para o construtor: apenas os dados necessários para criar um prontuário, sem as listas e métodos.
type CriarProntuarioDTO = Omit<
  ProntuarioDTO,
  | "diagnosticos"
  | "tratamentos"
  | "medicamentos"
  | "adicionarDiagnostico"
  | "adicionarTratamento"
  | "adicionarMedicamento"
>;

export class Prontuario implements ProntuarioDTO {
  id: string;
  pacienteId: string;

  // Listas privadas: acessíveis apenas via getters que retornam cópias.
  #diagnosticos: string[] = [];
  #tratamentos: string[] = [];
  #medicamentos: string[] = [];

  constructor(dados: CriarProntuarioDTO) {
    this.id = dados.id;
    this.pacienteId = dados.pacienteId;
  }

  adicionarDiagnostico(diagnostico: string): void {
    this.#diagnosticos.push(diagnostico);
    console.log(`Diagnóstico adicionado ao prontuário do paciente ${this.pacienteId}.`);
  }

  adicionarTratamento(tratamento: string): void {
    this.#tratamentos.push(tratamento);
    console.log(`Tratamento adicionado ao prontuário do paciente ${this.pacienteId}.`);
  }

  adicionarMedicamento(medicamento: string): void {
    this.#medicamentos.push(medicamento);
    console.log(`Medicamento adicionado ao prontuário do paciente ${this.pacienteId}.`);
  }

  get diagnosticos(): ReadonlyArray<string> {
    return [...this.#diagnosticos];
  }

  get tratamentos(): ReadonlyArray<string> {
    return [...this.#tratamentos];
  }

  get medicamentos(): ReadonlyArray<string> {
    return [...this.#medicamentos];
  }
}

if (import.meta.main) {
  const prontuario1 = new Prontuario({
    id: "pro-001",
    pacienteId: "123",
  });

  prontuario1.adicionarDiagnostico("Hipertensão");
  prontuario1.adicionarTratamento("Redução no consumo de sal");
  prontuario1.adicionarMedicamento("Captopril");

  console.log(`Prontuário ${prontuario1.id} do paciente ${prontuario1.pacienteId}:`);
  console.log(`Diagnósticos: ${prontuario1.diagnosticos.join(", ")}`);
  console.log(`Tratamentos: ${prontuario1.tratamentos.join(", ")}`);
  console.log(`Medicamentos: ${prontuario1.medicamentos.join(", ")}`);
}
