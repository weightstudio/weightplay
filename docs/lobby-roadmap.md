# Wonder Game Lobby Roadmap

## Current Direction

Wonder Game Lobby is the main website. Wonder Crash is now the first playable game inside the lobby, and future games should be added as separate entries instead of replacing the lobby.

## Website Structure

```txt
/
  index.html
  src/lobby-data.js
  src/lobby.js
  games/
    wonder-crash/
      index.html
```

## Game Card Rule

Add or update lobby games in `src/lobby-data.js`.

Each game should define:

- `id`
- `title`
- `status`: `playable` or `planned`
- `type`
- `ages`
- `ageLabel`
- `description`
- `meta`
- `art`
- `href` when playable

## Age Groups

- `3`: toddler and early child
- `6`: elementary child
- `9`: advanced elementary
- `12`: teen and challenge games
- `family`: parent-child games

## Next Website Updates

1. Add a game detail page template for planned games.
2. Add category filters besides age, such as action, puzzle, reaction, learning, and family.
3. Add image requests for each planned game after its MVP spec is chosen.
4. Add one new playable MVP game before expanding monetization.
5. Add privacy/contact/about pages before applying serious ad placement.

## PM Notes

Keep new games small. Every first version should have one core mechanic, one game screen, one result screen, mobile controls, and a fast restart.
