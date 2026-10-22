import { sameItems } from "../collectionEquality.ts";

export interface WorkingHoursDTO {
  hours: Array<HourDTO>;
}

export interface HourDTO {
  day: string;
  timeSlot: string;
}

export class WorkingHours implements WorkingHoursDTO {
  hours: HourDTO[];

  constructor(hours: HourDTO[] = []) {
    this.hours = [...hours];
  }

  equals(other: WorkingHours): boolean {
    return sameItems(
      this.hours,
      other.hours,
      (hour, otherHour) =>
        hour.day === otherHour.day && hour.timeSlot === otherHour.timeSlot,
    );
  }
}
