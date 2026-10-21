export interface AllergyDTO {
  type: string;
}

export class Allergy {
  type: string;
  constructor(data: AllergyDTO) {
    this.type = data.type;
  }

  equals(otherAllergy: Allergy): boolean {
    return this.type === otherAllergy.type;
  }
}