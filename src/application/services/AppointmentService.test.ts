import assert from "node:assert/strict";
import { Appointment } from "../../domain/entities/Appointments.ts";
import { Doctor } from "../../domain/entities/Doctor.ts";
import type { CreatePatientDTO } from "../../domain/entities/Patient.ts";
import { DoctorAvailabilityService } from "../../domain/services/doctor-services/DoctorAvailabilityService.ts";
import { DoctorService } from "../../domain/services/doctor-services/DoctorService.ts";
import { DoctorWorkingHoursService } from "../../domain/services/doctor-services/DoctorWorkingHoursService.ts";
import { PatientService } from "../../domain/services/PatientService.ts";
import { NotificationService } from "../../infrastructure/notification/NotificationService.ts";
import { AppointmentRepository } from "../../infrastructure/persistence/AppointmentRepository.ts";
import { DoctorRepository } from "../../infrastructure/persistence/DoctorRepository.ts";
import { PatientRepository } from "../../infrastructure/persistence/PatientRepository.ts";
import { createTestRunner } from "../../testing/testOutput.ts";
import { AppointmentService } from "./AppointmentService.ts";

type AppointmentInput = ConstructorParameters<typeof Appointment>[0];
type DoctorInput = ConstructorParameters<typeof Doctor>[0];

// Sexta-feira, 7 de março de 2025, ao meio-dia (horário local).
const FRIDAY_NOON = new Date(2025, 2, 7, 12, 0);
// Sábado, 8 de março de 2025 — o médico só atende às sextas.
const SATURDAY_NOON = new Date(2025, 2, 8, 12, 0);

function buildPatient(
  overrides: Partial<CreatePatientDTO> = {},
): CreatePatientDTO {
  return {
    id: "patient-001",
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
  };
}

function buildDoctor(overrides: Partial<DoctorInput> = {}): Doctor {
  return new Doctor({
    id: "doctor-001",
    rcm: "CRM-SP 123456",
    name: "Dra. Maria Santos",
    specialties: ["Cardiologia"],
    phone: "(11) 91234-5678",
    ...overrides,
  });
}

function buildAppointment(
  overrides: Partial<AppointmentInput> = {},
): AppointmentInput {
  return {
    id: "appointment-001",
    date: FRIDAY_NOON,
    patientId: "patient-001",
    doctorId: "doctor-001",
    reason: "Checkup",
    ...overrides,
  };
}

function createContext() {
  const appointmentRepository = new AppointmentRepository();
  const patientService = new PatientService(new PatientRepository());
  const doctorRepository = new DoctorRepository();
  const doctorService = new DoctorService(doctorRepository);
  const doctorWorkingHoursService = new DoctorWorkingHoursService(
    doctorRepository,
  );
  const doctorAvailabilityService = new DoctorAvailabilityService(
    appointmentRepository,
    doctorService,
    doctorWorkingHoursService,
  );
  const appointmentService = new AppointmentService(
    patientService,
    doctorService,
    appointmentRepository,
    doctorAvailabilityService,
    new NotificationService(),
  );

  return {
    appointmentService,
    appointmentRepository,
    patientService,
    doctorService,
    doctorWorkingHoursService,
  };
}

// Agenda um paciente e um médico com atendimento na sexta-feira.
function seed(context: ReturnType<typeof createContext>) {
  const patient = context.patientService.addPatient(buildPatient());
  const doctor = context.doctorService.addDoctor(buildDoctor());

  context.doctorWorkingHoursService.addWorkingHours(
    doctor.id,
    "Friday",
    "09:00 AM - 05:00 PM",
  );

  return { patient, doctor };
}

function captureLogs(run: () => void): string[] {
  const originalLog = console.log;
  const logs: string[] = [];

  console.log = (...args: unknown[]) => {
    logs.push(args.join(" "));
  };

  try {
    run();
  } finally {
    console.log = originalLog;
  }

  return logs;
}

const { test, run } = createTestRunner("AppointmentService");

test("execute persiste a consulta, agenda no paciente e notifica", () => {
  const context = createContext();
  const { patient } = seed(context);

  const appointment = new Appointment(buildAppointment());
  let result: Appointment | undefined;
  const logs = captureLogs(() => {
    result = context.appointmentService.execute(appointment);
  });

  assert.equal(result, appointment);
  assert.equal(context.appointmentRepository.findById(appointment.id), appointment);
  assert.deepEqual(patient.appointments, [appointment]);
  assert.ok(logs.some((log) => log.includes("Sending email to joao.silva@email.com")));
});

test("execute rejeita um paciente inexistente", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () =>
      context.appointmentService.execute(
        new Appointment(buildAppointment({ patientId: "patient-099" })),
      ),
    /Patient not found/,
  );
  assert.deepEqual(context.appointmentRepository.findAll(), []);
});

test("execute rejeita um médico inexistente", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () =>
      context.appointmentService.execute(
        new Appointment(buildAppointment({ doctorId: "doctor-099" })),
      ),
    /Doctor not found/,
  );
  assert.deepEqual(context.appointmentRepository.findAll(), []);
});

test("execute rejeita um horário fora do atendimento do médico", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () =>
      captureLogs(() =>
        context.appointmentService.execute(
          new Appointment(buildAppointment({ date: SATURDAY_NOON })),
        ),
      ),
    /Doctor is not available/,
  );
  assert.deepEqual(context.appointmentRepository.findAll(), []);
});

test("execute rejeita conflito de agenda do paciente antes de persistir", () => {
  const context = createContext();
  const { patient } = seed(context);

  const first = new Appointment(buildAppointment({ id: "appointment-001" }));
  const second = new Appointment(buildAppointment({ id: "appointment-002" }));

  captureLogs(() => patient.scheduleAppointment(first));

  assert.throws(
    () =>
      captureLogs(() => context.appointmentService.execute(second)),
    /Appointment conflict/,
  );
  assert.deepEqual(context.appointmentRepository.findAll(), []);
});

test("execute rejeita uma data inválida", () => {
  const context = createContext();
  seed(context);

  assert.throws(
    () =>
      context.appointmentService.execute(
        new Appointment(buildAppointment({ date: new Date("invalid") })),
      ),
    /Invalid date/,
  );
});

test("findById devolve a consulta persistida", () => {
  const context = createContext();
  seed(context);

  const appointment = new Appointment(buildAppointment());
  captureLogs(() => context.appointmentService.execute(appointment));

  assert.equal(context.appointmentService.findById(appointment.id), appointment);
});

test("findById rejeita um id inexistente", () => {
  const context = createContext();

  assert.throws(
    () => context.appointmentService.findById("appointment-099"),
    /Appointment not found/,
  );
});

test("findAll devolve todas as consultas persistidas", () => {
  const context = createContext();
  seed(context);

  const first = new Appointment(buildAppointment({ id: "appointment-001" }));
  const second = new Appointment(
    buildAppointment({ id: "appointment-002", date: new Date(2025, 2, 7, 14, 0) }),
  );

  captureLogs(() => {
    context.appointmentService.execute(first);
    context.appointmentService.execute(second);
  });

  assert.deepEqual(context.appointmentService.findAll(), [first, second]);
});

run();
