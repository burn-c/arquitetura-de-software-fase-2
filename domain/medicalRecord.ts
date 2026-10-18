interface MedicalRecordDTO {
  id: string;
  patientId: string;

  readonly diagnoses: ReadonlyArray<string>;
  readonly treatments: ReadonlyArray<string>;
  readonly medications: ReadonlyArray<string>;

  addDiagnosis(diagnosis: string): void;
  addTreatment(treatment: string): void;
  addMedication(medication: string): void;
}

// Constructor option: only the data needed to create a medical record, without the collections and methods.
type CreateMedicalRecordDTO = Omit<
  MedicalRecordDTO,
  | "diagnoses"
  | "treatments"
  | "medications"
  | "addDiagnosis"
  | "addTreatment"
  | "addMedication"
>;

export class MedicalRecord implements MedicalRecordDTO {
  id: string;
  patientId: string;

  // Private collections: accessible only through getters that return copies.
  #diagnoses: string[] = [];
  #treatments: string[] = [];
  #medications: string[] = [];

  constructor(data: CreateMedicalRecordDTO) {
    this.id = data.id;
    this.patientId = data.patientId;
  }

  addDiagnosis(diagnosis: string): void {
    this.#diagnoses.push(diagnosis);
    console.log(`Diagnosis added to patient ${this.patientId}'s medical record.`);
  }

  addTreatment(treatment: string): void {
    this.#treatments.push(treatment);
    console.log(`Treatment added to patient ${this.patientId}'s medical record.`);
  }

  addMedication(medication: string): void {
    this.#medications.push(medication);
    console.log(`Medication added to patient ${this.patientId}'s medical record.`);
  }

  get diagnoses(): ReadonlyArray<string> {
    return [...this.#diagnoses];
  }

  get treatments(): ReadonlyArray<string> {
    return [...this.#treatments];
  }

  get medications(): ReadonlyArray<string> {
    return [...this.#medications];
  }
}

if (import.meta.main) {
  const medicalRecord1 = new MedicalRecord({
    id: "pro-001",
    patientId: "123",
  });

  medicalRecord1.addDiagnosis("Hypertension");
  medicalRecord1.addTreatment("Reduced salt intake");
  medicalRecord1.addMedication("Captopril");

  console.log(
    `Medical record ${medicalRecord1.id} for patient ${medicalRecord1.patientId}:`,
  );
  console.log(`Diagnoses: ${medicalRecord1.diagnoses.join(", ")}`);
  console.log(`Treatments: ${medicalRecord1.treatments.join(", ")}`);
  console.log(`Medications: ${medicalRecord1.medications.join(", ")}`);
}
