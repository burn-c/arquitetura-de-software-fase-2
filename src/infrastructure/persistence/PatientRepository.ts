import { Patient } from "../../domain/entities/Patient.ts";
import { Repository } from "../../domain/repositories/Repository.ts";

export class PatientRepository extends Repository<Patient> {
  constructor() {
    super();
  }

  findByName(name: string): Patient[] {
    return this.findAll().filter((patient) => patient.name === name);
  }

  findByBloodType(bloodType: string): Patient[] {
    return this.findAll().filter((patient) => patient.bloodType === bloodType);
  }
}
