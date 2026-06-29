# Automation: 06 Improve Lobby

## Mission

Improve the Wonder Game Lobby as a website and game discovery surface.

## Decision Order

1. Check analytics if available.
2. If age filters are used heavily, improve age/category browsing.
3. If game cards are clicked but not started, improve game card clarity or game landing flow.
4. If planned game clicks are high, move that game up in `docs/game-production-queue.md`.
5. If monetization is planned, prioritize trust pages and clean ad-safe layout.

## Required Checks

- Read `docs/project-manager-rules.md`.
- Read `docs/lobby-roadmap.md`.
- Read `docs/analytics-and-sound.md`.
- Read `src/lobby-data.js`.
- Inspect `index.html`, `src/lobby.js`, and `src/styles.css`.

## Valid Work

- Add category filters.
- Add search.
- Add recently updated or popular sections.
- Improve game cards.
- Add game detail pages for planned games.
- Add about/privacy/contact pages.
- Improve mobile layout.
- Improve analytics for lobby interactions.

## Completion Criteria

- Lobby remains mobile-friendly.
- Existing playable games are still reachable.
- New lobby features do not require player login.
- `publish` is synced and pushed.

## Current Lobby Priorities

1. Add category filters beyond age.
2. Add popular/recently updated sections.
3. Add about/privacy/contact pages before serious ad placement.
