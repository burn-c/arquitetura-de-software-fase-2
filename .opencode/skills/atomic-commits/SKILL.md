---
name: Commits Semânticos e Atômicos
description: Use ao criar, dividir ou revisar commits: transforma as mudanças em commits atômicos (uma intenção por commit) com mensagens Conventional Commits em inglês, conferindo o que está staged e sem stage indiscriminado nem comandos destrutivos.
---

# Commits Semânticos e Atômicos

Objetivo: transformar o estado atual do repositório em uma sequência de commits **pequenos, independentes e revertíveis**, com mensagens que expliquem **por que** a mudança existe.

## Regras invioláveis

- **Só commite quando o usuário pedir.** "Revisar", "sugerir mensagem" ou "planejar commits" não autorizam executar `git commit`.
- **Nunca use `git add -A`, `git add .` ou `git commit -a`.** Stage sempre por caminho: `git add -- <caminho>`.
- **Nunca descarte trabalho do usuário.** Proibido `git reset --hard`, `git checkout -- <arquivo>`, `git restore`, `git clean -fd`, a menos que o usuário peça explicitamente.
- **Nunca use `--amend`, `--force`, `--force-with-lease` ou `--no-verify` sem pedido explícito.**
- **Nunca commite segredos ou lixo:** `.env`, credenciais, chaves, `node_modules`, `.DS_Store`, dumps, binários grandes. Confira o `.gitignore` antes de adicionar arquivos novos.
- **Não misture consertos não solicitados.** Se encontrar um problema fora do escopo, relate em vez de "aproveitar o commit".
- **Mensagens em inglês** (convenção do repositório), mesmo que a documentação e os comentários estejam em português.
- **Preserve o que já está staged.** Se houver mudanças preparadas pelo usuário, inspecione antes e não as remova do index.

## Fluxo

### 1. Diagnóstico

```sh
git status --short --branch
git diff --stat
git diff --cached --stat
git diff --cached --name-status
git log --oneline -15
```

Leia também o `AGENTS.md` e o `package.json` do projeto para conhecer convenções e scripts de verificação.

Antes de continuar, verifique:

- há **merge, rebase, cherry-pick ou revert em andamento**? (`git status` mostra) — pare e pergunte;
- o `HEAD` está **destacado** (detached)? — pare e pergunte;
- existem **mudanças já staged**? — elas são do usuário; descubra a intenção antes de agrupar;
- há **arquivos não rastreados** relevantes? — inspecione o conteúdo, não adicione pastas inteiras.

### 2. Plano de divisão

Agrupe por **intenção**, não por tipo de arquivo. Um commit deve responder a uma única pergunta: "o que muda e por quê?".

| Situação | Commit único? |
| --- | --- |
| Renomear/mover classe **e** atualizar imports e chamadas | Sim — separar quebraria o build |
| Nova funcionalidade **e** os testes dela | Sim |
| Refatoração preparatória **e** mudança de comportamento | Não — refatore primeiro, mude o comportamento depois |
| Formatação/estilo **e** lógica | Não |
| Nota de aula nova | Sim, uma por nota (ou um lote de scaffolds equivalentes) |
| Correção de bug **e** atualização de documentação derivada | Depende: docs geradas pela mudança vão junto; docs independentes viram `docs:` |
| Lockfile alterado por dependência nova | Junto do commit que introduz a dependência |

Sinais de que o commit está grande demais:

- o assunto precisaria de "**and**" para ser descrito;
- dá para separar em duas partes que passam nos testes **de forma independente**;
- o diff mistura arquivos de áreas sem relação (ex.: `docs/` e `src/domain/`).

Quando o plano tiver **mais de 3 commits** ou a divisão for ambígua, apresente o plano em uma lista curta antes de executar. Não peça confirmação para casos óbvios.

### 3. Staging cirúrgico

```sh
git add -- caminho/arquivo1 caminho/arquivo2
git diff --cached --stat
git diff --cached
git diff --cached --check
```

- Para **deleções e renomeações**, use `git add -A -- <caminho-antigo> <caminho-novo>` — o pathspec limita o `-A` aos caminhos citados.
- Para **arquivos novos**, adicione um a um depois de ler o conteúdo.
- Se um **único arquivo mistura intenções** e não há como separar por caminho, **pare**: peça ao usuário para rodar `git add -p <arquivo>` ou para dividir a mudança. Não fatie hunks "no escuro".
- Revise `git diff --cached` de verdade: é a última barreira antes do commit. Confirme que não entrou debug, `console.log` esquecido, comentário temporário ou arquivo alheio.

### 4. Verificação

Leia os scripts disponíveis no `package.json` e rode **apenas os que se aplicam** à mudança:

```sh
pnpm typecheck   # mudanças em TypeScript
pnpm test        # quando o script existir e cobrir a área alterada
```

Regras:

- **Nunca commite com verificação quebrada por causa da sua mudança.** Corrija ou reverta o stage.
- Se a falha parecer **pré-existente e não relacionada**, junte evidências (a mesma falha aparece em arquivo que você não tocou, saída completa do comando) e pergunte como proceder — não esconda o problema.
- Em mudanças só de documentação, valide o Markdown (fences, links, Mermaid) e pule testes de código.
- Se um **hook** falhar, leia a saída, corrija o que for relacionado e rode de novo. **Nunca** use `--no-verify` para contornar.

### 5. Mensagem e commit

Formato:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- **`subject`**: imperativo, minúsculo depois dos dois-pontos, sem ponto final, até ~72 caracteres.
- **`body`** (opcional): explique o **porquê** e o contraste com o comportamento anterior; quebre em ~72 colunas.
- **`footer`** (opcional): `BREAKING CHANGE: ...`, `Closes #123`, `Refs: #456`.
- **Escopo**: use o menor escopo que identifica a área (`domain`, `architecture`, `examples`, `tsconfig`). Omita quando a mudança for transversal.

```sh
git commit -m "feat(domain): add patient repository" \
  -m "Encapsulate CRUD over an in-memory Map so the domain no longer
depends on how patients are stored."
```

Para corpos longos com listas, use `git commit -F -` com heredoc, sempre com aspas simples no delimitador para evitar expansão.

Exemplos:

| Ruim | Bom |
| --- | --- |
| `Adiciona repositório de paciente.` | `feat(domain): add patient repository` |
| `fix: fixed bug` | `fix(domain): prevent duplicate appointment at same time` |
| `feat: add repository and refactor patient` | dois commits: `refactor(domain): ...` e `feat(domain): ...` |
| `update files` | `docs(architecture): add repositories lesson note` |
| `WIP` | não commite — termine ou descreva o estado real |

Detalhes de tipos, escopos e exemplos: `references/conventional-commits.md`.

### 6. Confirmação

Depois de cada commit:

```sh
git show --stat --oneline HEAD
git status --short
```

No fim:

```sh
git log --oneline -n <quantidade>
```

Confirme que:

- cada commit contém **exatamente** os arquivos planejados;
- não sobrou mudança relacionada fora do commit;
- o que ficou unstaged é **intencional** e será relatado.

### 7. Relatório final

Responda de forma curta, com uma tabela e o que sobrou:

```text
| # | Hash    | Mensagem                                      |
| - | ------- | --------------------------------------------- |
| 1 | a1b2c3d | refactor(domain): move repository to shared   |
| 2 | e4f5g6h | feat(domain): add patient repository          |

Não commitado: src/domain/patient/PatientRepository.test.ts (fora do escopo pedido).
```

Se nada foi commitado, diga o motivo (nenhuma mudança, verificação falhou, aguardando decisão).

## Casos que exigem parada

- Conflito de merge, rebase ou cherry-pick em andamento.
- `HEAD` destacado.
- Arquivo único com intenções misturadas.
- Segredo ou credencial no diff.
- Verificação falhando de forma que você não consegue explicar.
- Mudanças que claramente não são do usuário (trabalho em andamento de outra pessoa).

Nesses casos, **não invente um commit**: explique o bloqueio e proponha o próximo passo.

## Definição de pronto

- [ ] Cada commit tem **uma** intenção e passa a verificação aplicável.
- [ ] Nenhum comando de stage indiscriminado foi usado.
- [ ] Nenhum segredo, debug ou arquivo alheio entrou no diff.
- [ ] Mensagem em inglês, no formato Conventional Commits, imperativa.
- [ ] `git status` final mostra apenas o que deve ficar de fora, e isso foi relatado.
