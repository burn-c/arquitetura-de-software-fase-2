export interface ExamDTO {
  id: string;
  type: string;
  result: string;
  date: Date;
  location: string;
  responsible: string;
  patientId: string;
}

export type CreateExamDTO = ExamDTO;

export type UpdateExamDTO = Partial<Omit<CreateExamDTO, "id">>;

export class Exam implements ExamDTO {
  id: string;
  type: string;
  result: string;
  date: Date;
  location: string;
  responsible: string;
  patientId: string;

  constructor(data: CreateExamDTO) {
    this.id = data.id;
    this.type = data.type;
    this.result = data.result;
    this.date = data.date;
    this.location = data.location;
    this.responsible = data.responsible;
    this.patientId = data.patientId;
  }
}

if (import.meta.main) {
  const exam1 = new Exam({
    id: "exa-001",
    type: "Electrocardiogram",
    result: "Normal",
    date: new Date("2023-06-15"),
    location: "Central Laboratory",
    responsible: "Dr. João",
    patientId: "123",
  });

  console.log(
    `Exam ${exam1.type} (${exam1.result}) for patient ${exam1.patientId} performed at ${exam1.location}.`,
  );
}
