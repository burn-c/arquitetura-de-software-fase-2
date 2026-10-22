export interface EmergencyContactDTO {
  readonly name: string;
  readonly phone: string;
}

export class EmergencyContact implements EmergencyContactDTO {
  readonly name: string;
  readonly phone: string;

  constructor(data: EmergencyContactDTO) {
    this.name = data.name;
    this.phone = data.phone;

    // Imutabilidade em runtime: depois de criado, o objeto não aceita reatribuição
    // nem novos atributos. O `readonly` acima garante o mesmo em tempo de compilação.
    Object.freeze(this);
  }

  equals(otherContact: EmergencyContact): boolean {
    return this.name === otherContact.name && this.phone === otherContact.phone;
  }
}
