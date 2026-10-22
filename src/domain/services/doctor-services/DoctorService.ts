import {
  Doctor,
  type CreateDoctorDTO,
  type UpdateDoctorDTO,
} from "../../entities/Doctor.ts";
import type { DoctorRepository } from "../../../infrastructure/persistence/DoctorRepository.ts";

// Serviço enxuto: apenas o ciclo de vida cadastral do médico.
// Especialidades e horários vivem em serviços próprios.
export class DoctorService {
  private readonly doctorRepository: DoctorRepository;

  constructor(doctorRepository: DoctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  addDoctor(doctorData: CreateDoctorDTO): Doctor {
    const doctor = new Doctor(doctorData);

    this.doctorRepository.add(doctor.id, doctor);
    return doctor;
  }

  findDoctorById(doctorId: string): Doctor | undefined {
    return this.doctorRepository.findById(doctorId);
  }

  findAllDoctors(): Doctor[] {
    return this.doctorRepository.findAll();
  }

  updateDoctor(doctorId: string, updatedData: UpdateDoctorDTO): Doctor {
    const doctor = this.findDoctorOrThrow(doctorId);

    Object.assign(doctor, updatedData);

    this.doctorRepository.update(doctorId, doctor);
    return doctor;
  }

  deleteDoctor(doctorId: string): Doctor {
    const doctor = this.findDoctorOrThrow(doctorId);

    this.doctorRepository.delete(doctorId);
    return doctor;
  }

  private findDoctorOrThrow(doctorId: string): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    return doctor;
  }
}
