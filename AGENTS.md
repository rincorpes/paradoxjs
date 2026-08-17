# AGENTS.md

## Scope

This guide applies to `packages/javascript/paradoxjs`.

## Purpose

ParadoxJS is a standalone Node and TypeScript package for lightweight UI and
DOM utilities.

This file is intended to stay useful when the package is worked on outside the
parent workspace.

## Working Rules

- Treat this directory as its own project, not as part of the root Python
  workspace.
- Make source changes in `src/`.
- Keep tests aligned with behavior in `src/tests/`.
- If a source change affects shipped output, rebuild `build/` using the package
  scripts instead of editing output by hand.
- Preserve the package's existing module layout and public exports.

## Sensitive Areas

- public exports from `src/index.ts`
- router behavior
- pubsub behavior
- compatibility between TypeScript source and committed build output

## Commands

Run from this directory:

```bash
npm install
npm run build
npm test
```

## Notes

- `examples/` is useful for validating behavior manually.
- This package currently carries committed build artifacts, so source and build
  output should not drift.
