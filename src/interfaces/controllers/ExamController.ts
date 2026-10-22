import { Router, type Request, type Response } from "express";
import type {
  CreateExamDTO,
  Exam,
  UpdateExamDTO,
} from "../../domain/entities/Exam.ts";
import type { ExamService } from "../../domain/services/ExamService.ts";

export class ExamController {
  readonly router: Router;
  private readonly examService: ExamService;

  constructor(examService: ExamService) {
    this.router = Router();
    this.examService = examService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.scheduleExam.bind(this));
    this.router.get("/", this.getAllExams.bind(this));
    this.router.get(
      "/patient/:patientId",
      this.getExamsByPatientId.bind(this),
    );
    this.router.get("/type/:type", this.getExamsByType.bind(this));
    this.router.get("/date/:date", this.getExamsByDate.bind(this));
    this.router.get("/:id", this.getExamById.bind(this));
    this.router.put("/:id", this.updateExam.bind(this));
    this.router.delete("/:id", this.deleteExam.bind(this));
  }

  private scheduleExam(req: Request, res: Response): void {
    try {
      const data = (req.body ?? {}) as CreateExamDTO;
      const date = this.parseDate(data.date);

      if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid exam date.");
      }

      const createdExam = this.examService.scheduleExam({ ...data, date });

      res.status(201).json(createdExam);
    } catch (error) {
      this.sendError(res, error, 400);
    }
  }

  private getAllExams(_req: Request, res: Response): void {
    try {
      res.status(200).json(this.examService.findAllExams());
    } catch (error) {
      this.sendError(res, error, 500);
    }
  }

  private getExamById(req: Request<{ id: string }>, res: Response): void {
    try {
      const exam = this.examService.findExamById(req.params.id);

      if (!exam) {
        this.sendError(res, new Error("Exam not found."), 404);
        return;
      }

      res.status(200).json(exam);
    } catch (error) {
      this.sendError(res, error, 500);
    }
  }

  private updateExam(req: Request<{ id: string }>, res: Response): void {
    try {
      const data = (req.body ?? {}) as UpdateExamDTO;

      if (data.date) {
        const date = this.parseDate(data.date);

        if (Number.isNaN(date.getTime())) {
          throw new Error("Invalid exam date.");
        }

        data.date = date;
      }

      const updatedExam = this.examService.updateExam(req.params.id, data);
      res.status(200).json(updatedExam);
    } catch (error) {
      this.sendError(res, error, 400);
    }
  }

  private deleteExam(req: Request<{ id: string }>, res: Response): void {
    try {
      const deletedExam = this.examService.deleteExam(req.params.id);
      res.status(200).json(deletedExam);
    } catch (error) {
      this.sendError(res, error, 404);
    }
  }

  private getExamsByPatientId(
    req: Request<{ patientId: string }>,
    res: Response,
  ): void {
    try {
      res
        .status(200)
        .json(this.examService.findExamsByPatientId(req.params.patientId));
    } catch (error) {
      this.sendError(res, error, 500);
    }
  }

  private getExamsByType(
    req: Request<{ type: string }>,
    res: Response,
  ): void {
    try {
      res.status(200).json(this.examService.findExamsByType(req.params.type));
    } catch (error) {
      this.sendError(res, error, 500);
    }
  }

  private getExamsByDate(
    req: Request<{ date: string }>,
    res: Response,
  ): void {
    try {
      const date = this.parseDate(req.params.date);

      if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid exam date.");
      }

      res.status(200).json(this.examService.findExamsByDate(date));
    } catch (error) {
      this.sendError(res, error, 400);
    }
  }

  private parseDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
  }

  private sendError(
    res: Response,
    error: unknown,
    fallbackStatus: number,
  ): void {
    const message =
      error instanceof Error ? error.message : "Unexpected error.";
    const status = message === "Exam not found." ? 404 : fallbackStatus;

    res.status(status).json({ error: message });
  }
}
