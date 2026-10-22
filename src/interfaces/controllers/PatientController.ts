import { Router, type Request, type Response } from "express";
import type {
  CreatePatientDTO,
  Patient,
} from "../../domain/entities/Patient.ts";
import type { PatientService } from "../../domain/services/PatientService.ts";

export class PatientController {
  readonly router: Router;
  private readonly patientService: PatientService;

  constructor(patientService: PatientService) {
    this.router = Router();
    this.patientService = patientService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.createPatient.bind(this));
    this.router.get("/", this.getAllPatients.bind(this));
    this.router.get("/search/name/:name", this.getPatientsByName.bind(this));
    this.router.get(
      "/search/bloodType/:bloodType",
      this.getPatientsByBloodType.bind(this),
    );
    this.router.get("/:id", this.getPatientById.bind(this));
    this.router.put("/:id", this.updatePatient.bind(this));
    this.router.delete("/:id", this.deletePatient.bind(this));
  }

  private createPatient(req: Request, res: Response): void {
    try {
      const data = (req.body ?? {}) as CreatePatientDTO;
      const birthDate = this.parseDate(data.birthDate);

      if (Number.isNaN(birthDate.getTime())) {
        throw new Error("Invalid birth date.");
      }

      const createdPatient = this.patientService.addPatient({
        ...data,
        birthDate,
      });

      res.status(201).json(this.toResponse(createdPatient));
    } catch (error) {
      this.sendError(res, error, 400);
    }
  }

  private getAllPatients(_req: Request, res: Response): void {
    try {
      const patients = this.patientService.findAllPatients();
      res.status(200).json(patients.map((patient) => this.toResponse(patient)));
    } catch (error) {
      this.sendError(res, error, 500);
    }
  }

  private getPatientById(req: Request<{ id: string }>, res: Response): void {
    const patient = this.patientService.findPatientById(req.params.id);

    if (!patient) {
      this.sendError(res, new Error("Patient not found."), 404);
      return;
    }

    res.status(200).json(this.toResponse(patient));
  }

  private updatePatient(req: Request<{ id: string }>, res: Response): void {
    try {
      const updatedData = (req.body ?? {}) as Partial<Patient>;

      if (updatedData.birthDate) {
        const birthDate = this.parseDate(updatedData.birthDate);

        if (Number.isNaN(birthDate.getTime())) {
          throw new Error("Invalid birth date.");
        }

        updatedData.birthDate = birthDate;
      }

      const updatedPatient = this.patientService.updatePatient(
        req.params.id,
        updatedData,
      );

      res.status(200).json(this.toResponse(updatedPatient));
    } catch (error) {
      this.sendError(res, error, 400);
    }
  }

  private deletePatient(req: Request<{ id: string }>, res: Response): void {
    try {
      const deletedPatient = this.patientService.deletePatient(req.params.id);
      res.status(200).json(this.toResponse(deletedPatient));
    } catch (error) {
      this.sendError(res, error, 404);
    }
  }

  private getPatientsByName(
    req: Request<{ name: string }>,
    res: Response,
  ): void {
    const patients = this.patientService.findPatientsByName(req.params.name);

    if (patients.length === 0) {
      this.sendError(
        res,
        new Error("No patients found with the given name."),
        404,
      );
      return;
    }

    res.status(200).json(patients.map((patient) => this.toResponse(patient)));
  }

  private getPatientsByBloodType(
    req: Request<{ bloodType: string }>,
    res: Response,
  ): void {
    const patients = this.patientService.findPatientsByBloodType(
      req.params.bloodType,
    );

    if (patients.length === 0) {
      this.sendError(
        res,
        new Error("No patients found with the given blood type."),
        404,
      );
      return;
    }

    res.status(200).json(patients.map((patient) => this.toResponse(patient)));
  }

  // Serializa também as coleções expostas por getters, que não entram no spread.
  private toResponse(patient: Patient) {
    return {
      id: patient.id,
      identificationDocument: patient.identificationDocument,
      name: patient.name,
      birthDate: patient.birthDate,
      gender: patient.gender,
      bloodType: patient.bloodType,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
      emergencyContact: patient.emergencyContact,
      appointments: patient.appointments,
      exams: patient.exams,
      allergies: patient.allergies,
      medicalRecord: patient.medicalRecord,
    };
  }

  private parseDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
  }

  private sendError(res: Response, error: unknown, statusCode: number): void {
    const message =
      error instanceof Error ? error.message : "Unexpected error.";
    res.status(statusCode).json({ error: message });
  }
}
