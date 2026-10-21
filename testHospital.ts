import { Address } from "./domain/address.ts";
import { Appointment } from "./domain/appointments.ts";
import { Diagnoses } from "./domain/diagnosis.ts";
import { Medication } from "./domain/medication.ts";
import { Treatment } from "./domain/treatment.ts";
import { EmergencyContact } from "./domain/emergencyContact.ts";
import { Exam } from "./domain/exam.ts";
import { Doctor } from "./domain/doctor.ts";
import { Patient } from "./domain/patient.ts";
import { MedicalRecord } from "./domain/medicalRecord.ts";

console.log("Welcome to the Patient Management System!");

const emergencyContact1 = new EmergencyContact({
  name: "Maria Silva",
  phone: "(11) 88888-8888",
});

const address1 = new Address({
  street: "Rua das Flores",
  number: "123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
});

const patient1 = new Patient({
  id: "1",
  identificationDocument: "123.456.789-00",
  name: "João Silva",
  birthDate: new Date("1990-01-01"),
  gender: "Male",
  bloodType: "O+",
  address: address1,
  phone: "(11) 99999-9999",
  email: "joao.silva@email.com",
  emergencyContact: emergencyContact1,
});

const doctor1 = new Doctor({
  id: "101",
  rcm: "CRM/SP 123456",
  name: "Dr. Carlos",
  specialties: ["Cardiology", "General Practice"],
  phone: "(11) 77777-7777",
});

const appointment1 = new Appointment({
  id: "201",
  date: new Date("2023-10-15"),
  patientId: patient1.id,
  doctorId: doctor1.id,
  reason: "Chest pain",
  notes: "Patient reported chest pain after physical exertion.",
});

doctor1.addWorkingHours({ day: "Monday", timeSlot: "08:00-12:00" });
doctor1.addWorkingHours({ day: "Wednesday", timeSlot: "08:00-12:00" });

const exam1 = new Exam({
  id: "301",
  type: "Blood count",
  result: "Normal",
  date: new Date("2023-10-10"),
  location: "Lab X",
  responsible: "Dr. Ana",
  patientId: patient1.id,
});

const medicalRecord1 = new MedicalRecord();

patient1.scheduleAppointment(appointment1);
patient1.addExam(exam1);
medicalRecord1.addDiagnoses(new Diagnoses({ description: "Hypertension" }));
medicalRecord1.addTreatment(
  new Treatment({ description: "Reduced salt intake" }),
);
medicalRecord1.addMedication(
  new Medication({ name: "Captopril", dosage: "25mg" }),
);

console.log("Patient:");
console.table([
  { Field: "ID", Value: patient1.id },
  { Field: "Name", Value: patient1.name },
  { Field: "CPF", Value: patient1.identificationDocument },
  {
    Field: "Birth date",
    Value: patient1.birthDate.toLocaleDateString("pt-BR", { timeZone: "UTC" }),
  },
  { Field: "Gender", Value: patient1.gender },
  { Field: "Blood type", Value: patient1.bloodType },
  { Field: "Phone", Value: patient1.phone },
  { Field: "E-mail", Value: patient1.email },
  { Field: "Allergies", Value: patient1.allergies.join(", ") },
  {
    Field: "Address",
    Value: `${patient1.address.street}, ${patient1.address.number} – ${patient1.address.city}/${patient1.address.state} – ZIP ${patient1.address.zipCode}`,
  },
  {
    Field: "Emergency contact",
    Value: `${patient1.emergencyContact.name} – ${patient1.emergencyContact.phone}`,
  },
]);

console.log("Doctor:");
console.table([
  { Field: "ID", Value: doctor1.id },
  { Field: "RCM", Value: doctor1.rcm },
  { Field: "Name", Value: doctor1.name },
  { Field: "Specialties", Value: doctor1.specialties.join(", ") },
  { Field: "Phone", Value: doctor1.phone },
  {
    Field: "Working days",
    Value:
      doctor1.listWorkingHours.hours.map((h) => h.day).join(", ") || "-",
  },
]);

console.log("Working hours:");
console.table(
  doctor1.listWorkingHours.hours.map((h, i) => ({
    "#": i + 1,
    Day: h.day,
    "Time slot": h.timeSlot,
  })),
);

console.log("Appointment:");
console.table([
  {
    ID: appointment1.id,
    Date: appointment1.date.toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    Patient: appointment1.patientId,
    Doctor: appointment1.doctorId,
    Reason: appointment1.reason,
    Status: appointment1.status,
    Notes: appointment1.notes ?? "-",
  },
]);

console.log("Exam:");
console.table([
  {
    ID: exam1.id,
    Type: exam1.type,
    Result: exam1.result,
    Date: exam1.date.toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    Location: exam1.location,
    Responsible: exam1.responsible,
    Patient: exam1.patientId,
  },
]);

console.log(
  `Medical record – patient ${patient1.name}`,
);
console.table([
  ...medicalRecord1.diagnoses.map((value, i) => ({
    Type: "Diagnoses",
    "#": i + 1,
    Value: value.description,
  })),
  ...medicalRecord1.treatments.map((value, i) => ({
    Type: "Treatment",
    "#": i + 1,
    Value: value.description,
  })),
  ...medicalRecord1.medications.map((value, i) => ({
    Type: "Medication",
    "#": i + 1,
    Value: `${value.name} (${value.dosage})`,
  })),
]);
