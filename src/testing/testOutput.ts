// Saída compartilhada dos testes: cores, separadores e tabelas.
// As cores são desligadas automaticamente quando a saída não é um terminal
// (CI, pipe, arquivo) ou quando `NO_COLOR` está definido.

const forceColor = process.env.FORCE_COLOR;
const noColor =
  process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== "";
const supportsColor =
  !noColor &&
  (forceColor !== undefined ? forceColor !== "0" : Boolean(process.stdout.isTTY));

function paint(code: string, text: string): string {
  return supportsColor ? `\u001b[${code}m${text}\u001b[0m` : text;
}

export const colors = {
  bold: (text: string) => paint("1", text),
  red: (text: string) => paint("31", text),
  green: (text: string) => paint("32", text),
  yellow: (text: string) => paint("33", text),
  magenta: (text: string) => paint("35", text),
  cyan: (text: string) => paint("36", text),
  gray: (text: string) => paint("90", text),
};

// `SHOW_DATA=0 pnpm test` esconde as tabelas e deixa só o resultado dos testes.
const SHOW_DATA = process.env.SHOW_DATA !== "0";

type Row = Record<string, unknown>;

export interface TestRunner {
  test(name: string, run: () => void): void;
  run(): void;
}

function separatorWidth(): number {
  const columns = process.stdout.columns ?? 64;
  return Math.max(40, Math.min(columns, 72));
}

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

function display(value: unknown): string {
  if (value instanceof Date) return value.toLocaleDateString("pt-BR");
  return String(value ?? "");
}

function renderTable(rows: Row[], highlightFirstColumn = true): void {
  const columns = Object.keys(rows[0]);
  const widths = columns.map((column) =>
    Math.max(column.length, ...rows.map((row) => display(row[column]).length)),
  );

  const border = (left: string, middle: string, right: string) =>
    `  ${
      colors.gray(
        left + widths.map((width) => "─".repeat(width + 2)).join(middle) + right,
      )
    }`;

  const renderRow = (
    cells: string[],
    style?: (cell: string, index: number) => string,
  ) => {
    const colored = cells.map((cell, index) => {
      const padded = cell.padEnd(widths[index]);
      return style ? style(padded, index) : padded;
    });

    return `  ${colors.gray("│")} ${
      colored.join(` ${colors.gray("│")} `)
    } ${colors.gray("│")}`;
  };

  console.log(border("┌", "┬", "┐"));
  console.log(renderRow(columns, (cell) => colors.bold(colors.cyan(cell))));
  console.log(border("├", "┼", "┤"));
  rows.forEach((row) => {
    console.log(
      renderRow(
        columns.map((column) => display(row[column])),
        (cell, index) =>
          highlightFirstColumn && index === 0 ? colors.yellow(cell) : cell,
      ),
    );
  });
  console.log(border("└", "┴", "┘"));
}

interface RepositoryLike<T> {
  data: Map<string, any>;
  findAll(): T[];
}

// Mostra o estado completo do repositório e a chave usada em cada entidade.
export function showRepository<T>(
  label: string,
  repository: RepositoryLike<T>,
  toRow: (entity: T) => Row,
  emptyText = "(repositório vazio)",
): void {
  if (!SHOW_DATA) return;

  console.log(`\n ${colors.magenta("▸")} ${colors.bold(label)}`);

  const keys = Array.from(repository.data.keys()).map((key) => `"${key}"`);
  console.log(
    `   ${colors.gray("chaves:")} ${colors.cyan(`[${keys.join(", ")}]`)}`,
  );

  const rows = repository.findAll().map(toRow);
  if (rows.length === 0) {
    console.log(colors.gray(`   ${emptyText}`));
    return;
  }

  renderTable(rows);
}

// Mostra o resultado de uma busca específica do repositório.
export function showResults<T>(
  label: string,
  items: ReadonlyArray<T>,
  toRow: (item: T) => Row,
  emptyText = "(nenhum resultado)",
): void {
  if (!SHOW_DATA) return;

  console.log(
    `\n ${colors.magenta("▸")} ${colors.bold(label)} ${
      colors.gray(`· ${plural(items.length, "resultado", "resultados")}`)
    }`,
  );

  if (items.length === 0) {
    console.log(colors.gray(`   ${emptyText}`));
    return;
  }

  renderTable(items.map(toRow));
}

// Cria o runner: os testes são registrados e executados em `run()`.
// Assim é possível numerar cada teste e exibir o resumo com o total.
export function createTestRunner(title: string): TestRunner {
  const entries: Array<{ name: string; run: () => void }> = [];
  let passed = 0;
  let failed = 0;

  const line = () => colors.gray("─".repeat(separatorWidth()));

  return {
    test(name, run) {
      entries.push({ name, run });
    },

    run() {
      console.log();
      console.log(
        `${colors.bold(colors.cyan(title))} ${
          colors.gray(`· ${plural(entries.length, "teste", "testes")}`)
        }`,
      );

      const total = String(entries.length).padStart(2, "0");

      entries.forEach((entry, index) => {
        console.log(`\n${line()}`);
        console.log(
          ` ${colors.yellow(String(index + 1).padStart(2, "0"))}${
            colors.gray(`/${total}`)
          }  ${colors.bold(entry.name)}`,
        );
        console.log(line());

        try {
          entry.run();
          passed += 1;
          console.log(colors.green(" ✔ ok"));
        } catch (error) {
          failed += 1;
          console.log(colors.red(" ✘ FAIL"));

          const detail = error instanceof Error ? error.message : String(error);
          const indented = detail
            .split("\n")
            .map((detailLine) => `   ${detailLine}`)
            .join("\n");
          console.log(colors.red(indented));
        }
      });

      const failures =
        failed === 0
          ? colors.gray("0 falharam")
          : colors.red(`✘ ${plural(failed, "falhou", "falharam")}`);

      console.log(`\n${line()}`);
      console.log(
        ` ${colors.green(`✔ ${plural(passed, "passou", "passaram")}`)}   ${
          colors.gray("·")
        }   ${failures}   ${colors.gray(`(${passed}/${entries.length})`)}`,
      );
      console.log(line());
      console.log();

      if (failed > 0) {
        process.exitCode = 1;
      }
    },
  };
}
