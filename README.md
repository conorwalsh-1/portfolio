# Conor Walsh: Portfolio

Personal portfolio site for Conor Walsh, built as a fully static [Astro](https://astro.build) site.

## Development

Requires Node.js 24 (see `.nvmrc`).

```bash
npm install
npm run dev            # http://localhost:4321
```

| Command                 | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `npm run lint`          | ESLint (TypeScript + Astro)                           |
| `npm run check`         | `astro check` type and template checks                |
| `npm run test:coverage` | Vitest unit tests with an 80% coverage gate           |
| `npm run build`         | Static build into `dist/`                             |
| `npm run test:e2e`      | Playwright (desktop + mobile) with axe WCAG AA checks |

## CI

Every pull request to `main` runs **validate** (lint, type check, unit tests with
coverage, build), **infrastructure** (CDK tests and synth) and **e2e** (Playwright and
accessibility). All must pass before merging.

## Deploy (optional)

The `cdk/` app deploys the static build to AWS S3, optionally behind CloudFront. Deploys are
**manual only** (Actions → *Deploy Portfolio via AWS CDK*), so nothing is billed until it is run.
See [cdk/README.md](cdk/README.md) and the [rollback runbook](docs/runbooks/rollback-drills.md).
