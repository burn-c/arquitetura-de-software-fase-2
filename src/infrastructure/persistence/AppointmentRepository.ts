import {
  Appointment,
  type AppointmentStatus,
} from "../../domain/entities/Appointments.ts";
import { Repository } from "../../domain/repositories/Repository.ts";

export class AppointmentRepository extends Repository<Appointment> {
  constructor() {
    super();
  }

  findByPatientId(patientId: string): Appointment[] {
    return this.findAll().filter(
      (appointment) => appointment.patientId === patientId
    );
  }

  findByDoctorId(doctorId: string): Appointment[] {
    return this.findAll().filter(
      (appointment) => appointment.doctorId === doctorId
    );
  }

  findByStatus(status: AppointmentStatus): Appointment[] {
    return this.findAll().filter(
      (appointment) => appointment.status === status
    );
  }
}
