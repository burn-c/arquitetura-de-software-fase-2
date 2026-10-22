import { Router, type Request, type Response } from "express";
import {
  Appointment,
  type CreateAppointmentDTO,
} from "../../domain/entities/Appointments.ts";
import type { AppointmentService } from "../../application/services/AppointmentService.ts";

interface AppointmentBody extends Omit<CreateAppointmentDTO, "date"> {
  date: Date | string;
}

export class AppointmentController {
  readonly router: Router;
  private readonly appointmentService: AppointmentService;

  constructor(appointmentService: AppointmentService) {
    this.router = Router();
    this.appointmentService = appointmentService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.scheduleAppointment.bind(this));
    this.router.get("/", this.getAllAppointments.bind(this));
    this.router.get("/:id", this.getAppointmentById.bind(this));
  }

  private scheduleAppointment(req: Request, res: Response): void {
    try {
      const data = (req.body ?? {}) as AppointmentBody;
      const appointment = new Appointment({
        ...data,
        date: this.parseDate(data.date),
      });

      const scheduledAppointment =
        this.appointmentService.execute(appointment);

      res.status(201).json(this.toResponse(scheduledAppointment));
    } catch (error) {
      this.sendError(res, error, 400);
    }
  }

  private getAllAppointments(_req: Request, res: Response): void {
    try {
      const appointments = this.appointmentService.findAll();
      res
        .status(200)
        .json(appointments.map((appointment) => this.toResponse(appointment)));
    } catch (error) {
      this.sendError(res, error, 500);
    }
  }

  private getAppointmentById(
    req: Request<{ id: string }>,
    res: Response,
  ): void {
    try {
      const appointment = this.appointmentService.findById(req.params.id);
      res.status(200).json(this.toResponse(appointment));
    } catch (error) {
      this.sendError(res, error, 404);
    }
  }

  // O status é um getter de protótipo e não entra no spread/JSON direto.
  private toResponse(appointment: Appointment) {
    return {
      id: appointment.id,
      date: appointment.date,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status,
    };
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

    res.status(fallbackStatus).json({ error: message });
  }
}
