import type { Doctor } from "../../entities/Doctor.ts";
import { type HourDTO, WorkingHours } from "../../value-objects/WorkingHours.ts";
import type { DoctorRepository } from "../../../infrastructure/persistence/DoctorRepository.ts";

export class DoctorWorkingHoursService {
  private readonly doctorRepository: DoctorRepository;

  constructor(doctorRepository: DoctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  addWorkingHours(doctorId: string, day: string, timeSlot: string): Doctor {
    const doctor = this.findDoctorOrThrow(doctorId);

    const hasWorkingHours = doctor.workingHours.hours.some(
      (workingHours) =>
        workingHours.day === day && workingHours.timeSlot === timeSlot,
    );

    if (hasWorkingHours) {
      throw new Error("Working hours already exist.");
    }

    doctor.workingHours = new WorkingHours([
      ...doctor.workingHours.hours,
      { day, timeSlot },
    ]);

    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  removeWorkingHours(doctorId: string, day: string, timeSlot: string): Doctor {
    const doctor = this.findDoctorOrThrow(doctorId);

    doctor.workingHours = new WorkingHours(
      doctor.workingHours.hours.filter(
        (workingHours) =>
          !(workingHours.day === day && workingHours.timeSlot === timeSlot),
      ),
    );

    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  listWorkingHours(doctorId: string): HourDTO[] {
    return [...this.findDoctorOrThrow(doctorId).workingHours.hours];
  }

  getWorkingHours(doctorId: string): WorkingHours {
    return this.findDoctorOrThrow(doctorId).workingHours;
  }

  // A data recebida já vem normalizada pelo DoctorAvailabilityService: os
  // campos UTC representam o relógio de parede do consultório.
  isWithinWorkingHours(workingHours: WorkingHours, date: Date): boolean {
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });
    const timeSlot = `${this.pad(date.getUTCHours())}:${this.pad(
      date.getUTCMinutes(),
    )}`;

    return workingHours.hours.some(
      (workingHours) =>
        workingHours.day === dayOfWeek &&
        this.isTimeWithinSlot(timeSlot, workingHours.timeSlot),
    );
  }

  private isTimeWithinSlot(time: string, timeSlot: string): boolean {
    const [startTime, endTime] = timeSlot.split(/\s*-\s*/);

    if (!startTime || !endTime) {
      throw new Error(`Invalid time slot: ${timeSlot}`);
    }

    const timeInMinutes = this.timeToMinutes(time);
    const startInMinutes = this.timeToMinutes(startTime);
    const endInMinutes = this.timeToMinutes(endTime);

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  }

  private timeToMinutes(value: string): number {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

    if (!match) {
      throw new Error(`Invalid time: ${value}`);
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3]?.toUpperCase();

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    return hours * 60 + minutes;
  }

  private pad(value: number): string {
    return String(value).padStart(2, "0");
  }

  private findDoctorOrThrow(doctorId: string): Doctor {
    const doctor = this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    return doctor;
  }
}
