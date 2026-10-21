type AppointmentStatus = "scheduled" | "completed" | "canceled";

interface AppointmentDTO {
  id: string;
  date: Date;
  patientId: string;
  doctorId: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

// Opção do construtor: o status é opcional e assume "scheduled" por padrão.
type CreateAppointmentDTO = Omit<AppointmentDTO, "status"> & {
  status?: AppointmentStatus;
};

export class Appointment implements AppointmentDTO {
  id: string;
  date: Date;
  patientId: string;
  doctorId: string;
  reason: string;
  notes?: string;

  #status: AppointmentStatus;

  constructor(data: CreateAppointmentDTO) {
    this.id = data.id;
    this.date = data.date;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.reason = data.reason;
    this.notes = data.notes;
    this.#status = data.status ?? "scheduled";
  }

  hasConflict(otherAppointment: Appointment): boolean {
    return (
      this.date.getTime() === otherAppointment.date.getTime() &&
      this.doctorId === otherAppointment.doctorId
    );
  }

  complete(): void {
    if (this.#status !== "scheduled") {
      throw new Error("Only scheduled appointments can be completed.");
    }

    this.#status = "completed";
    console.log(`Appointment ${this.id} marked as completed.`);
  }

  cancel(): void {
    if (this.#status === "completed") {
      throw new Error("A completed appointment cannot be canceled.");
    }

    this.#status = "canceled";
    console.log(`Appointment ${this.id} canceled.`);
  }

  get status(): AppointmentStatus {
    return this.#status;
  }
}

if (import.meta.main) {
  const appointment1 = new Appointment({
    id: "apt-001",
    date: new Date("2023-06-15"),
    patientId: "123",
    doctorId: "med-001",
    reason: "Routine cardiology appointment",
    notes: "Patient fasting.",
  });

  console.log(`Initial status: ${appointment1.status}`);
  appointment1.complete();
  console.log(`Final status: ${appointment1.status}`);
}
