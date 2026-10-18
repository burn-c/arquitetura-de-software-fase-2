# AGENTS.md

Diretrizes para agentes e contribuidores trabalhando neste repositório.

## Visão Geral do Projeto

Resumos de aula e exemplos de código da trilha de **Arquitetura de Software** de
um curso de pós-graduação em Full-Stack com IA. O repositório combina:

- Resumos de aula em Markdown dentro de `docs/`.
- Exemplos em TypeScript que modelam o domínio usado ao longo do curso.

## Convenções de Idioma

- **Documentação e textos:** Português (acompanha o material do curso).
- **Comentários de código:** Português — inclusive JSDoc, comentários de
  linha e os títulos/descrições dos testes.
- **Identificadores de código:** Inglês (arquivos, classes, atributos e
  métodos), ex.: `patient.ts`, `scheduleConsultation`. A migração do domínio
  para o inglês é progressiva e acompanha as aulas.
- **Mensagens de commit:** Inglês (veja abaixo).
- **`AGENTS.md` e arquivos de ferramentas:** Português.

## Estrutura de `docs/`

```
docs/
└── <Trilha>/                    # ex.: "Estratégia e Inovação"
    └── <N - Tema>/              # ex.: "3 - Arquitetura de Software"
        ├── INDEX.md             # índice com link para cada nota da pasta
        └── <Aula>.md            # um arquivo por aula
```

- Cada aula fica em seu próprio arquivo Markdown, nomeado com o título da aula.
- Toda pasta que contém notas deve ter um `INDEX.md` com links relativos
  codificados para URL (ex.: `./Isolando%20o%20Dom%C3%ADnio...md`).

### Estilo Markdown

- Comece com um único título `#` igual ao nome da aula.
- Use seções `##`. Fluxo padrão: Introdução e contexto → conceitos →
  benefícios → limitações → conclusão/gancho para a próxima aula.
- Destaque termos-chave com `**negrito**` e referências cruzadas com *itálico*.
- Prefira tabelas para comparações e blocos **Mermaid** para diagramas
  (`flowchart`, `sequenceDiagram`). Os diagramas devem renderizar no GitHub.

## Convenções de Código

- **Linguagem:** TypeScript, ESM (`"type": "module"`).
- **Gerenciador de pacotes:** pnpm (fixado via `devEngines`).

### Estrutura de Código

- O modelo de domínio fica em `domain/`, com **um arquivo por entidade ou
  objeto de valor** (ex.: `domain/patient.ts`, `domain/consultation.ts`,
  `domain/workingHours.ts`).
- Use a extensão `.ts` nos imports relativos de ESM (ex.:
  `import { Consultation } from "./consultation.ts"`).
- Referencie outras entidades por **ID** (ex.: `patientId`, `doctorId`) em vez
  de objetos, evitando acoplamento e dependências circulares.
- Cada arquivo termina com um pequeno **bloco de demonstração** executável.

### Modelagem de Domínio

A modelagem segue as práticas de DDD usadas no curso:
  - Encapsule estado com campos privados do ECMAScript (`#campo`).
  - Exponha coleções como `ReadonlyArray` por meio de getters que retornam cópias.
  - Aceite um único objeto DTO no construtor em vez de argumentos posicionais.
  - Mantenha as regras de negócio dentro da entidade de domínio (ex.: impedir que
    um paciente agende duas consultas no mesmo horário).

## Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/) em inglês,
uma mudança lógica por commit (atômico):

- `chore: ...` – ferramentas, configuração, scaffolding do projeto.
- `feat: ...` – novos exemplos de código ou funcionalidades.
- `docs: ...` – documentação, notas, índices.
- `refactor: ...` – mudanças de código que não corrigem bug nem adicionam feature.

Prefira um escopo opcional quando ele esclarecer a área, ex.:
`docs(architecture): ...` ou `feat(domain): ...`.
