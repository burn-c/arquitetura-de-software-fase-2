import { Repository } from "../../domain/repositories/Repository.ts";
import { Appointment } from "../../domain/entities/Appointments.ts";

export class AppointmentRepository extends Repository {
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

  findByStatus(status: "scheduled" | "completed" | "canceled"): Appointment[] {
    return this.findAll().filter(
      (appointment) => appointment.status === status
    );
  }
}