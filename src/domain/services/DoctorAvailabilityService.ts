import type { Doctor } from "../entities/Doctor.ts";
import type { AppointmentRepository } from "../../infrastructure/persistence/AppointmentRepository.ts";
import type { DoctorService } from "./DoctorService.ts";

export class DoctorAvailabilityService {
  private readonly appointmentRepository: AppointmentRepository;
  private readonly doctorService: DoctorService;

  constructor(
    appointmentRepository: AppointmentRepository,
    doctorService: DoctorService
  ) {
    this.appointmentRepository = appointmentRepository;
    this.doctorService = doctorService;
  }

  isDoctorAvailable(doctorId: string, date: Date): boolean {
    const doctor = this.doctorService.findDoctorById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    if (!(date instanceof Date)) {
      throw new Error("Invalid date object.");
    }

    const hasAppointmentConflict = this.hasAppointmentConflict(doctorId, date);
    if (hasAppointmentConflict) {
      console.log("Doctor has a conflict appointment.");
      return false;
    }

    const isWithinWorkingHours = this.isWithinWorkingHours(doctor, date);
    if (!isWithinWorkingHours) {
      console.log("Doctor is not available at this time.");
      return false;
    }

    return true;
  }

  private hasAppointmentConflict(doctorId: string, date: Date): boolean {
    const doctorAppointments =
      this.appointmentRepository.findByDoctorId(doctorId);
    return doctorAppointments.some(
      (appointment) => appointment.date.getTime() === date.getTime()
    );
  }

  private isWithinWorkingHours(doctor: Doctor, date: Date): boolean {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const timeSlot = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return doctor.workingHours.hours.some(
      (workingHours) =>
        workingHours.day === dayOfWeek &&
        this.isTimeWithinSlot(timeSlot, workingHours.timeSlot)
    );
  }

  private isTimeWithinSlot(time: string, timeSlot: string): boolean {
    const [startTime, endTime] = timeSlot.split(" - ");

    const timeToMinutes = (value: string): number => {
      const [hour, minute] = value.split(/:| /).map(Number);
      const period = value.includes("PM") && hour !== 12 ? 12 : 0;
      return (hour + period) * 60 + minute;
    };

    const timeInMinutes = timeToMinutes(time);
    const startInMinutes = timeToMinutes(startTime);
    const endInMinutes = timeToMinutes(endTime);

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  }
}
