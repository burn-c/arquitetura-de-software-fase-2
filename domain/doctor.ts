import { type HourDTO, WorkingHours, type WorkingHoursDTO } from "./workingHours.ts";

interface DoctorDTO {
  id: string;
  rcm: string;
  name: string;
  specialties: ReadonlyArray<string>;
  phone: string;
}

type CreateDoctorDTO = Omit<DoctorDTO, "specialties"> & {
  specialties: string[];
};

export class Doctor implements DoctorDTO {
  id: string;
  rcm: string;
  name: string;
  phone: string;

  #specialties: string[];
  #workingHours: WorkingHours;

  constructor(data: CreateDoctorDTO) {
    this.id = data.id;
    this.rcm = data.rcm;
    this.name = data.name;
    this.phone = data.phone;
    this.#specialties = data.specialties;

    // O horário de atendimento nasce vazio.
    this.#workingHours = new WorkingHours();
  }

  addSpecialty(specialty: string): void {
    this.#specialties.push(specialty);
    console.log(`Specialty ${specialty} added to Dr(a). ${this.name}.`);
  }

  get specialties(): ReadonlyArray<string> {
    return [...this.#specialties];
  }

  // Delegação: o Doctor repassa para o objeto de valor WorkingHours.
  addWorkingHours(data: HourDTO): void {
    this.#workingHours.addHours(data);
  }

  removeWorkingHours(data: HourDTO): void {
    this.#workingHours.removeHours(data);
  }

  get listWorkingHours(): WorkingHoursDTO {
    return this.#workingHours;
  }
}

if (import.meta.main) {
  const doctor1 = new Doctor({
    id: "med-001",
    rcm: "CRM-SP 123456",
    name: "Maria Santos",
    specialties: ["Cardiologia"],
    phone: "(11) 91234-5678",
  });

  doctor1.addSpecialty("Clínica Geral");
  doctor1.addWorkingHours({ day: "Segunda", timeSlot: "14:00-18:00" });
  doctor1.addWorkingHours({ day: "Quarta", timeSlot: "14:00-18:00" });

  console.log(`Dr(a). ${doctor1.name} (${doctor1.rcm})`);
  console.log(`Especialidades: ${doctor1.specialties.join(", ")}`);
  console.log(
    `Atendimento: ${doctor1.listWorkingHours.hours
      .map((h) => `${h.day} ${h.timeSlot}`)
      .join(", ")}`,
  );
}
