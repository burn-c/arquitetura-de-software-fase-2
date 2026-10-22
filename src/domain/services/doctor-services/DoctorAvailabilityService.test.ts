import assert from "node:assert/strict";
import { Appointment } from "../../entities/Appointments.ts";
import { Doctor } from "../../entities/Doctor.ts";
import { AppointmentRepository } from "../../../infrastructure/persistence/AppointmentRepository.ts";
import { DoctorRepository } from "../../../infrastructure/persistence/DoctorRepository.ts";
import { createTestRunner } from "../../../testing/testOutput.ts";
import { DoctorAvailabilityService } from "./DoctorAvailabilityService.ts";
import { DoctorService } from "./DoctorService.ts";
import { DoctorWorkingHoursService } from "./DoctorWorkingHoursService.ts";

type DoctorInput = ConstructorParameters<typeof Doctor>[0];

// Sexta-feira, 7 de março de 2025, ao meio-dia (horário local).
const FRIDAY_NOON = new Date(2025, 2, 7, 12, 0);
// Sábado, 8 de março de 2025 — o médico só atende às sextas.
const SATURDAY_NOON = new Date(2025, 2, 8, 12, 0);

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
  const doctorRepository = new DoctorRepository();
  const appointmentRepository = new AppointmentRepository();
  const doctorService = new DoctorService(doctorRepository);
  const doctorWorkingHoursService = new DoctorWorkingHoursService(
    doctorRepository,
  );
  const service = new DoctorAvailabilityService(
    appointmentRepository,
    doctorService,
    doctorWorkingHoursService,
  );

  return {
    service,
    appointmentRepository,
    doctorService,
    doctorWorkingHoursService,
  };
}

function seed(context: ReturnType<typeof createContext>): Doctor {
  const doctor = context.doctorService.addDoctor(buildDoctor());
  context.doctorWorkingHoursService.addWorkingHours(
    "med-001",
    "Friday",
    "09:00 AM - 05:00 PM",
  );

  return doctor;
}

const { test, run } = createTestRunner("DoctorAvailabilityService");

test("isDoctorAvailable devolve true dentro do expediente e sem conflito", () => {
  const context = createContext();
  seed(context);

  assert.equal(context.service.isDoctorAvailable("med-001", FRIDAY_NOON), true);
});

test("isDoctorAvailable rejeita um médico inexistente", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () => context.service.isDoctorAvailable("med-099", FRIDAY_NOON),
    /Doctor not found/,
  );
});

test("isDoctorAvailable rejeita um horário fora do expediente", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () => context.service.isDoctorAvailable("med-001", SATURDAY_NOON),
    /Doctor is not available/,
  );
});

test("isDoctorAvailable rejeita conflito com consulta existente", () => {
  const context = createContext();
  seed(context);
  context.appointmentRepository.add(
    "appointment-001",
    new Appointment({
      id: "appointment-001",
      date: FRIDAY_NOON,
      patientId: "patient-001",
      doctorId: "med-001",
      reason: "Checkup",
    }),
  );

  assert.throws(
    () => context.service.isDoctorAvailable("med-001", FRIDAY_NOON),
    /Doctor is not available/,
  );
});

test("isDoctorAvailable aceita outro horário no mesmo dia", () => {
  const context = createContext();
  seed(context);
  context.appointmentRepository.add(
    "appointment-001",
    new Appointment({
      id: "appointment-001",
      date: FRIDAY_NOON,
      patientId: "patient-001",
      doctorId: "med-001",
      reason: "Checkup",
    }),
  );

  assert.equal(
    context.service.isDoctorAvailable(
      "med-001",
      new Date(2025, 2, 7, 14, 0),
    ),
    true,
  );
});

test("isDoctorAvailable rejeita uma data inválida", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () => context.service.isDoctorAvailable("med-001", new Date("invalid")),
    /Invalid date/,
  );
});

test("isDoctorAvailable rejeita doctorId ou data ausentes", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () => context.service.isDoctorAvailable("", FRIDAY_NOON),
    /Invalid doctor ID or date/,
  );
  assert.throws(
    () => context.service.isDoctorAvailable("med-001", ""),
    /Invalid doctor ID or date/,
  );
});

test("isDoctorAvailable aceita uma data em string local", () => {
  const context = createContext();
  seed(context);

  assert.equal(
    context.service.isDoctorAvailable("med-001", "2025-03-07T12:00:00"),
    true,
  );
});

run();
