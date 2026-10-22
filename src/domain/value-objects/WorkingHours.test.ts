import assert from "node:assert/strict";
import { type HourDTO, WorkingHours } from "./WorkingHours.ts";
import { createTestRunner } from "../../testing/testOutput.ts";

function buildWorkingHours(hours: HourDTO[] = []): WorkingHours {
  const workingHours = new WorkingHours();
  workingHours.hours.push(...hours);
  return workingHours;
}

const { test, run } = createTestRunner("WorkingHours");

test("começa sem horários", () => {
  const workingHours = new WorkingHours();

  assert.deepEqual(workingHours.hours, []);
});

test("equals compara dia e faixa de horário", () => {
  const a = buildWorkingHours([{ day: "Monday", timeSlot: "08:00-12:00" }]);
  const b = buildWorkingHours([{ day: "Monday", timeSlot: "08:00-12:00" }]);
  const c = buildWorkingHours([{ day: "Monday", timeSlot: "14:00-18:00" }]);

  assert.equal(a.equals(b), true);
  assert.equal(a.equals(c), false);
});

test("a ordem dos horários não importa", () => {
  const a = buildWorkingHours([
    { day: "Monday", timeSlot: "08:00-12:00" },
    { day: "Wednesday", timeSlot: "08:00-12:00" },
  ]);
  const b = buildWorkingHours([
    { day: "Wednesday", timeSlot: "08:00-12:00" },
    { day: "Monday", timeSlot: "08:00-12:00" },
  ]);

  assert.equal(a.equals(b), true);
});

test("duplicatas são respeitadas", () => {
  const a = buildWorkingHours([
    { day: "Monday", timeSlot: "08:00-12:00" },
    { day: "Monday", timeSlot: "08:00-12:00" },
  ]);
  const b = buildWorkingHours([
    { day: "Monday", timeSlot: "08:00-12:00" },
    { day: "Tuesday", timeSlot: "09:00-10:00" },
  ]);

  assert.equal(a.equals(b), false);
});

test("quantidades diferentes de horários não são iguais", () => {
  const a = buildWorkingHours([{ day: "Monday", timeSlot: "08:00-12:00" }]);
  const b = new WorkingHours();

  assert.equal(a.equals(b), false);
});

test("hours é uma coleção mutável usada pelo serviço", () => {
  const workingHours = new WorkingHours();

  workingHours.hours.push({ day: "Friday", timeSlot: "09:00-11:00" });

  assert.deepEqual(workingHours.hours, [
    { day: "Friday", timeSlot: "09:00-11:00" },
  ]);
});

run();
