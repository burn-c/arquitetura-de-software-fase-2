import { Router, type Request, type Response } from "express";
import type { DoctorAvailabilityService } from "../../../domain/services/doctor-services/DoctorAvailabilityService.ts";
import { sendDoctorError } from "./doctorResponse.ts";

const UNAVAILABLE_MESSAGE =
  "Doctor is not available at the specified date and time.";

export class DoctorAvailabilityController {
  readonly router: Router;
  private readonly doctorAvailabilityService: DoctorAvailabilityService;

  constructor(doctorAvailabilityService: DoctorAvailabilityService) {
    this.router = Router({ mergeParams: true });
    this.doctorAvailabilityService = doctorAvailabilityService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.checkAvailability.bind(this));
  }

  private checkAvailability(
    req: Request<{ id: string }, unknown, unknown, { date?: string }>,
    res: Response,
  ): void {
    try {
      const { date } = req.query;

      if (!date) {
        throw new Error("Date is required.");
      }

      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format.");
      }

      this.doctorAvailabilityService.isDoctorAvailable(
        req.params.id,
        parsedDate,
      );

      res.status(200).json({ available: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error.";

      // Indisponibilidade é uma resposta válida da consulta, não um erro HTTP.
      if (message === UNAVAILABLE_MESSAGE) {
        res.status(200).json({ available: false });
        return;
      }

      sendDoctorError(res, error, 400);
    }
  }
}
