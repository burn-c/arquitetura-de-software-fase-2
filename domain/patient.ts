import type { AddressDTO } from "./address.ts";
import { Consultation } from "./consultation.ts";
import type { EmergencyContactDTO } from "./emergencyContact.ts";
import { Exam } from "./exam.ts";

interface PatientDTO {
  id: string;
  cpf: string;
  name: string;
  birthDate: Date;
  gender: "Male" | "Female";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies: Array<string>;
  address: AddressDTO;
  phone: string;
  email: string;
  emergencyContact: EmergencyContactDTO;

  medicalHistory?: Array<string>; // Optional medical history: previous conditions described as strings.

  // 1. The interface declares the collections as READ-ONLY from the outside.
  readonly consultations: ReadonlyArray<Consultation>;
  readonly exams: ReadonlyArray<Exam>;

  scheduleConsultation(consultation: Consultation): void;
  addExam(exam: Exam): void;
}

// Constructor option: only the data needed to create a patient, without methods and the consultation/exam collections.
type CreatePatientDTO = Omit<
  PatientDTO,
  "consultations" | "exams" | "scheduleConsultation" | "addExam"
>;

export class Patient implements PatientDTO {
  // 1. Declare the properties explicitly.
  id: string;
  cpf: string;
  name: string;
  birthDate: Date;
  gender: "Male" | "Female";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies: Array<string>;
  address: AddressDTO;
  phone: string;
  email: string;
  emergencyContact: EmergencyContactDTO;
  medicalHistory: Array<string>;

  // Truly private properties, not accessible from outside the class.
  #consultations: Consultation[] = [];
  #exams: Exam[] = [];

  // 2. Constructor receiving an object (clean, no argument-order confusion).
  constructor(data: CreatePatientDTO) {
    this.id = data.id;
    this.cpf = data.cpf;
    this.name = data.name;
    this.birthDate = data.birthDate;
    this.gender = data.gender;
    this.bloodType = data.bloodType;
    this.allergies = data.allergies;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
    this.emergencyContact = data.emergencyContact;

    this.medicalHistory = [];
    this.#consultations = [];
    this.#exams = [];
  }

  // 3. Methods in the class body (outside the constructor).
  scheduleConsultation(consultation: Consultation): void {
    const conflict = this.#consultations.some(
      (c) => c.date.getTime() === consultation.date.getTime(),
    );

    if (conflict) {
      throw new Error("Patient already has a consultation scheduled at this time.");
    }

    this.#consultations.push(consultation);
    console.log(
      `Consultation scheduled for ${this.name} on ${consultation.date.toLocaleDateString("pt-BR", { timeZone: "UTC" })}.`,
    );
  }

  addExam(exam: Exam): void {
    this.#exams.push(exam);
    console.log(
      `Exam ${exam.type} added for ${this.name} with result: ${exam.result}.`,
    );
  }

  addMedicalHistoryEvent(event: string): void {
    this.medicalHistory.push(event);
    console.log(`Event added to ${this.name}'s medical history: ${event}`);
  }

  // 4. Getters to access the private collections from outside, returning copies to prevent external mutation.
  get consultations(): ReadonlyArray<Consultation> {
    return [...this.#consultations];
  }

  get exams(): ReadonlyArray<Exam> {
    return [...this.#exams];
  }
}

if (import.meta.main) {
  const patient1 = new Patient({
    id: "123",
    cpf: "123.456.789-00",
    name: "João Silva",
    birthDate: new Date("1990-05-15"),
    gender: "Male",
    bloodType: "A+",
    allergies: ["No known allergies."],
    address: {
      street: "Rua das Flores",
      number: "123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    phone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    emergencyContact: {
      name: "Maria Silva",
      phone: "(11) 98765-4321",
    },
    medicalHistory: ["Controlled hypertension", "Appendectomy in 2010"],
  });

  patient1.scheduleConsultation(
    new Consultation({
      id: "con-001",
      date: new Date("2023-06-15"),
      patientId: patient1.id,
      doctorId: "med-001",
      reason: "Routine cardiology consultation",
    }),
  );

  patient1.addExam(
    new Exam({
      id: "exa-001",
      type: "Electrocardiogram",
      result: "Normal",
      date: new Date("2023-06-15"),
      location: "Central Laboratory",
      responsible: "Dr. João",
      patientId: patient1.id,
    }),
  );

  patient1.addMedicalHistoryEvent("Appendectomy in 2010");
}
