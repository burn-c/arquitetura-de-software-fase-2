import { Router, type Request, type Response } from "express";
import {
  type CreateDoctorDTO,
  type UpdateDoctorDTO,
} from "../../../domain/entities/Doctor.ts";
import type { DoctorService } from "../../../domain/services/doctor-services/DoctorService.ts";
import { WorkingHours } from "../../../domain/value-objects/WorkingHours.ts";
import { sendDoctorError, toDoctorResponse } from "./doctorResponse.ts";

export class DoctorController {
  readonly router: Router;
  private readonly doctorService: DoctorService;

  constructor(doctorService: DoctorService) {
    this.router = Router();
    this.doctorService = doctorService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.createDoctor.bind(this));
    this.router.get("/", this.getAllDoctors.bind(this));
    this.router.get("/:id", this.getDoctorById.bind(this));
    this.router.put("/:id", this.updateDoctor.bind(this));
    this.router.delete("/:id", this.deleteDoctor.bind(this));
  }

  private createDoctor(req: Request, res: Response): void {
    try {
      const data = (req.body ?? {}) as CreateDoctorDTO;
      const createdDoctor = this.doctorService.addDoctor({
        ...data,
        workingHours: data.workingHours
          ? new WorkingHours(data.workingHours.hours)
          : undefined,
      });

      res.status(201).json(toDoctorResponse(createdDoctor));
    } catch (error) {
      sendDoctorError(res, error, 400);
    }
  }

  private getAllDoctors(_req: Request, res: Response): void {
    try {
      const doctors = this.doctorService.findAllDoctors();
      res
        .status(200)
        .json(doctors.map((doctor) => toDoctorResponse(doctor)));
    } catch (error) {
      sendDoctorError(res, error, 500);
    }
  }

  private getDoctorById(req: Request<{ id: string }>, res: Response): void {
    try {
      const doctor = this.doctorService.findDoctorById(req.params.id);

      if (!doctor) {
        sendDoctorError(res, new Error("Doctor not found."), 404);
        return;
      }

      res.status(200).json(toDoctorResponse(doctor));
    } catch (error) {
      sendDoctorError(res, error, 500);
    }
  }

  private updateDoctor(req: Request<{ id: string }>, res: Response): void {
    try {
      const updatedData = (req.body ?? {}) as UpdateDoctorDTO;
      const updatedDoctor = this.doctorService.updateDoctor(
        req.params.id,
        updatedData,
      );

      res.status(200).json(toDoctorResponse(updatedDoctor));
    } catch (error) {
      sendDoctorError(res, error, 400);
    }
  }

  private deleteDoctor(req: Request<{ id: string }>, res: Response): void {
    try {
      const deletedDoctor = this.doctorService.deleteDoctor(req.params.id);
      res.status(200).json(toDoctorResponse(deletedDoctor));
    } catch (error) {
      sendDoctorError(res, error, 404);
    }
  }
}
