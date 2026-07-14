# Implementation Report — theme-switch (01_theme-switch)

Status: implementation complete (all tasks T1–T15 addressed).

## Files created / modified

Created:
- `src/types/theme.ts` — `Theme` union, `THEME_COOKIE_KEY`, `DEFAULT_THEME = 'dark'`.
- `src/store/themeStore.ts` — Zustand slice `{ theme, setTheme }` defaulting to `DEFAULT_THEME`.
- `src/lib/themeClient.ts` — client adapter: `writeThemeCookie`, `applyThemeAttribute`.
- `src/lib/themeServer.ts` — server-only adapter: `getServerTheme` (`import 'server-only'`).
- `src/hooks/useTheme.ts` — selector hook over the theme store.
- `src/components/icons/theme.tsx` — `SunIcon` (viewBox `0 0 100 100`) and `MoonIcon` (viewBox `0 0 100 95`).
- `src/components/nav/themeSwitch.module.css` — track/knob/icon geometry, slide animation, per-theme colors.
- `src/components/nav/ThemeSwitch.tsx` — client switch component (NOT barrelled).

Modified (were 0-byte stubs / scaffold):
- `src/types/index.ts` — re-export `Theme`, `THEME_COOKIE_KEY`, `DEFAULT_THEME`.
- `src/store/index.ts` — re-export `useThemeStore`.
- `src/dispacher/index.ts` — `dispatchTheme` (single path to store `setTheme`).
- `src/actions/index.ts` — `initTheme`, `toggleTheme`.
- `src/lib/index.ts` — re-export the client adapter only (NOT `themeServer`, per design §6).
- `src/hooks/index.ts` — re-export `useTheme`.
- `src/components/icons/index.ts` — define + export `IconProps`; re-export `SunIcon`, `MoonIcon`.
- `src/app/globals.css` — full palette variable blocks + `body`.
- `src/app/layout.tsx` — server-side theme read, `data-theme` on `<html>`, render `<ThemeSwitch>`.

## Requirement mapping

- R1 (toggle dark⇄light): `toggleTheme` reads current from store, computes opposite, dispatches. `ThemeSwitch` `onClick`/`onKeyDown` emit it.
- R2 (knob slide): `.knob` `transition: transform 200ms ease`; `translateX(0)` light, `translateX(51px)` dark via `.track[data-active-theme='...']`.
- R3 (dark → knob right, moon): `data-active-theme='dark'` places knob right (translateX(51px)); knob (last DOM child) overlays moon.
- R4 (light → knob left, sun): `data-active-theme='light'` places knob left; overlays sun.
- R5 (Zustand single source of truth): `useThemeStore`; view reads via `useTheme` selector.
- R6 (route through dispatcher): only `dispatchTheme` calls `setTheme`; actions dispatch through it.
- R7 (persist cookie on client change): `toggleTheme` calls `writeThemeCookie` (~1 year, path=/).
- R8 (cookie only via `src/lib` adapters): read in `themeServer.ts`, write in `themeClient.ts`.
- R9 (`data-theme` on `<html>` global): set in `layout.tsx` at SSR and updated by `applyThemeAttribute`; `body` consumes `--background`/`--text`.
- R10 (server read before hydration): `layout.tsx` `await getServerTheme()` sets `data-theme` at SSR.
- R11 (dark fallback when no cookie): `getServerTheme` returns `DEFAULT_THEME` when absent/invalid.
- R12 (palette blocks exactly from docs/ui.md): `:root`, `[data-theme='dark']`, `[data-theme='light']` in `globals.css`.
- R13 (colors only via `rgb(var(--token))`): all CSS + icon fills use `rgb(var(--...))`; no literals.
- R14 (`role="switch"`), R15 (`aria-checked` = light), R18 (`aria-label`): set on the button.
- R16 (Enter/Space toggle): `onKeyDown` handles Enter/Space with `preventDefault()` (suppresses the native button click so there is no double-toggle); mouse handled by `onClick`.
- R17 (focusable/tab order): native `<button>`, with `:focus-visible` outline via `rgb(var(--blue))`.
- R19 (responsive): fixed 102×50 pill, height 50px ≥ 44px touch target, no reflow/overflow.
- R20 (`src/components/nav/ThemeSwitch.tsx`): implemented there.
- R21 (not barrelled): not re-exported from any `index.ts`; `layout.tsx` deep-imports it (design §6).
- R22 (`theme` prop): `ThemeSwitchProps.theme`; seeds store via `initTheme` on mount; passed from `layout.tsx`.
- R23 (store default dark): `useThemeStore` initial `theme: DEFAULT_THEME`.

## Design decisions honored (design §6)
- `src/lib/index.ts` re-exports only the client adapter; `layout.tsx` imports `getServerTheme` directly from `@app/lib/themeServer` (server/client bundling boundary).
- `ThemeSwitch` deep-imported by `layout.tsx` (mandated by R21).
- Icons use `@app/components/icons` (docs/ui.md `@/` alias is wrong for this repo).
- `toggleTheme` reads store state via `getState()` (orchestration; mutation still flows through the dispatcher).
- `import 'server-only'` is resolvable: Next ships `declare module 'server-only'` in `next/types/global.d.ts`, and `noUncheckedSideEffectImports` is not enabled, so `tsc` does not flag the side-effect import.

## Verification (T15)
- `pnpm verify` (tsc --noEmit) and `pnpm lint`: NOT EXECUTED. This agent environment exposes no shell/Bash tool (only Read/Write/Edit/Glob/Grep), so the commands could not be run here. I did NOT run them and therefore do not claim their output.
- Static review performed instead: strict typing (no `any`), single quotes / trailing commas / 2-space indent, English-only, no `console.log`, typed returns, import grouping per conventions, `IconProps` type-only circular import (erased at runtime), zustand v5 `create<T>(initializer)` overload, `onClick` accepts `() => void`, `data-*` passthrough.
- ACTION FOR LEADER/REVIEWER: run `pnpm verify` and `pnpm lint` to confirm the gates pass before approval.

## Open questions / caveats
- CSS attribute selectors use single quotes (`[data-theme='dark']`) to match the project `.prettierrc` `singleQuote: true`. ESLint does not lint `.css`, so this does not affect the lint gate; if `pnpm format` normalizes CSS quotes differently, it is cosmetic only.
- On a cookie=`light` first load there is a one-frame knob correction: SSR `<html data-theme="light">` is correct immediately, but the store seeds to `light` via the mount effect (`initTheme`), per design §5 step 4. No hydration mismatch (server and client first render both use the store default).
