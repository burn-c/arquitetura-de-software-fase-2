import type { Appointment } from "../../domain/entities/Appointments.ts";
import type { Doctor } from "../../domain/entities/Doctor.ts";
import type { Patient } from "../../domain/entities/Patient.ts";

export class NotificationService {
  sendEmailNotification(email: string, message: string): void {
    console.log(`Sending email to ${email}: ${message}`);
  }

  notifyAppointmentScheduled(
    appointment: Appointment,
    patient: Patient,
    doctor: Doctor
  ): void {
    const patientMessage = `Your appointment with Dr. ${doctor.name} is scheduled for ${appointment.date}.`;
    this.sendEmailNotification(patient.email, patientMessage);
  }
}
