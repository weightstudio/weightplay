(() => {
  "use strict";

  if (window.__weightPlayPrismInterfaceCleanup === 1) return;
  window.__weightPlayPrismInterfaceCleanup = 1;

  const style = document.createElement("style");
  style.id = "wp-prism-interface7-cleanup";
  style.textContent = `
/* Bounded legacy Interface 6 cleanup. This does not replace the shared frame,
   reparent scene nodes, or claim Interface 7 migration/acceptance. */
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .active-screen {
  grid-template-rows:minmax(0,1fr) var(--wp-ad-reserve-height,0px)!important;
}

html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .main-header.wp-main-shell-header {
  grid-template-columns:58px minmax(0,1fr) 48px!important;
  gap:8px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .main-header.wp-main-shell-header > #lobbyReturn {
  grid-column:1!important;
  width:58px!important;
  min-width:58px!important;
  height:48px!important;
  min-height:48px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .main-header.wp-main-shell-header > #soundToggle,
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .main-header.wp-main-shell-header > .locale-control {
  display:none!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .main-header.wp-main-shell-header > :is(strong,.wp-shell-main-title,.wp-generated-main-title) {
  grid-column:2!important;
  min-width:0!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] .main-header.wp-main-shell-header > .wp-shell-settings {
  grid-column:3!important;
}

html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-canvas {
  grid-template-columns:minmax(0,1fr)!important;
  grid-template-rows:48px minmax(0,1fr) 56px!important;
  gap:8px!important;
  padding:0 8px 8px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-header {
  grid-column:1!important;
  grid-row:1!important;
  grid-template-columns:48px minmax(0,1fr) 48px!important;
  align-items:center!important;
  width:100%!important;
  height:48px!important;
  min-height:48px!important;
  margin:0!important;
  padding:0 4px!important;
  gap:8px!important;
  border:0!important;
  border-radius:var(--wp-ui-radius,3px)!important;
  background:var(--wp-ui-header-image,#0b202b)!important;
  box-shadow:none!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-header > [data-wp-return="stage"] {
  grid-column:1!important;
  width:48px!important;
  min-width:48px!important;
  height:48px!important;
  min-height:48px!important;
  margin:0!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-header > div {
  grid-column:2!important;
  min-width:0!important;
  display:grid!important;
  place-items:center!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-header > div > strong,
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-header > img {
  display:none!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage #stageProgress {
  display:block!important;
  width:auto!important;
  min-width:0!important;
  max-width:100%!important;
  margin:0!important;
  padding:0 6px!important;
  color:var(--wp-ui-text,#f8fafc)!important;
  font:800 14px/1.2 system-ui,sans-serif!important;
  text-align:center!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-header > .wp-shell-settings {
  grid-column:3!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage > .stage-canvas > :is(#missionsTab,#labTab) {
  grid-column:1!important;
  grid-row:2!important;
  width:100%!important;
  height:100%!important;
  min-width:0!important;
  min-height:0!important;
  overflow:hidden!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage > .stage-canvas > #labTab:not([hidden]) {
  overflow:auto!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-tabs {
  grid-column:1!important;
  grid-row:3!important;
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  align-items:center!important;
  gap:8px!important;
  width:100%!important;
  height:56px!important;
  min-height:56px!important;
  margin:0!important;
  padding:6px!important;
  border:0!important;
  border-top:1px solid var(--wp-ui-line,rgba(255,255,255,.16))!important;
  border-radius:0!important;
  background:var(--wp-ui-surface,rgba(15,29,49,.92))!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-tabs > button {
  box-sizing:border-box!important;
  height:44px!important;
  min-height:44px!important;
  margin:0!important;
  padding:0 10px!important;
  border-radius:var(--wp-ui-radius,3px)!important;
  font:700 14px/1.2 system-ui,sans-serif!important;
  white-space:nowrap!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-tabs > button[data-tab="missions"] {
  grid-column:2!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #stage .stage-tabs > button[data-tab="lab"] {
  grid-column:3!important;
}

html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-live {
  grid-template-rows:48px 32px minmax(0,1fr) 24px!important;
  gap:4px!important;
  padding:4px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-header {
  grid-template-columns:48px minmax(0,1fr) 48px!important;
  align-items:center!important;
  width:100%!important;
  height:48px!important;
  min-height:48px!important;
  margin:0!important;
  padding:0!important;
  gap:4px!important;
  border:0!important;
  border-radius:var(--wp-ui-radius,3px)!important;
  background:var(--wp-ui-header-image,#0b202b)!important;
  box-shadow:none!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-header > button {
  width:48px!important;
  min-width:48px!important;
  height:48px!important;
  min-height:48px!important;
  margin:0!important;
  border-radius:var(--wp-ui-radius,3px)!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-header-center {
  grid-column:2!important;
  min-width:0!important;
  width:100%!important;
  height:100%!important;
  grid-template-columns:minmax(0,1fr) minmax(112px,30%)!important;
  gap:4px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle #battleHelp {
  grid-column:3!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .mission-block {
  min-width:0!important;
  gap:1px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .mission-block small {
  font:700 10px/1.1 system-ui,sans-serif!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .mission-block strong {
  font:800 14px/1.1 system-ui,sans-serif!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-status {
  gap:3px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-status span {
  min-width:0!important;
  padding:1px!important;
  border-radius:var(--wp-ui-radius,3px)!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-status b {
  font-size:9px!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .battle-status strong {
  font-size:12px!important;
  line-height:1.1!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .objective-row {
  min-height:32px!important;
  padding:4px 8px!important;
  border-radius:var(--wp-ui-radius,3px)!important;
}
html[data-wp-shared-interface="7"] body[data-game-id="animal-prism-battalion"] #battle .feedback {
  min-height:24px!important;
  padding:2px 6px!important;
  border-radius:var(--wp-ui-radius,3px)!important;
}
`;
  document.head.append(style);
})();
