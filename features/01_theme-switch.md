---
id: 01_theme-switch
name: theme-switch
title: Theme Switch Component and Store
status: pending
sdd: true 
---
# Theme Switch

This feature provides a theme switch component and a store to manage the application's theme state, allowing users to toggle between light and dark modes.

## Figma Design
- **Dark Theme**: [Figma Dark Theme](https://www.figma.com/design/3md97184vqa371qzoBxqU7/InsightAI?node-id=457-802&t=Bh4FD8OjQycsOweL-4)
- **Light Theme**: [Figma Light Theme](https://www.figma.com/design/3md97184vqa371qzoBxqU7/InsightAI?node-id=457-806&t=Bh4FD8OjQycsOweL-4)

## Icons
- **Sun Icon**: [Figma Sun Icon](https://www.figma.com/design/3md97184vqa371qzoBxqU7/InsightAI?node-id=8-107&t=Bh4FD8OjQycsOweL-0)
- **Moon Icon**: [Figma Moon Icon](https://www.figma.com/design/3md97184vqa371qzoBxqU7/InsightAI?node-id=8-103&t=Bh4FD8OjQycsOweL-0)

## Acceptance Criteria

- On click it, toggles the theme between light and dark transitioning position of the `Ellipse` inside the `ThemeSwitch` component.
- The theme state is managed by a store, which persists the user's preference as a `cookie` in the browser.
- The theme state is applied globally to the application, affecting all components and pages.
- The theme must be loaded on server-side to avoid flickering when the page is loaded.
- The theme switch component must be accessible, with proper ARIA attributes and keyboard navigation support.
- Check the `docs/ui.md` for the color palette between themes.
- The theme switch component must be responsive and work well on different screen sizes and devices.
- The fallback theme is `dark` if the user has no preference saved in the browser.
- `ThemeSwitch` component must be implemented in `src/components/nav/ThemeSwitch.tsx` and shall not be exported.
- Theme switch must have a `theme` prop to set the initial theme when the component is mounted from the `cookie`.