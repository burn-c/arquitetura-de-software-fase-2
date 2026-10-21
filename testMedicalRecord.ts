import assert from "node:assert/strict";
import { Address } from "./src/domain/shared/Address.ts";
import { Diagnoses } from "./src/domain/patient/record/Diagnosis.ts";
import { EmergencyContact } from "./src/domain/shared/EmergencyContact.ts";
import { Medication } from "./src/domain/patient/record/Medication.ts";
import { MedicalRecord } from "./src/domain/patient/record/MedicalRecord.ts";
import { Treatment } from "./src/domain/patient/record/Treatment.ts";
import { WorkingHours } from "./src/domain/doctor/WorkingHours.ts";
import { createTestRunner } from "./src/testing/testOutput.ts";

type Content = {
  diagnoses?: Array<string>;
  treatments?: Array<string>;
  medications?: Array<{ name: string; dosage: string }>;
};

// Os métodos add* imprimem logs; mantém a saída do teste legível.
function withoutLogs<T>(run: () => T): T {
  const originalLog = console.log;
  console.log = () => {};
  try {
    return run();
  } finally {
    console.log = originalLog;
  }
}

// O prontuário é um objeto de valor: não recebe id nem patientId.
function build(content: Content = {}): MedicalRecord {
  return withoutLogs(() => {
    const record = new MedicalRecord();

    (content.diagnoses ?? []).forEach((description) =>
      record.addDiagnoses(new Diagnoses({ description })),
    );
    (content.treatments ?? []).forEach((description) =>
      record.addTreatment(new Treatment({ description })),
    );
    (content.medications ?? []).forEach((medication) =>
      record.addMedication(new Medication(medication)),
    );

    return record;
  });
}

const fullContent: Content = {
  diagnoses: ["Hypertension"],
  treatments: ["Reduced salt intake"],
  medications: [{ name: "Lisinopril", dosage: "10mg" }],
};

const { test, run } = createTestRunner("MedicalRecord");

test("prontuários com o mesmo conteúdo são iguais", () => {
  const a = build(fullContent);
  const b = build(fullContent);

  assert.equal(a.equals(b), true);
  assert.equal(b.equals(a), true);
});

test("prontuários com coleções vazias são iguais", () => {
  assert.equal(build().equals(build()), true);
});

test("o prontuário não tem identidade própria", () => {
  const record = build(fullContent);

  assert.equal("id" in record, false);
  assert.equal("patientId" in record, false);
  assert.deepEqual(Object.keys(record), []);
});

test("medicações com o mesmo nome e dosagem diferente não são iguais", () => {
  const a = build({ medications: [{ name: "Lisinopril", dosage: "10mg" }] });
  const b = build({ medications: [{ name: "Lisinopril", dosage: "50mg" }] });

  assert.equal(a.equals(b), false);
});

test("diagnósticos e tratamentos comparam todos os seus campos", () => {
  const a = build({
    diagnoses: ["Hypertension"],
    treatments: ["Reduced salt intake"],
  });
  const b = build({
    diagnoses: ["Diabetes"],
    treatments: ["Reduced salt intake"],
  });

  assert.equal(a.equals(b), false);
});

test("a ordem das coleções não importa", () => {
  const a = build({
    diagnoses: ["Hypertension", "Diabetes"],
    medications: [
      { name: "Lisinopril", dosage: "10mg" },
      { name: "Metformin", dosage: "500mg" },
    ],
  });
  const b = build({
    diagnoses: ["Diabetes", "Hypertension"],
    medications: [
      { name: "Metformin", dosage: "500mg" },
      { name: "Lisinopril", dosage: "10mg" },
    ],
  });

  assert.equal(a.equals(b), true);
});

test("duplicatas são respeitadas: [A, A] não é igual a [A, B]", () => {
  const a = build({
    medications: [
      { name: "Lisinopril", dosage: "10mg" },
      { name: "Lisinopril", dosage: "10mg" },
    ],
  });
  const b = build({
    medications: [
      { name: "Lisinopril", dosage: "10mg" },
      { name: "Metformin", dosage: "500mg" },
    ],
  });

  assert.equal(a.equals(b), false);
});

test("coleções com tamanhos diferentes não são iguais", () => {
  assert.equal(build(fullContent).equals(build()), false);
});

test("objetos de valor são imutáveis na compilação e em runtime", () => {
  const medication = new Medication({ name: "Lisinopril", dosage: "10mg" });

  assert.equal(Object.isFrozen(medication), true);
  assert.equal(
    Object.isFrozen(new Diagnoses({ description: "Hypertension" })),
    true,
  );
  assert.equal(
    Object.isFrozen(new Treatment({ description: "Reduced salt intake" })),
    true,
  );
  assert.equal(
    Object.isFrozen(
      new Address({
        street: "Rua das Flores",
        number: "123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
      }),
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(
      new EmergencyContact({ name: "Maria Silva", phone: "(11) 88888-8888" }),
    ),
    true,
  );

  assert.throws(() => {
    // @ts-expect-error - `readonly` impede a reatribuição em tempo de compilação.
    medication.dosage = "50mg";
  }, TypeError);

  assert.equal(medication.dosage, "10mg");
});

test("os métodos add* continuam rejeitando objetos literais em runtime", () => {
  const record = build();

  assert.throws(
    // @ts-expect-error - objetos literais não são aceitos pelo tipo, e também não devem ser em runtime.
    () => record.addDiagnoses({ description: "Hypertension" }),
    /instance of the Diagnoses class/,
  );
});

test("horários: os mesmos períodos em ordem diferente são iguais", () => {
  const a = new WorkingHours();
  a.hours.push({ day: "Monday", timeSlot: "08:00-12:00" });
  a.hours.push({ day: "Wednesday", timeSlot: "08:00-12:00" });

  const b = new WorkingHours();
  b.hours.push({ day: "Wednesday", timeSlot: "08:00-12:00" });
  b.hours.push({ day: "Monday", timeSlot: "08:00-12:00" });

  assert.equal(a.equals(b), true);
});

test("horários: duplicatas são respeitadas", () => {
  const a = new WorkingHours();
  a.hours.push(
    { day: "Monday", timeSlot: "08:00-12:00" },
    { day: "Monday", timeSlot: "08:00-12:00" },
  );

  const b = new WorkingHours();
  b.hours.push(
    { day: "Monday", timeSlot: "08:00-12:00" },
    { day: "Tuesday", timeSlot: "09:00-10:00" },
  );

  assert.equal(a.equals(b), false);
});

run();
