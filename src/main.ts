import express from "express";
import { AppointmentRepository } from "./infrastructure/persistence/AppointmentRepository.ts";
import { DoctorRepository } from "./infrastructure/persistence/DoctorRepository.ts";
import { PatientRepository } from "./infrastructure/persistence/PatientRepository.ts";
import { PatientService } from "./domain/services/PatientService.ts";
import { DoctorService } from "./domain/services/doctor-services/DoctorService.ts";
import { DoctorSpecialtyService } from "./domain/services/doctor-services/DoctorSpecialtyService.ts";
import { DoctorWorkingHoursService } from "./domain/services/doctor-services/DoctorWorkingHoursService.ts";
import { DoctorAvailabilityService } from "./domain/services/doctor-services/DoctorAvailabilityService.ts";
import { PatientController } from "./interfaces/controllers/PatientController.ts";
import { DoctorController } from "./interfaces/controllers/doctor-controllers/DoctorController.ts";
import { DoctorSpecialtyController } from "./interfaces/controllers/doctor-controllers/DoctorSpecialtyController.ts";
import { DoctorWorkingHoursController } from "./interfaces/controllers/doctor-controllers/DoctorWorkingHoursController.ts";
import { DoctorAvailabilityController } from "./interfaces/controllers/doctor-controllers/DoctorAvailabilityController.ts";
import { createApiRouter } from "./interfaces/apiRouter.ts";

// Composition root: o único lugar que conhece as implementações concretas.
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorRepository();
const appointmentRepository = new AppointmentRepository();

const patientService = new PatientService(patientRepository);
const doctorService = new DoctorService(doctorRepository);
const doctorSpecialtyService = new DoctorSpecialtyService(doctorRepository);
const doctorWorkingHoursService = new DoctorWorkingHoursService(
  doctorRepository,
);
const doctorAvailabilityService = new DoctorAvailabilityService(
  appointmentRepository,
  doctorService,
  doctorWorkingHoursService,
);

const patientController = new PatientController(patientService);
const doctorController = new DoctorController(doctorService);
const doctorSpecialtyController = new DoctorSpecialtyController(
  doctorSpecialtyService,
);
const doctorWorkingHoursController = new DoctorWorkingHoursController(
  doctorWorkingHoursService,
);
const doctorAvailabilityController = new DoctorAvailabilityController(
  doctorAvailabilityService,
);

const app = express();

app.use(express.json());
app.use(
  createApiRouter({
    patientController,
    doctorController,
    doctorSpecialtyController,
    doctorWorkingHoursController,
    doctorAvailabilityController,
  }),
);

const port = Number(process.env.PORT ?? 3000);

if (import.meta.main) {
  app.listen(port, () => {
    console.log(`API disponível em http://localhost:${port}`);
  });
}

export { app };
