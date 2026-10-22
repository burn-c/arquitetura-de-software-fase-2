import type { Appointment } from "../../domain/entities/Appointments.ts";
import type { DoctorAvailabilityService } from "../../domain/services/doctor-services/DoctorAvailabilityService.ts";
import type { DoctorService } from "../../domain/services/doctor-services/DoctorService.ts";
import type { PatientService } from "../../domain/services/PatientService.ts";
import type { AppointmentRepository } from "../../infrastructure/persistence/AppointmentRepository.ts";
import type { NotificationService } from "../../infrastructure/notification/NotificationService.ts";

export class AppointmentService {
  private readonly patientService: PatientService;
  private readonly doctorService: DoctorService;
  private readonly appointmentRepository: AppointmentRepository;
  private readonly doctorAvailabilityService: DoctorAvailabilityService;
  private readonly notificationService: NotificationService;

  constructor(
    patientService: PatientService,
    doctorService: DoctorService,
    appointmentRepository: AppointmentRepository,
    doctorAvailabilityService: DoctorAvailabilityService,
    notificationService: NotificationService
  ) {
    this.patientService = patientService;
    this.doctorService = doctorService;
    this.appointmentRepository = appointmentRepository;
    this.doctorAvailabilityService = doctorAvailabilityService;
    this.notificationService = notificationService;
  }

  execute(appointment: Appointment): Appointment {
    const date = this.checkDate(appointment);
    const patient = this.patientService.findPatientById(appointment.patientId);
    const doctor = this.doctorService.findDoctorById(appointment.doctorId);

    if (!patient) {
      throw new Error("Patient not found.");
    }

    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    // O serviço de disponibilidade lança exceção quando o médico não pode atender.
    this.doctorAvailabilityService.isDoctorAvailable(doctor.id, date);

    // A entidade valida o conflito do paciente antes de a consulta ser persistida.
    patient.scheduleAppointment(appointment);
    this.appointmentRepository.add(appointment.id, appointment);
    this.notificationService.notifyAppointmentScheduled(
      appointment,
      patient,
      doctor
    );

    return appointment;
  }

  findById(id: string): Appointment {
    const appointment = this.appointmentRepository.findById(id);

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    return appointment;
  }

  findAll(): Appointment[] {
    return this.appointmentRepository.findAll();
  }

  private checkDate(appointment: Appointment): Date {
    const date = appointment.date;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date.");
    }

    return date;
  }
}
