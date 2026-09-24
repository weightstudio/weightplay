(() => {
  'use strict';
  const sourceUrl = "https://help.gnome.org/lightsoff/index.html";
  const competitor = "Lights Off";
  const copy = {
  "en": {
    "title": "Similar light-switch puzzle reference",
    "overlap": "GNOME’s Lights Off is a useful comparison because it is also a light-state puzzle solved by pressing controls and reading the visible changes. GNOME’s official help describes a 5×5 grid where clicking a tile toggles that tile and its non-diagonal neighbors, with the goal of turning every light off.",
    "difference": "Dawn Shutters uses a different rule set: three independent shutters each cycle through closed, slit, and open, and the goal is to match three target glow bars. Changing one shutter never changes another. The game has 30 authored rooms in six five-room dawn arcs; a wrong check keeps the attempted pattern visible, completed rooms unlock the next room, and progress plus the best tap total stay only in this browser. There is no hidden countdown.",
    "disclaimer": "WeightPlay Dawn Shutters is an independent browser puzzle and is not affiliated with, endorsed by, licensed by, or co-developed with the GNOME project.",
    "sourceLabel": "Official source: GNOME Help — Lights Off"
  },
  "zh-Hant": {
    "title": "相似燈光開關解謎參考",
    "overlap": "GNOME 的《Lights Off》適合作為玩法比較，因為它同樣是透過按下控制項、觀察可見燈光變化來解題的燈光狀態益智遊戲。GNOME 官方說明指出，遊戲使用 5×5 格子；點擊一格會切換該格與其上下左右鄰格的亮滅狀態，目標是把所有燈都關掉。",
    "difference": "《Dawn Shutters》採用不同規則：三個百葉窗彼此獨立，每個都在關閉、窄縫、全開三種狀態間循環，目標是對準三條指定晨光；調整其中一扇不會連動其他百葉窗。遊戲共有六個晨光篇章、30 個固定設計房間；判定錯誤時會保留目前嘗試，過關後解鎖下一房，進度與最佳點擊總數只保存在目前瀏覽器，而且沒有隱藏倒數。",
    "disclaimer": "WeightPlay《Dawn Shutters》為獨立製作的瀏覽器益智遊戲，與 GNOME 專案沒有隸屬、背書、授權或共同開發關係。",
    "sourceLabel": "官方來源：GNOME Help — Lights Off"
  },
  "zh-Hans": {
    "title": "相似灯光开关解谜参考",
    "overlap": "GNOME 的《Lights Off》适合作为玩法比较，因为它同样是通过按下控制项、观察可见灯光变化来解题的灯光状态益智游戏。GNOME 官方说明指出，游戏使用 5×5 网格；点击一格会切换该格及其上下左右相邻格的亮灭状态，目标是关闭所有灯。",
    "difference": "《Dawn Shutters》采用不同规则：三个百叶窗彼此独立，每个都在关闭、窄缝、全开三种状态间循环，目标是匹配三条指定晨光；调整其中一扇不会联动其他百叶窗。游戏共有六个晨光篇章、30 个固定设计房间；判断错误时会保留当前尝试，通关后解锁下一房，进度与最佳点击总数只保存在当前浏览器，而且没有隐藏倒计时。",
    "disclaimer": "WeightPlay《Dawn Shutters》是独立制作的浏览器益智游戏，与 GNOME 项目不存在隶属、背书、授权或共同开发关系。",
    "sourceLabel": "官方来源：GNOME Help — Lights Off"
  },
  "ja": {
    "title": "似たライト切替パズルとの比較",
    "overlap": "GNOME の「Lights Off」は、操作して見える光の変化を読みながら解くライト状態パズルという点で参考になります。GNOME の公式ヘルプでは、5×5 の盤面でタイルを押すとそのタイルと上下左右の隣接タイルが切り替わり、すべてのライトを消すことが目的だと説明されています。",
    "difference": "Dawn Shutters のルールは別物です。3枚のシャッターは互いに独立し、それぞれが閉じる・細い隙間・全開の3状態を循環し、3本の目標光量バーに合わせます。1枚を変えても他のシャッターは変化しません。6つの朝焼けアークに30の固定ルームがあり、間違った判定でも現在の形は残り、クリアすると次の部屋が解放されます。進行と最少タップ記録はこのブラウザーだけに保存され、隠し制限時間はありません。",
    "disclaimer": "WeightPlay の Dawn Shutters は独立したブラウザーパズルであり、GNOME プロジェクトとの提携、推奨、ライセンス、共同開発の関係はありません。",
    "sourceLabel": "公式情報：GNOME Help — Lights Off"
  },
  "ko": {
    "title": "비슷한 조명 스위치 퍼즐 참고",
    "overlap": "GNOME의 Lights Off는 조작을 눌러 눈에 보이는 빛의 변화를 읽으며 푸는 조명 상태 퍼즐이라는 점에서 비교할 만합니다. GNOME 공식 도움말은 5×5 격자에서 한 칸을 누르면 그 칸과 상하좌우 이웃 칸의 상태가 바뀌며, 모든 불을 끄는 것이 목표라고 설명합니다.",
    "difference": "Dawn Shutters는 규칙이 다릅니다. 서로 독립된 셔터 3개가 닫힘·틈새·완전 열림의 세 상태를 순환하며, 세 개의 목표 빛 막대와 정확히 맞추는 것이 목표입니다. 한 셔터를 바꿔도 다른 셔터는 변하지 않습니다. 6개 새벽 장에 고정 설계된 방 30개가 있고, 오답 확인 뒤에도 시도한 상태가 그대로 보이며, 완료하면 다음 방이 열립니다. 진행도와 최고 탭 수는 현재 브라우저에만 저장되고 숨겨진 제한 시간은 없습니다.",
    "disclaimer": "WeightPlay Dawn Shutters는 독립적으로 제작된 브라우저 퍼즐이며 GNOME 프로젝트와 제휴, 보증, 라이선스 또는 공동 개발 관계가 없습니다.",
    "sourceLabel": "공식 출처: GNOME Help — Lights Off"
  },
  "es": {
    "title": "Referencia de un puzle similar de interruptores de luz",
    "overlap": "Lights Off de GNOME es una comparación útil porque también es un puzle de estados de luz que se resuelve pulsando controles y leyendo los cambios visibles. La ayuda oficial de GNOME describe una cuadrícula de 5×5 donde al pulsar una casilla cambia esa casilla y sus vecinas no diagonales, con el objetivo de apagar todas las luces.",
    "difference": "Dawn Shutters usa reglas distintas: tres persianas independientes alternan entre cerrada, rendija y abierta, y hay que igualar tres barras de luz objetivo. Cambiar una persiana nunca modifica otra. Hay 30 habitaciones diseñadas a mano en seis arcos de cinco; un intento incorrecto conserva el patrón visible, cada victoria desbloquea la siguiente habitación y el progreso junto con el mejor total de pulsaciones se guarda solo en este navegador. No hay una cuenta atrás oculta.",
    "disclaimer": "WeightPlay Dawn Shutters es un puzle de navegador independiente y no está afiliado, respaldado, licenciado ni codesarrollado con el proyecto GNOME.",
    "sourceLabel": "Fuente oficial: GNOME Help — Lights Off"
  },
  "pt-BR": {
    "title": "Referência de quebra-cabeça semelhante com luzes",
    "overlap": "Lights Off, do GNOME, é uma comparação útil porque também é um quebra-cabeça de estados de luz resolvido ao pressionar controles e observar mudanças visíveis. A ajuda oficial do GNOME descreve uma grade 5×5 em que tocar em uma peça alterna essa peça e seus vizinhos não diagonais, com o objetivo de apagar todas as luzes.",
    "difference": "Dawn Shutters usa regras diferentes: três venezianas independentes alternam entre fechada, fresta e aberta, e o objetivo é corresponder a três barras de luz-alvo. Mudar uma veneziana nunca altera outra. São 30 salas autorais em seis arcos de cinco; uma verificação errada mantém a tentativa visível, cada sala concluída libera a próxima e o progresso, junto com o melhor total de toques, fica salvo somente neste navegador. Não existe contagem regressiva escondida.",
    "disclaimer": "WeightPlay Dawn Shutters é um quebra-cabeça independente para navegador e não tem afiliação, endosso, licença nem desenvolvimento conjunto com o projeto GNOME.",
    "sourceLabel": "Fonte oficial: GNOME Help — Lights Off"
  },
  "fr": {
    "title": "Référence de puzzle similaire à interrupteurs lumineux",
    "overlap": "Lights Off de GNOME constitue une comparaison utile, car il s’agit lui aussi d’un puzzle d’états lumineux résolu en actionnant des commandes et en observant les changements visibles. L’aide officielle de GNOME décrit une grille de 5×5 où cliquer sur une case bascule cette case et ses voisines non diagonales, avec pour objectif d’éteindre toutes les lumières.",
    "difference": "Dawn Shutters suit d’autres règles : trois volets indépendants passent chacun par fermé, entrouvert et ouvert, et il faut reproduire trois barres de lumière cibles. Modifier un volet ne change jamais les autres. Le jeu propose 30 salles conçues à l’avance, réparties en six arcs de cinq ; une vérification incorrecte laisse la tentative visible, une salle réussie débloque la suivante, et la progression ainsi que le meilleur total de pressions restent uniquement dans ce navigateur. Il n’y a aucun compte à rebours caché.",
    "disclaimer": "WeightPlay Dawn Shutters est un puzzle de navigateur indépendant, sans affiliation, approbation, licence ni développement conjoint avec le projet GNOME.",
    "sourceLabel": "Source officielle : GNOME Help — Lights Off"
  },
  "de": {
    "title": "Vergleich mit einem ähnlichen Lichtschalter-Puzzle",
    "overlap": "GNOMEs Lights Off eignet sich als Vergleich, weil es ebenfalls ein Lichtzustands-Puzzle ist, das durch Betätigen von Schaltern und Beobachten der sichtbaren Änderungen gelöst wird. Die offizielle GNOME-Hilfe beschreibt ein 5×5-Raster, bei dem ein Klick auf ein Feld dieses Feld und seine nicht diagonal angrenzenden Nachbarn umschaltet; Ziel ist es, alle Lichter auszuschalten.",
    "difference": "Dawn Shutters verwendet andere Regeln: Drei voneinander unabhängige Fensterläden wechseln jeweils zwischen geschlossen, Spalt und offen, und drei Ziel-Lichtbalken müssen getroffen werden. Das Ändern eines Ladens verändert keinen anderen. Es gibt 30 fest entworfene Räume in sechs Bögen zu je fünf; nach einer falschen Prüfung bleibt der Versuch sichtbar, ein gelöster Raum schaltet den nächsten frei, und Fortschritt sowie die beste Tippzahl bleiben nur in diesem Browser gespeichert. Es gibt keinen versteckten Countdown.",
    "disclaimer": "WeightPlay Dawn Shutters ist ein unabhängig entwickeltes Browser-Puzzle und steht in keiner Verbindung, Empfehlung, Lizenz- oder gemeinsamen Entwicklungsbeziehung zum GNOME-Projekt.",
    "sourceLabel": "Offizielle Quelle: GNOME Help — Lights Off"
  },
  "it": {
    "title": "Riferimento a un rompicapo simile con interruttori di luce",
    "overlap": "Lights Off di GNOME è un confronto utile perché è anch’esso un rompicapo basato sugli stati delle luci, risolto premendo i controlli e osservando i cambiamenti visibili. La guida ufficiale di GNOME descrive una griglia 5×5 in cui premere una casella cambia quella casella e le vicine non diagonali, con l’obiettivo di spegnere tutte le luci.",
    "difference": "Dawn Shutters usa regole diverse: tre persiane indipendenti passano tra chiusa, fessura e aperta, e bisogna farle corrispondere a tre barre di luce obiettivo. Cambiare una persiana non modifica mai le altre. Ci sono 30 stanze progettate a mano in sei archi da cinque; un controllo errato lascia visibile il tentativo, completare una stanza sblocca la successiva e i progressi con il miglior totale di tocchi restano solo in questo browser. Non c’è alcun conto alla rovescia nascosto.",
    "disclaimer": "WeightPlay Dawn Shutters è un rompicapo per browser indipendente e non è affiliato, approvato, concesso in licenza o sviluppato congiuntamente con il progetto GNOME.",
    "sourceLabel": "Fonte ufficiale: GNOME Help — Lights Off"
  },
  "ru": {
    "title": "Сравнение с похожей головоломкой о переключении света",
    "overlap": "Lights Off от GNOME подходит для сравнения, потому что это тоже головоломка о состояниях света, где решение строится на нажатиях и наблюдении за видимыми изменениями. В официальной справке GNOME описано поле 5×5: нажатие на клетку переключает её и соседей по вертикали и горизонтали, а цель — погасить все огни.",
    "difference": "В Dawn Shutters действуют другие правила: три независимые ставни по отдельности переключаются между закрытым положением, щелью и полностью открытым состоянием, а игрок должен точно повторить три целевые полосы света. Изменение одной ставни не влияет на другие. В игре 30 заранее созданных комнат в шести главах по пять; после неверной проверки попытка остаётся видимой, прохождение открывает следующую комнату, а прогресс и лучший итог по нажатиям сохраняются только в этом браузере. Скрытого таймера нет.",
    "disclaimer": "WeightPlay Dawn Shutters — независимая браузерная головоломка, не связанная с проектом GNOME отношениями аффилированности, одобрения, лицензирования или совместной разработки.",
    "sourceLabel": "Официальный источник: GNOME Help — Lights Off"
  },
  "hi": {
    "title": "मिलते-जुलते लाइट-स्विच पहेली खेल का संदर्भ",
    "overlap": "GNOME का Lights Off उपयोगी तुलना है, क्योंकि यह भी रोशनी की अवस्थाओं वाली पहेली है जिसमें नियंत्रण दबाकर दिखाई देने वाले बदलावों को पढ़ते हुए हल निकाला जाता है। GNOME की आधिकारिक सहायता के अनुसार इसमें 5×5 ग्रिड है; किसी टाइल को दबाने पर वह टाइल और उसके सीधे ऊपर, नीचे, बाएँ और दाएँ वाले पड़ोसी बदलते हैं, और लक्ष्य सभी लाइट बंद करना है।",
    "difference": "Dawn Shutters के नियम अलग हैं: तीन स्वतंत्र शटर अलग-अलग बंद, पतली दरार और पूरी तरह खुले तीन स्तरों में घूमते हैं, और आपको तीन लक्ष्य रोशनी पट्टियों से मिलान करना होता है। एक शटर बदलने से दूसरा नहीं बदलता। छह पाँच-कमरे वाले अध्यायों में 30 तयशुदा कमरे हैं; गलत जाँच के बाद कोशिश दिखाई देती रहती है, पूरा कमरा अगला कमरा खोलता है, और प्रगति व सबसे कम कुल टैप केवल इसी ब्राउज़र में सहेजे जाते हैं। कोई छिपी उलटी गिनती नहीं है।",
    "disclaimer": "WeightPlay Dawn Shutters एक स्वतंत्र ब्राउज़र पहेली है और GNOME परियोजना से संबद्ध, समर्थित, लाइसेंस प्राप्त या संयुक्त रूप से विकसित नहीं है।",
    "sourceLabel": "आधिकारिक स्रोत: GNOME Help — Lights Off"
  },
  "ar": {
    "title": "مرجع للعبة ألغاز مشابهة تعتمد على مفاتيح الضوء",
    "overlap": "تُعد Lights Off من GNOME مقارنة مفيدة لأنها أيضًا لعبة ألغاز تعتمد على حالات الإضاءة وتُحل بالضغط على عناصر التحكم وملاحظة التغييرات الظاهرة. توضح مساعدة GNOME الرسمية أنها تستخدم شبكة 5×5؛ فالضغط على خانة يبدّل حالتها وحالة جيرانها غير القطريين، والهدف هو إطفاء جميع الأضواء.",
    "difference": "تستخدم Dawn Shutters قواعد مختلفة: هناك ثلاث مصاريع مستقلة، ويتنقل كل مصراع بين مغلق وفتحة ضيقة ومفتوح، والمطلوب مطابقة ثلاثة أشرطة ضوء مستهدفة. تغيير مصراع لا يغيّر أي مصراع آخر. تضم اللعبة 30 غرفة مصممة مسبقًا ضمن ستة فصول من خمس غرف؛ عند التحقق الخاطئ يبقى النمط الذي جربته ظاهرًا، وإكمال الغرفة يفتح التالية، بينما تُحفظ مراحل التقدم وأفضل مجموع للنقرات في هذا المتصفح فقط. لا يوجد عدّ تنازلي مخفي.",
    "disclaimer": "Dawn Shutters من WeightPlay لعبة ألغاز مستقلة للمتصفح وليست تابعة لمشروع GNOME ولا معتمدة أو مرخّصة منه ولا مطوّرة بالاشتراك معه.",
    "sourceLabel": "المصدر الرسمي: GNOME Help — Lights Off"
  }
};
  const supported = new Set(Object.keys(copy));
  const currentLocale = () => {
    const selected = document.getElementById('languageSelect')?.value;
    if (supported.has(selected)) return selected;
    const lang = document.documentElement.lang;
    return supported.has(lang) ? lang : 'en';
  };
  const applyComparison = (locale = currentLocale()) => {
    const resolved = supported.has(locale) ? locale : 'en';
    const root = document.querySelector('[data-wp-market-comparison="1.3.0"]');
    if (!root) return;
    const text = copy[resolved];
    root.dataset.comparisonLocale = resolved;
    const set = (selector, value) => { const node = root.querySelector(selector); if (node) node.textContent = value; };
    set('[data-wp-market-title]', text.title);
    set('[data-wp-market-name]', competitor);
    set('[data-wp-market-overlap]', text.overlap);
    set('[data-wp-market-difference]', text.difference);
    set('[data-wp-market-disclaimer]', text.disclaimer);
    const link = root.querySelector('[data-wp-market-source]');
    if (link) { link.textContent = text.sourceLabel; link.href = sourceUrl; }
  };
  const bind = () => {
    applyComparison();
    const select = document.getElementById('languageSelect');
    select?.addEventListener('change', () => setTimeout(() => applyComparison(select.value), 0));
    window.addEventListener('weightplay:localechange', (event) => applyComparison(event.detail?.locale));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
