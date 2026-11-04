import { expect } from "chai";
import sinon from "sinon";
import { PatientService } from "../../../src/domain/services/PatientService.js";
import { Patient } from "../../../src/domain/entities/Patient.js";
import { Address } from "../../../src/domain/value-objects/Address.js";
import { EmergencyContact } from "../../../src/domain/value-objects/EmergencyContact.js";
import { PatientRepository } from "../../../src/infrastructure/persistence/PatientRepository.js";

describe("PatientService", () => {
  let patientService;
  let patientRepository;
  let sandbox;

  const mockPatientData = {
    identificationDocument: "12345678901",
    name: "John Doe",
    birthDate: "1990-01-01",
    gender: "male",
    bloodType: "A+",
    address: {},
    phone: "555-1234",
    email: "john@example.com",
    emergencyContact: {},
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    patientRepository = sandbox.createStubInstance(PatientRepository);

    const mockPatient = new Patient(mockPatientData);
    mockPatient._setId(1);

    patientRepository.add.returns(1);

    patientRepository.findById.withArgs(1).returns(mockPatient);

    patientService = new PatientService(patientRepository);
  });

  describe("constructor", () => {
    it("should require a repository", () => {
      expect(() => new PatientService()).to.throw("PatientRepository is required");
    });
  });

  describe("addPatient", () => {
    it("should add a new patient and return it with ID", () => {
      const patient = new Patient(mockPatientData);
      const result = patientService.addPatient(patient);

      expect(result).to.be.instanceOf(Patient);
      expect(result.id).to.equal(1);
      expect(result.name).to.equal("John Doe");

      expect(patientRepository.add.calledOnce).to.be.true;
      expect(patientRepository.findById.calledWith(1)).to.be.true;
    });

    it("should throw error when repository fails", () => {
      patientRepository.add.throws(new Error("Failed to save patient"));
      const patient = new Patient(mockPatientData);
      expect(() => patientService.addPatient(patient)).to.throw(
        "Failed to save patient"
      );
    });

    it("should throw error when the saved patient cannot be read back", () => {
      patientRepository.add.returns(2);
      const patient = new Patient(mockPatientData);

      expect(() => patientService.addPatient(patient)).to.throw(
        "Failed to save patient"
      );
    });
  });

  describe("findPatientById", () => {
    it("should return the patient when found", () => {
      const foundPatient = patientService.findPatientById(1);
      expect(foundPatient).to.be.instanceOf(Patient);
      expect(foundPatient.name).to.equal("John Doe");

      expect(patientRepository.findById.calledOnce).to.be.true;
    });

    it("should return null when patient not found", () => {
      const foundPatient = patientService.findPatientById(999);

      expect(foundPatient).to.be.null;

      expect(patientRepository.findById.calledOnce).to.be.true;
    });
  });

  describe("deletePatient", () => {
    it("should delete the patient and return it", () => {
      const deletedPatient = patientService.deletePatient(1);
      expect(deletedPatient).to.be.instanceOf(Patient);
      expect(deletedPatient.id).to.equal(1);
      expect(patientRepository.delete.calledOnce).to.be.true;
    });

    it("should throw error when patient not found", () => {
      expect(() => patientService.deletePatient(999)).to.throw(
        "Patient not Found!"
      );
    });
  });

  describe("findAllPatients", () => {
    it("should return every patient from the repository", () => {
      const patients = [new Patient(mockPatientData)];
      patientRepository.findAll.returns(patients);

      expect(patientService.findAllPatients()).to.deep.equal(patients);
      expect(patientRepository.findAll.calledOnce).to.be.true;
    });

    it("should return an empty list when there are no patients", () => {
      patientRepository.findAll.returns([]);

      expect(patientService.findAllPatients()).to.deep.equal([]);
    });
  });

  describe("updatePatient", () => {
    it("should update only the fields that were sent", () => {
      const patient = patientService.updatePatient(1, {
        name: "Jane Doe",
        email: "jane@example.com",
      });

      expect(patient.name).to.equal("Jane Doe");
      expect(patient.email).to.equal("jane@example.com");
      expect(patient.phone).to.equal("555-1234");
      expect(patientRepository.update.calledOnceWith(1, patient)).to.be.true;
    });

    it("should update every field when all of them are sent", () => {
      const address = new Address("456 Elm St", 20, "Shelbyville", "IL", "54321");
      const contact = new EmergencyContact("Mary Doe", "555-0000");

      const patient = patientService.updatePatient(1, {
        name: "Jane Doe",
        phone: "555-9999",
        email: "jane@example.com",
        emergencyContact: contact,
        address,
      });

      expect(patient.name).to.equal("Jane Doe");
      expect(patient.phone).to.equal("555-9999");
      expect(patient.email).to.equal("jane@example.com");
      expect(patient.emergencyContact).to.equal(contact);
      expect(patient.address).to.equal(address);
    });

    it("should throw error when patient not found", () => {
      expect(() => patientService.updatePatient(999, { name: "Jane" })).to.throw(
        "Patient not Found!"
      );
    });
  });

  describe("findPatientByName", () => {
    it("should delegate the search to the repository", () => {
      const patients = [new Patient(mockPatientData)];
      patientRepository.findByName.returns(patients);

      expect(patientService.findPatientByName("John Doe")).to.deep.equal(
        patients
      );
      expect(patientRepository.findByName.calledWith("John Doe")).to.be.true;
    });
  });

  describe("findPatientByBloodType", () => {
    it("should delegate the search to the repository", () => {
      const patients = [new Patient(mockPatientData)];
      patientRepository.findByBloodType.returns(patients);

      expect(patientService.findPatientByBloodType("A+")).to.deep.equal(
        patients
      );
      expect(patientRepository.findByBloodType.calledWith("A+")).to.be.true;
    });
  });
});
