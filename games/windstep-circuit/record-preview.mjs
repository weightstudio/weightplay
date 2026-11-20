#!/usr/bin/env node
process.argv.splice(2,0,"film"),await import("../../scripts/test-windstep-circuit-browser.mjs?wp-media=de92c88e8434cc53");
