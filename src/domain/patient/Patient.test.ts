import assert from "node:assert/strict";
import { Appointment } from "./Appointments.ts";
import { Exam } from "./Exam.ts";
import { Patient } from "./Patient.ts";
import { createTestRunner } from "../../testing/testOutput.ts";

type PatientInput = ConstructorParameters<typeof Patient>[0];
type AppointmentInput = ConstructorParameters<typeof Appointment>[0];
type ExamInput = ConstructorParameters<typeof Exam>[0];

// Paciente válido e previsível; cada teste sobrescreve só o que importa.
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

function buildExam(overrides: Partial<ExamInput> = {}): Exam {
  return new Exam({
    id: "exa-001",
    type: "Hemograma",
    result: "Normal",
    date: new Date("2023-06-15T08:30:00"),
    location: "Laboratório Central",
    responsible: "Dra. Ana",
    patientId: "1",
    ...overrides,
  });
}

// Os métodos do agregado registram logs; silenciamos para manter a saída limpa.
function withoutLogs<T>(run: () => T): T {
  const originalLog = console.log;
  console.log = () => {};
  try {
    return run();
  } finally {
    console.log = originalLog;
  }
}

const { test, run } = createTestRunner("Patient");

test("o paciente começa sem consultas, exames e alergias", () => {
  const patient = buildPatient();

  assert.deepEqual(patient.appointments, []);
  assert.deepEqual(patient.exams, []);
  assert.deepEqual(patient.allergies, []);
});

test("addExam guarda o exame", () => {
  const patient = buildPatient();
  const exam = buildExam();

  withoutLogs(() => patient.addExam(exam));

  assert.deepEqual(patient.exams, [exam]);
});

test("addExam rejeita um objeto que não é Exam", () => {
  const patient = buildPatient();

  assert.throws(
    () => patient.addExam({} as Exam),
    /Invalid exam object/,
  );
  assert.deepEqual(patient.exams, []);
});

test("scheduleAppointment guarda a consulta", () => {
  const patient = buildPatient();
  const appointment = buildAppointment();

  withoutLogs(() => patient.scheduleAppointment(appointment));

  assert.deepEqual(patient.appointments, [appointment]);
});

test("scheduleAppointment rejeita conflito com o mesmo médico e horário", () => {
  const patient = buildPatient();

  withoutLogs(() =>
    patient.scheduleAppointment(buildAppointment({ id: "apt-001" }))
  );

  assert.throws(
    () =>
      withoutLogs(() =>
        patient.scheduleAppointment(buildAppointment({ id: "apt-002" }))
      ),
    /Appointment conflict/,
  );
  assert.equal(patient.appointments.length, 1);
});

test("scheduleAppointment permite o mesmo horário com outro médico", () => {
  const patient = buildPatient();

  withoutLogs(() => {
    patient.scheduleAppointment(
      buildAppointment({ id: "apt-001", doctorId: "med-001" }),
    );
    patient.scheduleAppointment(
      buildAppointment({ id: "apt-002", doctorId: "med-002" }),
    );
  });

  assert.deepEqual(
    patient.appointments.map((appointment) => appointment.doctorId),
    ["med-001", "med-002"],
  );
});

test("scheduleAppointment rejeita um objeto que não é Appointment", () => {
  const patient = buildPatient();

  assert.throws(
    () => patient.scheduleAppointment({} as Appointment),
    /Invalid appointment object/,
  );
  assert.deepEqual(patient.appointments, []);
});

test("os getters de consultas e exames devolvem cópias", () => {
  const patient = buildPatient();

  assert.notEqual(patient.appointments, patient.appointments);
  assert.notEqual(patient.exams, patient.exams);
});

run();
