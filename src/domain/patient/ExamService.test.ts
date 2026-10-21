import assert from "node:assert/strict";
import { Exam } from "./Exam.ts";
import { ExamRepository } from "./ExamRepository.ts";
import { ExamService } from "./ExamService.ts";
import { createTestRunner } from "../../testing/testOutput.ts";

type ExamInput = ConstructorParameters<typeof Exam>[0];

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

function createService(): ExamService {
  return new ExamService(new ExamRepository());
}

function ids(exams: ReadonlyArray<Exam>): string[] {
  return exams.map((exam) => exam.id);
}

const { test, run } = createTestRunner("ExamService");

test("scheduleExam guarda e devolve o exame", () => {
  const service = createService();
  const exam = service.scheduleExam(buildExam());

  assert.equal(service.findExamById("exa-001"), exam);
});

test("findExamById devolve undefined para um id inexistente", () => {
  const service = createService();
  service.scheduleExam(buildExam());

  assert.equal(service.findExamById("exa-099"), undefined);
});

test("findExamsByPatientId filtra os exames do paciente", () => {
  const service = createService();
  service.scheduleExam(buildExam({ id: "exa-001", patientId: "1" }));
  service.scheduleExam(buildExam({ id: "exa-002", patientId: "2" }));
  service.scheduleExam(buildExam({ id: "exa-003", patientId: "1" }));

  assert.deepEqual(ids(service.findExamsByPatientId("1")), ["exa-001", "exa-003"]);
  assert.deepEqual(ids(service.findExamsByPatientId("2")), ["exa-002"]);
  assert.deepEqual(service.findExamsByPatientId("99"), []);
});

test("findExamsByType filtra pelo tipo exato", () => {
  const service = createService();
  service.scheduleExam(buildExam({ id: "exa-001", type: "Hemograma" }));
  service.scheduleExam(buildExam({ id: "exa-002", type: "Eletrocardiograma" }));

  assert.deepEqual(ids(service.findExamsByType("Hemograma")), ["exa-001"]);
  assert.deepEqual(ids(service.findExamsByType("Eletrocardiograma")), [
    "exa-002",
  ]);
  assert.deepEqual(service.findExamsByType("Ultrassom"), []);
});

test("findExamsByDate compara o dia e ignora o horário", () => {
  const service = createService();
  service.scheduleExam(
    buildExam({ id: "exa-001", date: new Date("2023-06-15T08:30:00") }),
  );
  service.scheduleExam(
    buildExam({ id: "exa-002", date: new Date("2023-06-15T23:59:00") }),
  );
  service.scheduleExam(
    buildExam({ id: "exa-003", date: new Date("2023-06-16T08:30:00") }),
  );

  assert.deepEqual(
    ids(service.findExamsByDate(new Date("2023-06-15T12:00:00"))),
    ["exa-001", "exa-002"],
  );
  assert.deepEqual(ids(service.findExamsByDate(new Date("2023-06-16T00:00:00"))), [
    "exa-003",
  ]);
  assert.deepEqual(service.findExamsByDate(new Date("2023-06-17T12:00:00")), []);
});

test("updateExam atualiza os campos e persiste", () => {
  const service = createService();
  const exam = service.scheduleExam(buildExam());

  const updated = service.updateExam("exa-001", {
    type: "Ultrassom",
    result: "Alterado",
  });

  assert.equal(updated, exam);
  assert.equal(service.findExamById("exa-001")?.type, "Ultrassom");
  assert.equal(service.findExamById("exa-001")?.result, "Alterado");
});

test("updateExam rejeita um id inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.updateExam("exa-099", { result: "Alterado" }),
    /Exam not found/,
  );
});

test("deleteExam remove e devolve o exame removido", () => {
  const service = createService();
  const exam = service.scheduleExam(buildExam());

  const removed = service.deleteExam("exa-001");

  assert.equal(removed, exam);
  assert.equal(service.findExamById("exa-001"), undefined);
});

test("deleteExam rejeita um id inexistente", () => {
  const service = createService();

  assert.throws(
    () => service.deleteExam("exa-099"),
    /Exam not found/,
  );
});

run();
