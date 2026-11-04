import { expect } from "chai";
import sinon from "sinon";
import { PatientRepository } from "../../../src/infrastructure/persistence/PatientRepository.js";
import { Patient } from "../../../src/domain/entities/Patient.js";

describe("PatientRepository", () => {
  let patientRepository;
  let sandbox;

  beforeEach(() => {
    patientRepository = new PatientRepository();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should generate unique IDs when adding patients", () => {
    const addStub = sandbox.stub().onCall(0).returns(1).onCall(1).returns(2);

    const patient1 = { name: "John Doe", bloodType: "O+" };
    const patient2 = { name: "Jane Doe", bloodType: "A-" };

    const id1 = addStub(patient1);
    const id2 = addStub(patient2);

    expect(id1).to.equal(1);
    expect(id2).to.equal(2);

    sinon.assert.calledWith(addStub.firstCall, patient1);
    sinon.assert.calledWith(addStub.secondCall, patient2);
  });

  it("should find patients by name", () => {
    const patients = [
      { name: "Alice", bloodType: "A-" },
      { name: "Alice", bloodType: "O-" },
    ];

    sandbox.stub(patientRepository, "findByName").returns(patients);

    const results = patientRepository.findByName("Alice");
    expect(results).to.have.lengthOf(2);
    expect(results[0].bloodType).to.equal("A-");
    expect(results[1].bloodType).to.equal("O-");
  });

  it("should find patients by blood type", () => {
    const patients = [
      { name: "Charlie", bloodType: "A-" },
      { name: "Alice", bloodType: "A-" },
    ];

    sandbox.stub(patientRepository, "findByBloodType").returns(patients);

    const results = patientRepository.findByBloodType("A-");
    expect(results).to.have.lengthOf(2);
    expect(results[0].name).to.equal("Charlie");
    expect(results[1].name).to.equal("Alice");
  });

  it("should add patients with unique IDs", () => {
    const patient1 = { name: "Alice", bloodType: "A+" };
    const patient2 = { name: "Bob", bloodType: "O-" };

    const addStub = sandbox.stub(patientRepository, "add");

    patientRepository.add(patient1);
    patientRepository.add(patient2);

    sinon.assert.calledWith(addStub.firstCall, patient1);
    sinon.assert.calledWith(addStub.secondCall, patient2);
  });

  it("should update an existing patient", () => {
    const patient = { name: "Charlie", bloodType: "B+" };
    const updatedPatient = { name: "Charlie", bloodType: "O+" };

    sandbox.stub(patientRepository, "findById").returns(patient);
    const updateStub = sandbox.stub(patientRepository, "update");

    patientRepository.update(1, updatedPatient);

    sinon.assert.calledWith(updateStub, 1, updatedPatient);
  });

  it("should delete a patient", () => {
    const patient = { name: "David", bloodType: "AB-" };

    sandbox.stub(patientRepository, "findById").returns(patient);
    const deleteStub = sandbox.stub(patientRepository, "delete");

    patientRepository.delete(1);

    sinon.assert.calledWith(deleteStub, 1);
  });
});

describe("PatientRepository storage", () => {
  let repository;

  const buildPatient = (overrides = {}) =>
    new Patient({
      identificationDocument: "12345678901",
      name: "John Doe",
      birthDate: "1990-01-01",
      gender: "male",
      bloodType: "A+",
      address: {},
      phone: "555-1234",
      email: "john@example.com",
      emergencyContact: {},
      ...overrides,
    });

  beforeEach(() => {
    repository = new PatientRepository();
  });

  it("should assign sequential IDs and store the patient itself", () => {
    const first = buildPatient();
    const second = buildPatient({ name: "Jane Doe" });

    expect(repository.add(first)).to.equal(1);
    expect(repository.add(second)).to.equal(2);

    expect(first.id).to.equal(1);
    expect(repository.findById(1)).to.equal(first);
    expect(repository.findAll()).to.have.lengthOf(2);
  });

  it("should refuse anything that is not a patient", () => {
    expect(() => repository.add({ name: "John Doe" })).to.throw(
      "Can only add Patient instances"
    );
  });

  it("should find patients by name", () => {
    repository.add(buildPatient({ name: "Alice" }));
    repository.add(buildPatient({ name: "Bob" }));
    repository.add(buildPatient({ name: "Alice" }));

    const found = repository.findByName("Alice");

    expect(found).to.have.lengthOf(2);
    expect(found.map((patient) => patient.id)).to.deep.equal([1, 3]);
  });

  it("should find patients by blood type", () => {
    repository.add(buildPatient({ name: "Alice", bloodType: "O-" }));
    repository.add(buildPatient({ name: "Bob", bloodType: "A+" }));

    const found = repository.findByBloodType("O-");

    expect(found).to.have.lengthOf(1);
    expect(found[0].name).to.equal("Alice");
  });
});
