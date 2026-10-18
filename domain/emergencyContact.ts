export interface EmergencyContactDTO {
  name: string;
  phone: string;
}

export class EmergencyContact implements EmergencyContactDTO {
  name: string;
  phone: string;

  constructor(data: EmergencyContactDTO) {
    this.name = data.name;
    this.phone = data.phone;
  }

  equals(otherContact: EmergencyContact): boolean {
    return this.name === otherContact.name && this.phone === otherContact.phone;
  }
}