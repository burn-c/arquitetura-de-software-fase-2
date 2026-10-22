export interface TreatmentDTO {
  readonly description: string;
}

export class Treatment implements TreatmentDTO {
  readonly description: string;

  constructor(data: TreatmentDTO) {
    this.description = data.description;

    // Imutabilidade em runtime: depois de criado, o objeto não aceita reatribuição
    // nem novos atributos. O `readonly` acima garante o mesmo em tempo de compilação.
    Object.freeze(this);
  }

  equals(otherTreatment: Treatment): boolean {
    return this.description === otherTreatment.description;
  }
}
