/**
 * Compara duas coleções sem considerar a ordem dos itens (igualdade de
 * multiconjunto).
 *
 * Diferente de `left.every((item) => right.some(...))`, cada item da esquerda
 * consome um item distinto da direita, então as duplicatas são respeitadas:
 * `[A, A]` NÃO é igual a `[A, B]`.
 *
 * Compartilhado pelos objetos de valor do domínio que guardam coleções
 * (WorkingHours, MedicalRecord).
 */
export function sameItems<T>(
  left: ReadonlyArray<T>,
  right: ReadonlyArray<T>,
  equals: (a: T, b: T) => boolean,
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const consumed = new Array<boolean>(right.length).fill(false);

  return left.every((item) => {
    const index = right.findIndex(
      (candidate, i) => !consumed[i] && equals(item, candidate),
    );

    if (index === -1) {
      return false;
    }

    consumed[index] = true;
    return true;
  });
}
