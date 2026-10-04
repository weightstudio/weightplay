// Text Growth 1.4.0: keep Spades' first paint, runtime summary, tags and
// structured metadata aligned with the public four-player rules.
const COPY = Object.freeze({
  en: {
    summary: "Bid a team contract, follow suit when possible, and use spades as trump in a four-player hand.",
    description: "Play Spades free in your browser: bid a team contract, follow suit, and use spades as trump.",
    tableTitle: "The four-player table",
    table: "One 52-card deck is dealt evenly: thirteen cards to each of four seats. You and the AI partner across the table form one team; the other two AI seats are your opponents.",
    team: "The AI controls the other three seats, including your partner. Your bid and your partner's bid combine to set your team's target.",
    tags: ["Four-player trick-taking", "Team contract bidding", "Spades as trump"],
  },
  "zh-Hant": {
    summary: "四人分兩隊叫牌吃墩；能跟花色時就跟牌，並以黑桃為王牌。",
    description: "免費在瀏覽器遊玩黑桃：叫出團隊合約、能跟花色時就跟牌，並善用黑桃王牌。",
    tableTitle: "四人牌桌",
    table: "一副 52 張牌平均發給四個座位，每人 13 張。你和對面的 AI 隊友同隊，另外兩個 AI 座位是對手。",
    team: "另外三個座位都由 AI 操作，包括你的隊友。你的叫牌會與隊友的叫牌相加，成為團隊目標。",
    tags: ["四人吃墩牌戲", "團隊合約叫牌", "黑桃為王牌"],
  },
  "zh-Hans": {
    summary: "四人分两队叫牌吃墩；能跟花色时就跟牌，并以黑桃为王牌。",
    description: "免费在浏览器游玩黑桃：叫出团队合约、能跟花色时就跟牌，并善用黑桃王牌。",
    tableTitle: "四人牌桌",
    table: "一副 52 张牌平均发给四个座位，每人 13 张。你和对面的 AI 队友同队，另外两个 AI 座位是对手。",
    team: "另外三个座位都由 AI 操作，包括你的队友。你的叫牌会与队友的叫牌相加，成为团队目标。",
    tags: ["四人吃墩牌戏", "团队合约叫牌", "黑桃为王牌"],
  },
  ja: {
    summary: "4人でチーム契約をビッドし、可能ならリードスートに従い、スペードを切り札にして戦います。",
    description: "ブラウザーで無料のスペードをプレイ。チーム契約をビッドし、スートに従い、スペードを切り札として使います。",
    tableTitle: "4人のテーブル",
    table: "52枚のデッキが4つの席に配られ、各プレイヤーは13枚を持ちます。向かい側のAIが味方で、残る2席のAIが対戦相手です。",
    team: "味方を含む残り3席はAIが操作します。あなたと味方のビッドを合計した数がチームの目標です。",
    tags: ["4人のトリックテイキング", "チーム契約のビッド", "スペードが切り札"],
  },
  ko: {
    summary: "네 명이 팀 계약을 비드하고, 가능하면 리드 무늬를 따라 내며 스페이드를 으뜸패로 사용하세요.",
    description: "브라우저에서 스페이드를 무료로 플레이하세요. 팀 계약을 비드하고 무늬를 따라 내며 스페이드를 으뜸패로 사용합니다.",
    tableTitle: "네 명이 앉는 테이블",
    table: "52장 카드 한 벌을 네 자리에 나누어 각자 13장씩 받습니다. 맞은편 AI는 같은 팀이며, 나머지 두 AI 자리는 상대 팀입니다.",
    team: "팀원 AI를 포함한 나머지 세 자리는 AI가 조작합니다. 플레이어와 팀원의 비드를 합한 수가 팀 목표입니다.",
    tags: ["4인 트릭 게임", "팀 계약 비드", "스페이드 으뜸패"],
  },
  es: {
    summary: "Apuesta un contrato de equipo, sigue el palo cuando puedas y usa las picas como triunfo en una mano de cuatro personas.",
    description: "Juega a Picas gratis en el navegador: apuesta un contrato de equipo, sigue el palo y usa las picas como triunfo.",
    tableTitle: "La mesa de cuatro",
    table: "Una baraja de 52 cartas se reparte por igual: trece cartas para cada uno de los cuatro puestos. Tu compañera o compañero de IA, al otro lado de la mesa, forma equipo contigo; los otros dos puestos de IA son rivales.",
    team: "La IA controla los otros tres puestos, incluido tu compañero o compañera. La suma de sus apuestas y la tuya fija el objetivo del equipo.",
    tags: ["Bazas para cuatro", "Apuestas de equipo", "Picas como triunfo"],
  },
  "pt-BR": {
    summary: "Declare um contrato de equipe, siga o naipe quando puder e use espadas como trunfo nesta mão para quatro pessoas.",
    description: "Jogue Espadas grátis no navegador: declare um contrato de equipe, siga o naipe e use espadas como trunfo.",
    tableTitle: "A mesa de quatro pessoas",
    table: "Um baralho de 52 cartas é distribuído igualmente: treze cartas para cada um dos quatro lugares. O parceiro de IA do outro lado da mesa joga na sua equipe; os outros dois lugares de IA são adversários.",
    team: "A IA controla os outros três lugares, incluindo seu parceiro. A soma do seu lance com o lance dele define a meta da equipe.",
    tags: ["Vazas para quatro", "Lances de equipe", "Espadas como trunfo"],
  },
  fr: {
    summary: "Annoncez un contrat d’équipe, fournissez la couleur si possible et utilisez le pique comme atout dans cette partie à quatre.",
    description: "Jouez gratuitement à Pique dans votre navigateur : annoncez un contrat d’équipe, fournissez la couleur et utilisez le pique comme atout.",
    tableTitle: "La table à quatre",
    table: "Un jeu de 52 cartes est réparti entre quatre places, soit treize cartes par personne. Le partenaire IA assis en face joue dans votre équipe ; les deux autres places IA sont adverses.",
    team: "L’IA contrôle les trois autres places, partenaire compris. Votre annonce et celle du partenaire fixent ensemble l’objectif de l’équipe.",
    tags: ["Plis à quatre", "Contrat d’équipe", "Pique comme atout"],
  },
  de: {
    summary: "Biete einen Teamkontrakt, bediene möglichst die Farbe und nutze Pik als Trumpf in einem Stichspiel für vier Personen.",
    description: "Spiele Pik kostenlos im Browser: Biete einen Teamkontrakt, bediene die Farbe und nutze Pik als Trumpf.",
    tableTitle: "Der Vierertisch",
    table: "Ein 52-Karten-Blatt wird gleichmäßig verteilt: Jede der vier Personen erhält 13 Karten. Die KI gegenüber ist dein Teampartner; die beiden anderen KI-Plätze sind Gegner.",
    team: "Die KI spielt die drei übrigen Plätze, auch deinen Partner. Dein Gebot und das deines Partners ergeben gemeinsam das Teamziel.",
    tags: ["Stichspiel für vier", "Teamkontrakt bieten", "Pik als Trumpf"],
  },
  it: {
    summary: "Dichiara un contratto di squadra, segui il seme quando puoi e usa le picche come briscola in una mano a quattro.",
    description: "Gioca a Picche gratis nel browser: dichiara un contratto di squadra, segui il seme e usa le picche come briscola.",
    tableTitle: "Il tavolo a quattro",
    table: "Un mazzo da 52 carte viene distribuito in parti uguali: tredici carte per ciascuno dei quattro posti. Il compagno IA di fronte a te è nella tua squadra; gli altri due posti IA sono avversari.",
    team: "L’IA controlla gli altri tre posti, compreso il tuo compagno. La somma delle vostre dichiarazioni stabilisce l’obiettivo della squadra.",
    tags: ["Prese per quattro", "Contratto di squadra", "Picche come briscola"],
  },
  ru: {
    summary: "Заявляйте командный контракт, ходите в масть при наличии и используйте пики как козырь в игре на четверых.",
    description: "Играйте в Пики бесплатно в браузере: заявляйте командный контракт, ходите в масть и используйте пики как козырь.",
    tableTitle: "Стол для четырёх игроков",
    table: "Колода из 52 карт делится поровну: каждому из четырёх мест достаётся по 13 карт. ИИ напротив играет в вашей команде, а два других места ИИ занимают соперники.",
    team: "ИИ управляет тремя остальными местами, включая вашего партнёра. Сумма вашей заявки и заявки партнёра задаёт цель команды.",
    tags: ["Взятки для четырёх игроков", "Заявки команды", "Пики как козырь"],
  },
  hi: {
    summary: "चार खिलाड़ियों की इस बाज़ी में टीम अनुबंध की बोली लगाएँ, संभव हो तो सूट का पालन करें और स्पेड्स को तुरुप बनाएँ।",
    description: "ब्राउज़र में स्पेड्स मुफ़्त खेलें: टीम अनुबंध की बोली लगाएँ, सूट का पालन करें और स्पेड्स को तुरुप बनाएँ।",
    tableTitle: "चार खिलाड़ियों की मेज़",
    table: "52 पत्तों की गड्डी चारों सीटों में बराबर बाँटी जाती है, यानी हर खिलाड़ी को 13 पत्ते मिलते हैं। सामने बैठा AI साथी आपकी टीम में है; बाकी दो AI सीटें विरोधी हैं।",
    team: "आपके साथी सहित बाकी तीन सीटें AI चलाता है। आपकी और साथी की बोली का योग टीम का लक्ष्य तय करता है।",
    tags: ["चार खिलाड़ियों की बाज़ी", "टीम अनुबंध की बोली", "स्पेड्स तुरुप"],
  },
  ar: {
    summary: "راهنوا على عقد الفريق، واتبعوا النوع إن أمكن، واستخدموا البستوني حكماً في جولة لأربعة لاعبين.",
    description: "العب البستوني مجاناً في المتصفح: راهن على عقد الفريق، واتبع النوع واستخدم البستوني حكماً.",
    tableTitle: "طاولة لأربعة لاعبين",
    table: "تُوزع رزمة من 52 بطاقة بالتساوي على أربعة مقاعد، 13 بطاقة لكل لاعب. شريك الذكاء الاصطناعي المقابل لك ضمن فريقك، والمقعدان الآخران خصمان.",
    team: "يتولى الذكاء الاصطناعي المقاعد الثلاثة الأخرى، بما فيها مقعد شريكك. يُجمع رهانك ورهان الشريك لتحديد هدف الفريق.",
    tags: ["لعبة لمّات لأربعة", "رهان عقد الفريق", "البستوني حكم"],
  },
});

const ESC = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const LANGUAGE = Object.freeze({ en: "en", "zh-Hant": "zh-Hant", "zh-Hans": "zh-Hans", ja: "ja", ko: "ko", es: "es", "pt-BR": "pt-BR", fr: "fr", de: "de", it: "it", ru: "ru", hi: "hi", ar: "ar" });

function setMeta(html, selector, content) {
  const escaped = ESC(content);
  const re = new RegExp(`(<meta\\b(?=[^>]*${selector})[^>]*\\bcontent=["'])[^"']*(["'][^>]*>)`, "iu");
  return html.replace(re, `$1${escaped}$2`);
}

export function applySpadesTextGrowth(html, locale = "en") {
  const copy = COPY[locale];
  if (!copy) throw new Error(`Missing Spades Text Growth locale: ${locale}`);
  let out = String(html);
  out = out.replace(/card-games-next\.js(?:\?v=[^"']+)?/giu, "card-games-next.js?v=20261003-spades-text-growth-140-v1");
  out = out
    .replaceAll("../../assets/card-games-next-batch-cover.svg", "../../Assets/card-games-next-batch-cover.svg")
    .replaceAll("/assets/interface7-redrawn/gin-rummy.webp", "/Assets/interface7-redrawn/gin-rummy.webp")
    .replaceAll("/assets/interface7-redrawn/go-fish.webp", "/Assets/interface7-redrawn/go-fish.webp")
    .replaceAll("https://weightplay.com/assets/interface7-redrawn/spades.webp", "https://weightplay.com/Assets/interface7-redrawn/spades.webp");
  const summary = /(<p\b(?=[^>]*\bdata-card-summary\b)[^>]*>)[\s\S]*?(<\/p>)/iu;
  if (!summary.test(out)) throw new Error(`Spades main summary not found: ${locale}`);
  out = out.replace(summary, `$1${ESC(copy.summary)}$2`);

  const tagHtml = `<div class="game-info-tags" data-wp-gameplay-tags="1.4.0" data-wp-gameplay-tags-locale="${locale}">${copy.tags.map((tag) => `<span>${ESC(tag)}</span>`).join("")}</div>`;
  const tagPattern = /<div\b(?=[^>]*\bclass=["'][^"']*\bgame-info-tags\b[^"']*["'])[^>]*>[\s\S]*?<\/div>/iu;
  if (tagPattern.test(out)) out = out.replace(tagPattern, tagHtml);
  else {
    const titleStart = out.indexOf('<div class="game-info-title">');
    const summaryEnd = titleStart < 0 ? -1 : out.indexOf("</p>", titleStart);
    if (summaryEnd < 0) throw new Error(`Spades title summary not found for gameplay tags: ${locale}`);
    out = `${out.slice(0, summaryEnd + 4)}${tagHtml}${out.slice(summaryEnd + 4)}`;
  }

  const firstGuideParagraph = /(<div class="game-info-section"><h3>)[\s\S]*?(<\/h3><p>)[\s\S]*?(<\/p>)/iu;
  if (!firstGuideParagraph.test(out)) throw new Error(`Spades first Guide section not found: ${locale}`);
  out = out.replace(firstGuideParagraph, `$1${ESC(copy.tableTitle)}$2${ESC(copy.table)}$3`);
  const sectionStart = out.indexOf('<div class="game-info-section">');
  const sectionEnd = out.indexOf("</div>", sectionStart);
  const firstSection = out.slice(sectionStart, sectionEnd);
  const paragraphs = [...firstSection.matchAll(/<p>([\s\S]*?)<\/p>/giu)];
  if (paragraphs.length < 2) throw new Error(`Spades team explanation not found: ${locale}`);
  const second = paragraphs[1];
  const absoluteStart = sectionStart + second.index;
  const paragraphEnd = out.indexOf("</p>", absoluteStart) + 4;
  out = `${out.slice(0, absoluteStart)}<p>${ESC(copy.team)}</p>${out.slice(paragraphEnd)}`;

  out = setMeta(out, `\\bname=["']description["']`, copy.description);
  out = setMeta(out, `\\bproperty=["']og:description["']`, copy.description);
  out = setMeta(out, `\\bname=["']twitter:description["']`, copy.description);
  let schemaCount = 0;
  out = out.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/giu, (whole, open, body, close) => {
    const data = JSON.parse(body);
    if (data["@type"] !== "VideoGame") return whole;
    data.description = copy.description;
    data.inLanguage = LANGUAGE[locale];
    data.keywords = copy.tags;
    schemaCount += 1;
    return `${open}${JSON.stringify(data)}${close}`;
  });
  if (schemaCount !== 1) throw new Error(`Expected one Spades VideoGame schema, found ${schemaCount}: ${locale}`);
  return out;
}

export const SPADES_TEXT_140_LOCALES = Object.freeze(Object.keys(COPY));
