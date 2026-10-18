export interface DiagnosesDTO {
  readonly description: string;
}

export class Diagnoses implements DiagnosesDTO {
  readonly description: string;

  constructor(data: DiagnosesDTO) {
    this.description = data.description;

    // Imutabilidade em runtime: depois de criado, o objeto não aceita reatribuição
    // nem novos atributos. O `readonly` acima garante o mesmo em tempo de compilação.
    Object.freeze(this);
  }

  equals(otherDiagnoses: Diagnoses): boolean {
    return this.description === otherDiagnoses.description;
  }
}
