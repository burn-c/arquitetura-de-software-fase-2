import type { HourDTO } from "../value-objects/WorkingHours.ts";
import { Doctor } from "../entities/Doctor.ts";
import { DoctorRepository } from "../../infrastructure/persistence/DoctorRepository.ts";

export class DoctorService {
  private readonly doctorRepository: DoctorRepository;

  constructor(doctorRepository: DoctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  addDoctor(doctorData: Doctor): Doctor {
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

  updateDoctor(doctorId: string, updatedData: Partial<Doctor>): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    Object.assign(doctor, updatedData);

    this.doctorRepository.update(doctorId, doctor);
    return doctor;
  }

  deleteDoctor(doctorId: string): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    this.doctorRepository.delete(doctorId);
    return doctor;
  }

  addDoctorWorkingHours(
    doctorId: string,
    day: string,
    timeSlot: string
  ): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const hasWorkingHours = doctor.workingHours.hours.some(
      (workingHour) =>
        workingHour.day === day && workingHour.timeSlot === timeSlot
    );

    if (hasWorkingHours) {
      throw new Error('Working hours already exist.');
    }

    doctor.workingHours.hours.push({ day, timeSlot });
    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  removeWorkingHours(
    doctorId: string,
    day: string,
    timeSlot: string
  ): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    doctor.workingHours.hours = doctor.workingHours.hours.filter(
      (hour) => !(hour.day === day && hour.timeSlot === timeSlot)
    );
    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  addSpecialty(doctorId: string, specialty: string): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    if (doctor.specialties.includes(specialty)) {
      throw new Error('Specialty already exists.');
    }

    doctor.specialties.push(specialty);
    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  listWorkingHours(doctorId: string): HourDTO[] {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return doctor.workingHours.hours;
  }
}
