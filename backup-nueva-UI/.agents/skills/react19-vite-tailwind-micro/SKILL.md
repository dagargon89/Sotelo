---
name: react19-vite-tailwind-micro
description: Best practices for implementing UI adjustments on the Sotelo Phase 2 frontend, preserving the existing aesthetic and standard React 19 methodologies.
---
# React + Vite + Tailwind 4 (Sotelo MVP) Skill

## Context
The project uses React 19, Vite, and Tailwind 4. It does not use Next.js, Remix, or complex routing. It's a single page application (SPA) focused on data entry and calculating final outcomes.

## UI/UX Directives
1. **Preserve Phase 1 Aesthetics**: Strictly maintain the visual design, typography, spacing, and color palette established in Phase 1. 
2. **Do Not Over-Engineer**: If existing components handle the layout (like `TripCard.jsx` and `SummaryBar.jsx`), modify them inline rather than building new complex context providers or libraries.
3. **Responsive**: It must respond nicely to desktop screens primarily, as the operating administrative team works on desktop monitors. Keep tables and cards highly functional.

## Modifying Existing Components
- Use standard functional components.
- Rely on Tailwind utility classes inline. Do not extract to arbitrary CSS unless there's an overwhelming need, to maintain encapsulation.
- When sending payload mutations back to the PHP backend, ensure you match the exact `api/calculate.php` JSON contract `{ "trips": [...] }`.
