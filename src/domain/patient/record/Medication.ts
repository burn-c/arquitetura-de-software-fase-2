export interface MedicationDTO {
  readonly name: string;
  readonly dosage: string;
}

export class Medication implements MedicationDTO {
  readonly name: string;
  readonly dosage: string;

  constructor(data: MedicationDTO) {
    this.name = data.name;
    this.dosage = data.dosage;

    // Imutabilidade em runtime: depois de criado, o objeto não aceita reatribuição
    // nem novos atributos. O `readonly` acima garante o mesmo em tempo de compilação.
    Object.freeze(this);
  }

  equals(otherMedication: Medication): boolean {
    return this.name === otherMedication.name && this.dosage === otherMedication.dosage;
  }
}
