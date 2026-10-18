export interface WorkingHoursDTO {
  hours: Array<HourDTO>;
}

export interface HourDTO {
  day: string;
  timeSlot: string;
}

export class WorkingHours implements WorkingHoursDTO {
  constructor() {
    this.hours = [];
  }
  hours: HourDTO[];

  addHours(data: HourDTO): void {
    const { day, timeSlot } = data;
    const existingHour = this.hours.find(
      (hour) => hour.day === day && hour.timeSlot === timeSlot
    );

    if (existingHour) {
      console.log(`O horário ${timeSlot} do dia ${day} já está registrado.`);
      return;
    }

    this.hours.push({ day, timeSlot });
  }

  removeHours(data: HourDTO): void {
    const { day, timeSlot } = data;
    const index = this.hours.findIndex(
      (hour) => hour.day === day && hour.timeSlot === timeSlot
    );

    if (index !== -1) {
      this.hours = this.hours.filter((_, i) => i !== index);
      console.log(`O horário ${timeSlot} do dia ${day} foi removido.`);
    } else {
      console.log(`O horário ${timeSlot} do dia ${day} não foi encontrado.`);
    }
  }

  equals(other: WorkingHours): boolean {
    if (this.hours.length !== other.hours.length) {
      return false;
    }

  return this.hours.every((hour) =>
      other.hours.some(
        (otherHour) =>
          otherHour.day === hour.day && otherHour.timeSlot === hour.timeSlot
      )
    );  
  }

  listHours(): Array<HourDTO> {
    if (this.hours.length === 0) {
      console.log("Nenhum horário registrado.");
    }

    console.log("Horários registrados:");
    this.hours.forEach((hour) => {
      console.log(`Dia: ${hour.day}, Horário: ${hour.timeSlot}`);
    });

    return this.hours
  }
}