import assert from "node:assert/strict";
import { Patient } from "./Patient.ts";
import { PatientRepository } from "./PatientRepository.ts";

// O construtor do Patient recebe um DTO; reaproveitamos o próprio tipo.
type PatientInput = ConstructorParameters<typeof Patient>[0];

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

function buildRepository(patients: Patient[] = []): PatientRepository {
  const repository = new PatientRepository();
  patients.forEach((patient) => repository.add(patient.id, patient));
  return repository;
}

/* ------------------------- visualização no terminal ------------------------ */

// Mude para `false` se quiser a saída só com ok/FAIL.
const SHOW_DATA = true;

function toRow(patient: Patient) {
  return { id: patient.id, name: patient.name, bloodType: patient.bloodType };
}

function show(label: string, repository: PatientRepository): void {
  if (!SHOW_DATA) return;

  const rows = repository.findAll().map(toRow);
  console.log(`\n--- ${label} ---`);
  console.log(
    `chaves: [${Array.from(repository.data.keys()).map((key) => `"${key}"`).join(", ")}]`,
  );
  if (rows.length === 0) {
    console.log("(repositório vazio)");
    return;
  }
  console.table(rows);
}

function showResults(label: string, patients: ReadonlyArray<Patient>): void {
  if (!SHOW_DATA) return;

  console.log(`\n--- ${label} · ${patients.length} resultado(s) ---`);
  if (patients.length === 0) {
    console.log("(nenhum paciente)");
    return;
  }
  console.table(patients.map(toRow));
}

let passed = 0;
let failed = 0;

function test(name: string, run: () => void): void {
  try {
    run();
    passed += 1;
    console.log(`ok   ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(`     ${error instanceof Error ? error.message : error}`);
  }
}

test("o repositório começa vazio", () => {
  const repository = new PatientRepository();

  assert.deepEqual(repository.findAll(), []);
  assert.equal(repository.findById("1"), undefined);
  assert.deepEqual(repository.findByName("João Silva"), []);
  assert.deepEqual(repository.findByBloodType("O+"), []);
  show("estado inicial", repository);
});

test("add guarda o paciente e findById o recupera", () => {
  const repository = new PatientRepository();
  const patient = buildPatient();

  repository.add(patient.id, patient);

  assert.equal(repository.findById("1"), patient);
  assert.equal(repository.findById("2"), undefined);
  show("add(id: \"1\")", repository);
});

test("add rejeita um id duplicado e preserva o paciente original", () => {
  const repository = buildRepository([buildPatient()]);
  show("antes do add(id: \"1\") duplicado", repository);

  assert.throws(
    () => repository.add("1", buildPatient({ name: "Outra pessoa" })),
    /Entity with id 1 already exists/,
  );

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("1")?.name, "João Silva");
  show("depois do add duplicado (inalterado)", repository);
});

test("findAll devolve todos os pacientes na ordem de inserção", () => {
  const repository = buildRepository([
    buildPatient({ id: "3", name: "Ana Souza" }),
    buildPatient({ id: "1", name: "João Silva" }),
    buildPatient({ id: "2", name: "Maria Oliveira" }),
  ]);

  assert.deepEqual(
    repository.findAll().map((patient) => patient.id),
    ["3", "1", "2"],
  );
  show("findAll()", repository);
});

test("findAll devolve uma coleção nova, sem expor o estado interno", () => {
  const repository = buildRepository([buildPatient()]);

  const firstRead = repository.findAll();
  firstRead.pop();
  firstRead.push(buildPatient({ id: "99" }));

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("99"), undefined);
});

test("findByName compara o nome inteiro e diferencia maiúsculas", () => {
  const repository = buildRepository([
    buildPatient({ id: "1", name: "João Silva" }),
    buildPatient({ id: "2", name: "joão silva" }),
    buildPatient({ id: "3", name: "João Silva Santos" }),
  ]);

  assert.deepEqual(
    repository.findByName("João Silva").map((patient) => patient.id),
    ["1"],
  );
  assert.deepEqual(
    repository.findByName("joão silva").map((patient) => patient.id),
    ["2"],
  );
  assert.deepEqual(repository.findByName("João"), []);
  assert.deepEqual(repository.findByName("Maria"), []);
  showResults('findByName("João Silva")', repository.findByName("João Silva"));
  showResults('findByName("joão silva")', repository.findByName("joão silva"));
});

test("findByName devolve todos os homônimos", () => {
  const repository = buildRepository([
    buildPatient({ id: "1", name: "João Silva", bloodType: "O+" }),
    buildPatient({ id: "2", name: "João Silva", bloodType: "A+" }),
  ]);

  assert.deepEqual(
    repository.findByName("João Silva").map((patient) => patient.id),
    ["1", "2"],
  );
  showResults('findByName("João Silva")', repository.findByName("João Silva"));
});

test("findByBloodType filtra pelo tipo sanguíneo", () => {
  const repository = buildRepository([
    buildPatient({ id: "1", name: "João Silva", bloodType: "O+" }),
    buildPatient({ id: "2", name: "Maria Oliveira", bloodType: "A-" }),
    buildPatient({ id: "3", name: "Ana Souza", bloodType: "O+" }),
  ]);

  assert.deepEqual(
    repository.findByBloodType("O+").map((patient) => patient.id),
    ["1", "3"],
  );
  assert.deepEqual(
    repository.findByBloodType("A-").map((patient) => patient.id),
    ["2"],
  );
  assert.deepEqual(repository.findByBloodType("AB-"), []);
  showResults('findByBloodType("O+")', repository.findByBloodType("O+"));
  showResults('findByBloodType("A-")', repository.findByBloodType("A-"));
  showResults('findByBloodType("AB-")', repository.findByBloodType("AB-"));
});

test("update substitui a entidade mantendo a mesma chave", () => {
  const original = buildPatient();
  const repository = buildRepository([original]);
  show("antes do update(id: \"1\")", repository);

  const updated = buildPatient({ name: "João Atualizado", bloodType: "A+" });
  repository.update("1", updated);

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("1"), updated);
  assert.notEqual(repository.findById("1"), original);
  assert.equal(repository.findById("1")?.name, "João Atualizado");
  assert.deepEqual(repository.findByBloodType("O+"), []);
  assert.deepEqual(
    repository.findByBloodType("A+").map((patient) => patient.id),
    ["1"],
  );
  show("depois do update(id: \"1\")", repository);
});

test("update rejeita um id inexistente e não cria a entidade", () => {
  const repository = new PatientRepository();

  assert.throws(
    () => repository.update("99", buildPatient({ id: "99" })),
    /Entity with id 99 does not exist/,
  );

  assert.equal(repository.findAll().length, 0);
  assert.equal(repository.findById("99"), undefined);
  show('depois do update(id: "99") inexistente (inalterado)', repository);
});

test("delete remove o paciente de todas as consultas", () => {
  const repository = buildRepository([
    buildPatient({ id: "1", name: "João Silva" }),
    buildPatient({ id: "2", name: "Maria Oliveira", bloodType: "A-" }),
  ]);

  repository.delete("1");

  assert.equal(repository.findById("1"), undefined);
  assert.deepEqual(repository.findByName("João Silva"), []);
  assert.deepEqual(repository.findByBloodType("O+"), []);
  assert.deepEqual(
    repository.findAll().map((patient) => patient.id),
    ["2"],
  );
  show('depois do delete(id: "1")', repository);
});

test("delete rejeita um id inexistente", () => {
  const repository = buildRepository([buildPatient()]);
  show('antes do delete(id: "99") inexistente', repository);

  assert.throws(
    () => repository.delete("99"),
    /Entity with id 99 does not exist/,
  );

  assert.equal(repository.findAll().length, 1);
  show('depois do delete(id: "99") inexistente (inalterado)', repository);
});

test("após delete, o mesmo id pode ser adicionado novamente", () => {
  const repository = buildRepository([buildPatient()]);
  show("antes do delete(id: \"1\")", repository);

  repository.delete("1");
  show("depois do delete(id: \"1\")", repository);

  repository.add("1", buildPatient({ name: "Novo Paciente" }));

  assert.equal(repository.findById("1")?.name, "Novo Paciente");
  assert.deepEqual(
    repository.findByName("Novo Paciente").map((patient) => patient.id),
    ["1"],
  );
  show("depois de readicionar o id \"1\"", repository);
});

console.log(`\n${passed} passaram, ${failed} falharam`);

if (failed > 0) {
  process.exit(1);
}
