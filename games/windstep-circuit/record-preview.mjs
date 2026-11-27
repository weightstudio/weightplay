#!/usr/bin/env node
process.argv.splice(2,0,"film"),await import("../../scripts/test-windstep-circuit-browser.mjs?wp-media=f2e6f208e6c2c8f1");
