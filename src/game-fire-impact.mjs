// Existing fire consumers use the same atlas and timeline as the other elements.
import { createThreeElementImpactLayer, loadElementImpactAtlas } from "./game-element-impact.mjs?wp-media=578d0c578a630f95";

export {
  createElementImpactQueue as createFireImpactQueue,
  drawElementImpact as drawFireImpact,
  elementImpactFrame as fireImpactFrame,
  playElementImpactOnCanvas as playFireImpactOnCanvas,
} from "./game-element-impact.mjs?wp-media=578d0c578a630f95";

export function loadFireImpactAtlas() {
  return loadElementImpactAtlas("fire");
}

export function createThreeFireImpactLayer(three, scene, limit = 10) {
  return createThreeElementImpactLayer(three, scene, "fire", limit);
}
