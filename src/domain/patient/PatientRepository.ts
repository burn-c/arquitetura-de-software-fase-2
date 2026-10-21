import { Repository } from "../shared/PatientRepository.ts";

export class PatientRepository extends Repository {
  constructor() {
    super();
  }

  findByName(name: string): any[] {
    return this.findAll().filter((patient) => patient.name === name);
  }

  findByBloodType(bloodType: string): any[] {
    return this.findAll().filter((patient) => patient.bloodType === bloodType);
  }
}