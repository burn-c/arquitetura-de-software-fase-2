import assert from "node:assert/strict";
import { Doctor } from "../../entities/Doctor.ts";
import { DoctorRepository } from "../../../infrastructure/persistence/DoctorRepository.ts";
import { createTestRunner } from "../../../testing/testOutput.ts";
import { DoctorSpecialtyService } from "./DoctorSpecialtyService.ts";

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

function createContext() {
  const repository = new DoctorRepository();
  const service = new DoctorSpecialtyService(repository);
  const doctor = buildDoctor();

  repository.add(doctor.id, doctor);

  return { service, repository, doctor };
}

const { test, run } = createTestRunner("DoctorSpecialtyService");

test("addSpecialty adiciona a especialidade e persiste", () => {
  const { service, doctor } = createContext();

  service.addSpecialty("med-001", "Clínica Geral");

  assert.deepEqual(doctor.specialties, ["Cardiologia", "Clínica Geral"]);
  assert.deepEqual(service.listSpecialties("med-001"), [
    "Cardiologia",
    "Clínica Geral",
  ]);
});

test("addSpecialty rejeita especialidade duplicada", () => {
  const { service, doctor } = createContext();

  assert.throws(
    () => service.addSpecialty("med-001", "Cardiologia"),
    /Specialty already exists/,
  );
  assert.deepEqual(doctor.specialties, ["Cardiologia"]);
});

test("addSpecialty rejeita um médico inexistente", () => {
  const { service } = createContext();

  assert.throws(
    () => service.addSpecialty("med-099", "Cardiologia"),
    /Doctor not found/,
  );
});

test("removeSpecialty remove apenas a especialidade informada", () => {
  const { service, doctor } = createContext();
  doctor.specialties.push("Clínica Geral");

  service.removeSpecialty("med-001", "Cardiologia");

  assert.deepEqual(doctor.specialties, ["Clínica Geral"]);
});

test("removeSpecialty mantém a lista quando a especialidade não existe", () => {
  const { service, doctor } = createContext();

  service.removeSpecialty("med-001", "Ortopedia");

  assert.deepEqual(doctor.specialties, ["Cardiologia"]);
});

test("removeSpecialty rejeita um médico inexistente", () => {
  const { service } = createContext();

  assert.throws(
    () => service.removeSpecialty("med-099", "Cardiologia"),
    /Doctor not found/,
  );
});

test("listSpecialties devolve uma cópia da coleção", () => {
  const { service } = createContext();
  const specialties = service.listSpecialties("med-001");

  specialties.push("Ortopedia");

  assert.deepEqual(service.listSpecialties("med-001"), ["Cardiologia"]);
});

test("listSpecialties rejeita um médico inexistente", () => {
  const { service } = createContext();

  assert.throws(
    () => service.listSpecialties("med-099"),
    /Doctor not found/,
  );
});

run();
