import { Router } from "express";
import type { PatientController } from "./controllers/PatientController.ts";
import type { AppointmentController } from "./controllers/AppointmentController.ts";
import type { ExamController } from "./controllers/ExamController.ts";
import type { DoctorAvailabilityController } from "./controllers/doctor-controllers/DoctorAvailabilityController.ts";
import type { DoctorController } from "./controllers/doctor-controllers/DoctorController.ts";
import type { DoctorSpecialtyController } from "./controllers/doctor-controllers/DoctorSpecialtyController.ts";
import type { DoctorWorkingHoursController } from "./controllers/doctor-controllers/DoctorWorkingHoursController.ts";

export interface ApiRouterDependencies {
  patientController: PatientController;
  doctorController: DoctorController;
  examController: ExamController;
  appointmentController: AppointmentController;
  doctorSpecialtyController: DoctorSpecialtyController;
  doctorWorkingHoursController: DoctorWorkingHoursController;
  doctorAvailabilityController: DoctorAvailabilityController;
}

// Monta os adaptadores de entrada. O domínio não conhece essas rotas.
export function createApiRouter(
  dependencies: ApiRouterDependencies,
): Router {
  const router = Router();

  router.use("/patients", dependencies.patientController.router);
  router.use("/doctors", dependencies.doctorController.router);
  router.use("/exams", dependencies.examController.router);
  router.use("/appointments", dependencies.appointmentController.router);
  router.use(
    "/doctors/:id/specialties",
    dependencies.doctorSpecialtyController.router,
  );
  router.use(
    "/doctors/:id/working-hours",
    dependencies.doctorWorkingHoursController.router,
  );
  router.use(
    "/doctors/:id/availability",
    dependencies.doctorAvailabilityController.router,
  );

  return router;
}
