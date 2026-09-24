/* Dungeon Venture v31 source preservation + Interface 7 compatibility cleanup.
   The authored v31 runtime is kept byte-for-byte in game-v31-base.js.
   Parser-order loading preserves the original game bootstrap before later shared runtimes. */
document.write('<script src="game-v31-base.js?v=20260924-interface7-base"><\/script>');
document.write('<script src="interface-7-compat.js?v=20260924-interface7-cleanup"><\/script>');
