const MAX_CANVAS_WIDTH = 920;
const MIN_CANVAS_WIDTH = 390;
const PORTRAIT_MIN_CANVAS_HEIGHT = 780;
const LANDSCAPE_MIN_CANVAS_HEIGHT = 310;
const SHORT_LANDSCAPE_MAX_HEIGHT = 500;

export function getCanvasFit(viewportWidth, viewportHeight) {
  const fullWidth = Number.isFinite(viewportWidth) && viewportWidth > 0
    ? viewportWidth
    : MIN_CANVAS_WIDTH;
  const availableHeight = Number.isFinite(viewportHeight) && viewportHeight > 0
    ? viewportHeight
    : PORTRAIT_MIN_CANVAS_HEIGHT;
  const availableWidth = Math.min(MAX_CANVAS_WIDTH, fullWidth);
  const shortLandscape = fullWidth > availableHeight && availableHeight <= SHORT_LANDSCAPE_MAX_HEIGHT;
  const minimumLogicalHeight = shortLandscape
    ? LANDSCAPE_MIN_CANVAS_HEIGHT
    : PORTRAIT_MIN_CANVAS_HEIGHT;
  const scale = Math.min(availableWidth / MIN_CANVAS_WIDTH, availableHeight / minimumLogicalHeight);

  return {
    availableWidth,
    availableHeight,
    logicalWidth: availableWidth / scale,
    logicalHeight: availableHeight / scale,
    scale,
    shortLandscape,
  };
}
