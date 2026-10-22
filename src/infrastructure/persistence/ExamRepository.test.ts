import assert from "node:assert/strict";
import { Exam } from "../../domain/entities/Exam.ts";
import { ExamRepository } from "./ExamRepository.ts";
import {
  createTestRunner,
  showRepository,
  showResults as printResults,
} from "../../testing/testOutput.ts";

// O construtor do Exam recebe um DTO; reaproveitamos o próprio tipo.
type ExamInput = ConstructorParameters<typeof Exam>[0];

// Exame válido e previsível; cada teste sobrescreve só o que importa.
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

function buildRepository(exams: Exam[] = []): ExamRepository {
  const repository = new ExamRepository();
  exams.forEach((exam) => repository.add(exam.id, exam));
  return repository;
}

function ids(exams: ReadonlyArray<Exam>): string[] {
  return exams.map((exam) => exam.id);
}

/* ------------------------- visualização no terminal ------------------------ */

function toRow(exam: Exam) {
  return {
    id: exam.id,
    type: exam.type,
    patientId: exam.patientId,
    date: exam.date.toLocaleDateString("pt-BR"),
  };
}

function show(label: string, repository: ExamRepository): void {
  showRepository(label, repository, toRow);
}

function showResults(label: string, exams: ReadonlyArray<Exam>): void {
  printResults(label, exams, toRow, "(nenhum exame)");
}

const { test, run } = createTestRunner("ExamRepository");

test("o repositório começa vazio", () => {
  const repository = new ExamRepository();

  assert.deepEqual(repository.findAll(), []);
  assert.equal(repository.findById("exa-001"), undefined);
  assert.deepEqual(repository.findByPatientId("1"), []);
  assert.deepEqual(repository.findByType("Hemograma"), []);
  assert.deepEqual(repository.findByDate(new Date("2023-06-15T12:00:00")), []);
  show("estado inicial", repository);
});

test("add guarda o exame e findById o recupera", () => {
  const repository = new ExamRepository();
  const exam = buildExam();

  repository.add(exam.id, exam);

  assert.equal(repository.findById("exa-001"), exam);
  assert.equal(repository.findById("exa-002"), undefined);
  show('add(id: "exa-001")', repository);
});

test("add rejeita um id duplicado e preserva o exame original", () => {
  const repository = buildRepository([buildExam()]);
  show('antes do add(id: "exa-001") duplicado', repository);

  assert.throws(
    () => repository.add("exa-001", buildExam({ result: "Alterado" })),
    /Entity with id exa-001 already exists/,
  );

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("exa-001")?.result, "Normal");
  show("depois do add duplicado (inalterado)", repository);
});

test("findAll devolve os exames na ordem de inserção", () => {
  const repository = buildRepository([
    buildExam({ id: "exa-003" }),
    buildExam({ id: "exa-001" }),
    buildExam({ id: "exa-002" }),
  ]);

  assert.deepEqual(ids(repository.findAll()), ["exa-003", "exa-001", "exa-002"]);
  show("findAll()", repository);
});

test("findByPatientId filtra os exames do paciente", () => {
  const repository = buildRepository([
    buildExam({ id: "exa-001", patientId: "1" }),
    buildExam({ id: "exa-002", patientId: "2" }),
    buildExam({ id: "exa-003", patientId: "1" }),
  ]);

  assert.deepEqual(ids(repository.findByPatientId("1")), ["exa-001", "exa-003"]);
  assert.deepEqual(ids(repository.findByPatientId("2")), ["exa-002"]);
  assert.deepEqual(repository.findByPatientId("99"), []);
  showResults('findByPatientId("1")', repository.findByPatientId("1"));
  showResults('findByPatientId("99")', repository.findByPatientId("99"));
});

test("findByType filtra pelo tipo exato do exame", () => {
  const repository = buildRepository([
    buildExam({ id: "exa-001", type: "Hemograma" }),
    buildExam({ id: "exa-002", type: "Eletrocardiograma" }),
    buildExam({ id: "exa-003", type: "Hemograma" }),
  ]);

  assert.deepEqual(ids(repository.findByType("Hemograma")), [
    "exa-001",
    "exa-003",
  ]);
  assert.deepEqual(ids(repository.findByType("Eletrocardiograma")), [
    "exa-002",
  ]);
  assert.deepEqual(repository.findByType("Ultrassom"), []);
  showResults('findByType("Hemograma")', repository.findByType("Hemograma"));
  showResults('findByType("Ultrassom")', repository.findByType("Ultrassom"));
});

test("findByType diferencia maiúsculas e exige o tipo inteiro", () => {
  const repository = buildRepository([
    buildExam({ id: "exa-001", type: "Hemograma" }),
    buildExam({ id: "exa-002", type: "hemograma" }),
  ]);

  assert.deepEqual(ids(repository.findByType("Hemograma")), ["exa-001"]);
  assert.deepEqual(ids(repository.findByType("hemograma")), ["exa-002"]);
  assert.deepEqual(repository.findByType("Hemo"), []);
});

test("findByDate compara o dia e ignora o horário", () => {
  // Horário explícito: uma string só com data (AAAA-MM-DD) seria lida em UTC.
  const repository = buildRepository([
    buildExam({ id: "exa-001", date: new Date("2023-06-15T08:30:00") }),
    buildExam({ id: "exa-002", date: new Date("2023-06-15T23:59:00") }),
    buildExam({ id: "exa-003", date: new Date("2023-06-16T08:30:00") }),
  ]);

  assert.deepEqual(ids(repository.findByDate(new Date("2023-06-15T12:00:00"))), [
    "exa-001",
    "exa-002",
  ]);
  assert.deepEqual(ids(repository.findByDate(new Date("2023-06-16T00:00:00"))), [
    "exa-003",
  ]);
  assert.deepEqual(repository.findByDate(new Date("2023-06-17T12:00:00")), []);
  showResults(
    'findByDate("2023-06-15")',
    repository.findByDate(new Date("2023-06-15T12:00:00")),
  );
  showResults(
    'findByDate("2023-06-17")',
    repository.findByDate(new Date("2023-06-17T12:00:00")),
  );
});

test("update substitui o exame e atualiza as buscas", () => {
  const original = buildExam();
  const repository = buildRepository([original]);
  show('antes do update(id: "exa-001")', repository);

  const updated = buildExam({
    id: "exa-001",
    type: "Ultrassom",
    patientId: "2",
    date: new Date("2023-06-20T09:00:00"),
  });
  repository.update("exa-001", updated);

  assert.equal(repository.findAll().length, 1);
  assert.equal(repository.findById("exa-001"), updated);
  assert.notEqual(repository.findById("exa-001"), original);
  assert.deepEqual(repository.findByPatientId("1"), []);
  assert.deepEqual(ids(repository.findByPatientId("2")), ["exa-001"]);
  assert.deepEqual(repository.findByType("Hemograma"), []);
  assert.deepEqual(ids(repository.findByType("Ultrassom")), ["exa-001"]);
  assert.deepEqual(repository.findByDate(new Date("2023-06-15T12:00:00")), []);
  assert.deepEqual(ids(repository.findByDate(new Date("2023-06-20T12:00:00"))), [
    "exa-001",
  ]);
  show('depois do update(id: "exa-001")', repository);
});

test("update rejeita um id inexistente e não cria o exame", () => {
  const repository = new ExamRepository();

  assert.throws(
    () => repository.update("exa-099", buildExam({ id: "exa-099" })),
    /Entity with id exa-099 does not exist/,
  );

  assert.equal(repository.findAll().length, 0);
  assert.equal(repository.findById("exa-099"), undefined);
});

test("delete remove o exame de todas as buscas", () => {
  const repository = buildRepository([
    buildExam({ id: "exa-001", patientId: "1", type: "Hemograma" }),
    buildExam({
      id: "exa-002",
      patientId: "2",
      type: "Eletrocardiograma",
      date: new Date("2023-06-16T10:00:00"),
    }),
  ]);

  repository.delete("exa-001");

  assert.equal(repository.findById("exa-001"), undefined);
  assert.deepEqual(repository.findByPatientId("1"), []);
  assert.deepEqual(repository.findByType("Hemograma"), []);
  assert.deepEqual(repository.findByDate(new Date("2023-06-15T12:00:00")), []);
  assert.deepEqual(ids(repository.findAll()), ["exa-002"]);
  show('depois do delete(id: "exa-001")', repository);
});

test("delete rejeita um id inexistente", () => {
  const repository = buildRepository([buildExam()]);

  assert.throws(
    () => repository.delete("exa-099"),
    /Entity with id exa-099 does not exist/,
  );

  assert.equal(repository.findAll().length, 1);
});

run();
