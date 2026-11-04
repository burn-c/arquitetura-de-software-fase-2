import { MedicalRecord } from "../value-objects/medical-record/MedicalRecord.js";

// Datas sem hora ("AAAA-MM-DD") são interpretadas como meia-noite UTC pelo
// JavaScript, o que desloca o dia no fuso local. Aqui elas viram meia-noite
// local, preservando a data de nascimento informada.
const parseBirthDate = (value) => {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }
  return new Date(value);
};

export class Patient {
  #id;
  #identificationDocument;
  #name;
  #birthDate;
  #gender;
  #bloodType;
  #address;
  #phone;
  #email;
  #emergencyContact;
  #medicalRecord;

  constructor({
    identificationDocument,
    name,
    birthDate,
    gender,
    bloodType,
    address,
    phone,
    email,
    emergencyContact,
  }) {
    this.#identificationDocument = identificationDocument;
    this.#name = name;
    this.#birthDate = parseBirthDate(birthDate);
    this.#gender = gender;
    this.#bloodType = bloodType;
    this.#address = address;
    this.#phone = phone;
    this.#email = email;
    this.#emergencyContact = emergencyContact;
    this.#medicalRecord = new MedicalRecord();
  }

  get id() {
    return this.#id;
  }
  get identificationDocument() {
    return this.#identificationDocument;
  }
  get name() {
    return this.#name;
  }
  get birthDate() {
    return this.#birthDate;
  }
  get gender() {
    return this.#gender;
  }
  get bloodType() {
    return this.#bloodType;
  }
  get address() {
    return this.#address;
  }
  get phone() {
    return this.#phone;
  }
  get email() {
    return this.#email;
  }
  get emergencyContact() {
    return this.#emergencyContact;
  }
  get medicalRecord() {
    return structuredClone(this.#medicalRecord);
  }
  _setId(id) {
    this.#id = id;
  }
  set name(newName) {
    this.#name = newName;
  }
  set phone(newPhone) {
    this.#phone = newPhone;
  }
  set email(newEmail) {
    this.#email = newEmail;
  }
  set emergencyContact(newEmergencyContact) {
    this.#emergencyContact = newEmergencyContact;
  }
  set address(newAddress) {
    this.#address = newAddress;
  }
}

export const addPatient = (data) => {
  return new Patient(data);
};
