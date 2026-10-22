import type { Doctor } from "../../entities/Doctor.ts";
import type { DoctorRepository } from "../../../infrastructure/persistence/DoctorRepository.ts";

export class DoctorSpecialtyService {
  private readonly doctorRepository: DoctorRepository;

  constructor(doctorRepository: DoctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  addSpecialty(doctorId: string, specialty: string): Doctor {
    const doctor = this.findDoctorOrThrow(doctorId);

    if (doctor.specialties.includes(specialty)) {
      throw new Error("Specialty already exists.");
    }

    doctor.specialties.push(specialty);

    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  removeSpecialty(doctorId: string, specialty: string): Doctor {
    const doctor = this.findDoctorOrThrow(doctorId);

    doctor.specialties = doctor.specialties.filter(
      (currentSpecialty) => currentSpecialty !== specialty,
    );

    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  listSpecialties(doctorId: string): string[] {
    return [...this.findDoctorOrThrow(doctorId).specialties];
  }

  private findDoctorOrThrow(doctorId: string): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    return doctor;
  }
}
