---
name: figma-context
description: This skill ensures the agent always works with the correct Figma project without requiring the user to provide the project ID in every request.
---
# Skill: Figma Project Context

This skill ensures the agent always works with the correct Figma project without requiring the user to provide the project ID in every request.

## Default Figma Project

Always use the following Figma project as the default workspace unless the user explicitly requests a different one.

**Figma Project ID:** `3md97184vqa371qzoBxqU7`

Do not ask the user for the project ID when creating, modifying, inspecting, or commenting on designs. Assume this project is the default context for all Figma-related tasks.

Only switch to another Figma project if the user explicitly provides a different project ID or clearly indicates that another project should be used.

## UI Design Standards

Before performing any design-related task, read and use the guidelines defined in:

`docs/ui.md`

Treat this document as the single source of truth for the design system, including but not limited to:

* Color palette
* Typography
* Font sizes
* Font weights
* Spacing
* Layout rules
* Component usage
* Border radius
* Shadows
* Icons
* Design tokens
* Responsive behavior
* Accessibility guidelines
* Any additional UI conventions documented in the file

Whenever creating or modifying designs, ensure they comply with these standards. Do not introduce styles, colors, typography, spacing, or components that conflict with the documented design system unless the user explicitly requests an exception.

## Expected Behavior

* Always use the default Figma project.
* Never ask for the Figma project ID unless the user wants to work in a different project.
* Always read `docs/ui.md` before making design decisions.
* Use the documented design system consistently across all screens and components.
* If a required design decision is not covered in `docs/ui.md`, make the most consistent choice based on the existing design system and document your assumption if appropriate.
* Prioritize consistency with the existing project over introducing new patterns.
* If the user's request conflicts with the documented UI standards, follow the user's explicit instructions while clearly noting the deviation.
