import { Router, type Request, type Response } from "express";
import type { DoctorWorkingHoursService } from "../../../domain/services/doctor-services/DoctorWorkingHoursService.ts";
import { sendDoctorError, toDoctorResponse } from "./doctorResponse.ts";

interface WorkingHoursBody {
  day?: string;
  timeSlot?: string;
}

export class DoctorWorkingHoursController {
  readonly router: Router;
  private readonly workingHoursService: DoctorWorkingHoursService;

  constructor(workingHoursService: DoctorWorkingHoursService) {
    this.router = Router({ mergeParams: true });
    this.workingHoursService = workingHoursService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.addWorkingHours.bind(this));
    this.router.delete("/", this.removeWorkingHours.bind(this));
    this.router.get("/", this.listWorkingHours.bind(this));
  }

  private addWorkingHours(
    req: Request<{ id: string }, unknown, WorkingHoursBody>,
    res: Response,
  ): void {
    try {
      const { day, timeSlot } = this.requireWorkingHours(req.body);
      const doctor = this.workingHoursService.addWorkingHours(
        req.params.id,
        day,
        timeSlot,
      );

      res.status(200).json(toDoctorResponse(doctor));
    } catch (error) {
      sendDoctorError(res, error, 400);
    }
  }

  private removeWorkingHours(
    req: Request<{ id: string }, unknown, WorkingHoursBody>,
    res: Response,
  ): void {
    try {
      const { day, timeSlot } = this.requireWorkingHours(req.body);
      const doctor = this.workingHoursService.removeWorkingHours(
        req.params.id,
        day,
        timeSlot,
      );

      res.status(200).json(toDoctorResponse(doctor));
    } catch (error) {
      sendDoctorError(res, error, 400);
    }
  }

  private listWorkingHours(
    req: Request<{ id: string }>,
    res: Response,
  ): void {
    try {
      const workingHours = this.workingHoursService.listWorkingHours(
        req.params.id,
      );

      res.status(200).json(workingHours);
    } catch (error) {
      sendDoctorError(res, error, 500);
    }
  }

  private requireWorkingHours(body: WorkingHoursBody): {
    day: string;
    timeSlot: string;
  } {
    if (!body.day || !body.timeSlot) {
      throw new Error("Day and time slot are required.");
    }

    return { day: body.day, timeSlot: body.timeSlot };
  }
}
