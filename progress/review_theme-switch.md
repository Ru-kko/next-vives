# Review — theme-switch

## Verdict: APPROVED

Reviewed against `spec/theme-switch/{requirements,design,tasks}.md`, `docs/ui.md`, `docs/architecture.md`, `docs/conventions.md`. No `CHECKPOINTS.md` exists.

## Gates
- `pnpm verify` (tsc --noEmit): PASS (run by leader).
- `pnpm lint` (eslint .): PASS (run by leader).

## Tasks
T1–T15 all complete. Implementer correctly disclosed it could not run gates in its sandbox rather than fabricating output; leader ran them (both PASS).

## Focus areas (all honored)
1. `@app/*` alias used everywhere; no `@/` in code.
2. `src/components/icons/theme.tsx` — single file exporting `SunIcon` (viewBox `0 0 100 100`) and `MoonIcon` (`0 0 100 95`), matching figma_context.md item paths.
3. `IconProps` defined AND exported in `src/components/icons/index.ts`; `theme.tsx` imports it via `import type { IconProps } from '@app/components/icons'` (type-only → no runtime circular ref).
4. `ThemeSwitch` at `src/components/nav/ThemeSwitch.tsx`, has `theme` prop, not in any barrel; `layout.tsx` deep-imports it (justified by R21 / design §6).
5. `layout.tsx` stays a server component, `await getServerTheme()`, sets `data-theme` on `<html>`, dark fallback in `themeServer.ts` (`import 'server-only'`).
6. Flux flow intact (View→Action→Dispatcher→Store→View); `'use client'` only on the `ThemeSwitch` leaf.
7. `globals.css` palette matches `docs/ui.md` exactly (`:root`/dark/light triplets verified); all via `rgb(var(--token))`, no literals.
8. `role="switch"`, `aria-checked`, `aria-label`, native focusable button, Enter/Space handled with `preventDefault`.

## Requirements
R1–R23 all satisfied.

## Non-blocking observations (design-sanctioned; no changes required)
1. `src/actions/index.ts` reads `useThemeStore.getState()` from `@app/store` for orchestration, while `docs/architecture.md`'s layer map lists actions' deps as `types, dispacher, lib` (not `store`). It's a read, not a mutation (writes still flow through `dispatchTheme`), and is explicitly documented/approved in `design.md` §6. **Worth surfacing to the human as an architecture-doc tension.**
2. R4 wording ("Sun glyph visible" in light): the opaque white knob covers the sun in light state, faithfully reproducing the Figma light frame and design §4. Spec-wording quirk, not an implementer defect.
