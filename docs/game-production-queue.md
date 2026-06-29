# Game Production Queue

## Queue Rules

- `queued`: ready to build.
- `planned`: concept exists but not ready to build.
- `playable`: already released.
- `prototype`: playable experiment but not production-ready.
- `blocked`: missing decision, image, or technical dependency.

When a queued game is built:

1. Create it under `games/<game-id>/`.
2. Add loading screen.
3. Add sound support.
4. Add analytics events.
5. Add progression mode or leaderboard-ready score mode.
6. Update `src/lobby-data.js`.
7. Update this queue status to `playable`.

## Current Queue

| Priority | Status | Game ID | Game Name | Age | Type | Required Structure | Notes |
|---|---|---|---|---|---|---|---|
| P0 | queued | star-memory | 星星翻翻牌 | 6+, family | Memory puzzle | Level mode | Add stages with increasing card counts. |
| P1 | queued | campus-dash | 校園閃電跑 | 9+, 12+ | Reaction runner | Score attack + leaderboard | Local leaderboard MVP is acceptable. |
| P1 | planned | animal-quiz | 動物小博士 | 3+, 6+, family | Parent-child quiz | Level mode | Needs animal image/audio plan. |
| P2 | planned | snack-blocks | 點心方塊 | 12+, family | Casual puzzle | Score attack + leaderboard | Better after leaderboard UI exists. |

## Released Games

| Game ID | Game Name | Status | Current Need |
|---|---|---|---|
| wonder-crash | Wonder Crash | playable | Continue adding levels, weapons, enemies, and boss variety based on play demand. |
| color-lunchbox | 顏色便當盒 | playable | Add level mode because it is not score-attack focused. |

## Concept Backlog

Add new ideas here when the queue is empty or when analytics show a missing age/category.
