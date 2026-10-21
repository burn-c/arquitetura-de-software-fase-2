import assert from "node:assert/strict";
import { Doctor } from "./Doctor.ts";
import { DoctorRepository } from "./DoctorRepository.ts";
import { DoctorService } from "./DoctorService.ts";
import { createTestRunner } from "../../testing/testOutput.ts";

type DoctorInput = ConstructorParameters<typeof Doctor>[0];

function buildDoctor(overrides: Partial<DoctorInput> = {}): Doctor {
  return new Doctor({
    id: "med-001",
    rcm: "CRM-SP 123456",
    name: "Maria Santos",
    specialties: ["Cardiologia"],
    phone: "(11) 91234-5678",
    ...overrides,
  });
}

function createService(): DoctorService {
  return new DoctorService(new DoctorRepository());
}

function seed(service: DoctorService, data: Doctor = buildDoctor()): Doctor {
  return service.addDoctor(data);
}

function ids(doctors: ReadonlyArray<Doctor>): string[] {
  return doctors.map((doctor) => doctor.id);
}

const { test, run } = createTestRunner("DoctorService");

test("addDoctor guarda e devolve o médico", () => {
  const service = createService();
  const doctor = seed(service);

  assert.equal(service.findDoctorById("med-001"), doctor);
  assert.deepEqual(ids(service.findAllDoctors()), ["med-001"]);
});

test("findDoctorById devolve undefined para um id inexistente", () => {
  const service = createService();
  seed(service);

  assert.equal(service.findDoctorById("med-099"), undefined);
});

test("findAllDoctors devolve todos na ordem de inserção", () => {
  const service = createService();

  service.addDoctor(buildDoctor({ id: "med-003", name: "Ana Souza" }));
  service.addDoctor(buildDoctor({ id: "med-001", name: "Maria Santos" }));
  service.addDoctor(buildDoctor({ id: "med-002", name: "Carlos Lima" }));

  assert.deepEqual(ids(service.findAllDoctors()), ["med-003", "med-001", "med-002"]);
});

test("updateDoctor atualiza os campos e persiste", () => {
  const service = createService();
  const doctor = seed(service);

  const updated = service.updateDoctor("med-001", {
    name: "Maria Souza",
    phone: "(11) 00000-0000",
  });

  assert.equal(updated, doctor);
  assert.equal(service.findDoctorById("med-001")?.name, "Maria Souza");
  assert.equal(service.findDoctorById("med-001")?.phone, "(11) 00000-0000");
});

test("updateDoctor rejeita um id inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.updateDoctor("med-099", { name: "Ninguém" }),
    /Doctor not found/,
  );
});

test("deleteDoctor remove e devolve o médico removido", () => {
  const service = createService();
  const doctor = seed(service);

  const removed = service.deleteDoctor("med-001");

  assert.equal(removed, doctor);
  assert.equal(service.findDoctorById("med-001"), undefined);
  assert.deepEqual(service.findAllDoctors(), []);
});

test("deleteDoctor rejeita um id inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.deleteDoctor("med-099"),
    /Doctor not found/,
  );
});

test("addSpecialty adiciona a especialidade e persiste", () => {
  const service = createService();
  const doctor = seed(service);

  service.addSpecialty("med-001", "Clínica Geral");

  assert.deepEqual(doctor.specialties, ["Cardiologia", "Clínica Geral"]);
  assert.deepEqual(service.findDoctorById("med-001")?.specialties, [
    "Cardiologia",
    "Clínica Geral",
  ]);
});

test("addSpecialty rejeita especialidade duplicada", () => {
  const service = createService();
  seed(service);

  assert.throws(
    () => service.addSpecialty("med-001", "Cardiologia"),
    /Specialty already exists/,
  );
  assert.deepEqual(service.findDoctorById("med-001")?.specialties, [
    "Cardiologia",
  ]);
});

test("addSpecialty rejeita um médico inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.addSpecialty("med-099", "Cardiologia"),
    /Doctor not found/,
  );
});

test("addDoctorWorkingHours adiciona o horário de atendimento", () => {
  const service = createService();
  const doctor = seed(service);

  service.addDoctorWorkingHours("med-001", "Monday", "08:00-12:00");

  assert.deepEqual(doctor.workingHours.hours, [
    { day: "Monday", timeSlot: "08:00-12:00" },
  ]);
});

test("addDoctorWorkingHours rejeita um horário duplicado", () => {
  const service = createService();
  const doctor = seed(service);
  doctor.workingHours.hours.push({
    day: "Monday",
    timeSlot: "08:00-12:00",
  });

  assert.throws(
    () => service.addDoctorWorkingHours("med-001", "Monday", "08:00-12:00"),
    /Working hours already exist/,
  );
});

test("addDoctorWorkingHours rejeita um médico inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.addDoctorWorkingHours("med-099", "Monday", "08:00-12:00"),
    /Doctor not found/,
  );
});

test("removeWorkingHours remove apenas o horário informado", () => {
  const service = createService();
  const doctor = seed(service);
  doctor.workingHours.hours.push(
    { day: "Monday", timeSlot: "08:00-12:00" },
    { day: "Monday", timeSlot: "14:00-18:00" },
  );

  service.removeWorkingHours("med-001", "Monday", "08:00-12:00");

  assert.deepEqual(doctor.workingHours.hours, [
    { day: "Monday", timeSlot: "14:00-18:00" },
  ]);
});

test("removeWorkingHours rejeita um médico inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.removeWorkingHours("med-099", "Monday", "08:00-12:00"),
    /Doctor not found/,
  );
});

test("listWorkingHours devolve os horários do médico", () => {
  const service = createService();
  const doctor = seed(service);
  doctor.workingHours.hours.push({
    day: "Monday",
    timeSlot: "08:00-12:00",
  });

  assert.deepEqual(service.listWorkingHours("med-001"), [
    { day: "Monday", timeSlot: "08:00-12:00" },
  ]);
});

test("listWorkingHours rejeita um médico inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.listWorkingHours("med-099"),
    /Doctor not found/,
  );
});

run();
