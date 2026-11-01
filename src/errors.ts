/**
 * Error hierarchy.
 */

/**
 * Base class of every error Titlecast defines.
 *
 * A shared root lets a `catch` block tell a failure Titlecast raises from any
 * other thrown value.
 */
export class TitlecastError extends Error {
  override readonly name: string = "TitlecastError";
}
