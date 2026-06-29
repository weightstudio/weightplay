# Automation: 00 Update Existing Games

## Mission

Improve one existing playable game based on recent player demand and missing retention features.

## Decision Order

1. Check analytics if available.
2. Prefer the game with highest meaningful demand:
   - `game_start`
   - `game_complete`
   - `game_restart`
   - `game_open`
3. If analytics are unavailable, inspect existing games and choose the game with the strongest missing production feature.
4. If everything is similar, choose the least recently updated playable game.

## Required Checks

- Read `docs/project-manager-rules.md`.
- Read `docs/game-production-queue.md`.
- Read `docs/design-notes.md`.
- Read `docs/analytics-and-sound.md`.
- Inspect the selected game's files before editing.

## Valid Work

- Add new levels/stages.
- Add new items, skills, enemies, obstacles, or wave patterns.
- Add or improve progression.
- Add local leaderboard for score-attack games.
- Improve result screen.
- Improve analytics events.
- Improve mobile controls or loading.

## Completion Criteria

- The selected game still loads.
- New or updated gameplay is reachable.
- Analytics events are updated if the feature needs them.
- `publish` is synced and pushed.

## Current Product Note

`color-lunchbox` should receive level mode soon because it is currently a simple one-round activity and is not primarily a score-attack game.
