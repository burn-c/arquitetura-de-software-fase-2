import { Appointment } from "../src/domain/entities/Appointments.ts";
import { Doctor } from "../src/domain/entities/Doctor.ts";
import { Exam } from "../src/domain/entities/Exam.ts";
import { Patient } from "../src/domain/entities/Patient.ts";
import { Address } from "../src/domain/value-objects/Address.ts";
import { EmergencyContact } from "../src/domain/value-objects/EmergencyContact.ts";

export const address = new Address({
  street: "Rua das Flores",
  number: "123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
});

export const emergencyContact = new EmergencyContact({
  name: "Maria Silva",
  phone: "(11) 88888-8888",
});

export const patient = new Patient({
  id: "1",
  identificationDocument: "123.456.789-00",
  name: "João Silva",
  birthDate: new Date("1990-01-01"),
  gender: "Male",
  bloodType: "O+",
  address,
  phone: "(11) 99999-9999",
  email: "joao.silva@email.com",
  emergencyContact,
});

export const doctor = new Doctor({
  id: "1",
  rcm: "CRM/SP 12345",
  name: "Dr. João Silva",
  specialties: ["Cardiology"],
  phone: "(11) 99999-9999",
});

export const exam = new Exam({
  id: "1",
  type: "Blood Test",
  result: "Normal",
  date: new Date("2025-02-27T11:00:00"),
  location: "Lab",
  responsible: "Dr. Ana",
  patientId: patient.id,
});

export const appointment = new Appointment({
  id: "1",
  date: new Date(2025, 2, 7, 12, 0),
  patientId: patient.id,
  doctorId: doctor.id,
  reason: "Checkup",
  status: "scheduled",
  notes: "Regular checkup",
});
