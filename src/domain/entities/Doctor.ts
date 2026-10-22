import { WorkingHours } from "../value-objects/WorkingHours.ts";

export interface DoctorDTO {
  id: string;
  rcm: string;
  name: string;
  specialties: ReadonlyArray<string>;
  phone: string;
  workingHours: WorkingHours;
}

export type CreateDoctorDTO = Omit<
  DoctorDTO,
  "specialties" | "workingHours"
> & {
  specialties?: string[];
  workingHours?: WorkingHours;
};

// A atualização cadastral não pode trocar a identidade nem substituir o objeto
// de valor de horários: essas mudanças passam pelos serviços específicos.
export type UpdateDoctorDTO = Partial<
  Omit<CreateDoctorDTO, "id" | "workingHours">
>;

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
    this.specialties = data.specialties ? [...data.specialties] : [];
    this.phone = data.phone;
    this.workingHours = data.workingHours ?? new WorkingHours();
  }
}
