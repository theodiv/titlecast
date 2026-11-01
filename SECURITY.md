# Security Policy

## Supported Versions

Only the latest released version of Titlecast receives security fixes.
Older releases are not patched.

## Reporting a Vulnerability

Report vulnerabilities privately; never open a public issue for one.

- **GitHub private vulnerability reporting** (preferred): open a draft
  advisory on the
  [security advisories page](https://github.com/theodiv/titlecast/security/advisories/new).
- **Email**: `theodiv@gmail.com`.

## Disclosure Process

1. The maintainer acknowledges the report within **72 hours**.
2. The maintainer confirms or declines the report and assesses its
   severity within **7 days** of receiving it.
3. The fix is developed and tested in the advisory's temporary private fork.
4. Disclosure is coordinated with the reporter, targeting **30 days** from
   confirmation; complex issues may take longer.
5. The patched release and the advisory are published together.
6. The advisory credits the reporter unless anonymity is requested.

## Out of Scope

- The behavior of GitHub itself: the REST API, GitHub Actions, and the
  runners. Report it through the
  [GitHub Bug Bounty](https://bounty.github.com/) program.
- A caller's workflow: the token it grants, its `permissions:` block, and its
  other steps.
- A vulnerability in a dependency that Titlecast never reaches. Report it to
  that dependency's project.
