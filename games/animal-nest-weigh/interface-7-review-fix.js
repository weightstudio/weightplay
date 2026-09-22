(() => {
  "use strict";

  const dialog = document.querySelector(".wp-nest-leave-dialog");
  const title = document.getElementById("wp-nest-leave-title");
  const battleHeading = document.getElementById("battleHeading");
  const languageSelect = document.getElementById("languageSelect");
  if (!dialog || !title) return;

  const syncRouteName = () => {
    if (dialog.hidden) return;
    const route = battleHeading?.textContent?.trim();
    const current = title.textContent.trim();
    if (!route || !current) return;
    const separator = " · ";
    const baseTitle = current.startsWith(`${route}${separator}`)
      ? current.slice(route.length + separator.length)
      : current;
    title.textContent = `${route}${separator}${baseTitle}`;
  };

  new MutationObserver(syncRouteName).observe(dialog, {
    attributes: true,
    attributeFilter: ["hidden"],
  });

  languageSelect?.addEventListener("change", () => {
    // The compatibility layer rewrites localized modal copy first; then add the
    // current localized round label so the leave consequence names its route.
    setTimeout(syncRouteName, 0);
  });

  syncRouteName();
})();
