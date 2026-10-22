import assert from "node:assert/strict";
import { Doctor } from "../../entities/Doctor.ts";
import { WorkingHours } from "../../value-objects/WorkingHours.ts";
import { DoctorRepository } from "../../../infrastructure/persistence/DoctorRepository.ts";
import { createTestRunner } from "../../../testing/testOutput.ts";
import { DoctorWorkingHoursService } from "./DoctorWorkingHoursService.ts";

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
  const service = new DoctorWorkingHoursService(repository);
  const doctor = buildDoctor();

  repository.add(doctor.id, doctor);

  return { service, doctor };
}

// Datas normalizadas: os campos UTC representam o relógio de parede.
const FRIDAY_10AM = new Date(Date.UTC(2025, 2, 7, 10, 0));
const SATURDAY_10AM = new Date(Date.UTC(2025, 2, 8, 10, 0));
const FRIDAY_8AM = new Date(Date.UTC(2025, 2, 7, 8, 0));

const { test, run } = createTestRunner("DoctorWorkingHoursService");

test("addWorkingHours adiciona o horário de atendimento", () => {
  const { service, doctor } = createContext();

  service.addWorkingHours("med-001", "Friday", "09:00 AM - 05:00 PM");

  assert.deepEqual(doctor.workingHours.hours, [
    { day: "Friday", timeSlot: "09:00 AM - 05:00 PM" },
  ]);
});

test("addWorkingHours rejeita um horário duplicado", () => {
  const { service } = createContext();
  service.addWorkingHours("med-001", "Friday", "09:00 AM - 05:00 PM");

  assert.throws(
    () =>
      service.addWorkingHours("med-001", "Friday", "09:00 AM - 05:00 PM"),
    /Working hours already exist/,
  );
});

test("addWorkingHours rejeita um médico inexistente", () => {
  const { service } = createContext();

  assert.throws(
    () => service.addWorkingHours("med-099", "Friday", "09:00 AM - 05:00 PM"),
    /Doctor not found/,
  );
});

test("removeWorkingHours remove apenas o horário informado", () => {
  const { service, doctor } = createContext();
  service.addWorkingHours("med-001", "Friday", "09:00 AM - 05:00 PM");
  service.addWorkingHours("med-001", "Friday", "02:00 PM - 06:00 PM");

  service.removeWorkingHours("med-001", "Friday", "09:00 AM - 05:00 PM");

  assert.deepEqual(doctor.workingHours.hours, [
    { day: "Friday", timeSlot: "02:00 PM - 06:00 PM" },
  ]);
});

test("removeWorkingHours rejeita um médico inexistente", () => {
  const { service } = createContext();

  assert.throws(
    () =>
      service.removeWorkingHours("med-099", "Friday", "09:00 AM - 05:00 PM"),
    /Doctor not found/,
  );
});

test("listWorkingHours devolve os horários do médico", () => {
  const { service } = createContext();
  service.addWorkingHours("med-001", "Friday", "09:00 AM - 05:00 PM");

  assert.deepEqual(service.listWorkingHours("med-001"), [
    { day: "Friday", timeSlot: "09:00 AM - 05:00 PM" },
  ]);
});

test("getWorkingHours devolve o objeto de valor do médico", () => {
  const { service, doctor } = createContext();

  assert.equal(service.getWorkingHours("med-001"), doctor.workingHours);
});

test("getWorkingHours rejeita um médico inexistente", () => {
  const { service } = createContext();

  assert.throws(
    () => service.getWorkingHours("med-099"),
    /Doctor not found/,
  );
});

test("isWithinWorkingHours aceita um horário dentro da faixa", () => {
  const { service } = createContext();
  const workingHours = new WorkingHours([
    { day: "Friday", timeSlot: "09:00 AM - 05:00 PM" },
  ]);

  assert.equal(service.isWithinWorkingHours(workingHours, FRIDAY_10AM), true);
});

test("isWithinWorkingHours rejeita outro dia da semana", () => {
  const { service } = createContext();
  const workingHours = new WorkingHours([
    { day: "Friday", timeSlot: "09:00 AM - 05:00 PM" },
  ]);

  assert.equal(service.isWithinWorkingHours(workingHours, SATURDAY_10AM), false);
});

test("isWithinWorkingHours rejeita um horário antes da faixa", () => {
  const { service } = createContext();
  const workingHours = new WorkingHours([
    { day: "Friday", timeSlot: "09:00 AM - 05:00 PM" },
  ]);

  assert.equal(service.isWithinWorkingHours(workingHours, FRIDAY_8AM), false);
});

test("isWithinWorkingHours entende faixas em formato 24 horas", () => {
  const { service } = createContext();
  const workingHours = new WorkingHours([
    { day: "Friday", timeSlot: "08:00-12:00" },
  ]);

  assert.equal(service.isWithinWorkingHours(workingHours, FRIDAY_10AM), true);
});

test("isWithinWorkingHours trata 12:00 AM como meia-noite", () => {
  const { service } = createContext();
  const workingHours = new WorkingHours([
    { day: "Friday", timeSlot: "12:00 AM - 02:00 AM" },
  ]);
  const midnight = new Date(Date.UTC(2025, 2, 7, 0, 30));
  const noon = new Date(Date.UTC(2025, 2, 7, 12, 30));

  assert.equal(service.isWithinWorkingHours(workingHours, midnight), true);
  assert.equal(service.isWithinWorkingHours(workingHours, noon), false);
});

run();
