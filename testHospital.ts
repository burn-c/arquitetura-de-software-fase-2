import { Address } from "./domain/address.ts";
import { Consulta } from "./domain/consulta.ts";
import { EmergencyContact } from "./domain/emergencyContact.ts";
import { Exame } from "./domain/exame.ts";
import { Medico } from "./domain/medico.ts";
import { Paciente } from "./domain/paciente.ts";
import { Prontuario } from "./domain/prontuario.ts";

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

const medico1 = new Medico({
  id: "101",
  crm: "CRM/SP 123456",
  nome: "Dr. Carlos",
  especialidades: ["Cardiologia", "Clínica Geral"],
  telefone: "(11) 77777-7777",
  horarioAtendimento: { dias: ["Segunda", "Quarta"], horario: "14:00-18:00" },
});

const consulta1 = new Consulta({
  id: "201",
  data: new Date("2023-10-15"),
  pacienteId: paciente1.id,
  medicoId: medico1.id,
  motivo: "Dor no peito",
  observacoes: "Paciente relatou dor no peito após esforço físico.",
});

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

console.log(consulta1);
