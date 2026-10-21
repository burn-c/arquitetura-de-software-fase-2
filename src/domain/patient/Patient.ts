import type { AddressDTO } from "../shared/Address.ts";
import { Allergy } from "./Allergy.ts";
import { Appointment } from "./Appointments.ts";
import { Diagnoses } from "./record/Diagnosis.ts";
import type { EmergencyContactDTO } from "../shared/EmergencyContact.ts";
import { Exam } from "./Exam.ts";
import { MedicalRecord } from "./record/MedicalRecord.ts";

interface PatientDTO {
  id: string;
  identificationDocument: string;
  name: string;
  birthDate: Date;
  gender: "Male" | "Female";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address: AddressDTO;
  phone: string;
  email: string;
  emergencyContact: EmergencyContactDTO;
  
  // 1. A interface declara as coleções como SOMENTE LEITURA para o mundo externo.
  readonly appointments: ReadonlyArray<Appointment>;
  readonly exams: ReadonlyArray<Exam>;
  readonly allergies: ReadonlyArray<Allergy>;
  readonly medicalRecord: MedicalRecord;

  scheduleAppointment(appointment: Appointment): void;
  addExam(exam: Exam): void;
}

// Opção do construtor: apenas os dados necessários para criar um paciente, sem os métodos e sem as coleções de consultas/exames.
type CreatePatientDTO = Omit<
  PatientDTO,
  "appointments" | "exams" | "allergies" | "medicalRecord" | "scheduleAppointment" | "addExam"
>;

export class Patient implements PatientDTO {
  // 1. Declare as propriedades explicitamente.
  id: string;
  identificationDocument: string;
  name: string;
  birthDate: Date;
  gender: "Male" | "Female";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address: AddressDTO;
  phone: string;
  email: string;
  emergencyContact: EmergencyContactDTO;
  
  // Coleções privadas: acessíveis apenas pelos getters, que retornam cópias.
  #appointments: Appointment[] = [];
  #exams: Exam[] = [];

  // Estado manipulado pelo PatientService, como no exemplo da aula.
  allergies: Allergy[] = [];
  medicalRecord: MedicalRecord = new MedicalRecord();

  // 2. Construtor recebendo um objeto (limpo, sem confusão na ordem dos argumentos).
  constructor(data: CreatePatientDTO) {
    this.id = data.id;
    this.identificationDocument = data.identificationDocument;
    this.name = data.name;
    this.birthDate = data.birthDate;
    this.gender = data.gender;
    this.bloodType = data.bloodType;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
    this.emergencyContact = data.emergencyContact;

    this.medicalRecord = new MedicalRecord();
    this.#appointments = [];
    this.#exams = [];
    this.allergies = [];
  }

  // 3. Métodos no corpo da classe (fora do construtor).
  addExam(exam: Exam): void {
    if (!exam || !(exam instanceof Exam)) {
      throw new Error("Invalid exam object.");
    }

    this.#exams.push(exam);
    console.log(
      `Exam ${exam.type} added for ${this.name} with result: ${exam.result}.`,
    );
  }

  scheduleAppointment(appointment: Appointment): void {
    if (!appointment || !(appointment instanceof Appointment)) {
      throw new Error("Invalid appointment object.");
    }

    const hasConflict = this.#appointments.some((existing) =>
      existing.hasConflict(appointment)
    );

    if (hasConflict) {
      throw new Error(
        `Appointment conflict: ${this.name} already has an appointment with Dr. ${appointment.doctorId} at ${appointment.date}.`,
      );
    }

    this.#appointments.push(appointment);
    console.log(
      `Appointment scheduled for ${this.name} with Dr. ${appointment.doctorId} on ${appointment.date}.`,
    );
  }

  // 4. Getters para acessar as coleções privadas de fora, retornando cópias que impedem mutação externa.
  get appointments(): ReadonlyArray<Appointment> {
    return [...this.#appointments];
  }

  get exams(): ReadonlyArray<Exam> {
    return [...this.#exams];
  }
}