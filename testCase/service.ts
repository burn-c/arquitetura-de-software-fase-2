import { AppointmentService } from "../src/application/services/AppointmentService.ts";
import { DoctorAvailabilityService } from "../src/domain/services/doctor-services/DoctorAvailabilityService.ts";
import { DoctorService } from "../src/domain/services/doctor-services/DoctorService.ts";
import { DoctorSpecialtyService } from "../src/domain/services/doctor-services/DoctorSpecialtyService.ts";
import { DoctorWorkingHoursService } from "../src/domain/services/doctor-services/DoctorWorkingHoursService.ts";
import { ExamService } from "../src/domain/services/ExamService.ts";
import { PatientService } from "../src/domain/services/PatientService.ts";
import { NotificationService } from "../src/infrastructure/notification/NotificationService.ts";

import {
  patientRepository,
  doctorRepository,
  appointmentRepository,
  examRepository,
} from "./repositories.ts";

export const doctorService = new DoctorService(doctorRepository);
export const doctorSpecialtyService = new DoctorSpecialtyService(doctorRepository);
export const doctorWorkingHoursService = new DoctorWorkingHoursService(
  doctorRepository
);
export const examService = new ExamService(examRepository);
export const patientService = new PatientService(patientRepository);
export const doctorAvailabilityService = new DoctorAvailabilityService(
  appointmentRepository,
  doctorService,
  doctorWorkingHoursService
);

export const notificationService = new NotificationService();
export const appointmentService = new AppointmentService(
  patientService,
  doctorService,
  appointmentRepository,
  doctorAvailabilityService,
  notificationService
);
