<h1 align="center">
  Arquitetura de Software — Fase 2
</h1>

<h3 align="center">
Resumos de aula e modelo de domínio em TypeScript com DDD
</h3>
<h5 align="center">
  Feito com TypeScript | Node.js | pnpm
</h5>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/burn-c/arquitetura-de-software-fase-2?color=10B981">
  <img alt="License" src="https://img.shields.io/badge/licence-ISC-10B981">
  <a href="https://www.linkedin.com/in/carlosoliveiradev/">
    <img alt="Made by Carlos Oliveira" src="https://img.shields.io/badge/made%20by-carlos%20oliveira-10B981">
  </a>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-conteúdo-estudado">Conteúdo</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-modelo-de-domínio">Domínio</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

---

## 💡 Sobre

**Arquitetura de Software — Fase 2** reúne os resumos de aula e os exemplos de
código da trilha de **Arquitetura de Software** de um curso de pós-graduação em
**Full-Stack com IA**.

O repositório combina duas partes:

- 📓 **Resumos de aula** em Markdown, dentro de `docs/`, cobrindo o conteúdo
  teórico e diagramas (Mermaid).
- 🧩 **Modelo de domínio** em **TypeScript**, dentro de `domain/`, aplicando as
  práticas de **Domain-Driven Design (DDD)** em um contexto de exemplo: um
  **sistema hospitalar**.

A proposta aqui não é seguir um tutorial passo a passo, mas **pensar e codar**:
modelar o domínio, isolar as regras de negócio e praticar — porque programação é
uma arte que se aprende praticando.

## 📚 Conteúdo estudado

- 🧭 **Isolamento do domínio** e **linguagem ubíqua**
- 🧱 **Arquitetura em camadas**
- ⬡ **Arquitetura hexagonal** (Portas e Adaptadores)
- 🪪 **Entidades** e **Objetos de Valor**
- 📦 **Agregados**, **Serviços de Domínio** e **Repositórios**

## 🏥 Modelo de domínio

O domínio fica em `domain/`, com **um arquivo por entidade**. O contexto de
exemplo é um **sistema hospitalar**:

| Entidade | Responsabilidade |
| --- | --- |
| `Paciente` | Recebe o atendimento; histórico médico e regras de agendamento. |
| `Medico` | Atende os pacientes; especialidades e horários de atendimento. |
| `Consulta` | Relaciona paciente e médico, com status (`agendada`/`realizada`/`cancelada`). |
| `Exame` | Exame médico realizado, atrelado ao paciente. |
| `Prontuario` | Diagnósticos, tratamentos e medicamentos do paciente. |

As entidades seguem as convenções do projeto:

- 🔒 Encapsulamento com campos privados do ECMAScript (`#campo`)
- 📖 Coleções expostas como `ReadonlyArray` via getters que retornam cópias
- 🧾 Construtor recebendo um único objeto **DTO**
- 🧠 Regras de negócio dentro da própria entidade
- 🔗 Relacionamentos entre entidades feitos por **ID** (`pacienteId`, `medicoId`)

## 🚀 Como executar

1. Clone o repositório:

```bash
git clone https://github.com/burn-c/arquitetura-de-software-fase-2.git
```

2. Instale as dependências:

```bash
pnpm install
```

3. Rode os exemplos:

```bash
# Demonstração de todas as entidades
pnpm domain

# Cenário de integração do sistema hospitalar
pnpm hospital

# Os dois acima
pnpm examples

# Verificação de tipos
pnpm typecheck
```

> Cada arquivo em `domain/` também pode ser executado individualmente, por
> exemplo: `node domain/paciente.ts`.

## 🛠 Tecnologias

- [TypeScript](https://www.typescriptlang.org/) (ESM)
- [Node.js](https://nodejs.org/) (execução de `.ts` via type stripping)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)

## 📁 Estrutura do projeto

```
.
├── domain/                 # Modelo de domínio (uma entidade por arquivo)
│   ├── paciente.ts
│   ├── medico.ts
│   ├── consulta.ts
│   ├── exame.ts
│   └── prontuario.ts
├── docs/                   # Resumos de aula em Markdown
│   └── Estratégia e Inovação/
│       └── Arquitetura de Software/
│           ├── 3 - Arquitetura do Domínio/
│           └── 4 - Entidades e Objetos de Valor/
├── testHospital.ts         # Cenário de integração das entidades
├── tsconfig.json
├── AGENTS.md               # Diretrizes e convenções do projeto
└── package.json
```

## 📝 Convenções

As diretrizes de idioma, estrutura de `docs/`, estilo Markdown, modelagem de
domínio e mensagens de commit estão documentadas em [`AGENTS.md`](./AGENTS.md).

---

Made with  🔥  by Carlos Oliveira (BurN) - [My linkedin!](https://www.linkedin.com/in/carlosoliveiradev/)
