import { Allergy } from "../value-objects/Allergy.ts";
import { Patient, type CreatePatientDTO } from "../entities/Patient.ts";
import { PatientRepository } from "../../infrastructure/persistence/PatientRepository.ts";
import { Diagnoses } from "../value-objects/medical-record/Diagnosis.ts";
import { Medication } from "../value-objects/medical-record/Medication.ts";
import { Treatment } from "../value-objects/medical-record/Treatment.ts";

export class PatientService {
  private readonly patientRepository: PatientRepository;

  constructor(patientRepository: PatientRepository) {
    this.patientRepository = patientRepository;
  }

  addPatient(patientData: CreatePatientDTO): Patient {
    const patient = new Patient(patientData);
    this.patientRepository.add(patient.id, patient);

    return patient;
  }

  findPatientById(patientId: string): Patient | undefined {
    return this.patientRepository.findById(patientId);
  }

  findAllPatients(): Patient[] {
    return this.patientRepository.findAll();
  }

  findPatientsByName(name: string): Patient[] {
    return this.patientRepository.findByName(name);
  }

  findPatientsByBloodType(bloodType: string): Patient[] {
    return this.patientRepository.findByBloodType(bloodType);
  }

  updatePatient(patientId: string, updatedData: Partial<Patient>): Patient {
    const patient = this.patientRepository.findById(patientId);
    if (!patient) {
      console.log(`Paciente com ID ${patientId} não encontrado.`);
      throw new Error(`Paciente com ID ${patientId} não encontrado.`);
    }

    Object.assign(patient, updatedData);
    this.patientRepository.update(patientId, patient);
    return patient;
  }

  deletePatient(patientId: string): Patient {
    const patient = this.patientRepository.findById(patientId);
    if (!patient) {
      console.log(`Paciente com ID ${patientId} não encontrado.`);
      throw new Error(`Paciente com ID ${patientId} não encontrado.`);
    }

    this.patientRepository.delete(patientId);
    console.log(`Paciente com ID ${patientId} foi removido.`);
    return patient;
  }

  addPatientAllergy(patientId: string, allergy: Allergy): Patient {
    const patient = this.patientRepository.findById(patientId);
    if (!patient) {
      console.log(`Paciente com ID ${patientId} não encontrado.`);
      throw new Error(`Paciente com ID ${patientId} não encontrado.`);
    }

    if (!allergy || !(allergy instanceof Allergy)) {
      console.log("Objeto de alergia inválido.");
      throw new Error("Objeto de alergia inválido.");
    }

    const hasAllergy = patient.allergies.some((existing: Allergy) =>
      existing.equals(allergy)
    );

    if (hasAllergy) {
      console.log(`Paciente com ID ${patientId} já possui a alergia.`);
      throw new Error(`Paciente com ID ${patientId} já possui a alergia.`);
    }

    patient.allergies.push(allergy);
    this.updatePatient(patientId, { allergies: patient.allergies });
    console.log(`Alergia adicionada ao paciente com ID ${patientId}.`);
    return patient;
  }

  addPatientDiagnosis(patientId: string, diagnosis: Diagnoses): Patient {
    const patient = this.patientRepository.findById(patientId);
    if (!patient) {
      console.log(`Paciente com ID ${patientId} não encontrado.`);
      throw new Error(`Paciente com ID ${patientId} não encontrado.`);
    }

    patient.medicalRecord.addDiagnoses(diagnosis);
    this.updatePatient(patientId, patient);
    console.log(`Diagnóstico adicionado ao paciente com ID ${patientId}.`);
    return patient;
  }

  addPatientMedication(patientId: string, medication: Medication): Patient {
    const patient = this.patientRepository.findById(patientId);
    if (!patient) {
      console.log(`Paciente com ID ${patientId} não encontrado.`);
      throw new Error(`Paciente com ID ${patientId} não encontrado.`);
    }

    patient.medicalRecord.addMedication(medication);
    this.updatePatient(patientId, patient);
    console.log(`Medicação adicionada ao paciente com ID ${patientId}.`);
    return patient;
  }

  addPatientTreatment(patientId: string, treatment: Treatment): Patient {
    const patient = this.patientRepository.findById(patientId);
    if (!patient) {
      console.log(`Paciente com ID ${patientId} não encontrado.`);
      throw new Error(`Paciente com ID ${patientId} não encontrado.`);
    }

    patient.medicalRecord.addTreatment(treatment);
    this.updatePatient(patientId, patient);
    console.log(`Tratamento adicionado ao paciente com ID ${patientId}.`);
    return patient;
  }
}