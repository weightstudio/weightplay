// First-response Main copy. Runtime preserves it; the shared frame owns layout.
export const mainCopy = {
  'zh-Hant':['三國放置戰鬥','培養武將、調整隊伍，率領義軍自動迎戰並擊敗首領。','目前進度','開始遊戲'],
  'zh-Hans':['三国放置战斗','培养武将、调整队伍，率领义军自动迎战并击败首领。','当前进度','开始游戏'],
  en:['Three Kingdoms idle battles','Train heroes, equip your squad and win automatic battles against enemy bosses.','Current progress','Start game'],
  ja:['三国志の放置バトル','武将を育てて部隊を編成。装備を整え、自動戦闘でボスを倒そう。','現在の進行','ゲーム開始'],
  ko:['삼국지 방치형 전투','무장을 육성하고 부대를 편성하세요. 장비를 갖추고 자동 전투로 우두머리를 물리치세요.','현재 진행','게임 시작'],
  es:['Batallas automáticas de los Tres Reinos','Entrena héroes, equipa al grupo y derrota a los jefes en combates automáticos.','Progreso actual','Comenzar'],
  'pt-BR':['Batalhas automáticas dos Três Reinos','Treine heróis, equipe o grupo e derrote chefes em combates automáticos.','Progresso atual','Começar'],
  fr:['Combats automatiques des Trois Royaumes','Entraînez vos héros, équipez le groupe et battez les boss en combat automatique.','Progression actuelle','Jouer'],
  de:['Automatische Kämpfe der Drei Reiche','Trainiere Helden, rüste deine Gruppe aus und besiege Bosse in automatischen Kämpfen.','Aktueller Fortschritt','Spiel starten'],
  it:['Battaglie automatiche dei Tre Regni','Allena gli eroi, equipaggia il gruppo e sconfiggi i boss in battaglie automatiche.','Progressi attuali','Inizia'],
  ru:['Автобои Троецарствия','Развивайте героев, снаряжайте отряд и побеждайте боссов в автоматических боях.','Текущий прогресс','Начать игру'],
  hi:['तीन राज्यों के स्वचालित युद्ध','योद्धाओं को प्रशिक्षित करें, दल को उपकरण दें और स्वचालित युद्ध में सरदारों को हराएँ।','मौजूदा प्रगति','खेल शुरू करें'],
  ar:['معارك الممالك الثلاث التلقائية','درّب الأبطال وجهّز فريقك واهزم الزعماء في معارك تلقائية.','التقدم الحالي','ابدأ اللعبة']
};
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const mainReturnLabels = {
  'zh-Hant':'返回 WeightPlay 大廳','zh-Hans':'返回 WeightPlay 大厅',en:'Back to WeightPlay lobby',
  ja:'WeightPlay ロビーに戻る',ko:'WeightPlay 로비로 돌아가기',es:'Volver al inicio de WeightPlay',
  'pt-BR':'Voltar ao início do WeightPlay',fr:'Retour à l’accueil WeightPlay',de:'Zurück zur WeightPlay-Lobby',
  it:'Torna alla lobby di WeightPlay',ru:'Вернуться в лобби WeightPlay',hi:'WeightPlay लॉबी में लौटें',ar:'العودة إلى ردهة WeightPlay'
};
export function localizeMain(html, locale) {
  const values = mainCopy[locale];
  if (!values) throw new Error(`Unsupported Peach Oath Main locale: ${locale}`);
  const patterns = [
    /(<span\b[^>]*class="eyebrow"[^>]*>)[^<]*(<\/span>)/,
    /(<p\b[^>]*data-wp-frame-summary[^>]*>)[^<]*(<\/p>)/,
    /(<div\b[^>]*class="main-progress"[^>]*>\s*<span>)[^<]*(<\/span>)/,
    /(<button\b[^>]*id="startBtn"[^>]*>)[^<]*(<\/button>)/
  ];
  patterns.forEach((pattern,index) => {
    if (!pattern.test(html)) throw new Error(`Missing Peach Oath Main field ${index}`);
    html = html.replace(pattern, (_,start,end) => start + escape(values[index]) + end);
  });
  html = html.replace(/(<strong\b[^>]*id="mainProgress"[^>]*>)[^<]*(<\/strong>)/, (_,start,end) => start + '1' + end);
  html = html.replace(/(<a\b[^>]*\bmain-return\b[^>]*aria-label=")[^"]*(")/, (_,start,end) => start + escape(mainReturnLabels[locale]) + end);
  return html.replace(/(<div\b[^>]*class="main-copy"[^>]*)(>)/, (_,start,end) => start.includes('data-runtime-localize') ? start + end : start + ' data-runtime-localize="off"' + end);
}
