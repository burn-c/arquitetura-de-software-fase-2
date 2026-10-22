import { Exam } from "../../domain/entities/Exam.ts";
import { Repository } from "../../domain/repositories/Repository.ts";

export class ExamRepository extends Repository<Exam> {
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
