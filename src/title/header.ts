/**
 * Conventional Commits header reading.
 *
 * A header is read only as far as the parts that name labels: the type, the
 * scope text, and `!`. Whatever follows the colon and space, nothing or later
 * lines included, leaves the reading unchanged.
 */

// A type ends where the reference parser ends one. Where its code and
// grammar disagree, this takes the stricter reading: any `!` and a lone CR
// from the code, every space separator from the grammar. The class spells
// out `\s` without U+2028 and U+2029, which are neither a line break nor
// whitespace in either, so a type keeps them.
const TYPE_END = /[\t\v\f\r\n\u{feff}\p{Zs}()!:]/u;

// A line break before the first `)` leaves the scope unclosed.
const SCOPE_END = /[)\r\n]/u;

/**
 * The parts of a Conventional Commits header that name labels.
 */
export interface Header {
  /** The type, as written. */
  readonly type: string;
  /** The text between the parentheses, as written; absent for none or `()`. */
  readonly scope?: string;
  /** Whether `!` stands directly before the colon. */
  readonly breaking: boolean;
}

/**
 * Read the Conventional Commits header at the start of `title`.
 *
 * The reading requires the space after the colon, as rule 1 of Conventional
 * Commits 1.0.0 does, though its reference parser leaves the space optional.
 * It also reads `()` as no scope, and a `(` inside the scope as scope text,
 * since the scope ends at its first `)`. The reference refuses both, but the
 * header pattern of the validators that callers run beside Titlecast accepts
 * them, and a title those validators pass must not lose its labels.
 *
 * @param title - A pull request title.
 * @returns The header, or `undefined` when `title` does not start with one.
 */
export function readHeader(title: string): Header | undefined {
  const typeEnd = title.search(TYPE_END);
  if (typeEnd <= 0) {
    return undefined;
  }
  const type = title.slice(0, typeEnd);

  let end = typeEnd;
  let scope: string | undefined;
  if (title.charAt(end) === "(") {
    const rest = title.slice(end + 1);
    const length = rest.search(SCOPE_END);
    if (length === -1 || rest.charAt(length) !== ")") {
      return undefined;
    }
    if (length > 0) {
      scope = rest.slice(0, length);
    }
    end += length + 2;
  }

  const breaking = title.charAt(end) === "!";
  if (breaking) {
    end += 1;
  }

  if (!title.startsWith(": ", end)) {
    return undefined;
  }
  return scope === undefined ? { type, breaking } : { type, scope, breaking };
}
