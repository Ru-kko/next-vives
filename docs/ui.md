# Style Guide

This project has an strict style guide that must be followed in all design and development tasks.

## Figma Project Structure

The Figma project is organized into three main sections: 
- **Items:**: `node-id=0-1`
- **Pages:** `node-id=6-32`
- **Components:** `node-id=10-271`

The skill `figma-context`, contains the default Figma project URL and ensures that the agent always works with the correct Figma project without requiring the user to provide the project ID in every request.

### Items
Contains:

- Color Palette
- SVG Icons (Grouped in `icons` group)
- Image resources

> **NOTE:** Every vector asset in `pages` or `components` has a corresponding item in `items` with same name.
> A svg component must be the same as the svg item in `items` group. This is to ensure that the design system
> is consistent and that the same assets are used across the application.

### Pages
Contains:

- The complete design of each page
- The navigation flow between screens
- The final compositions that must be respected in the frontend

### Components
Contains:

- In development components
- Reusable variants for building the pages
- Interface pieces that are later consumed in `src/components`

## Typography

The application uses **Roboto** as the base font, loaded from Next.js in the main layout.
Actual location in the code:

- [src/app/layout.tsx](../src/app/layout.tsx)
- [src/app/globals.css](../src/app/globals.css)


## Color Palette

Global colors are defined `src/app/globals.css` as CSS variables. The application uses two sets of values depending on the active theme.

### Static Variables

These variables remain constant across both themes:

- `--border`: `51, 65, 85`
- `--turquoise`: `6, 182, 212`
- `--indigo`: `99, 102, 241`
- `--emerald`: `16, 185, 129`
- `--red`: `236, 72, 153`

### Dark Theme

Default theme when the attribute `data-theme="dark"` is active:

- `--blue`: `59, 130, 246`
- `--orange`: `251, 191, 36`
- `--background`: `30, 41, 59`
- `--surface`: `15, 23, 42`
- `--text`: `248, 250, 252`
- `--text-secondary`: `148, 163, 184`

### Light Theme

When the attribute `data-theme="light"` is active:

- `--blue`: `29, 78, 216`
- `--orange`: `245, 158, 11`
- `--background`: `249, 250, 251`
- `--surface`: `255, 255, 255`
- `--text`: `51, 65, 85`
- `--text-secondary`: `107, 114, 128`

## Theme

To use any color from the user's current theme, you can do so in CSS as follows:

```css
color: rgb(var(--text));
```

## Vector Assets

Most of vector assets are monocolor with the exception of company logos. All monocolor assets must be used with
`IconProps` as follows:

```tsx
import { IconProps } from "@/components/icons";

export const MyIcon = ({color, ...attr}: IconProps): JSX.Element => (
  <svg viewBox="0 0 100 100" {...attr}>
    <path style={{ fill: `rgb(var(--${color}))` }} d="..." />
    <path style={{ stroke: `rgb(var(--${color}))` }} d="..." />
  </svg>
);
```

usage:

```tsx
<MyIcon color="blue" width={24} height={24} />
```