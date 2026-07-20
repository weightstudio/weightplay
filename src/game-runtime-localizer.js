(() => {
  const locale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  const catalog = window.WeightPlayGameRuntimeLocales?.[locale];
  if (!catalog || !Object.keys(catalog).length) return;

  const exact = new Map(Object.entries(catalog));
  const placeholderPattern = /\{[a-zA-Z0-9_]+\}/g;
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [];

  exact.forEach((translated, source) => {
    if (!placeholderPattern.test(source)) return;
    placeholderPattern.lastIndex = 0;
    const names = [];
    let cursor = 0;
    let expression = "^";
    for (const match of source.matchAll(placeholderPattern)) {
      expression += escapeRegExp(source.slice(cursor, match.index));
      expression += "(.+?)";
      names.push(match[0]);
      cursor = match.index + match[0].length;
    }
    expression += `${escapeRegExp(source.slice(cursor))}$`;
    patterns.push({ regex: new RegExp(expression, "u"), translated, names });
  });

  function translateCore(value) {
    if (typeof value !== "string" || !value) return value;
    const direct = exact.get(value);
    if (direct) return direct;
    for (const pattern of patterns) {
      const match = value.match(pattern.regex);
      if (!match) continue;
      let output = pattern.translated;
      pattern.names.forEach((name, index) => {
        output = output.replaceAll(name, match[index + 1]);
      });
      return output;
    }
    return value;
  }

  function translate(value) {
    if (typeof value !== "string" || !value.trim()) return value;
    const leading = value.match(/^\s*/u)?.[0] || "";
    const trailing = value.match(/\s*$/u)?.[0] || "";
    const core = value.slice(leading.length, value.length - trailing.length || undefined);
    return `${leading}${translateCore(core)}${trailing}`;
  }

  const translatedNodes = new WeakMap();
  const translatedAttributes = new WeakMap();
  const attributes = ["aria-label", "aria-description", "title", "placeholder", "alt"];

  function translateTextNode(node) {
    if (!node?.parentElement || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentElement.tagName)) return;
    const next = translate(node.data);
    if (next === node.data) return;
    translatedNodes.set(node, node.data);
    node.data = next;
  }

  function translateElement(element) {
    if (!(element instanceof Element)) return;
    let records = translatedAttributes.get(element);
    attributes.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const current = element.getAttribute(name) || "";
      const next = translate(current);
      if (next === current) return;
      records ||= new Map();
      records.set(name, current);
      element.setAttribute(name, next);
    });
    if (records) translatedAttributes.set(element, records);
    if (element instanceof HTMLInputElement && ["button", "submit", "reset"].includes(element.type)) {
      const next = translate(element.value);
      if (next !== element.value) element.value = next;
    }
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) translateTextNode(root);
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateElement(node);
    }
  }

  const canvas = window.CanvasRenderingContext2D?.prototype;
  if (canvas && !canvas.__weightPlayRuntimeLocale) {
    ["fillText", "strokeText", "measureText"].forEach((method) => {
      const original = canvas[method];
      if (typeof original !== "function") return;
      canvas[method] = function (value, ...args) {
        return original.call(this, translate(String(value)), ...args);
      };
    });
    Object.defineProperty(canvas, "__weightPlayRuntimeLocale", { value: locale });
  }

  const start = () => {
    translateTree(document.documentElement);
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "characterData") translateTextNode(record.target);
        else if (record.type === "attributes") translateElement(record.target);
        else record.addedNodes.forEach(translateTree);
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: attributes,
      childList: true,
      characterData: true,
      subtree: true,
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
  window.WeightPlayGameRuntimeLocalizer = Object.freeze({ locale, translate, translateTree });
})();
