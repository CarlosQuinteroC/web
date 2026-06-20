# Ojo al Fraude — Agent Instructions

This repository contains the public web platform for Ojo al Fraude.

## Project shape

- Framework: Astro 6.
- UI islands: React only when client interactivity is necessary.
- Styling: Tailwind CSS 4 plus semantic CSS tokens in `src/styles/`.
- Content: Astro content collections and MDX.
- Tests: Vitest.
- Default branch: `master`.

## Working rules

- Keep changes small and reviewable.
- Use feature branches named `feat/<short-description>` for new work.
- Do not commit directly to `master` unless explicitly instructed.
- Prefer static Astro pages and content collections before adding client JavaScript.
- Do not add authentication, backend sync, simulations, or local progress unless the current task explicitly asks for that slice.
- Public learning content is Spanish-first for Colombia, written in clear neutral Spanish.
- Technical artifacts, code identifiers, and comments default to English.

## Current SDD direction

The MVP is split into reviewable slices:

1. Foundation: Astro/Tailwind/MDX/React/Vitest, tokens, MVP docs. Done on `master`.
2. Learning content: contracts, content schema, first MDX lessons, and `/learn` routes.
3. Simulations/progress: React islands and anonymous local progress.
4. UX QA/docs: accessibility, theme QA, and verification docs.

Use Engram SDD artifacts when available. Important topic keys include:

- `sdd/public-platform-mvp/tasks`
- `sdd/public-platform-mvp/design`
- `sdd/public-platform-mvp/apply-progress`

## Verification

Run these before reporting a slice as complete:

```powershell
npm run check
npm test
npm run build
```

If a command fails, report the exact command and error. Do not claim success without verification.

## Content collection notes

Astro 6 uses `src/content.config.ts` with loaders from `astro/loaders`.

- Do not create legacy `src/content/config.ts`.
- Use `render(entry)` from `astro:content` to render MDX entries.
- Course content lives under `src/content/courses/`.

## Out of scope unless explicitly requested

- Login or accounts.
- Backend/database work.
- AI-based risk analysis.
- Evidence vault or legal verdict features.
- Punitive scoring, timers, rankings, or anxiety-driven gamification.
