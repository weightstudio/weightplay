/* Source rectangles for the EXISTING 1448x1086 WebP. No replacement artwork.
 * Its painted dividers are x=358/722/1114 and y=364/726, not an equal grid.
 * Square, gutter-free windows preserve aspect ratio; the lantern window is
 * top-aligned to retain its handle. Scene IDs match locales.js and cards.js.
 */
(function (root) {
  'use strict';
  const width = 1448, height = 1086;
  const rects = [
    [1, 4, 355, 355], [361, 2, 359, 359], [738, 1, 361, 361], [1117, 16, 330, 330],
    [1, 368, 355, 355], [362, 367, 357, 357], [740, 367, 357, 357], [1117, 367, 330, 330],
    [1, 730, 355, 355], [363, 730, 355, 355], [741, 730, 355, 355], [1117, 742, 330, 330],
  ].map(Object.freeze);
  function styleFor(index) {
    if (!Number.isInteger(index) || !rects[index]) throw new RangeError('Unknown postcard scene');
    const [x, y, w, h] = rects[index];
    // Percentage positions use the remaining image/element extent.
    return {
      backgroundSize: `${width / w * 100}% ${height / h * 100}%`,
      backgroundPosition: `${x / (width - w) * 100}% ${y / (height - h) * 100}%`,
    };
  }
  function apply(node, index) {
    Object.assign(node.style, styleFor(index));
    node.dataset.sceneId = String(index);
  }
  const atlas = Object.freeze({width, height, rects:Object.freeze(rects), styleFor, apply});
  root.PostcardCropAtlas = atlas;
  if (typeof module !== 'undefined' && module.exports) module.exports = atlas;
})(typeof window !== 'undefined' ? window : globalThis);
