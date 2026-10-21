# Referência — Conventional Commits

Detalhamento usado pela skill `atomic-commits`. As mensagens são sempre em **inglês**; a documentação e os comentários do projeto seguem em português.

## Estrutura

```text
<type>(<scope>): <subject>
│        │        │
│        │        └─ resumo imperativo, minúsculo, sem ponto final, até ~72 caracteres
│        └─ área afetada, opcional
└─ tipo da mudança
```

Com corpo e rodapé:

```text
feat(domain): add patient repository

Replace direct array handling with a repository that owns persistence
details. The domain now asks for a patient by id instead of scanning
the collection.

Closes #42
```

## Tipos

| Tipo | Use quando | Exemplo |
| --- | --- | --- |
| `feat` | adiciona capacidade nova para quem usa o sistema | `feat(domain): add patient repository` |
| `fix` | corrige comportamento errado | `fix(domain): reject appointment at the same time` |
| `docs` | muda apenas documentação | `docs(architecture): add repositories lesson note` |
| `refactor` | muda a estrutura interna **sem** alterar comportamento | `refactor(domain): move repository into shared module` |
| `perf` | melhora desempenho sem mudar o contrato | `perf(domain): avoid copying working hours on read` |
| `test` | adiciona ou ajusta testes, sem tocar no código de produção | `test(domain): cover repository CRUD edge cases` |
| `build` | build, dependências, gerenciador de pacotes | `build: pin pnpm version in devEngines` |
| `ci` | pipelines e automação de integração | `ci: run typecheck on pull requests` |
| `chore` | manutenção, ferramentas, scaffolding, configuração | `chore(tsconfig): include source tests in typecheck` |
| `style` | formatação, espaços, imports — sem efeito no comportamento | `style(domain): order imports consistently` |
| `revert` | desfaz um commit anterior | `revert: feat(domain): add patient repository` |

> O `AGENTS.md` deste repositório lista `chore`, `feat`, `docs` e `refactor`. Os demais tipos são permitidos quando descrevem melhor a mudança — `test`, `build` e `ci` são os mais prováveis de aparecer.

### `feat`, `fix` ou `refactor`?

Pergunte: **o comportamento observável mudou?**

| Resposta | Tipo |
| --- | --- |
| Sim, algo novo passou a existir | `feat` |
| Sim, algo errado passou a funcionar | `fix` |
| Não, só a organização interna mudou | `refactor` |
| Não, só a aparência do código mudou | `style` |

Se a mudança só reorganiza arquivos, renomeia classes ou extrai métodos, é `refactor` — mesmo que o diff seja grande.

## Escopos

O escopo deve apontar para a **área**, não para o arquivo. Use o menor escopo que ainda identifica o assunto.

| Escopo | Área |
| --- | --- |
| `domain` | `src/domain/` — entidades, objetos de valor, agregados, repositórios |
| `architecture` | notas e índices em `docs/<Trilha>/Arquitetura de Software/` |
| `examples` | scripts de demonstração (`testHospital.ts`, `testMedicalRecord.ts`) |
| `tsconfig` | configuração do TypeScript |
| `study` | painel/scripts de estudo |
| *(sem escopo)* | mudanças transversais, como regra que vale para o repositório inteiro |

Regras:

- **um escopo por commit**; se precisar de dois, provavelmente são dois commits;
- não invente escopo para arquivo isolado (`patient.ts`) — use a área (`domain`);
- escopo é opcional; `docs: require mermaid diagrams in documentation` é melhor que um escopo forçado.

## Subject

- **Modo imperativo**, como uma ordem: `add`, `remove`, `move`, `prevent`, `rename`.
- **Inglês**, minúsculo depois dos dois-pontos.
- **Sem ponto final.**
- Até ~72 caracteres; se não couber, o commit está grande demais.

| Evite | Prefira |
| --- | --- |
| `added patient repository` | `add patient repository` |
| `adding patient repository` | `add patient repository` |
| `Add Patient Repository.` | `add patient repository` |
| `fix bug` | `prevent duplicate appointment at same time` |
| `update patient repository` | `reject duplicate ids in add` |
| `feat: patient repository and tests and docs` | três commits separados |

## Body

O corpo responde **por que** a mudança foi feita. O `git show` já mostra **o que** mudou, então não repita a lista de arquivos.

Bom corpo:

```text
The repository lived inside the patient module, but every aggregate needs
the same CRUD contract. Moving it to shared avoids duplicating the Map
handling and keeps the dependency direction pointing to shared.
```

Evite:

- descrever arquivo por arquivo;
- justificar com "conforme pedido";
- misturar assuntos de outros commits;
- deixar o corpo sem quebra de linha (dificulta leitura no terminal e no GitHub).

## Footer

| Rodapé | Uso |
| --- | --- |
| `BREAKING CHANGE: <descrição>` | contrato público quebrado |
| `Closes #123` | encerra a issue ao mergear |
| `Refs: #123` | referência sem encerrar |
| `Co-authored-by: Nome <email>` | autoria compartilhada |

Mudança incompatível também pode usar `!` antes dos dois-pontos:

```text
feat(domain)!: remove patientId from medical record

BREAKING CHANGE: medical records are now value objects accessed through
the patient history. Code that read `record.patientId` must navigate from
the aggregate instead.
```

## Revert

```text
revert: feat(domain): add patient repository

This reverts commit a1b2c3d4e5f6.

Reason: the repository introduced a circular dependency between modules.
```

O assunto repete a mensagem revertida; o corpo cita o hash e o motivo.

## Commits atômicos — exemplos aplicados

### Separação de refatoração e comportamento

```text
1. refactor(domain): extract repository contract to shared
2. feat(domain): add patient repository with blood type search
3. test(domain): cover repository CRUD and filters
4. docs(architecture): add repositories lesson note
```

Cada passo compila e passa nos testes por conta própria. O commit 1 não muda comportamento; o 2 introduz a capacidade; o 3 protege; o 4 documenta.

### Renomeação com atualização de chamadas

```text
refactor(domain): rename Appointments module to Appointment

Update every import and call site in the same commit; splitting would
leave the build broken between commits.
```

### Documentação em lote

```text
docs(architecture): scaffold repositories and services module

Add the module index and four blank lesson notes so each lesson can be
filled in separately.
```

Vários arquivos, **uma** intenção — o commit continua atômico.

### Dependência e lockfile

```text
build: add zod for runtime validation

Update pnpm-lock.yaml together with package.json; the lockfile alone
would not explain why the dependency exists.
```

## Antipadrões

| Antipadrão | Problema |
| --- | --- |
| `WIP`, `wip`, `temp` | não descreve intenção e suja o histórico |
| `misc`, `update files`, `improvements` | vago; não permite entender nem reverter |
| `fix` para refatoração | mente sobre o comportamento |
| `chore` para funcionalidade | esconde uma mudança relevante |
| dois tipos no mesmo assunto (`feat/fix`) | sinal de commit não atômico |
| emoji ou prefixo pessoal | foge da convenção do repositório |
| mensagem em português | quebra o padrão em inglês do histórico |
| corpo listando arquivos | redundante com o diff |
| `--no-verify` para "resolver" hook | esconde o problema em vez de corrigir |
