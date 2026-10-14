interface ExameDTO {
  id: string;
  tipo: string;
  resultado: string;
  data: Date;
  local: string;
  responsavel: string;
  pacienteId: string;
}

type CriarExameDTO = ExameDTO;

export class Exame implements ExameDTO {
  id: string;
  tipo: string;
  resultado: string;
  data: Date;
  local: string;
  responsavel: string;
  pacienteId: string;

  constructor(dados: CriarExameDTO) {
    this.id = dados.id;
    this.tipo = dados.tipo;
    this.resultado = dados.resultado;
    this.data = dados.data;
    this.local = dados.local;
    this.responsavel = dados.responsavel;
    this.pacienteId = dados.pacienteId;
  }
}

if (import.meta.main) {
  const exame1 = new Exame({
    id: "exa-001",
    tipo: "Eletrocardiograma",
    resultado: "Normal",
    data: new Date("2023-06-15"),
    local: "Laboratório Central",
    responsavel: "Dr. João",
    pacienteId: "123",
  });

  console.log(
    `Exame ${exame1.tipo} (${exame1.resultado}) do paciente ${exame1.pacienteId} realizado em ${exame1.local}.`,
  );
}
