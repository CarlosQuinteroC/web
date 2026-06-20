# Testing and QA

Use this checklist before merging each Ojo al Fraude public platform slice.

## Quick path

Run from `web/`:

```powershell
npm run check
npm test
npm run build
```

Expected result:

- Astro check reports `0 errors`, `0 warnings`, and `0 hints`.
- Vitest passes all test files.
- Astro build completes and generates the static learning routes.

## What each command proves

| Command | Proves |
|---|---|
| `npm run check` | Astro, TypeScript, content collections, and MDX frontmatter are valid. |
| `npm test` | Unit-level behavior is still correct, especially local anonymous progress. |
| `npm run build` | Static pages and React islands can be built for production. |

## Manual QA checklist

Use a local preview after a successful build:

```powershell
npm run preview
```

Then verify:

- [ ] `/learn/` lists both learning tracks.
- [ ] `/learn/digital-confidence/` lists the first digital confidence lesson.
- [ ] `/learn/common-frauds/` lists the first common frauds lesson.
- [ ] `/learn/common-frauds/message-urgency-check/` shows the message-pressure simulation.
- [ ] The simulation uses calm feedback and no timers, scores, rankings, or punitive language.
- [ ] The lesson completion checkpoint stores progress on the current device only.
- [ ] The progress summary can delete/reset progress from the current device.

## Accessibility spot checks

Before merge, check at least:

- [ ] Keyboard navigation reaches links, radio options, and buttons in a logical order.
- [ ] Focus indicators are visible in light and dark modes.
- [ ] The message simulation uses a `fieldset` and `legend` for radio options.
- [ ] Feedback from the simulation is announced with `role="status"`.
- [ ] Touch targets are comfortable on a 375px-wide viewport.
- [ ] Content remains readable with reduced motion enabled.

## Privacy and safety checks

- [ ] No lesson or simulation asks for real passwords, verification codes, documents, or bank data.
- [ ] No pasted message content is sent to a server.
- [ ] Progress data stays local and anonymous.
- [ ] Reset/delete controls are visible and clear.

## Known tooling note

`gga run` currently finds staged files and `AGENTS.md`, but the configured `opencode` provider can fail on this machine with a local database migration error for `session_message`. If that happens, do not treat it as a code failure. Preserve the staged changes and rely on the commands above plus a fresh diff review until the local OpenCode database is repaired.
