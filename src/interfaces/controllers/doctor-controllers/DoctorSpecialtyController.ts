import { Router, type Request, type Response } from "express";
import type { DoctorSpecialtyService } from "../../../domain/services/doctor-services/DoctorSpecialtyService.ts";
import { sendDoctorError, toDoctorResponse } from "./doctorResponse.ts";

interface SpecialtyBody {
  specialty?: string;
}

export class DoctorSpecialtyController {
  readonly router: Router;
  private readonly specialtyService: DoctorSpecialtyService;

  constructor(specialtyService: DoctorSpecialtyService) {
    this.router = Router({ mergeParams: true });
    this.specialtyService = specialtyService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.addSpecialty.bind(this));
    this.router.delete("/", this.removeSpecialty.bind(this));
    this.router.get("/", this.listSpecialties.bind(this));
  }

  private addSpecialty(
    req: Request<{ id: string }, unknown, SpecialtyBody>,
    res: Response,
  ): void {
    try {
      const specialty = this.requireSpecialty(req.body.specialty);
      const doctor = this.specialtyService.addSpecialty(
        req.params.id,
        specialty,
      );

      res.status(200).json(toDoctorResponse(doctor));
    } catch (error) {
      sendDoctorError(res, error, 400);
    }
  }

  private removeSpecialty(
    req: Request<{ id: string }, unknown, SpecialtyBody>,
    res: Response,
  ): void {
    try {
      const specialty = this.requireSpecialty(req.body.specialty);
      const doctor = this.specialtyService.removeSpecialty(
        req.params.id,
        specialty,
      );

      res.status(200).json(toDoctorResponse(doctor));
    } catch (error) {
      sendDoctorError(res, error, 400);
    }
  }

  private listSpecialties(
    req: Request<{ id: string }>,
    res: Response,
  ): void {
    try {
      const specialties = this.specialtyService.listSpecialties(req.params.id);
      res.status(200).json(specialties);
    } catch (error) {
      sendDoctorError(res, error, 500);
    }
  }

  private requireSpecialty(specialty: string | undefined): string {
    if (!specialty) {
      throw new Error("Specialty is required.");
    }

    return specialty;
  }
}
