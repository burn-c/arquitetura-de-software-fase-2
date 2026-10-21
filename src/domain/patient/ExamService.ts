import { Exam } from "./Exam.ts";
import { ExamRepository } from "./ExamRepository.ts";

export class ExamService {
  private examRepository: ExamRepository;
  constructor(examRepository: ExamRepository) {
    this.examRepository = examRepository;
  }

  scheduleExam(examData: Exam): Exam | undefined {
    const exam = new Exam(examData);

    this.examRepository.add(exam.id, exam);
    return exam;
  }

  findExamById(id: string) {
    return this.examRepository.findById(id);
  }

  findExamsByPatientId(patientId: string) {
    return this.examRepository.findByPatientId(patientId);
  }

  findExamsByType(type: string) {
    return this.examRepository.findByType(type);
  }

  findExamsByDate(date: Date) {
    return this.examRepository.findByDate(date);
  }

  updateExam(examId: string, updatedData: Partial<Exam>) {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error("Exam not found.");
    }

    Object.assign(exam, updatedData);

    this.examRepository.update(examId, exam);
    return exam;
  }

  deleteExam(examId: string) {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error("Exam not found.");
    }

    this.examRepository.delete(examId);
    return exam;
  }

}