// Static output and the browser read the same current rescue-guide facts.
// game.js returns before browser initialization when imported without a DOM.
import "./game.js";

export const GUIDE_COPY = globalThis.HabitatRescueGuideCopy;
