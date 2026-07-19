/* Japanese card copy. This augments the shared lobby data instead of duplicating a lobby or game implementation. */
(() => {
  if (!window.WONDER_LOBBY) return;
  const titles = {
    "wonder-crash":"ファンタジー・ライオン防衛","color-lunchbox":"どうぶつ色べんとう","bubble-bakery":"どうぶつバブルベーカリー","animal-rope-rescue":"どうぶつつるロープ救出","animal-zoo-idle":"どうぶつ動物園おせわ","star-memory":"どうぶつ星空メモリー","campus-dash":"キャンパス・サファリダッシュ","snack-blocks":"おやつブロック","fruit-merge":"フルーツ合体どうぶつ園","garden-tiles":"ガーデンタイル","animal-rescue":"どうぶつ救出ルート","animal-bubble-safari":"どうぶつバブルサファリ","animal-habitat-mahjong":"どうぶつ生息地麻雀","animal-hidden-safari":"どうぶつかくれんぼサファリ","animal-guard-yard":"どうぶつガードヤード","animal-crystal-survivor":"どうぶつクリスタルサバイバー","animal-quiz":"どうぶつクイズ","zoo-helper-day":"動物園ヘルパーの日","shape-train":"かたちトレイン","tiny-weather-rescue":"小さな天気レスキュー","beast-deck":"ビーストデッキ","animal-relic-hunters":"どうぶつレリックハンター","animal-rune-tactics":"どうぶつルーン戦術","animal-orb-fortress":"星珠要塞","animal-auto-squad":"どうぶつオート分隊","beast-tactician":"ビースト戦術家","animal-reef-fisher":"どうぶつリーフフィッシャー","animal-cafe-rush":"どうぶつカフェラッシュ","animal-hero-trials":"どうぶつ英雄試練","animal-gearpack-expedition":"どうぶつ行嚢遠征","shadow-wolf":"シャドウウルフ伝説","animal-moonlight-heist":"どうぶつ月夜の潜入","animal-skyport-dispatch":"どうぶつスカイポート・ディスパッチ","animal-abyss-diver":"どうぶつ深海ダイバー","animal-coloring-studio":"どうぶつぬりえスタジオ","animal-word-trails":"どうぶつことばの小道","animal-one-line":"One Line 一筆描き"
  };
  window.WONDER_LOBBY.platform.tagline.ja = "あらゆる年齢のためのオリジナルどうぶつゲーム。";
  window.WONDER_LOBBY.platform.subtitle.ja = "子ども、家族、カジュアルプレイヤーのために育つ、どうぶつブラウザゲームの世界。";
  const animal2048 = window.WONDER_LOBBY.games.find((game) => game.id === "animal-2048");
  if (animal2048) {
    animal2048.title.ja = "アニマル2048：森の進化";
    animal2048.statusText.ja = "今すぐ遊ぶ";
    animal2048.type.ja = "全盤スライド合成戦略";
    animal2048.description.ja = "盤面全体を動かして同じ動物を合成し、30ミッションと無限の森に挑戦します。";
    animal2048.meta.ja = ["30ミッション", "グリッド戦略", "無限の森"];
  }
  window.WONDER_LOBBY.games.forEach((game) => {
    const title = titles[game.id];
    if (!title) return;
    game.title.ja = title;
    game.statusText.ja = game.status === "playable" ? "今すぐ遊ぶ" : "近日公開";
    game.type.ja = "どうぶつゲーム";
    game.description.ja = `${title}を遊ぼう。画面の手がかりを読み、自分の選択で次の挑戦へ進むWeightPlayオリジナルゲームです。`;
    game.meta.ja = ["オリジナル作品", "タッチ対応", "ブラウザで遊べる"];
  });
})();
