#!/usr/bin/env node
process.argv.splice(2,0,"film"),await import("../../scripts/test-windstep-circuit-browser.mjs?wp-media=26811efd72110c5c");
