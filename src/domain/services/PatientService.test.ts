import assert from "node:assert/strict";
import { Allergy } from "../value-objects/Allergy.ts";
import { Patient } from "../entities/Patient.ts";
import { PatientRepository } from "../../infrastructure/persistence/PatientRepository.ts";
import { PatientService } from "./PatientService.ts";
import { Diagnoses } from "../value-objects/medical-record/Diagnosis.ts";
import { Medication } from "../value-objects/medical-record/Medication.ts";
import { Treatment } from "../value-objects/medical-record/Treatment.ts";
import { createTestRunner } from "../../testing/testOutput.ts";

type PatientInput = ConstructorParameters<typeof Patient>[0];

function buildPatient(overrides: Partial<PatientInput> = {}): Patient {
  return new Patient({
    id: "1",
    identificationDocument: "123.456.789-00",
    name: "João Silva",
    birthDate: new Date("1990-01-01"),
    gender: "Male",
    bloodType: "O+",
    address: {
      street: "Rua das Flores",
      number: "123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
    },
    phone: "(11) 99999-9999",
    email: "joao.silva@email.com",
    emergencyContact: {
      name: "Maria Silva",
      phone: "(11) 88888-8888",
    },
    ...overrides,
  });
}

// O serviço e a entidade registram logs; silenciamos para manter a saída limpa.
function withoutLogs<T>(run: () => T): T {
  const originalLog = console.log;
  console.log = () => {};
  try {
    return run();
  } finally {
    console.log = originalLog;
  }
}

function createService(): PatientService {
  return new PatientService(new PatientRepository());
}

function seed(service: PatientService, data: Patient = buildPatient()): Patient {
  return withoutLogs(() => service.addPatient(data));
}

function ids(patients: ReadonlyArray<Patient>): string[] {
  return patients.map((patient) => patient.id);
}

const { test, run } = createTestRunner("PatientService");

test("addPatient guarda e devolve o paciente", () => {
  const service = createService();
  const patient = seed(service);

  assert.equal(service.findPatientById("1"), patient);
  assert.deepEqual(ids(service.findAllPatients()), ["1"]);
});

test("findPatientById devolve undefined para um id inexistente", () => {
  const service = createService();
  seed(service);

  assert.equal(service.findPatientById("99"), undefined);
});

test("findAllPatients devolve todos na ordem de inserção", () => {
  const service = createService();

  withoutLogs(() => {
    service.addPatient(buildPatient({ id: "3", name: "Ana Souza" }));
    service.addPatient(buildPatient({ id: "1", name: "João Silva" }));
    service.addPatient(buildPatient({ id: "2", name: "Maria Oliveira" }));
  });

  assert.deepEqual(ids(service.findAllPatients()), ["3", "1", "2"]);
});

test("findPatientsByName e findPatientsByBloodType filtram", () => {
  const service = createService();

  withoutLogs(() => {
    service.addPatient(
      buildPatient({ id: "1", name: "João Silva", bloodType: "O+" }),
    );
    service.addPatient(
      buildPatient({ id: "2", name: "Maria Oliveira", bloodType: "A-" }),
    );
    service.addPatient(
      buildPatient({ id: "3", name: "João Silva", bloodType: "A+" }),
    );
  });

  assert.deepEqual(ids(service.findPatientsByName("João Silva")), ["1", "3"]);
  assert.deepEqual(ids(service.findPatientsByBloodType("A-")), ["2"]);
  assert.deepEqual(service.findPatientsByName("Carlos"), []);
  assert.deepEqual(service.findPatientsByBloodType("AB-"), []);
});

test("updatePatient atualiza os campos e persiste", () => {
  const service = createService();
  const patient = seed(service);

  const updated = service.updatePatient("1", {
    name: "João Atualizado",
    phone: "(11) 00000-0000",
  });

  assert.equal(updated, patient);
  assert.equal(service.findPatientById("1")?.name, "João Atualizado");
  assert.equal(service.findPatientById("1")?.phone, "(11) 00000-0000");
});

test("updatePatient rejeita um id inexistente", () => {
  const service = createService();

  assert.throws(
    () => withoutLogs(() => service.updatePatient("99", { name: "Ninguém" })),
    /Paciente com ID 99 não encontrado/,
  );
});

test("deletePatient remove e devolve o paciente removido", () => {
  const service = createService();
  const patient = seed(service);

  const removed = withoutLogs(() => service.deletePatient("1"));

  assert.equal(removed, patient);
  assert.equal(service.findPatientById("1"), undefined);
  assert.deepEqual(service.findAllPatients(), []);
});

test("deletePatient rejeita um id inexistente", () => {
  const service = createService();

  assert.throws(
    () => withoutLogs(() => service.deletePatient("99")),
    /Paciente com ID 99 não encontrado/,
  );
});

test("addPatientAllergy adiciona a alergia e persiste", () => {
  const service = createService();
  seed(service);

  const patient = withoutLogs(() =>
    service.addPatientAllergy("1", new Allergy({ type: "Penicilina" }))
  );

  assert.deepEqual(
    patient.allergies.map((allergy) => allergy.type),
    ["Penicilina"],
  );
  assert.equal(service.findPatientById("1")?.allergies.length, 1);
});

test("addPatientAllergy rejeita uma alergia duplicada", () => {
  const service = createService();
  seed(service);

  withoutLogs(() =>
    service.addPatientAllergy("1", new Allergy({ type: "Penicilina" }))
  );

  assert.throws(
    () =>
      withoutLogs(() =>
        service.addPatientAllergy("1", new Allergy({ type: "Penicilina" }))
      ),
    /já possui a alergia/,
  );
  assert.equal(service.findPatientById("1")?.allergies.length, 1);
});

test("addPatientAllergy rejeita um objeto que não é Allergy", () => {
  const service = createService();
  seed(service);

  assert.throws(
    () => withoutLogs(() => service.addPatientAllergy("1", {} as Allergy)),
    /Objeto de alergia inválido/,
  );
  assert.equal(service.findPatientById("1")?.allergies.length, 0);
});

test("addPatientDiagnosis adiciona o diagnóstico ao prontuário", () => {
  const service = createService();
  seed(service);

  withoutLogs(() =>
    service.addPatientDiagnosis("1", new Diagnoses({ description: "Hipertensão" }))
  );

  assert.deepEqual(
    service
      .findPatientById("1")
      ?.medicalRecord.diagnoses.map((diagnosis) => diagnosis.description),
    ["Hipertensão"],
  );
});

test("addPatientMedication adiciona a medicação ao prontuário", () => {
  const service = createService();
  seed(service);

  withoutLogs(() =>
    service.addPatientMedication(
      "1",
      new Medication({ name: "Captopril", dosage: "25mg" }),
    )
  );

  assert.deepEqual(
    service
      .findPatientById("1")
      ?.medicalRecord.medications.map(
        (medication) => `${medication.name} ${medication.dosage}`,
      ),
    ["Captopril 25mg"],
  );
});

test("addPatientTreatment adiciona o tratamento ao prontuário", () => {
  const service = createService();
  seed(service);

  withoutLogs(() =>
    service.addPatientTreatment(
      "1",
      new Treatment({ description: "Reduzir sal" }),
    )
  );

  assert.deepEqual(
    service
      .findPatientById("1")
      ?.medicalRecord.treatments.map((treatment) => treatment.description),
    ["Reduzir sal"],
  );
});

test("as operações de prontuário rejeitam paciente inexistente", () => {
  const service = createService();

  assert.throws(
    () =>
      withoutLogs(() =>
        service.addPatientAllergy("99", new Allergy({ type: "Penicilina" }))
      ),
    /Paciente com ID 99 não encontrado/,
  );
  assert.throws(
    () =>
      withoutLogs(() =>
        service.addPatientDiagnosis("99", new Diagnoses({ description: "X" }))
      ),
    /Paciente com ID 99 não encontrado/,
  );
  assert.throws(
    () =>
      withoutLogs(() =>
        service.addPatientMedication(
          "99",
          new Medication({ name: "X", dosage: "1mg" }),
        )
      ),
    /Paciente com ID 99 não encontrado/,
  );
  assert.throws(
    () =>
      withoutLogs(() =>
        service.addPatientTreatment("99", new Treatment({ description: "X" }))
      ),
    /Paciente com ID 99 não encontrado/,
  );
});

run();
