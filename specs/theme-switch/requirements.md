# Requirements — Theme Switch

Feature: `01_theme-switch` (`theme-switch`)
Notation: strict EARS (see `docs/spec.md`). Every acceptance criterion has a unique `R<n>`.

Colors, tokens and geometry referenced below come from `docs/ui.md` and
`spec/theme-switch/figma_context.md`. The real path alias is `@app/*` → `./src/*`
(the `@/` shown in `docs/ui.md` examples is wrong for this repo).

---

## User story 1 — Toggle the theme

> As a user, I want to click the switch to flip between light and dark, so that the
> interface matches my preference, with the knob visibly sliding between sides.

## R1
WHEN the user activates the ThemeSwitch, THEN the system SHALL toggle the active theme from `dark` to `light` or from `light` to `dark`.

## R2
WHEN the active theme changes, THEN the system SHALL animate the `Ellipse` knob horizontally between its light resting position (left, `translateX(0)`) and its dark resting position (right, `translateX(51px)`).

## R3
WHILE the `dark` theme is active, the ThemeSwitch SHALL render the knob at the right position with the Moon glyph visible.

## R4
WHILE the `light` theme is active, the ThemeSwitch SHALL render the knob at the left position with the Sun glyph visible.

---

## User story 2 — Managed, persisted state

> As a user, I want my choice remembered across visits, and as a maintainer I want a
> single, auditable source of truth for the theme.

## R5
The system SHALL hold the active theme in a Zustand store as the single source of truth for view state.

## R6
WHEN a theme-change intent is emitted, THEN the system SHALL route the new theme through the dispatcher (`src/dispacher`) to the store.

## R7
WHEN the active theme changes on the client, THEN the system SHALL persist the theme as a browser cookie.

## R8
The system SHALL access the theme cookie only through an adapter in `src/lib`.

---

## User story 3 — Global, flicker-free application

> As a user, I want the whole app to reflect the theme immediately on load, without a
> flash of the wrong theme.

## R9
The system SHALL apply the active theme globally via a `data-theme` attribute on the `<html>` element, affecting all components and pages.

## R10
WHEN a page is requested, THEN the system SHALL read the theme cookie on the server and render the `data-theme` attribute before hydration.

## R11
IF no theme cookie exists when the server reads the request, THEN the system SHALL apply the `dark` theme.

---

## User story 4 — Palette from the design system

> As a maintainer, I want colors to come exclusively from the documented CSS variables.

## R12
The system SHALL define, in `src/app/globals.css`, the static color variables and both the `[data-theme="dark"]` and `[data-theme="light"]` variable blocks exactly as listed in `docs/ui.md`.

## R13
The system SHALL consume every color through `rgb(var(--token))` and SHALL NOT hardcode any color literal in CSS or inline styles.

---

## User story 5 — Accessible switch

> As a keyboard or assistive-technology user, I want the switch to be announced and
> operable without a mouse.

## R14
The ThemeSwitch SHALL expose `role="switch"`.

## R15
The ThemeSwitch SHALL expose `aria-checked` set to `true` while the `light` theme is active and `false` while the `dark` theme is active.

## R16
WHEN the user presses `Enter` or `Space` while the ThemeSwitch is focused, THEN the system SHALL toggle the active theme.

## R17
The ThemeSwitch SHALL be focusable and reachable through the keyboard tab order.

## R18
The ThemeSwitch SHALL expose an accessible label describing its purpose (e.g. `aria-label`).

---

## User story 6 — Responsive

## R19
The ThemeSwitch SHALL render without layout breakage across the supported range of screen sizes and devices.

---

## User story 7 — Component contract

> As a maintainer, I want the component placed and wired exactly as the feature dictates.

## R20
The system SHALL implement the ThemeSwitch component at `src/components/nav/ThemeSwitch.tsx`.

## R21
The system SHALL NOT export the ThemeSwitch component from any barrel (`index.ts`).

## R22
The ThemeSwitch SHALL accept a `theme` prop that sets the initial theme when the component mounts.

## R23
The store's default theme SHALL be `dark` when no preference is provided.
