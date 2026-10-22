import { AppointmentRepository } from "../src/infrastructure/persistence/AppointmentRepository.ts";
import { DoctorRepository } from "../src/infrastructure/persistence/DoctorRepository.ts";
import { ExamRepository } from "../src/infrastructure/persistence/ExamRepository.ts";
import { PatientRepository } from "../src/infrastructure/persistence/PatientRepository.ts";

export const patientRepository = new PatientRepository();
export const doctorRepository = new DoctorRepository();
export const appointmentRepository = new AppointmentRepository();
export const examRepository = new ExamRepository();