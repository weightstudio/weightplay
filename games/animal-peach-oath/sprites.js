(function () {
  "use strict";

  // Native-pixel windows and transparent-gap partitions for the original PNGs.
  // Weapon/tail extents cross adjacent bounding boxes: equal columns or plain
  // rectangular crops are not safe. Keep the original artwork bytes untouched.
  const atlases = {
    heroes: { width: 2043, height: 770, frames: {
      leo: { box: [5, 61, 462, 674], clip: "0,0 0,770 460,769 499,575 442,505 460,0" },
      tiger: { box: [454, 21, 450, 724], clip: "460,0 442,505 499,575 460,769 834,769 972.5,715 892,674 892,528 819,226 657,136 771,7 834,0" },
      bear: { box: [765, 1, 562, 731], clip: "834,0 771,7 657,136 819,226 892,528 892,674 972.5,715 834,769 1312.5,769 1278,597 1322,527 1339.5,395 1312.5,0" },
      crane: { box: [1299, 131, 379, 628], clip: "1312.5,0 1339.5,395 1322,527 1278,597 1312.5,769 1673.5,769 1673.5,0" },
      fox: { box: [1670, 139, 370, 606], clip: "1673.5,0 1673.5,769 2043,770 2043,0" },
    } },
    enemies: { width: 2066, height: 761, frames: {
      wolf: { box: [18, 225, 413, 509], clip: "0,0 0,761 365,760 477,570 313,158 312,155 311,152 309,145 307,136 306,130 306,129 306,128 306,127 306,126 306,125 306,124 306,123 306,122 306,121 306,120 306,119 306,118 306,117 306,116 306,115 306,114 306,113 306,112 306,111 306,110 307,103 308,98 309,95 311,90 312,88 365,0" },
      boar: { box: [300, 44, 527, 684], clip: "365,0 312,88 311,90 309,95 308,98 307,103 306,110 306,111 306,112 306,113 306,114 306,115 306,116 306,117 306,118 306,119 306,120 306,121 306,122 306,123 306,124 306,125 306,126 306,127 306,128 306,129 306,130 307,136 309,145 311,152 312,155 313,158 477,570 365,760 831,760 831,0" },
      hyena: { box: [836, 172, 386, 561], clip: "831,0 831,760 1212.5,760 1270,704 1189.5,597 1212.5,0" },
      cobra: { box: [1204, 102, 383, 613], clip: "1212.5,0 1189.5,597 1270,704 1212.5,760 1555,760 1616,600 1582.5,524 1573.5,290 1462,131 1555,0" },
      buffalo: { box: [1524, 9, 535, 733], clip: "1555,0 1462,131 1573.5,290 1582.5,524 1616,600 1555,760 2066,761 2066,0" },
    } },
  };

  function markup(side, id, instance) {
    if (side !== "hero" && side !== "enemy") throw new Error("Unknown Peach Oath side");
    const atlas = atlases[side === "hero" ? "heroes" : "enemies"];
    const frame = atlas.frames[id];
    if (!frame || !/^[a-zA-Z0-9-]+$/.test(instance)) throw new Error("Unknown Peach Oath sprite");
    const clipId = `peach-sprite-${instance}`;
    const sheet = side === "hero" ? "heroes" : "enemies";
    return `<svg class="sprite" data-sprite="${id}" viewBox="${frame.box.join(" ")}"
      preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <defs><clipPath id="${clipId}" clipPathUnits="userSpaceOnUse"><polygon points="${frame.clip}"/></clipPath></defs>
      <image href="assets/${sheet}.png" width="${atlas.width}" height="${atlas.height}" clip-path="url(#${clipId})"/>
    </svg>`;
  }

  window.PEACH_OATH_SPRITES = Object.freeze({ atlases, markup });
})();
