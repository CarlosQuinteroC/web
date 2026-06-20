# Ojo al Fraude Public Platform MVP

This document captures the implementation boundary for the first SDD delivery chain.

## MVP Scope

The MVP is a Colombia-aware, Spanish-first learning platform focused on two interactive course tracks:

1. Digital Confidence: practical technology literacy for low-confidence users.
2. Common Attacks and Frauds: simulated practice around common fraud patterns.

The learning structure is:

```text
tracks → microcourses/modules → micro-lessons → simulations
```

The MVP supports anonymous learning first: visitors can start lessons and practice without creating an account.

## Colombia-first vs. General Literacy

Colombia is the primary context for fraud examples, search intent, help references, and local terminology when relevant.

General technology literacy remains broader: links, apps, browsers, search, verification codes, device permissions, and safe exploration should be reusable beyond Colombia.

The boundary is practical: use Colombian context when it makes the risk or next step clearer, but avoid turning universal digital-confidence lessons into country-specific procedures unless the action truly depends on local context.

## Non-goals for this MVP

- Mandatory login.
- Companion/facilitator mode.
- Backend account synchronization.
- AI-powered risk analysis.
- Evidence vault.
- Legal/criminal verdicts.
- Punitive scoring, rankings, timers, or anxiety-driven gamification.
- Full fraud report builder.
- Real-time reputation or threat-intelligence lookups.

## Delivery Chain

The implementation uses feature-branch-chain review slicing:

| PR | Boundary | Goal |
|---|---|---|
| PR 1 | foundation branch → tracker branch | Astro/Tailwind/MDX/React/Vitest foundation, design tokens, MVP docs. |
| PR 2 | learning content branch → foundation branch | Course model, routes, and first Spanish content slice. |
| PR 3 | simulations/progress branch → learning content branch | React islands, persistent local progress, reset/delete control. |
| PR 4 | UX QA/docs branch → simulations/progress branch | Accessibility, dark/light QA, verification docs. |

## Foundation Decisions

- Package manager: npm with `package-lock.json`.
- Rendering: Astro pages with MDX content and React islands only where interaction needs client JavaScript.
- Styling: Tailwind CSS 4 through `@tailwindcss/vite` plus semantic CSS tokens.
- Theme: light and dark tokens are defined together so contrast and meaning survive theme changes.
- Motion: calm transform/opacity transitions with `prefers-reduced-motion` support.
- Accessibility: visible focus states, semantic colors, readable type scale, and 44px minimum touch targets from the start.

## Current PR Boundary

PR 1 is intentionally limited to foundation work. It does not introduce course schemas, learning routes, simulations, progress persistence, or public lesson copy beyond the placeholder starter page.
