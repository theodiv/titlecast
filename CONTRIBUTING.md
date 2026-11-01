# Contributing to Titlecast

This document defines the standards, workflow, and expectations for all
submissions.

## Code of Conduct

Every participant follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup

```bash
npm ci
```

`.node-version` names the Node.js line, and `npm ci` installs exactly what
`package-lock.json` pins. Keep npm at 11.10 or later, which reads every key in
`.npmrc`.

## Toolchain

| Tool | Role |
|---|---|
| TypeScript | Strict type checking and the build into `lib/` |
| ESLint | Typed rules, layout through ESLint Stylistic, TSDoc through `eslint-plugin-jsdoc`, and Vitest rules |
| Vitest | Tests, with per-file coverage from `@vitest/coverage-v8` |

`devDependencies` pin each tool to one exact version, and `package-lock.json`
pins everything below them, so a local run and CI use the same versions.
ESLint Stylistic is the only formatter.

## Quality Gates

Every gate must pass before a pull request is opened:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

`npm run lint:fix` applies ESLint's fixes, layout included. A line over 80
columns stays to be broken by hand.

## Testing Standards

- Tests must mirror `src/`: `tests/<domain>/<module>.test.ts`, or
  `tests/<module>.test.ts` for a top-level module.
- Coverage must stay at or above **90%** per file for branches, functions,
  lines, and statements. `coverage.thresholds` in `vitest.config.ts` holds the
  number.
- Every bug fix must add a regression test that fails on the unfixed code.
- Tests must assert outcomes, never that an internal call happened.
- Tests must use fake credentials and must not reach the network beyond
  `127.0.0.1`.

Run one test file during development:

```bash
npm run test -- tests/errors.test.ts
```

## Pull Request Process

1. Fork the repository and create a branch from `main`, named
   `<type>/<short-kebab-summary>`.
2. Keep each PR to one change, with its tests and its documentation.
3. Add an entry under `[Unreleased]` in `CHANGELOG.md` for every
   caller-visible change.
4. Run every gate in Quality Gates.
5. Open the PR from the template: state the why in the description, mark
   exactly one type, and complete the checklist.

Report security defects through [SECURITY.md](SECURITY.md), never in a public
issue or PR.

## Commit Convention

Every PR lands as one squash merge, so its title becomes the commit subject on
`main` and must follow
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>(<scope>)[!]: <summary>
```

- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`.
- Scopes, optional: `title`, `labels`, `github`, `action`, `build`.
  A CI change takes the `ci` type with no scope.
- The summary must be imperative and lowercase, with no trailing period.
- A title must not exceed 68 characters, `<type>(<scope>)` and `!` included,
  so that GitHub's `(#N)` suffix still fits.
- A title must not hold an issue link. `Closes #N` goes on its own line in the
  description, only when the PR resolves that issue.
- A breaking change adds `!` after the scope, and the description states what
  callers must change in a `**Breaking:**` line.

CI rejects a title with an unlisted type or scope, or over the length limit.
