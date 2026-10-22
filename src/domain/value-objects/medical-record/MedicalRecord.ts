import { sameItems } from "../../collectionEquality.ts";
import type { DiagnosesDTO } from "./Diagnosis.ts";
import { Diagnoses } from "./Diagnosis.ts";
import { Medication } from "./Medication.ts";
import { Treatment } from "./Treatment.ts";

export interface MedicalRecordDTO {
  readonly diagnoses: ReadonlyArray<DiagnosesDTO>;
  readonly treatments: ReadonlyArray<Treatment>;
  readonly medications: ReadonlyArray<Medication>;
}

export class MedicalRecord implements MedicalRecordDTO {
  // O prontuário não tem id nem patientId: sendo um objeto de valor, ele é
  // acessado pelo histórico do paciente — a identidade vem do agregado (Patient).
  //
  // Coleções privadas: acessíveis apenas pelos getters, que retornam cópias.
  #diagnoses: Diagnoses[] = [];
  #treatments: Treatment[] = [];
  #medications: Medication[] = [];

  addDiagnoses(diagnoses: Diagnoses): void {
    if (!(diagnoses instanceof Diagnoses)) {
      throw new Error("Diagnoses must be an instance of the Diagnoses class.");
    }

    if (!diagnoses.description) {
      throw new Error("Diagnoses must have a description.");
    }

    this.#diagnoses.push(diagnoses);
    console.log("Diagnoses added to the medical record.");
  }

  addTreatment(treatment: Treatment): void {
    if (!(treatment instanceof Treatment)) {
      throw new Error("Treatment must be an instance of the Treatment class.");
    }
    this.#treatments.push(treatment);
    console.log("Treatment added to the medical record.");
  }

  addMedication(medication: Medication): void {
    if (!(medication instanceof Medication)) {
      throw new Error("Medication must be an instance of the Medication class.");
    }
    this.#medications.push(medication);
    console.log("Medication added to the medical record.");
  }

  /**
   * Igualdade por conteúdo: dois prontuários são iguais quando possuem os mesmos
   * diagnósticos, tratamentos e medicações, em qualquer ordem.
   *
   * Os itens são comparados pelo próprio `equals`, então todos os campos de cada
   * objeto de valor contam (ex.: Medication compara name E dosage).
   *
   * Como o prontuário é um objeto de valor, não há identidade própria a comparar:
   * a identidade do conjunto é a do `Patient`, dono do agregado.
   */
  equals(otherRecord: MedicalRecord): boolean {
    const diagnoses = this.diagnoses;
    const treatments = this.treatments;
    const medications = this.medications;

    return (
      sameItems(diagnoses, otherRecord.diagnoses, (a, b) => a.equals(b)) &&
      sameItems(treatments, otherRecord.treatments, (a, b) => a.equals(b)) &&
      sameItems(medications, otherRecord.medications, (a, b) => a.equals(b))
    );
  }

  get diagnoses(): ReadonlyArray<Diagnoses> {
    return [...this.#diagnoses];
  }

  get treatments(): ReadonlyArray<Treatment> {
    return [...this.#treatments];
  }

  get medications(): ReadonlyArray<Medication> {
    return [...this.#medications];
  }
}

if (import.meta.main) {
  const medicalRecord1 = new MedicalRecord();

  medicalRecord1.addDiagnoses(new Diagnoses({ description: "Hypertension" }));
  medicalRecord1.addTreatment(
    new Treatment({ description: "Reduced salt intake" }),
  );
  medicalRecord1.addMedication(
    new Medication({ name: "Lisinopril", dosage: "10mg" }),
  );

  console.log("Medical record:");
  console.log(
    `Diagnoses: ${medicalRecord1.diagnoses.map((d) => d.description).join(", ")}`,
  );
  console.log(
    `Treatments: ${medicalRecord1.treatments.map((t) => t.description).join(", ")}`,
  );
  console.log(
    `Medications: ${medicalRecord1.medications.map((m) => `${m.name} ${m.dosage}`).join(", ")}`,
  );
}
