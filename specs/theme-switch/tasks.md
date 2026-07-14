# Tasks — Theme Switch

Ordered implementation plan. Each task is checkable and references the `R<n>` it satisfies.
The `implementer` marks `[x]` when a task is complete. Follow `docs/architecture.md`,
`docs/conventions.md`, `docs/ui.md`. Alias is `@app/*`.

- [x] T1: In `src/app/globals.css`, define the `:root` static variables (`--border`, `--turquoise`, `--indigo`, `--emerald`, `--red`), the `[data-theme="dark"]` block and the `[data-theme="light"]` block verbatim from `docs/ui.md`, plus `body { background: rgb(var(--background)); color: rgb(var(--text)); }`. (satisfies R12, R13, R9)

- [x] T2: Create `src/types/theme.ts` with `type Theme = 'dark' | 'light'`, `THEME_COOKIE_KEY`, and `DEFAULT_THEME = 'dark'`; re-export them from `src/types/index.ts`. (satisfies R23)

- [x] T3: Create `src/store/themeStore.ts` — a Zustand slice `{ theme: Theme; setTheme(theme) }` defaulting to `DEFAULT_THEME`; re-export `useThemeStore` from `src/store/index.ts`. (satisfies R5, R23)

- [x] T4: Implement `dispatchTheme(theme)` in `src/dispacher/index.ts` as the single path that calls the store's `setTheme`. (satisfies R6)

- [x] T5: Create the client adapter `src/lib/themeClient.ts` with `writeThemeCookie(theme)` (writes the `THEME_COOKIE_KEY` cookie, path `/`, ~1 year) and `applyThemeAttribute(theme)` (sets `data-theme` on `document.documentElement`); re-export both from `src/lib/index.ts`. (satisfies R7, R8, R9)

- [x] T6: Create the server-only adapter `src/lib/themeServer.ts` (`import 'server-only'`) with `getServerTheme()` reading the cookie via `next/headers` `cookies()` and returning `DEFAULT_THEME` when absent/invalid. Do NOT re-export it from `src/lib/index.ts` (server/client boundary, see design §6). (satisfies R8, R10, R11)

- [x] T7: Implement `initTheme(theme)` and `toggleTheme()` in `src/actions/index.ts`. `initTheme` dispatches the SSR value into the store; `toggleTheme` reads the current theme from the store, computes the opposite, calls `writeThemeCookie` + `applyThemeAttribute`, then dispatches via `dispatchTheme`. (satisfies R1, R6, R7)

- [x] T8: Create `src/hooks/useTheme.ts` returning the store's `theme` via a selector; re-export from `src/hooks/index.ts`. (satisfies R5)

- [x] T9: In the icons barrel `src/components/icons/index.ts`, define AND export `IconProps extends SVGProps<SVGSVGElement>` with a `color: string` token prop (not a separate file). (satisfies R13)

- [x] T10: Create a single file `src/components/icons/theme.tsx` exporting BOTH `SunIcon` and `MoonIcon`, importing `IconProps` from the barrel (`@app/components/icons`), and using the path data / viewBoxes from `spec/theme-switch/figma_context.md` (Sun `0 0 100 100`, Moon `0 0 100 95`); apply color via `style={{ fill: 'rgb(var(--' + color + '))' }}`; re-export both from `src/components/icons/index.ts`. (satisfies R13)

- [x] T11: Create `src/components/nav/themeSwitch.module.css` implementing the pill track (102×50, radius 25, `rgb(var(--border))`), the `Ellipse` knob (Ø40, 5px insets), the light/dark knob fill+opacity, icon positioning, and the `transform: translateX(0) → translateX(51px)` slide with `transition: transform 200ms ease`. Colors only via `rgb(var(--token))`. (satisfies R2, R3, R4, R13)

- [x] T12: Create `src/components/nav/ThemeSwitch.tsx` (`'use client'`) accepting a `theme` prop; seed the store with `initTheme(theme)` on mount; read the live theme with `useTheme`; render a `role="switch"` `<button>` with `aria-checked={theme === 'light'}`, an `aria-label`, keyboard handling (Enter/Space), and `onClick` calling `toggleTheme`; render the track, sliding knob, and `SunIcon`/`MoonIcon` with per-theme color tokens. Do NOT export it from any barrel. (satisfies R1, R2, R3, R4, R14, R15, R16, R17, R18, R20, R21, R22)

- [x] T13: Modify `src/app/layout.tsx` (keep it a server component): `await getServerTheme()` from `@app/lib/themeServer`, set `data-theme` on `<html>`, and render `<ThemeSwitch theme={theme} />` imported directly from `@app/components/nav/ThemeSwitch` (not via a barrel). (satisfies R9, R10, R11, R20, R21, R22)

- [x] T14: Verify responsiveness of the ThemeSwitch in the nav across small/large viewports (no overflow, touch target ≥ 44px). (satisfies R19)

- [x] T15: Run `pnpm lint` and `pnpm verify` (`tsc --noEmit`); resolve all warnings/errors before marking the feature done. (satisfies R5, R13)
