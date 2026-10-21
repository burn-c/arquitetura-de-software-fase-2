import { Repository } from "../shared/PatientRepository.ts";
import { Exam } from "./Exam.ts";

export class ExamRepository extends Repository {
  constructor() {
    super();
  }

  findByPatientId(patientId: string): Exam[] {
    return this.findAll().filter((exam) => exam.patientId === patientId);
  }

  findByType(type: string): Exam[] {
    return this.findAll().filter((exam) => exam.type === type);
  }

  findByDate(date: Date): Exam[] {
    return this.findAll().filter(
      (exam) => exam.date.toDateString() === date.toDateString()
    );
  }
}