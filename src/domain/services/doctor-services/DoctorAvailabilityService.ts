import type { AppointmentRepository } from "../../../infrastructure/persistence/AppointmentRepository.ts";
import type { DoctorService } from "./DoctorService.ts";
import type { DoctorWorkingHoursService } from "./DoctorWorkingHoursService.ts";

export class DoctorAvailabilityService {
  private readonly appointmentRepository: AppointmentRepository;
  private readonly doctorService: DoctorService;
  private readonly doctorWorkingHoursService: DoctorWorkingHoursService;

  constructor(
    appointmentRepository: AppointmentRepository,
    doctorService: DoctorService,
    doctorWorkingHoursService: DoctorWorkingHoursService,
  ) {
    this.appointmentRepository = appointmentRepository;
    this.doctorService = doctorService;
    this.doctorWorkingHoursService = doctorWorkingHoursService;
  }

  isDoctorAvailable(doctorId: string, date: Date | string): true {
    if (!doctorId || !date) {
      throw new Error("Invalid doctor ID or date.");
    }

    const adjustedDate = this.checkDate(date);

    const doctor = this.doctorService.findDoctorById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    const workingHours = this.doctorWorkingHoursService.getWorkingHours(
      doctor.id,
    );

    const hasAppointmentConflict = this.hasAppointmentConflict(
      doctor.id,
      adjustedDate,
    );
    const isWithinWorkingHours =
      this.doctorWorkingHoursService.isWithinWorkingHours(
        workingHours,
        adjustedDate,
      );

    if (hasAppointmentConflict || !isWithinWorkingHours) {
      throw new Error(
        "Doctor is not available at the specified date and time.",
      );
    }

    return true;
  }

  private hasAppointmentConflict(doctorId: string, date: Date): boolean {
    const doctorAppointments =
      this.appointmentRepository.findByDoctorId(doctorId);

    return doctorAppointments.some(
      (appointment) =>
        this.checkDate(appointment.date).getTime() === date.getTime(),
    );
  }

  // Normaliza a data para o "relógio de parede" local codificado em UTC.
  // Assim o dia e o horário não dependem do fuso em que o servidor roda.
  private checkDate(date: Date | string): Date {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date.");
    }

    const offset = parsedDate.getTimezoneOffset() * 60_000;
    return new Date(parsedDate.getTime() - offset);
  }
}
