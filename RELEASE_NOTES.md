# Release Notes — v2.0.3

**Date:** 2026-03-14  
**Tag:** `v2.0.3`  
**Branch:** `main`

## Summary

This release carries forward the social modularization work into a clean release boundary. The remaining social data loaders and notification state now live in `social-core`, `app.js` is reduced to UI composition and wiring, the repo has a real ESLint gate in CI, and the smoke suite now covers social runtime route transitions and notification polling.

## v2.0.3 Follow-up

- Moved the remaining social loaders and notification state from `public/app.js` into `public/social-core.js`.
- Added a real `eslint`-backed lint script and extended the GitHub Actions build/test workflow to run lint and build verification.
- Added `tests/social-core.test.js` to cover profile/group route transitions and notification polling behavior.
- Updated application version surfaces to `2.0.3` and cut a clean release point after `RELEASE_NOTES.md` landed.

---

## Commits

### `5a8eae5` — Add notification smoke tests and defer frontend scripts
- Added `tests/social-notifications.test.js` covering filter logic, pagination (load-more button), and route metadata rendering.
- Added `defer` attribute to all 8 `<script>` tags in `public/index.html` for parser-non-blocking script loading.

### `13b8a2d` — Add social route smoke tests and top-nav aria-current sync
- Added `tests/social-routes.test.js` covering hash route parsing, group ID fallback, and hash normalization.
- Added `aria-current="page"` to the active `.nav-tab` in `syncTopNav()` for accessibility compliance.

### `23e313f` — Ignore local runtime artifacts and state files
- Added `artifacts/`, `cache/`, `transactions.json`, and `wallets.json` to `.gitignore`.

### `5c0e018` — Centralize social hashchange wiring in social-core
- Removed `hashchange` listener from `social-events.js`.
- Moved it into `initializeSocialExperience()` in `social-core.js` as the single registration point.
- Removed `handleSocialRoute` and `syncTopNav` from the `social-events` context binding.

### `e777315` — Move social board rendering into module helpers
- Added `renderFriendsBoardHtml`, `renderGroupsListHtml`, `renderGroupOptionsHtml` to `social-ui.js`.
- Added DOM-level `renderNotificationBoard()` to `social-notifications.js`.
- `app.js` now delegates all board rendering to these module helpers.

### `4822f19` — Move social route and timeline runtime into social-core
- Migrated route parsing, view switching, profile/group timeline rendering, and startup orchestration into `public/social-core.js`.
- Introduced `createSocialRuntime()` factory to replace inline initialization in `app.js`.
- Removed ~195 lines from `app.js`.

---

## Testing

| Suite | Tests | Status |
|---|---|---|
| `tests/api.test.js` | 4 | ✅ Pass |
| `tests/social-api.test.js` | 7 | ✅ Pass |
| `tests/frontend-regressions.test.js` | 3 | ✅ Pass |
| `tests/social-routes.test.js` | 3 | ✅ Pass |
| `tests/social-notifications.test.js` | 3 | ✅ Pass |
| **Total** | **17** | **✅ All green** |

---

## Module Ownership After This Release

| File | Responsibility |
|---|---|
| `public/social-core.js` | Route dispatch, view switching, timeline rendering, hashchange lifecycle, startup |
| `public/social-events.js` | User interaction DOM event bindings |
| `public/social-ui.js` | Pure HTML-string renderers (stories, suggestions, feeds, boards, groups) |
| `public/social-notifications.js` | Notification HTML generation and DOM writing |
| `public/app.js` | Top-level wiring only — delegates to all modules above |
