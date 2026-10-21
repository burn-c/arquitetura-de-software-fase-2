import { Repository } from "../shared/PatientRepository.ts";

export class DoctorRepository extends Repository {
  constructor() {
    super();
  }

  findByName(name: string): any[] {
    return this.findAll().filter((doctor) => doctor.name === name);
  }

  findBySpecialty(specialty: string): any[] {
    return this.findAll().filter((doctor) =>
      doctor.specialties.includes(specialty)
    );
  }
}