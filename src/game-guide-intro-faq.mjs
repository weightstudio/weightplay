// Questions are shared copy; every answer comes from the game's own current
// localized introduction. No gameplay, storage or progress is changed.
export const INTRO_FAQ_LABELS = {
  en: ['FAQ', 'What will I do in this game?'],
  'zh-Hant': ['常見問題', '這款遊戲要做什麼？'],
  'zh-Hans': ['常见问题', '这款游戏要做什么？'],
  ja: ['よくある質問', 'このゲームでは何をしますか？'],
  ko: ['자주 묻는 질문', '이 게임에서는 무엇을 하나요?'],
  es: ['Preguntas frecuentes', '¿Qué haré en este juego?'],
  'pt-BR': ['Perguntas frequentes', 'O que farei neste jogo?'],
  fr: ['Questions fréquentes', 'Que vais-je faire dans ce jeu ?'],
  de: ['Häufige Fragen', 'Was mache ich in diesem Spiel?'],
  it: ['Domande frequenti', 'Che cosa farò in questo gioco?'],
  ru: ['Частые вопросы', 'Что я буду делать в этой игре?'],
  hi: ['अक्सर पूछे जाने वाले प्रश्न', 'इस खेल में मुझे क्या करना होगा?'],
  ar: ['الأسئلة الشائعة', 'ماذا سأفعل في هذه اللعبة؟'],
};

const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function appendStaticIntroFaq(guide, locale) {
  if (/<dl\b[^>]*>[\s\S]*?<dt\b/i.test(guide)) return guide;
  const answer = guide.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  const closing = guide.match(/<\/(?:section|details)>\s*$/i)?.[0], labels = INTRO_FAQ_LABELS[locale];
  if (!answer?.replace(/<[^>]*>/g,'').trim() || !closing || !labels) throw new Error('AUTHORED_INTRO_FAQ_SOURCE_MISSING');
  const marked = guide.replace(/<p\b([^>]*)>/i, (all, attributes) => attributes.includes('data-wp-intro-faq-source') ? all : `<p${attributes} data-wp-intro-faq-source>`);
  const faq = `<article class="game-info-section" data-wp-intro-faq><h3>${escape(labels[0])}</h3><dl><dt>${escape(labels[1])}</dt><dd>${answer.replace(/\s+id=["'][^"']*["']/gi,'')}</dd></dl></article>`;
  return marked.slice(0,-closing.length) + faq + closing;
}

export function installIntroFaq(doc = document) {
  const guide = doc.querySelector('section.game-page-info,details.game-page-info');
  if (!guide) return null;
  let scheduled = false;
  const refresh = () => {
    scheduled = false;
    const locale = ({'zh-tw':'zh-Hant','zh-cn':'zh-Hans','pt-br':'pt-BR'})[doc.documentElement.lang] || doc.documentElement.lang;
    const labels = INTRO_FAQ_LABELS[locale];
    const source = guide.querySelector('[data-wp-intro-faq-source]') || guide.querySelector('.game-info-title p') || guide.querySelector('p');
    if (!labels || !source?.textContent.trim()) return;
    let faq = guide.querySelector('[data-wp-intro-faq]');
    if (!faq && guide.querySelector('dl dt')) return;
    // A native Guide can rebuild its own contents after a language choice.
    // Recreate only this declared supplement, using its new localized intro.
    if (!faq) {
      faq = doc.createElement('article');
      faq.className = 'game-info-section';
      faq.setAttribute('data-wp-intro-faq', '');
      faq.innerHTML = '<h3></h3><dl><dt></dt><dd></dd></dl>';
      guide.append(faq);
    }
    for (const [selector, value] of [['h3', labels[0]], ['dt', labels[1]], ['dd', source.textContent.trim()]]) {
      const node = faq.querySelector(selector);
      if (node && node.textContent !== value) node.textContent = value;
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(refresh);
  };
  const guideObserver = new MutationObserver(schedule), languageObserver = new MutationObserver(schedule);
  guideObserver.observe(guide, {childList:true,characterData:true,subtree:true});
  languageObserver.observe(doc.documentElement, {attributes:true,attributeFilter:['lang']});
  const disconnect = () => {guideObserver.disconnect();languageObserver.disconnect();};
  doc.defaultView?.addEventListener('pagehide', disconnect, {once:true});
  refresh();
  return {refresh, disconnect};
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => installIntroFaq(), {once:true});
  else installIntroFaq();
}
