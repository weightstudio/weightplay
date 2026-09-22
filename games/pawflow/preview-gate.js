// Preview remains an unlisted owner trial, never a public playable release.
(() => {
  if (new URLSearchParams(location.search).get('preview') === '1') return;
  const segment = location.pathname.match(/^\/([^/]+)\/games\//)?.[1] || 'en';
  location.replace(`/${segment}/`);
})();
