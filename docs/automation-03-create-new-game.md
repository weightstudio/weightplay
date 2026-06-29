# Automation: 03 Create New Game

## Mission

Create the next playable MVP from the production queue.

## Decision Order

1. Read `docs/game-production-queue.md`.
2. Build the first `queued` game by priority.
3. If no queued game exists, create three small game concepts and add the best one as `queued`.
4. Prefer games that fill missing age groups or categories.

## Required Checks

- Read `docs/project-manager-rules.md`.
- Read `docs/design-notes.md`.
- Read `docs/analytics-and-sound.md`.
- Read `src/lobby-data.js`.

## New Game Requirements

- Create under `games/<game-id>/`.
- Include `index.html`, `game.js`, and `style.css`.
- Include a loading screen.
- Use mobile-first controls.
- Add sound support using `src/sound.js`.
- Add analytics using `src/analytics.js`.
- Add level/progression mode unless it is score-attack.
- If score-attack, include local leaderboard.
- Update `src/lobby-data.js` when playable.
- Update `docs/game-production-queue.md`.

## Completion Criteria

- The new game is playable from the lobby.
- The game has loading, start, completion, restart, and result flow.
- The lobby card is accurate.
- `publish` is synced and pushed.

## Current Next Game

Build `star-memory` / `星星翻翻牌` next unless analytics strongly suggest otherwise.
