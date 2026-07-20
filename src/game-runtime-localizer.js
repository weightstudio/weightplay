(() => {
  const locale = window.WonderI18n?.actualLocale?.() || document.documentElement.lang || "en";
  const catalog = window.WeightPlayGameRuntimeLocales?.[locale];
  if (!catalog || !Object.keys(catalog).length) return;

  const exact = new Map(Object.entries(catalog));
  const resolved = new Map();
  const placeholderPattern = /\{[a-zA-Z0-9_]+\}/g;
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [];
  const longFragmentIndex = new Map();
  const fragmentIndex = new Map();
  const shortFragmentIndex = new Map();

  exact.forEach((translated, source) => {
    placeholderPattern.lastIndex = 0;
    const hasPlaceholder = placeholderPattern.test(source);
    placeholderPattern.lastIndex = 0;
    if (!hasPlaceholder) {
      if (translated !== source && source.length <= 180 && /[A-Za-z]{2}/u.test(source)) {
        const firstWord = source.match(/[A-Za-z][A-Za-z'-]*/u)?.[0];
        if (firstWord) {
          const index = source.length >= 24
            ? longFragmentIndex
            : (/\s/u.test(source) || source.length > 12 ? fragmentIndex : shortFragmentIndex);
          const entries = index.get(firstWord) || [];
          entries.push({ source, translated });
          index.set(firstWord, entries);
        }
      }
      return;
    }
    const names = [];
    let cursor = 0;
    let expression = "";
    for (const match of source.matchAll(placeholderPattern)) {
      expression += escapeRegExp(source.slice(cursor, match.index));
      // A dynamic value may contain spaces, but it must not consume a sibling
      // field from the middle-dot accessibility/HUD composite.
      expression += "([^·\\n]+?)";
      names.push(match[0]);
      cursor = match.index + match[0].length;
    }
    expression += escapeRegExp(source.slice(cursor));
    patterns.push({ regex: new RegExp(expression, "u"), translated, names, sourceLength: source.length });
  });
  patterns.sort((left, right) => right.sourceLength - left.sourceLength);
  longFragmentIndex.forEach((entries) => entries.sort((left, right) => right.source.length - left.source.length));
  fragmentIndex.forEach((entries) => entries.sort((left, right) => right.source.length - left.source.length));
  shortFragmentIndex.forEach((entries) => entries.sort((left, right) => right.source.length - left.source.length));

  function replaceFragments(value, index) {
    let output = value;
    const words = new Set(value.match(/[A-Za-z][A-Za-z'-]*/gu) || []);
    words.forEach((word) => {
      for (const fragment of index.get(word) || []) {
        if (!output.includes(fragment.source)) continue;
        output = output.replaceAll(fragment.source, fragment.translated);
      }
    });
    return output;
  }

  function translateCore(value) {
    if (typeof value !== "string" || !value) return value;
    if (resolved.has(value)) return resolved.get(value);
    const direct = exact.get(value);
    if (direct) {
      resolved.set(value, direct);
      return direct;
    }
    let outputValue = value;
    // Stage/Battle accessibility labels commonly join independently authored
    // fields with a middle dot. Translate exact field values (such as stage
    // names) before broader templates can alter one of their words.
    outputValue = outputValue.split(/(\s*·\s*)/u).map((part, index) => {
      if (index % 2) return part;
      const leading = part.match(/^\s*/u)?.[0] || "";
      const trailing = part.match(/\s*$/u)?.[0] || "";
      const core = part.slice(leading.length, part.length - trailing.length || undefined);
      return exact.has(core) ? `${leading}${exact.get(core)}${trailing}` : part;
    }).join("");
    // Translate complete sentences embedded in accessibility composites first.
    // Their full meaning is more specific than any numeric template or noun.
    outputValue = replaceFragments(outputValue, longFragmentIndex);
    // Resolve parameterized UI templates before translating their internal
    // fragments; otherwise a translated noun can prevent the full template
    // (for example a Result summary with numeric values) from matching.
    for (const pattern of patterns) {
      const match = outputValue.match(pattern.regex);
      if (!match) continue;
      let output = pattern.translated;
      pattern.names.forEach((name, index) => {
        output = output.replaceAll(name, match[index + 1]);
      });
      outputValue = outputValue.replace(match[0], output);
    }
    outputValue = replaceFragments(outputValue, fragmentIndex);
    outputValue = replaceFragments(outputValue, shortFragmentIndex);
    if (resolved.size > 2500) resolved.clear();
    resolved.set(value, outputValue);
    return outputValue;
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
    // Language names are self-identifying UI labels. Keep the owner-approved
    // spelling stable in every locale instead of translating the option text.
    if (node.parentElement.tagName === "OPTION" && node.parentElement.closest("select")) return;
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
