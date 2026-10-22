import {
  Exam,
  type CreateExamDTO,
  type UpdateExamDTO,
} from "../entities/Exam.ts";
import { ExamRepository } from "../../infrastructure/persistence/ExamRepository.ts";

export class ExamService {
  private readonly examRepository: ExamRepository;

  constructor(examRepository: ExamRepository) {
    this.examRepository = examRepository;
  }

  scheduleExam(examData: CreateExamDTO): Exam {
    const exam = new Exam(examData);

    this.examRepository.add(exam.id, exam);
    return exam;
  }

  findExamById(id: string): Exam | undefined {
    return this.examRepository.findById(id);
  }

  findAllExams(): Exam[] {
    return this.examRepository.findAll();
  }

  findExamsByPatientId(patientId: string): Exam[] {
    return this.examRepository.findByPatientId(patientId);
  }

  findExamsByType(type: string): Exam[] {
    return this.examRepository.findByType(type);
  }

  findExamsByDate(date: Date): Exam[] {
    return this.examRepository.findByDate(date);
  }

  updateExam(examId: string, updatedData: UpdateExamDTO): Exam {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error("Exam not found.");
    }

    Object.assign(exam, updatedData);

    this.examRepository.update(examId, exam);
    return exam;
  }

  deleteExam(examId: string): Exam {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error("Exam not found.");
    }

    this.examRepository.delete(examId);
    return exam;
  }
}
