(function () {
  const config = window.WONDER_SITE?.localization || {};
  const localeKey = "weightPlayLocale";
  const fallbackLocale = config.fallbackLocale || "en";
  const supportedLocales = config.phaseOneLocales || ["en", "zh-Hant"];

  const dictionaries = {
    en: {
      "site.kicker": "Kids & Family Games",
      "site.featured": "Featured",
      "filter.all_ages": "All Ages",
      "filter.family": "Family",
      "filter.all_topics": "All Topics",
      "section.hero_rank": "Top 3",
      "section.hero_games": "Hero Games",
      "stats.playable": "Playable",
      "stats.hero_games": "Hero Games",
      "stats.animal_games": "Animal Games",
      "stats.age_groups": "Age Groups",
      "status.all_games": "All games",
      "status.no_games": "No games match this filter yet.",
      "status.games_found_one": "1 game found",
      "status.games_found_many": "{count} games found",
      "action.play": "Play",
      "action.coming_soon": "Coming Soon",
      "toast.coming_soon": "{title} is coming soon",
      "language.label": "Language",
      "topic.featured": "Featured",
      "topic.animal": "Animal Games",
      "topic.puzzle": "Puzzle",
      "topic.arcade": "Arcade",
      "topic.education": "Education",
    },
    "zh-Hant": {
      "site.kicker": "兒童與親子遊戲",
      "site.featured": "主打遊戲",
      "filter.all_ages": "全部年齡",
      "filter.family": "親子",
      "filter.all_topics": "全部主題",
      "section.hero_rank": "前三名",
      "section.hero_games": "Hero Games",
      "stats.playable": "可玩遊戲",
      "stats.hero_games": "Hero Games",
      "stats.animal_games": "動物遊戲",
      "stats.age_groups": "年齡分類",
      "status.all_games": "全部遊戲",
      "status.no_games": "目前沒有符合這個篩選的遊戲。",
      "status.games_found_one": "找到 1 款遊戲",
      "status.games_found_many": "找到 {count} 款遊戲",
      "action.play": "開始玩",
      "action.coming_soon": "即將推出",
      "toast.coming_soon": "{title} 還在準備中",
      "language.label": "語言",
      "topic.featured": "主打",
      "topic.animal": "動物遊戲",
      "topic.puzzle": "益智",
      "topic.arcade": "街機",
      "topic.education": "教育",
    },
  };

  function getSavedLocale() {
    try {
      const saved = localStorage.getItem(localeKey);
      if (saved && supportedLocales.includes(saved)) return saved;
    } catch {
      // Locale storage is optional.
    }
    return config.defaultLocale || fallbackLocale;
  }

  let currentLocale = getSavedLocale();

  function interpolate(value, params) {
    return Object.entries(params || {}).reduce((text, [key, replacement]) => {
      return text.replaceAll(`{${key}}`, String(replacement));
    }, value);
  }

  function t(key, params) {
    const dictionary = dictionaries[currentLocale] || dictionaries[fallbackLocale] || {};
    const fallback = dictionaries[fallbackLocale] || {};
    return interpolate(dictionary[key] || fallback[key] || key, params);
  }

  function getLocalized(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return value;
    return value[currentLocale] || value[fallbackLocale] || Object.values(value)[0] || "";
  }

  function setLocale(locale) {
    if (!supportedLocales.includes(locale)) return;
    currentLocale = locale;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(localeKey, locale);
    } catch {
      // Locale storage is optional.
    }
    window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail: { locale } }));
    window.WonderAnalytics?.track("locale_change", { locale });
  }

  function locale() {
    return currentLocale;
  }

  document.documentElement.lang = currentLocale;

  window.WonderI18n = {
    t,
    getLocalized,
    locale,
    setLocale,
    supportedLocales,
    fallbackLocale,
  };
})();
