# Codebase Context — Theme Switch

## TL;DR — current state
This is a **freshly scaffolded, essentially empty** Next.js 16 (App Router) + React 19 + TypeScript project. Almost every source module referenced in the task is a **0-byte stub**. The conventions/architecture are richly documented in `docs/`, but virtually **no implementation code exists yet**. Nearly everything the Theme Switch spec needs (store, icons, IconProps, CSS variables, cookie helpers, server actions, nav folder contents) **must be created from scratch**, following the documented conventions.

## 1. Store pattern (`src/store/index.ts`)
- `src/store/index.ts` — **EXISTS but is 0 bytes (empty barrel)**. Nothing is exported yet.
- **Library: Zustand** is installed (`package.json:17` → `"zustand": "^5.0.14"`). No store code exists yet.
- Documented pattern (`docs/architecture.md:37`, `:69`): stores are Zustand slices, the **single source of truth** for view state, synchronous only (no async/fetch/orchestration). Components subscribe via selectors (through hooks) and never mutate directly.
- Flux loop is mandated (`docs/architecture.md:47-71`): `View → Action → Dispatcher → Store → View`. The **dispatcher** (`src/dispacher/`) is the only choke point that calls store `set`.
- Barrel convention (`docs/conventions.md:56-69`): consume via `import { useReportStore } from '@app/store';` — deep-imports into internal files are forbidden.
- **How a theme store fits:** create e.g. `src/store/themeStore.ts` (Zustand slice holding `theme: 'dark' | 'light'`), re-export its hook from `src/store/index.ts`. State transitions should route through `src/dispacher` and be triggered by an action in `src/actions` per the Flux rule. Fallback theme is `dark` (feature `features/01_theme-switch.md:29`).

## 2. Components pattern (`src/components/`)
- `src/components/index.ts` — **EXISTS but 0 bytes**.
- `src/components/nav/` — **folder EXISTS but is empty** (no files). This is where `ThemeSwitch.tsx` must go.
- `src/components/icons/` — **folder EXISTS but is empty**.
- Barrel convention (`docs/conventions.md:56-61`): a module exposes its public surface only through `index.ts`, re-exporting only what outside consumers need; internal-only pieces stay unexported.
- **Key alignment with the feature:** `features/01_theme-switch.md:30` says `ThemeSwitch` lives at `src/components/nav/ThemeSwitch.tsx` and **shall not be exported** — consistent with the barrel rule (internal, not re-exported from `src/components/index.ts`).
- Naming (`docs/conventions.md:43-53`): components PascalCase, files/modules camelCase (note: `ThemeSwitch.tsx` is PascalCase, matching the component-name exception).

## 3. Icons pattern (`src/components/icons`)
- **The folder is EMPTY. `IconProps` DOES NOT EXIST yet — it must be created.**
- The **only** spec for it is prose + example in `docs/ui.md:92-112`. Representative excerpt (docs/ui.md:97-105):
  ```tsx
  import { IconProps } from "@/components/icons";
  export const MyIcon = ({color, ...attr}: IconProps): JSX.Element => (
    <svg viewBox="0 0 100 100" {...attr}>
      <path style={{ fill: `rgb(var(--${color}))` }} d="..." />
      <path style={{ stroke: `rgb(var(--${color}))` }} d="..." />
    </svg>
  );
  ```
  Usage (docs/ui.md:110-112): `<MyIcon color="blue" width={24} height={24} />`
- **Color model:** icons are monocolor; color is applied via inline style `fill`/`stroke` = `rgb(var(--${color}))`, where `color` is a CSS-variable name (e.g. `blue`, `text`). So `IconProps` extends SVG attributes and adds a `color` prop (spread `...attr` onto `<svg>`).
- **Import-alias discrepancy (IMPORTANT):** docs/ui.md uses `@/components/icons`, but the actual tsconfig alias is `@app/*` (see §7). The real import should be `@app/components/icons`. Flag this for the spec author.
- The Theme Switch feature needs **Sun** and **Moon** icons (`features/01_theme-switch.md:16-18`, with Figma node references) — both must be created in this folder.

## 4. Actions pattern (`src/actions/index.ts`)
- `src/actions/index.ts` — **EXISTS but 0 bytes. No server actions (or any actions) exist yet.**
- Documented role (`docs/architecture.md:39`, `:65`): actions are named intents that orchestrate (call adapters in `src/lib`, await, shape payload, hand to dispatcher). They hold orchestration, not rendering, not business logic. Dependency: `types`, `dispacher`, `lib`.
- **For persisting theme as a cookie server-side:** the architecture funnels browser/third-party access through **adapters in `src/lib/`** (`docs/architecture.md:22`, `:40`, `:73-89`). A cookie read/write helper would idiomatically be a `src/lib/` adapter, invoked by an action. No such adapter exists yet. (Next.js `cookies()` from `next/headers` is the underlying server API to wrap.)

## 5. Cookie / server-side theme (`src/app/layout.tsx`, `globals.css`)
- `src/app/layout.tsx` (`src/app/layout.tsx:1-27`) — minimal. **Does NOT read cookies.** It sets `<html lang="en" className={...roboto variable...}>` and `<body>{children}</body>`. There is **no `data-theme` attribute** anywhere yet.
  - Excerpt (layout.tsx:22-23): `<html lang="en" className={`${geistSans.variable}`}>` / `<body>{children}</body>`
  - This is where the spec must add server-side cookie reading (`next/headers` `cookies()`) and apply `data-theme` (dark fallback) to `<html>` or `<body>` to prevent flicker (`features/01_theme-switch.md:24-25`).
- `src/app/globals.css` — **EXISTS but 0 bytes. The CSS variables and `data-theme` wiring DO NOT EXIST yet.** They are only *described* in `docs/ui.md:48-90`:
  - Static vars (docs/ui.md:52-60): `--border`, `--turquoise`, `--indigo`, `--emerald`, `--red` (RGB triplets, no `rgb()` wrapper).
  - `data-theme="dark"` values (docs/ui.md:62-72): `--blue`, `--orange`, `--background`, `--surface`, `--text`, `--text-secondary`.
  - `data-theme="light"` values (docs/ui.md:74-82): same var names, different triplets.
  - Consumption (docs/ui.md:84-90): `color: rgb(var(--text));` — variables store bare `R, G, B` triplets, wrapped with `rgb(var(--x))` at use.
  - Conventions reinforce (`docs/conventions.md:71-89`): colors/font-sizes/font-styles come exclusively from CSS variables defined centrally in `globals.css`; hardcoding is forbidden.
- **The spec author must define the full `:root`/`[data-theme="dark"]`/`[data-theme="light"]` blocks in `globals.css` from the docs/ui.md palette** — none of it is implemented.

## 6. Other barrels (`hooks`, `lib`, `dispacher`, `types`)
- `src/hooks/index.ts` — **0 bytes**. Role (`docs/architecture.md:41`): reusable React logic / store selectors; may depend on `types`, `store`, `actions`. A `useTheme` selector hook would go here.
- `src/lib/index.ts` — **0 bytes**. Role: adapters for browser/third-party APIs (`docs/architecture.md:40`, `:73-89`). Cookie read/write helper belongs here.
- `src/dispacher/index.ts` — **0 bytes**. (Note the intentional spelling "**dispacher**".) Role (`docs/architecture.md:38`, `:67`): single choke point routing action payloads to store `set`.
- `src/types/index.ts` — **0 bytes**. Domain layer, depends on nothing (`docs/architecture.md:36`, `:91-100`). **No `Theme` type / theme enum / cookie key constant exists** — a `Theme = 'dark' | 'light'` union and any shared contracts should be defined here.
- **Every barrel is empty**; per `docs/conventions.md:61` a module with nothing to export shouldn't even have a barrel, yet these stubs exist as empty placeholders.

## 7. Path aliases (`tsconfig.json`)
- `tsconfig.json:21-23` defines exactly one alias:
  ```json
  "paths": { "@app/*": ["./src/*"] }
  ```
- **There is NO `@/` alias.** The real alias is **`@app/*` → `./src/*`** (confirmed by `docs/conventions.md:22,34,64-68`, e.g. `import { useReportStore } from '@app/store';`).
- **Action item for spec author:** `docs/ui.md`'s `@/components/icons` examples are wrong for this repo — icon imports must use `@app/components/icons`.
- Other tsconfig notes: `strict: true` (conventions demand full typing, no `any`), `jsx: "react-jsx"`, `moduleResolution: "bundler"`, target ES2017.

## 8. `next.config.ts`
- `next.config.ts:1-8` — minimal; the only meaningful option is `reactCompiler: true` (React Compiler enabled; `babel-plugin-react-compiler` is in devDeps).
- **Uncommitted change is cosmetic only:** `git diff` shows the single modified line is `import type { NextConfig } from "next";` → `'next';` (double→single quotes, a Prettier formatting fix per `docs/conventions.md:9`). No functional config change relevant to theming.

## Additional context for the spec author
- **Tooling/scripts** (`package.json:5-12`): `verify` = `tsc --noEmit`, `lint` = `eslint .`, `format` = `prettier --write .`. Conventions: single quotes, trailing commas all, 2-space indent, fully typed, English-only, no `console.log`, no comments-except-why (`docs/conventions.md:7-13,97-99`).
- **Server-first React** (`docs/conventions.md:91-95`): avoid `'use client'`; push it to the smallest leaf. `ThemeSwitch` needs interactivity (click/keyboard), so it will be a client leaf, while `layout.tsx` stays a server component that reads the cookie and passes the initial `theme` prop down (matches `features/01_theme-switch.md:31`: "Theme switch must have a `theme` prop to set the initial theme from the cookie").
- **No `next/image`** — use plain `<img/>` (`docs/conventions.md:94`).
- **Feature acceptance criteria** live in `features/01_theme-switch.md:20-31` (toggle animates an `Ellipse` position, cookie persistence, server-side load to avoid flicker, ARIA + keyboard a11y, responsive, dark fallback, `theme` prop, not exported).
- Figma design/icon node references are in `features/01_theme-switch.md:12-18` (see `figma_context.md` research).
