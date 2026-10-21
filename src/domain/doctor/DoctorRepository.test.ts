import assert from "node:assert/strict";
import { Doctor } from "./Doctor.ts";
import { DoctorRepository } from "./DoctorRepository.ts";
import {
  createTestRunner,
  showRepository,
  showResults as printResults,
} from "../../testing/testOutput.ts";

// O construtor do Doctor recebe um DTO; reaproveitamos o próprio tipo.
type DoctorInput = ConstructorParameters<typeof Doctor>[0];

// Médico válido e previsível; cada teste sobrescreve só o que importa.
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

function buildRepository(doctors: Doctor[] = []): DoctorRepository {
  const repository = new DoctorRepository();
  doctors.forEach((doctor) => repository.add(doctor.id, doctor));
  return repository;
}

function ids(doctors: ReadonlyArray<Doctor>): string[] {
  return doctors.map((doctor) => doctor.id);
}

/* ------------------------- visualização no terminal ------------------------ */

function toRow(doctor: Doctor) {
  return {
    id: doctor.id,
    name: doctor.name,
    specialties: doctor.specialties.join(", "),
  };
}

function show(label: string, repository: DoctorRepository): void {
  showRepository(label, repository, toRow);
}

function showResults(label: string, doctors: ReadonlyArray<Doctor>): void {
  printResults(label, doctors, toRow, "(nenhum médico)");
}

const { test, run } = createTestRunner("DoctorRepository");

test("o repositório começa vazio", () => {
  const repository = new DoctorRepository();

  assert.deepEqual(repository.findAll(), []);
  assert.equal(repository.findById("med-001"), undefined);
  assert.deepEqual(repository.findByName("Maria Santos"), []);
  assert.deepEqual(repository.findBySpecialty("Cardiologia"), []);
  show("estado inicial", repository);
});

test("add guarda o médico e findById o recupera", () => {
  const repository = new DoctorRepository();
  const doctor = buildDoctor();

  repository.add(doctor.id, doctor);

  assert.equal(repository.findById("med-001"), doctor);
  assert.equal(repository.findById("med-002"), undefined);
  show('add(id: "med-001")', repository);
});

test("add rejeita um id duplicado e preserva o médico original", () => {
  const repository = buildRepository([buildDoctor()]);
  show('antes do add(id: "med-001") duplicado', repository);

  assert.throws(
    () => repository.add("med-001", buildDoctor({ name: "Outro médico" })),
    /Entity with id med-001 already exists/,
  );

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("med-001")?.name, "Maria Santos");
  show("depois do add duplicado (inalterado)", repository);
});

test("findAll devolve os médicos na ordem de inserção", () => {
  const repository = buildRepository([
    buildDoctor({ id: "med-003", name: "Ana Souza" }),
    buildDoctor({ id: "med-001", name: "Maria Santos" }),
    buildDoctor({ id: "med-002", name: "Carlos Lima" }),
  ]);

  assert.deepEqual(ids(repository.findAll()), ["med-003", "med-001", "med-002"]);
  show("findAll()", repository);
});

test("findByName compara o nome inteiro e diferencia maiúsculas", () => {
  const repository = buildRepository([
    buildDoctor({ id: "med-001", name: "Maria Santos" }),
    buildDoctor({ id: "med-002", name: "maria santos" }),
    buildDoctor({ id: "med-003", name: "Maria Santos Silva" }),
  ]);

  assert.deepEqual(ids(repository.findByName("Maria Santos")), ["med-001"]);
  assert.deepEqual(ids(repository.findByName("maria santos")), ["med-002"]);
  assert.deepEqual(repository.findByName("Maria"), []);
  assert.deepEqual(repository.findByName("Carlos"), []);
  showResults('findByName("Maria Santos")', repository.findByName("Maria Santos"));
  showResults('findByName("maria santos")', repository.findByName("maria santos"));
});

test("findByName devolve todos os homônimos", () => {
  const repository = buildRepository([
    buildDoctor({ id: "med-001", name: "Maria Santos" }),
    buildDoctor({ id: "med-002", name: "Maria Santos" }),
  ]);

  assert.deepEqual(ids(repository.findByName("Maria Santos")), [
    "med-001",
    "med-002",
  ]);
  showResults('findByName("Maria Santos")', repository.findByName("Maria Santos"));
});

test("findBySpecialty encontra todos os médicos da especialidade", () => {
  const repository = buildRepository([
    buildDoctor({
      id: "med-001",
      name: "Maria Santos",
      specialties: ["Cardiologia", "Clínica Geral"],
    }),
    buildDoctor({ id: "med-002", name: "Carlos Lima", specialties: ["Ortopedia"] }),
    buildDoctor({ id: "med-003", name: "Ana Souza", specialties: ["Cardiologia"] }),
  ]);

  assert.deepEqual(ids(repository.findBySpecialty("Cardiologia")), [
    "med-001",
    "med-003",
  ]);
  assert.deepEqual(ids(repository.findBySpecialty("Ortopedia")), ["med-002"]);
  assert.deepEqual(repository.findBySpecialty("Pediatria"), []);
  showResults(
    'findBySpecialty("Cardiologia")',
    repository.findBySpecialty("Cardiologia"),
  );
  showResults(
    'findBySpecialty("Pediatria")',
    repository.findBySpecialty("Pediatria"),
  );
});

test("findBySpecialty compara a especialidade inteira", () => {
  const repository = buildRepository([
    buildDoctor({ id: "med-001", specialties: ["Cardiologia"] }),
    buildDoctor({ id: "med-002", specialties: ["Cardiologia Intervencionista"] }),
  ]);

  assert.deepEqual(ids(repository.findBySpecialty("Cardiologia")), ["med-001"]);
  assert.deepEqual(ids(repository.findBySpecialty("Cardiologia Intervencionista")), [
    "med-002",
  ]);
  assert.deepEqual(repository.findBySpecialty("Cardio"), []);
});

test("findBySpecialty encontra especialidade adicionada depois do cadastro", () => {
  const doctor = buildDoctor({ id: "med-001", specialties: ["Cardiologia"] });
  const repository = buildRepository([doctor]);

  doctor.addSpecialty("Clínica Geral");

  assert.deepEqual(ids(repository.findBySpecialty("Clínica Geral")), [
    "med-001",
  ]);
  showResults(
    'findBySpecialty("Clínica Geral")',
    repository.findBySpecialty("Clínica Geral"),
  );
});

test("update substitui o médico e atualiza as buscas", () => {
  const original = buildDoctor();
  const repository = buildRepository([original]);
  show('antes do update(id: "med-001")', repository);

  const updated = buildDoctor({
    id: "med-001",
    name: "Maria Souza",
    specialties: ["Dermatologia"],
  });
  repository.update("med-001", updated);

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("med-001"), updated);
  assert.notEqual(repository.findById("med-001"), original);
  assert.deepEqual(repository.findByName("Maria Santos"), []);
  assert.deepEqual(ids(repository.findByName("Maria Souza")), ["med-001"]);
  assert.deepEqual(repository.findBySpecialty("Cardiologia"), []);
  assert.deepEqual(ids(repository.findBySpecialty("Dermatologia")), ["med-001"]);
  show('depois do update(id: "med-001")', repository);
});

test("update rejeita um id inexistente e não cria o médico", () => {
  const repository = new DoctorRepository();

  assert.throws(
    () => repository.update("med-099", buildDoctor({ id: "med-099" })),
    /Entity with id med-099 does not exist/,
  );

  assert.equal(repository.findAll().length, 0);
  assert.equal(repository.findById("med-099"), undefined);
});

test("delete remove o médico de todas as buscas", () => {
  const repository = buildRepository([
    buildDoctor({ id: "med-001", name: "Maria Santos" }),
    buildDoctor({
      id: "med-002",
      name: "Carlos Lima",
      specialties: ["Ortopedia"],
    }),
  ]);

  repository.delete("med-001");

  assert.equal(repository.findById("med-001"), undefined);
  assert.deepEqual(repository.findByName("Maria Santos"), []);
  assert.deepEqual(repository.findBySpecialty("Cardiologia"), []);
  assert.deepEqual(ids(repository.findAll()), ["med-002"]);
  show('depois do delete(id: "med-001")', repository);
});

test("delete rejeita um id inexistente", () => {
  const repository = buildRepository([buildDoctor()]);

  assert.throws(
    () => repository.delete("med-099"),
    /Entity with id med-099 does not exist/,
  );

  assert.equal(repository.findAll().length, 1);
});

run();
