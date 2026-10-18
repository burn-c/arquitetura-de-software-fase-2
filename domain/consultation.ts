type ConsultationStatus = "scheduled" | "completed" | "canceled";

interface ConsultationDTO {
  id: string;
  date: Date;
  patientId: string;
  doctorId: string;
  reason: string;
  status: ConsultationStatus;
  notes?: string;
}

// Constructor option: status is optional and defaults to "scheduled".
type CreateConsultationDTO = Omit<ConsultationDTO, "status"> & {
  status?: ConsultationStatus;
};

export class Consultation implements ConsultationDTO {
  id: string;
  date: Date;
  patientId: string;
  doctorId: string;
  reason: string;
  notes?: string;

  #status: ConsultationStatus;

  constructor(data: CreateConsultationDTO) {
    this.id = data.id;
    this.date = data.date;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.reason = data.reason;
    this.notes = data.notes;
    this.#status = data.status ?? "scheduled";
  }

  complete(): void {
    if (this.#status !== "scheduled") {
      throw new Error("Only scheduled consultations can be completed.");
    }

    this.#status = "completed";
    console.log(`Consultation ${this.id} marked as completed.`);
  }

  cancel(): void {
    if (this.#status === "completed") {
      throw new Error("A completed consultation cannot be canceled.");
    }

    this.#status = "canceled";
    console.log(`Consultation ${this.id} canceled.`);
  }

  get status(): ConsultationStatus {
    return this.#status;
  }
}

if (import.meta.main) {
  const consultation1 = new Consultation({
    id: "con-001",
    date: new Date("2023-06-15"),
    patientId: "123",
    doctorId: "med-001",
    reason: "Routine cardiology consultation",
    notes: "Patient fasting.",
  });

  console.log(`Initial status: ${consultation1.status}`);
  consultation1.complete();
  console.log(`Final status: ${consultation1.status}`);
}
