/* Localized authored data for the common Interface 9 Stage selector. */
window.MagnetMeadowStageConfig = ({ rounds, unlocked, completed, copy, roundTitle, roundHint, mechanicLabel }) => ({
  gameId: 'animal-magnet-meadow',
  count: rounds.length,
  poster: '/games/animal-magnet-meadow/assets/animal-magnet-meadow-cover-v1.png',
  stage(index) {
    const round = rounds[index];
    const locked = !unlocked(index);
    const cleared = completed(index);
    const title = roundTitle(index);
    const hint = roundHint(index);
    return {
      id: index + 1,
      kicker: copy('arc', { number: round.arc }),
      title: copy('round', { number: index + 1, total: rounds.length }),
      subtitle: title,
      status: locked ? '—' : cleared ? copy('completed') : copy('readyStage'),
      summary: hint,
      details: [hint, mechanicLabel(round)],
      locked,
      cleared,
      poster: '/games/animal-magnet-meadow/assets/animal-magnet-meadow-cover-v1.png',
      posterPosition: 'center',
    };
  },
});
