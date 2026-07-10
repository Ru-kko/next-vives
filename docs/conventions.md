# Code conventions

> Extreme homogeneity. The code must look the same everywhere, regardless of who wrote it.

## TypeScript style

- **Language target**: TypeScript with `strict` mode on (see `tsconfig.json`). Every construct the compiler flags under `strict` is an error, not a warning.
- **Tooling is the source of truth**: We align to the maximum with ESLint (`eslint-config-next` core-web-vitals + typescript) and Prettier. `pnpm lint` and `pnpm format` must pass with zero warnings before code is considered done. If Prettier and this document ever disagree on formatting, Prettier wins.
- **Formatting** (enforced by Prettier): single quotes `'...'`, trailing commas everywhere (`trailingComma: "all"`), 2-space indentation.
- **Strings**: single quotes `'...'` always. Use template literals `` `${x}` `` for interpolation — never string concatenation with `+`.
- **Typing is mandatory**: Every function and method is fully typed — parameters and return type. `any` is forbidden; reach for a specific type, a generic, `unknown` (narrowed before use), or a union. Prefer `Foo | undefined` / `Foo | null` explicitly over implicit optionality.
- **Language**: All code is in English — variable, function, class, component and interface names, plus any comment. This keeps the codebase collaboration-ready and maintainable.
- **No `console.log`**: Debug logging via `console.log` must never be committed. Remove it before opening a change.

## Import order

Imports are grouped, and each group is separated from the next by a single blank line. The order is:

1. **Node standard libraries** — e.g. `node:path`, `node:crypto`.
2. **React libraries** — `react`, `react-dom`, `next` and its subpaths.
3. **Utility / non-React third-party libraries** — anything that has nothing to do with React (e.g. `zustand`).
4. **Own modules** — absolute imports via the `@app/*` alias (`@app/...`).
5. **Relative internal modules** — `./...`, `../...`.
6. **CSS modules** — `*.module.css`.
7. **Bare side-effect imports** — imports that only load a script and bind no name, e.g. `import 'some-polyfill';`.

```ts
import path from 'node:path';

import { useState } from 'react';

import { create } from 'zustand';

import { Report } from '@app/types';

import { formatDate } from '../lib/date';

import styles from './card.module.css';

import 'some-side-effect';
```

## Naming

| Type | Convention | Example |
| --- | --- | --- |
| Modules / files | camelCase | `myModule.ts` |
| Components | PascalCase | `MyComponent` |
| Classes | PascalCase | `MyClass` |
| Interfaces / types | PascalCase | `MyInterface` |
| Functions | camelCase | `myFunction()` |
| Variables | camelCase | `myVariable` |
| Constants | UPPER_SNAKE_CASE | `MY_CONSTANT` |

## Barrel files

Every module exposes its public surface through a **barrel file** (`index.ts`), and only that surface.

- A barrel re-exports **only what consumers outside the module need**. Internal helpers stay unexported — they are not in the barrel.
- Cross-module imports go **through the barrel only**. Never deep-import another module's internal file; import from its `index.ts` (via the `@app/*` alias).
- If a module has nothing to export, its barrel should not exist.

```ts
// good — consuming the store module through its barrel
import { useReportStore } from '@app/store';

// forbidden — reaching into a module's internals
import { useReportStore } from '@app/store/reportStore';
```

## Theming

Colors, font sizes and font styles come **exclusively** from CSS variables. Hardcoding a color, a font size or a font style anywhere — CSS or inline — is forbidden.

```css
/* good */
.title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
}

/* forbidden */
.title {
  color: #1a1a1a;
  font-size: 20px;
}
```

The variables are defined centrally (in `globals.css`); components consume them, never redefine literal values.

## React & Next.js

- **Server-first**: Avoid `'use client'` as much as possible. A component becomes a client component only when it genuinely needs client-only capability (state, effects, event handlers, browser APIs). Push `'use client'` to the smallest leaf that needs it; keep the rest as server components.
- **No `next/image`**: Do not use the Next.js `<Image />` component. Use a plain `<img />`.
- **Single Responsibility per component**: Components render and emit intents. They do not fetch, transform or persist data — that is the job of actions and adapters (see `architecture.md`).

## Comments

By default, code carries **no comments** — names do the work, and the code must be self-explanatory. A comment is allowed only when it explains a **non-obvious why** (a documented workaround, a subtle invariant). It is never used to restate what the code already says.

## Errors

Consistent with `architecture.md`:

- Errors that cross a layer boundary are **named, typed error types** defined in `src/types/`, not generic `Error` thrown ad hoc.
- Avoid throwing bare `Error`/generic failures. Define a specific error that describes the problem (e.g. `ReportNotFoundError`, `DataSourceUnavailableError`).
- Transport-level failures are translated into domain errors **inside the adapter** (`src/lib/`); callers catch a known error type and never inspect HTTP status codes or raw response bodies.
