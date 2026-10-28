// Local-practice drafts: native-language and real-screen review remain open.
export const heatCopy=Object.freeze({
 en:['Heat Crossing','Carry a fragment to C, then survive. The marked floor heats up; cross early, go around, or wait. Damage loses the fragment.'],
 'zh-Hant':['熱帶穿行','帶碎片至 C，然後存活至結束。標示地板即將灼熱，可提早穿越、繞行或等待；受傷會失去碎片。'],
 'zh-Hans':['热带穿行','带碎片至 C，然后存活至结束。标示地板即将灼热，可提前穿越、绕行或等待；受伤会失去碎片。'],
 ja:['熱帯を越える','欠片を C に運び、生き残る。印の床は熱くなるので、早く横切る、迂回する、または待つ。被弾で欠片を失う。'],
 ko:['열기 지대 통과','조각을 C로 옮긴 뒤 살아남으세요. 표시된 바닥이 뜨거워지니 일찍 건너거나 돌아가거나 기다리세요. 피해를 받으면 조각을 잃습니다.'],
 es:['Cruce ardiente','Lleva un fragmento a C y sobrevive. El suelo marcado se calentará: cruza pronto, rodea o espera. El daño hace perder el fragmento.'],
 'pt-BR':['Travessia quente','Leve um fragmento a C e sobreviva. O chão marcado vai esquentar: atravesse cedo, contorne ou espere. Dano faz perder o fragmento.'],
 fr:['Traversée brûlante','Portez un fragment à C puis survivez. Le sol marqué va chauffer : traversez tôt, contournez ou attendez. Un coup fait perdre le fragment.'],
 de:['Heiße Passage','Bringe ein Fragment zu C und überlebe. Der markierte Boden erhitzt sich: früh hindurch, außen herum oder abwarten. Schaden lässt das Fragment fallen.'],
 it:['Passaggio rovente','Porta un frammento a C e sopravvivi. Il terreno segnato si scalda: attraversa presto, aggira o aspetta. I danni fanno perdere il frammento.'],
 ru:['Горячий переход','Отнесите осколок к C и выживите. Отмеченный пол нагреется: пройдите заранее, обойдите или подождите. Урон лишает осколка.'],
 hi:['गर्म रास्ता','टुकड़ा C तक ले जाकर जीवित रहें। चिह्नित फ़र्श गर्म होगा: जल्दी पार करें, घूमकर जाएँ या प्रतीक्षा करें। चोट से टुकड़ा खोता है।'],
 ar:['عبور المنطقة الساخنة','احمل شظية إلى C ثم ابقَ حياً. ستسخن الأرض المحددة؛ اعبر مبكراً أو التف حولها أو انتظر. الإصابة تفقدك الشظية.'],
});
const warning={en:'Floor heating · cross or detour','zh-Hant':'地板升溫 · 穿越或繞行','zh-Hans':'地板升温 · 穿越或绕行',ja:'床が加熱中 · 横断か迂回',ko:'바닥 가열 중 · 건너거나 우회',es:'Suelo calentándose · cruza o rodea','pt-BR':'Chão aquecendo · atravesse ou contorne',fr:'Sol en chauffe · traversez ou contournez',de:'Boden heizt · durch oder außen herum',it:'Suolo in riscaldamento · attraversa o aggira',ru:'Пол нагревается · пройдите или обойдите',hi:'फ़र्श गर्म होगा · पार करें या घूमें',ar:'الأرض تسخن · اعبر أو التف'};
const active={en:'Hot floor · detour or wait','zh-Hant':'灼熱地板 · 繞行或等待','zh-Hans':'灼热地板 · 绕行或等待',ja:'熱い床 · 迂回か待機',ko:'뜨거운 바닥 · 우회하거나 대기',es:'Suelo caliente · rodea o espera','pt-BR':'Chão quente · contorne ou espere',fr:'Sol brûlant · contournez ou attendez',de:'Heißer Boden · umgehen oder warten',it:'Suolo rovente · aggira o aspetta',ru:'Горячий пол · обойдите или ждите',hi:'गर्म फ़र्श · घूमें या प्रतीक्षा करें',ar:'أرض ساخنة · التف أو انتظر'};
export function heatStatus(locale,phase){const table=phase==='active'?active:warning;return table[locale]||table.en}
