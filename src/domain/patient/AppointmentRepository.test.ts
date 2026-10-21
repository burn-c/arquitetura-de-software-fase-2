import assert from "node:assert/strict";
import { Appointment } from "./Appointments.ts";
import { AppointmentRepository } from "./AppointmentRepository.ts";
import {
  createTestRunner,
  showRepository,
  showResults as printResults,
} from "../../testing/testOutput.ts";

// O construtor do Appointment recebe um DTO; reaproveitamos o próprio tipo.
type AppointmentInput = ConstructorParameters<typeof Appointment>[0];

// Consulta válida e previsível; cada teste sobrescreve só o que importa.
function buildAppointment(
  overrides: Partial<AppointmentInput> = {},
): Appointment {
  return new Appointment({
    id: "apt-001",
    date: new Date("2023-06-15T10:00:00"),
    patientId: "1",
    doctorId: "med-001",
    reason: "Rotina",
    ...overrides,
  });
}

function buildRepository(
  appointments: Appointment[] = [],
): AppointmentRepository {
  const repository = new AppointmentRepository();
  appointments.forEach((appointment) => repository.add(appointment.id, appointment));
  return repository;
}

function ids(appointments: ReadonlyArray<Appointment>): string[] {
  return appointments.map((appointment) => appointment.id);
}

/* ------------------------- visualização no terminal ------------------------ */

function toRow(appointment: Appointment) {
  return {
    id: appointment.id,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    status: appointment.status,
  };
}

function show(label: string, repository: AppointmentRepository): void {
  showRepository(label, repository, toRow);
}

function showResults(
  label: string,
  appointments: ReadonlyArray<Appointment>,
): void {
  printResults(label, appointments, toRow, "(nenhuma consulta)");
}

const { test, run } = createTestRunner("AppointmentRepository");

test("o repositório começa vazio", () => {
  const repository = new AppointmentRepository();

  assert.deepEqual(repository.findAll(), []);
  assert.equal(repository.findById("apt-001"), undefined);
  assert.deepEqual(repository.findByPatientId("1"), []);
  assert.deepEqual(repository.findByDoctorId("med-001"), []);
  assert.deepEqual(repository.findByStatus("scheduled"), []);
  show("estado inicial", repository);
});

test("add guarda a consulta e findById a recupera", () => {
  const repository = new AppointmentRepository();
  const appointment = buildAppointment();

  repository.add(appointment.id, appointment);

  assert.equal(repository.findById("apt-001"), appointment);
  assert.equal(repository.findById("apt-002"), undefined);
  show('add(id: "apt-001")', repository);
});

test("add rejeita um id duplicado e preserva a consulta original", () => {
  const repository = buildRepository([buildAppointment()]);
  show('antes do add(id: "apt-001") duplicado', repository);

  assert.throws(
    () => repository.add("apt-001", buildAppointment({ reason: "Outra" })),
    /Entity with id apt-001 already exists/,
  );

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("apt-001")?.reason, "Rotina");
  show("depois do add duplicado (inalterado)", repository);
});

test("findAll devolve as consultas na ordem de inserção", () => {
  const repository = buildRepository([
    buildAppointment({ id: "apt-003" }),
    buildAppointment({ id: "apt-001" }),
    buildAppointment({ id: "apt-002" }),
  ]);

  assert.deepEqual(ids(repository.findAll()), ["apt-003", "apt-001", "apt-002"]);
  show("findAll()", repository);
});

test("findByPatientId filtra as consultas do paciente", () => {
  const repository = buildRepository([
    buildAppointment({ id: "apt-001", patientId: "1" }),
    buildAppointment({ id: "apt-002", patientId: "2" }),
    buildAppointment({ id: "apt-003", patientId: "1" }),
  ]);

  assert.deepEqual(ids(repository.findByPatientId("1")), ["apt-001", "apt-003"]);
  assert.deepEqual(ids(repository.findByPatientId("2")), ["apt-002"]);
  assert.deepEqual(repository.findByPatientId("99"), []);
  showResults('findByPatientId("1")', repository.findByPatientId("1"));
  showResults('findByPatientId("99")', repository.findByPatientId("99"));
});

test("findByDoctorId filtra as consultas do médico", () => {
  const repository = buildRepository([
    buildAppointment({ id: "apt-001", doctorId: "med-001" }),
    buildAppointment({ id: "apt-002", doctorId: "med-002" }),
    buildAppointment({ id: "apt-003", doctorId: "med-001" }),
  ]);

  assert.deepEqual(ids(repository.findByDoctorId("med-001")), [
    "apt-001",
    "apt-003",
  ]);
  assert.deepEqual(ids(repository.findByDoctorId("med-002")), ["apt-002"]);
  assert.deepEqual(repository.findByDoctorId("med-099"), []);
  showResults('findByDoctorId("med-001")', repository.findByDoctorId("med-001"));
});

test("findByStatus separa agendadas, concluídas e canceladas", () => {
  const repository = buildRepository([
    buildAppointment({ id: "apt-001" }),
    buildAppointment({ id: "apt-002", status: "completed" }),
    buildAppointment({ id: "apt-003", status: "canceled" }),
    buildAppointment({ id: "apt-004" }),
  ]);

  assert.deepEqual(ids(repository.findByStatus("scheduled")), [
    "apt-001",
    "apt-004",
  ]);
  assert.deepEqual(ids(repository.findByStatus("completed")), ["apt-002"]);
  assert.deepEqual(ids(repository.findByStatus("canceled")), ["apt-003"]);
  showResults('findByStatus("scheduled")', repository.findByStatus("scheduled"));
  showResults('findByStatus("completed")', repository.findByStatus("completed"));
  showResults('findByStatus("canceled")', repository.findByStatus("canceled"));
});

test("o status padrão da consulta é scheduled", () => {
  const repository = buildRepository([buildAppointment({ id: "apt-001" })]);

  assert.equal(repository.findById("apt-001")?.status, "scheduled");
  assert.deepEqual(ids(repository.findByStatus("scheduled")), ["apt-001"]);
  assert.deepEqual(repository.findByStatus("canceled"), []);
});

test("update substitui a consulta e atualiza as buscas", () => {
  const original = buildAppointment();
  const repository = buildRepository([original]);
  show('antes do update(id: "apt-001")', repository);

  const updated = buildAppointment({
    id: "apt-001",
    patientId: "2",
    doctorId: "med-002",
    status: "completed",
  });
  repository.update("apt-001", updated);

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("apt-001"), updated);
  assert.notEqual(repository.findById("apt-001"), original);
  assert.deepEqual(repository.findByPatientId("1"), []);
  assert.deepEqual(ids(repository.findByPatientId("2")), ["apt-001"]);
  assert.deepEqual(repository.findByDoctorId("med-001"), []);
  assert.deepEqual(ids(repository.findByDoctorId("med-002")), ["apt-001"]);
  assert.deepEqual(repository.findByStatus("scheduled"), []);
  assert.deepEqual(ids(repository.findByStatus("completed")), ["apt-001"]);
  show('depois do update(id: "apt-001")', repository);
});

test("update rejeita um id inexistente e não cria a consulta", () => {
  const repository = new AppointmentRepository();

  assert.throws(
    () => repository.update("apt-099", buildAppointment({ id: "apt-099" })),
    /Entity with id apt-099 does not exist/,
  );

  assert.equal(repository.findAll().length, 0);
  assert.equal(repository.findById("apt-099"), undefined);
});

test("delete remove a consulta de todas as buscas", () => {
  const repository = buildRepository([
    buildAppointment({ id: "apt-001", patientId: "1", doctorId: "med-001" }),
    buildAppointment({ id: "apt-002", patientId: "2", doctorId: "med-002" }),
  ]);

  repository.delete("apt-001");

  assert.equal(repository.findById("apt-001"), undefined);
  assert.deepEqual(repository.findByPatientId("1"), []);
  assert.deepEqual(repository.findByDoctorId("med-001"), []);
  assert.deepEqual(ids(repository.findByStatus("scheduled")), ["apt-002"]);
  assert.deepEqual(ids(repository.findAll()), ["apt-002"]);
  show('depois do delete(id: "apt-001")', repository);
});

test("delete rejeita um id inexistente", () => {
  const repository = buildRepository([buildAppointment()]);

  assert.throws(
    () => repository.delete("apt-099"),
    /Entity with id apt-099 does not exist/,
  );

  assert.equal(repository.findAll().length, 1);
});

run();
