import { describe, expect, it } from "vitest";

import { readHeader } from "../../src/title/header.js";
import type { Header } from "../../src/title/header.js";

const LONG_TEXT = "x".repeat(2 ** 20);
const LONG_PARENTHESES = "(".repeat(2 ** 16);

const HEADERS: readonly (readonly [string, Header])[] = [
  // The summaries the reference's own tests accept, in `test/parser.js` of
  // `conventional-commits/parser` v0.4.1.
  ["fix: a really weird bug", { type: "fix", breaking: false }],
  [
    "feat(parser): add support for scopes",
    { type: "feat", scope: "parser", breaking: false },
  ],
  ["feat!: add support for scopes", { type: "feat", breaking: true }],
  [
    "feat(http parser)!: add support for scopes",
    { type: "feat", scope: "http parser", breaking: true },
  ],
  [
    "feat(tree):    add whitespace node",
    { type: "feat", scope: "tree", breaking: false },
  ],
  // Whatever follows the colon and space, later lines included.
  ["feat: ", { type: "feat", breaking: false }],
  ["feat:  x", { type: "feat", breaking: false }],
  ["feat: \tx", { type: "feat", breaking: false }],
  ["feat: a: b", { type: "feat", breaking: false }],
  ["feat: x!", { type: "feat", breaking: false }],
  ["feat: !x", { type: "feat", breaking: false }],
  ["feat(api): x (see y): z", { type: "feat", scope: "api", breaking: false }],
  ["feat: x\nmore", { type: "feat", breaking: false }],
  ["feat: x\r\nmore", { type: "feat", breaking: false }],
  ["feat: \n", { type: "feat", breaking: false }],
  // Scope text as written: `!`, colons, separators, and spaces.
  ["feat(!api): x", { type: "feat", scope: "!api", breaking: false }],
  ["feat(api!): x", { type: "feat", scope: "api!", breaking: false }],
  ["feat(api)!: x", { type: "feat", scope: "api", breaking: true }],
  ["feat(a:b): x", { type: "feat", scope: "a:b", breaking: false }],
  ["feat(a: b): x", { type: "feat", scope: "a: b", breaking: false }],
  ["feat(api): b: c", { type: "feat", scope: "api", breaking: false }],
  ["feat(api,ui): x", { type: "feat", scope: "api,ui", breaking: false }],
  ["feat(api, ui): x", { type: "feat", scope: "api, ui", breaking: false }],
  [
    "feat(api/ui\\core): x",
    { type: "feat", scope: "api/ui\\core", breaking: false },
  ],
  // The reference refuses these two scope readings: `()` as no scope, and a
  // `(` inside the scope.
  ["feat(): x", { type: "feat", breaking: false }],
  ["feat()!: x", { type: "feat", breaking: true }],
  ["feat(a(b): x", { type: "feat", scope: "a(b", breaking: false }],
  ["feat((): x", { type: "feat", scope: "(", breaking: false }],
  // Characters outside ASCII, lone surrogates included, with case and
  // normalization kept as written.
  ["\u{1f389}: x", { type: "\u{1f389}", breaking: false }],
  [
    "\u{1f389}(\u{1f680})!: x",
    { type: "\u{1f389}", scope: "\u{1f680}", breaking: true },
  ],
  ["\u{0301}: x", { type: "\u{0301}", breaking: false }],
  ["\u{d800}: x", { type: "\u{d800}", breaking: false }],
  ["feat(\u{dc00}): x", { type: "feat", scope: "\u{dc00}", breaking: false }],
  ["\u{fffd}: x", { type: "\u{fffd}", breaking: false }],
  ["fe\u{2028}at: x", { type: "fe\u{2028}at", breaking: false }],
  ["Feat: x", { type: "Feat", breaking: false }],
  ["FEAT(API): x", { type: "FEAT", scope: "API", breaking: false }],
  ["f\u{00e9}at: x", { type: "f\u{00e9}at", breaking: false }],
  ["fe\u{0301}at: x", { type: "fe\u{0301}at", breaking: false }],
];

const NO_HEADERS: readonly string[] = [
  // The summaries the same v0.4.1 tests refuse, and one they accept without
  // the space of rule 1.
  "feat add support for scopes",
  "feat( foo ) add support for scopes",
  "feat(bar)! add support for breaking change",
  "feat(foo: add support for scopes",
  "feat(tree):no whitespaces here",
  // Empty and partial titles.
  "",
  "feat",
  "feat:",
  ": x",
  "(api): x",
  // Empty, nested, unbalanced, and repeated parentheses.
  "feat()(): x",
  "feat((api)): x",
  "feat(a(b)): x",
  "feat(api: x",
  "feat)api(: x",
  "feat): x",
  "feat(api)(ui): x",
  "feat(api)): x",
  "feat(api)x: y",
  // `!` anywhere but right before the colon.
  "!feat: x",
  "fe!at: x",
  "feat!!: x",
  "feat!(api): x",
  "feat(api)!!: x",
  "feat! : x",
  "feat:! x",
  // Colons, whitespace, and line breaks where a header has none.
  "feat:: x",
  "feat(api):: x",
  " feat: x",
  "\u{feff}feat: x",
  "feat : x",
  "feat\t: x",
  "feat\v: x",
  "feat\f: x",
  "feat\u{3000}: x",
  "feat:\tx",
  "feat:\u{00a0}x",
  "feat:\u{3000}x",
  "fe\nat: x",
  "fe\rat: x",
  "feat\n: x",
  "feat(a\nb): x",
  "feat(a\rb): x",
  "feat(a\n: x",
  "feat:\nx",
  "feat!\n: x",
  // A footer's separator and breaking-change tokens.
  "fix #42",
  "feat(x)BREAKING CHANGE: y",
  "feat(x)BREAKING-CHANGE: y",
];

const LONG_READINGS: readonly (readonly [string, Header | undefined])[] = [
  [`feat: ${LONG_TEXT}`, { type: "feat", breaking: false }],
  [
    `${LONG_TEXT}(${LONG_TEXT})!: x`,
    { type: LONG_TEXT, scope: LONG_TEXT, breaking: true },
  ],
  [`feat${LONG_PARENTHESES}: x`, undefined],
  [
    `feat(${LONG_PARENTHESES}): x`,
    { type: "feat", scope: LONG_PARENTHESES, breaking: false },
  ],
];

describe("readHeader", () => {
  it.each(HEADERS)("reads the header of %j", (title, header) => {
    expect(readHeader(title)).toStrictEqual(header);
  });

  it.each(NO_HEADERS)("reads no header in %j", (title) => {
    expect(readHeader(title)).toBeUndefined();
  });

  it("reads titles of 2^20 characters and 2^16 parentheses", () => {
    expect(LONG_READINGS.map(([title]) => readHeader(title))).toStrictEqual(
      LONG_READINGS.map(([, header]) => header),
    );
  });
});
