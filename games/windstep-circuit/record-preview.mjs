#!/usr/bin/env node
process.argv.splice(2,0,"film"),await import("../../scripts/test-windstep-circuit-browser.mjs?wp-media=ad4f5b7b56e6920a");
