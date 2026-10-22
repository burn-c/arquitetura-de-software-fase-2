import { type HourDTO, WorkingHours, type WorkingHoursDTO } from "../value-objects/WorkingHours.ts";

interface DoctorDTO {
  id: string;
  rcm: string;
  name: string;
  specialties: ReadonlyArray<string>;
  phone: string;
}

type CreateDoctorDTO = Omit<DoctorDTO, "specialties"> & {
  specialties: string[];
};

export class Doctor implements DoctorDTO {
  id: string;
  rcm: string;
  name: string;
  phone: string;
  specialties: string[];
  workingHours: WorkingHours;

  constructor(data: CreateDoctorDTO) {
    this.id = data.id;
    this.rcm = data.rcm;
    this.name = data.name;
    this.specialties = data.specialties;
    this.phone = data.phone;
    this.workingHours = new WorkingHours();
  }
}
