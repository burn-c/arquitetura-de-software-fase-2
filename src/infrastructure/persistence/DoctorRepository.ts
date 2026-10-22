import { Doctor } from "../../domain/entities/Doctor.ts";
import { Repository } from "../../domain/repositories/Repository.ts";

export class DoctorRepository extends Repository<Doctor> {
  constructor() {
    super();
  }

  findByName(name: string): Doctor[] {
    return this.findAll().filter((doctor) => doctor.name === name);
  }

  findBySpecialty(specialty: string): Doctor[] {
    return this.findAll().filter((doctor) =>
      doctor.specialties.includes(specialty)
    );
  }
}
