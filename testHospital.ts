import { Address } from "./domain/address.ts";
import { Consulta } from "./domain/consulta.ts";
import { EmergencyContact } from "./domain/emergencyContact.ts";
import { Exame } from "./domain/exame.ts";
import { Doctor } from "./domain/doctor.ts";
import { Paciente } from "./domain/paciente.ts";
import { Prontuario } from "./domain/prontuario.ts";

console.log("Bem-vindo ao Sistema de Gestão de Pacientes!");

const emergencyContact1 = new EmergencyContact({
  name: "Maria Silva",
  phone: "(11) 88888-8888",
});

const address1 = new Address({
  street: "Rua das Flores",
  number: "123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
});

const paciente1 = new Paciente({
  id: "1",
  cpf: "123.456.789-00",
  nome: "João Silva",
  dataNasc: new Date("1990-01-01"),
  genero: "Masculino",
  tipoSanguineo: "O+",
  alergias: ["Nenhuma"],
  endereço: address1,
  telefone: "(11) 99999-9999",
  email: "joao.silva@email.com",
  contatoEmergencia: emergencyContact1,
});

const doctor1 = new Doctor({
  id: "101",
  rcm: "CRM/SP 123456",
  name: "Dr. Carlos",
  specialties: ["Cardiologia", "Clínica Geral"],
  phone: "(11) 77777-7777",
});

const consulta1 = new Consulta({
  id: "201",
  data: new Date("2023-10-15"),
  pacienteId: paciente1.id,
  medicoId: doctor1.id,
  motivo: "Dor no peito",
  observacoes: "Paciente relatou dor no peito após esforço físico.",
});

doctor1.addWorkingHours({ day: "Segunda", timeSlot: "08:00-12:00" });
doctor1.addWorkingHours({ day: "Quarta", timeSlot: "08:00-12:00" });

const exame1 = new Exame({
  id: "301",
  tipo: "Hemograma",
  resultado: "Normal",
  data: new Date("2023-10-10"),
  local: "Laboratório X",
  responsavel: "Dr. Ana",
  pacienteId: paciente1.id,
});

const prontuario1 = new Prontuario({ id: "401", pacienteId: paciente1.id });

paciente1.agendarConsulta(consulta1);
paciente1.adicionarExame(exame1);
prontuario1.adicionarDiagnostico("Hipertensão");
prontuario1.adicionarTratamento("Redução no consumo de sal");
prontuario1.adicionarMedicamento("Captopril");

console.log("Paciente:");
console.table([
  { Campo: "ID", Valor: paciente1.id },
  { Campo: "Nome", Valor: paciente1.nome },
  { Campo: "CPF", Valor: paciente1.cpf },
  {
    Campo: "Nascimento",
    Valor: paciente1.dataNasc.toLocaleDateString("pt-BR", { timeZone: "UTC" }),
  },
  { Campo: "Gênero", Valor: paciente1.genero },
  { Campo: "Tipo Sanguíneo", Valor: paciente1.tipoSanguineo },
  { Campo: "Telefone", Valor: paciente1.telefone },
  { Campo: "E-mail", Valor: paciente1.email },
  { Campo: "Alergias", Valor: paciente1.alergias.join(", ") },
  {
    Campo: "Endereço",
    Valor: `${paciente1.endereço.street}, ${paciente1.endereço.number} – ${paciente1.endereço.city}/${paciente1.endereço.state} – CEP ${paciente1.endereço.zipCode}`,
  },
  {
    Campo: "Contato de Emergência",
    Valor: `${paciente1.contatoEmergencia.name} – ${paciente1.contatoEmergencia.phone}`,
  },
]);

console.log("Médico:");
console.table([
  { Campo: "ID", Valor: doctor1.id },
  { Campo: "RCM", Valor: doctor1.rcm },
  { Campo: "Nome", Valor: doctor1.name },
  { Campo: "Especialidades", Valor: doctor1.specialties.join(", ") },
  { Campo: "Telefone", Valor: doctor1.phone },
  {
    Campo: "Dias de Atendimento",
    Valor: doctor1.listWorkingHours.hours.map((h) => h.day).join(", ") || "-",
  },
]);

console.log("Horários de Atendimento:");
console.table(
  doctor1.listWorkingHours.hours.map((h, i) => ({
    "#": i + 1,
    Dia: h.day,
    Horário: h.timeSlot,
  })),
);

console.log("Consulta:");
console.table([
  {
    ID: consulta1.id,
    Data: consulta1.data.toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    Paciente: consulta1.pacienteId,
    Médico: consulta1.medicoId,
    Motivo: consulta1.motivo,
    Status: consulta1.status,
    Observações: consulta1.observacoes ?? "-",
  },
]);

console.log("Exame:");
console.table([
  {
    ID: exame1.id,
    Tipo: exame1.tipo,
    Resultado: exame1.resultado,
    Data: exame1.data.toLocaleDateString("pt-BR", { timeZone: "UTC" }),
    Local: exame1.local,
    Responsável: exame1.responsavel,
    Paciente: exame1.pacienteId,
  },
]);

console.log(`Prontuário ${prontuario1.id} – Paciente ${prontuario1.pacienteId}`);
console.table([
  ...prontuario1.diagnosticos.map((valor, i) => ({
    Tipo: "Diagnóstico",
    "#": i + 1,
    Valor: valor,
  })),
  ...prontuario1.tratamentos.map((valor, i) => ({
    Tipo: "Tratamento",
    "#": i + 1,
    Valor: valor,
  })),
  ...prontuario1.medicamentos.map((valor, i) => ({
    Tipo: "Medicamento",
    "#": i + 1,
    Valor: valor,
  })),
]);