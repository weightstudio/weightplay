// Existing fire consumers use the same atlas and timeline as the other elements.
import { createThreeElementImpactLayer, loadElementImpactAtlas } from "./game-element-impact.mjs?v=world-hit-1&wp-media=a4d649c8383eff35";

export {
  createElementImpactQueue as createFireImpactQueue,
  drawElementImpact as drawFireImpact,
  elementImpactFrame as fireImpactFrame,
  playElementImpactOnCanvas as playFireImpactOnCanvas,
} from "./game-element-impact.mjs?v=world-hit-1&wp-media=a4d649c8383eff35";

export function loadFireImpactAtlas() {
  return loadElementImpactAtlas("fire");
}

export function createThreeFireImpactLayer(three, scene, limit = 10) {
  return createThreeElementImpactLayer(three, scene, "fire", limit);
}
