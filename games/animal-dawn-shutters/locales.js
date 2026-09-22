(() => {
  'use strict';
  const source = document.currentScript?.src || location.href;
  const base = new URL('./locales-v5-base.js?v=20260922-interface7-review-2', source).href;
  const canonical = new URL('./interface-copy-v7.js?v=20260922-interface7-review-2', source).href;
  /* This file is parser-loaded before game.js. document.write keeps the preserved
     locale catalog and the canonical interface-label patch synchronous, so Main
     and Stage never paint with the retired labels. */
  document.write(`<script src="${base}"><\/script><script src="${canonical}"><\/script>`);
})();
