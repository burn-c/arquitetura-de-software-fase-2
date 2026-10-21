import type { AddressDTO } from "./address.ts";
import { Allergy } from "./allergy.ts";
import { Appointment } from "./appointments.ts";
import { Diagnoses } from "./diagnosis.ts";
import type { EmergencyContactDTO } from "./emergencyContact.ts";
import { Exam } from "./exam.ts";
import { MedicalRecord } from "./medicalRecord.ts";
import { Medication } from "./medication.ts";
import { Treatment } from "./treatment.ts";
import type { TreatmentDTO } from "./treatment.ts";

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
  
  // Propriedades realmente privadas, inacessíveis de fora da classe.
  #appointments: Appointment[] = [];
  #exams: Exam[] = [];
  #allergies: Allergy[] = [];
  #medicalRecord: MedicalRecord = new MedicalRecord();

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

    this.#medicalRecord = new MedicalRecord();
    this.#appointments = [];
    this.#exams = [];
    this.#allergies = [];
  }

  // 3. Métodos no corpo da classe (fora do construtor).
  addAllergy(allergy: Allergy): void {
    const exists = this.#allergies.some((a) => a.equals(allergy));
    if (exists) {
      throw new Error(`Allergy ${allergy.type} already exists for this patient.`);
    }
    this.#allergies.push(allergy);
    console.log(`Allergy ${allergy.type} added for ${this.name}.`);
  }

  addDiagnosis(diagnosis: Diagnoses): void {
    this.#medicalRecord.addDiagnoses(diagnosis);
    console.log(`Diagnosis "${diagnosis.description}" added to ${this.name}'s medical history.`);
  }

  addExam(exam: Exam): void {
    this.#exams.push(exam);
    console.log(
      `Exam ${exam.type} added for ${this.name} with result: ${exam.result}.`,
    );
  }

  addMedication({dosage, name}: Medication): void {
    const medication = new Medication({ dosage, name });
    this.#medicalRecord.addMedication(medication);
    console.log(
      `Medication "${medication.name}" with dosage "${medication.dosage}" added to ${this.name}'s medical history.`,
    );
  }

  addTreatment(description: TreatmentDTO): void {
    const treatment = new Treatment(description);
    this.#medicalRecord.addTreatment(treatment);
    console.log(
      `Treatment "${treatment.description}" added to ${this.name}'s medical history.`,
    );
  }

  scheduleAppointment(appointment: Appointment): void {
    const conflict = this.#appointments.some(
      (existing) => existing.date.getTime() === appointment.date.getTime(),
    );

    if (conflict) {
      throw new Error("Patient already has an appointment scheduled at this time.");
    }

    this.#appointments.push(appointment);
    console.log(
      `Appointment scheduled for ${this.name} on ${appointment.date.toLocaleDateString("pt-BR", { timeZone: "UTC" })}.`,
    );
  }

  // 4. Getters para acessar as coleções privadas de fora, retornando cópias que impedem mutação externa.
  get appointments(): ReadonlyArray<Appointment> {
    return [...this.#appointments];
  }

  get exams(): ReadonlyArray<Exam> {
    return [...this.#exams];
  }

  get allergies(): ReadonlyArray<Allergy> {
    return [...this.#allergies];
  }
}

if (import.meta.main) {
  const patient1 = new Patient({
    id: "123",
    identificationDocument: "123.456.789-00",
    name: "João Silva",
    birthDate: new Date("1990-05-15"),
    gender: "Male",
    bloodType: "A+",
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
  });

  patient1.scheduleAppointment(
    new Appointment({
      id: "apt-001",
      date: new Date("2023-06-15"),
      patientId: patient1.id,
      doctorId: "med-001",
      reason: "Routine cardiology appointment",
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

  patient1.addDiagnosis(new Diagnoses({ description: "Appendectomy in 2010" }));
}
