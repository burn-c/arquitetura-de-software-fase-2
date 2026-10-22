import type { Response } from "express";
import type { Doctor } from "../../../domain/entities/Doctor.ts";

// Serializa o médico no formato exposto pela API.
export function toDoctorResponse(doctor: Doctor) {
  return {
    id: doctor.id,
    rcm: doctor.rcm,
    name: doctor.name,
    phone: doctor.phone,
    specialties: doctor.specialties,
    workingHours: doctor.workingHours.hours,
  };
}

// Enquanto os erros são `Error` simples, o controller traduz a mensagem em
// status HTTP. Em uma evolução, o domínio pode expor erros tipados.
export function sendDoctorError(
  res: Response,
  error: unknown,
  fallbackStatus: number,
): void {
  const message =
    error instanceof Error ? error.message : "Unexpected error.";
  const status = message === "Doctor not found." ? 404 : fallbackStatus;

  res.status(status).json({ error: message });
}
