import assert from "node:assert/strict";
import { Doctor } from "./Doctor.ts";
import { createTestRunner } from "../../testing/testOutput.ts";

type DoctorInput = ConstructorParameters<typeof Doctor>[0];

// Médico válido e previsível; cada teste sobrescreve só o que importa.
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

const { test, run } = createTestRunner("Doctor");

test("cria o médico com os dados informados", () => {
  const doctor = buildDoctor();

  assert.equal(doctor.id, "med-001");
  assert.equal(doctor.rcm, "CRM-SP 123456");
  assert.equal(doctor.name, "Maria Santos");
  assert.equal(doctor.phone, "(11) 91234-5678");
  assert.deepEqual(doctor.specialties, ["Cardiologia"]);
});

test("o médico começa sem horários de atendimento", () => {
  const doctor = buildDoctor();

  assert.deepEqual(doctor.workingHours.hours, []);
});

test("specialties é uma coleção mutável usada pelo serviço", () => {
  const doctor = buildDoctor();

  doctor.specialties.push("Clínica Geral");

  assert.deepEqual(doctor.specialties, ["Cardiologia", "Clínica Geral"]);
});

test("workingHours pode ser preenchido pelo serviço", () => {
  const doctor = buildDoctor();

  doctor.workingHours.hours.push({ day: "Monday", timeSlot: "08:00-12:00" });

  assert.deepEqual(doctor.workingHours.hours, [
    { day: "Monday", timeSlot: "08:00-12:00" },
  ]);
});

run();
