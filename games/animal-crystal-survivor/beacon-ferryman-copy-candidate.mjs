// Stage 40 local-practice copy drafts; native and rendered review required.
export const ferrymanCopy=Object.freeze({
 en:['Prism Ferryman','Carry a fragment to A to open the first shield and cancel its lane. Damage the Ferryman to half health; a new carrier appears. Carry its fragment to B to open the second shield and defeat the boss. The other lane remains dangerous.'],
 'zh-Hant':['稜鏡渡者','帶碎片到 A 開啟第一面盾並取消該路危險；攻擊渡者至半血，新攜帶者出現。將新碎片帶到 B 開啟第二面盾，再擊敗首領。另一條路仍危險。'],
 'zh-Hans':['棱镜渡者','带碎片到 A 打开第一面盾并取消该路危险；攻击渡者至半血，新携带者出现。将新碎片带到 B 打开第二面盾，再击败首领。另一条路仍危险。'],
 ja:['プリズムの渡し守','欠片を A に運び第一の盾とその道を開く。渡し守の体力を半分まで減らすと新たな敵が現れる。欠片を B に運び第二の盾を開いて倒す。反対の道は危険なまま。'],
 ko:['프리즘 뱃사공','조각을 A로 가져가 첫 방패와 해당 길을 여세요. 뱃사공의 체력을 절반으로 줄이면 새 운반자가 나타납니다. 조각을 B로 가져가 두 번째 방패를 열고 보스를 물리치세요. 다른 길은 여전히 위험합니다.'],
 es:['Barquero del prisma','Lleva un fragmento a A para abrir el primer escudo y cancelar su carril. Reduce la vida del barquero a la mitad; aparece otro portador. Lleva su fragmento a B para abrir el segundo escudo y derrotar al jefe. El otro carril sigue siendo peligroso.'],
 'pt-BR':['Barqueiro do prisma','Leve um fragmento a A para abrir o primeiro escudo e cancelar sua faixa. Reduza a vida do barqueiro pela metade; outro portador aparece. Leve seu fragmento a B para abrir o segundo escudo e vencer o chefe. A outra faixa continua perigosa.'],
 fr:['Passeur du prisme','Apportez un fragment à A pour ouvrir le premier bouclier et annuler sa voie. Réduisez la vie du passeur de moitié ; un autre porteur apparaît. Apportez son fragment à B pour ouvrir le second bouclier et vaincre le boss. L’autre voie reste dangereuse.'],
 de:['Prismen-Fährmann','Bringe ein Fragment zu A, um den ersten Schild zu öffnen und seine Bahn zu entfernen. Bei halber Lebensenergie erscheint ein neuer Träger. Bringe sein Fragment zu B, öffne den zweiten Schild und besiege den Boss. Die andere Bahn bleibt gefährlich.'],
 it:['Traghettatore del prisma','Porta un frammento ad A per aprire il primo scudo e annullare la sua corsia. Riduci la vita del traghettatore a metà: appare un altro portatore. Porta il frammento a B, apri il secondo scudo e sconfiggi il boss. L’altra corsia resta pericolosa.'],
 ru:['Призменный перевозчик','Отнесите осколок к A, чтобы открыть первый щит и убрать его полосу. Уменьшите здоровье перевозчика наполовину — появится новый носитель. Отнесите его осколок к B, откройте второй щит и победите босса. Другая полоса остаётся опасной.'],
 hi:['प्रिज़्म नाविक','टुकड़ा A तक ले जाकर पहली ढाल खोलें और उसकी पट्टी हटाएँ। नाविक का जीवन आधा करें; नया वाहक आएगा। उसका टुकड़ा B तक ले जाकर दूसरी ढाल खोलें और बॉस को हराएँ। दूसरी पट्टी खतरनाक रहेगी।'],
 ar:['ملاح المنشور','احمل شظية إلى A لفتح الدرع الأول وإلغاء مساره. أنقص صحة الملاح إلى النصف ليظهر حامل جديد. احمل شظيته إلى B لفتح الدرع الثاني ثم اهزم الزعيم. يبقى المسار الآخر خطراً.'],
});
const phaseCopy=Object.freeze({
 en:['Damage the Ferryman to half health','Shield open · defeat the Ferryman'], 'zh-Hant':['攻擊渡者至半血','護盾已開 · 擊敗渡者'], 'zh-Hans':['攻击渡者至半血','护盾已开 · 击败渡者'],
 ja:['渡し守の体力を半分にする','盾が開いた · 渡し守を倒す'],ko:['뱃사공의 체력을 절반으로','방패 개방 · 뱃사공 처치'],es:['Reduce la vida del barquero a la mitad','Escudo abierto · vence al barquero'],
 'pt-BR':['Reduza a vida do barqueiro pela metade','Escudo aberto · vença o barqueiro'],fr:['Réduisez la vie du passeur de moitié','Bouclier ouvert · battez le passeur'],de:['Fährmann auf halbe Lebensenergie bringen','Schild offen · besiege den Fährmann'],
 it:['Riduci la vita del traghettatore a metà','Scudo aperto · sconfiggi il traghettatore'],ru:['Уменьшите здоровье перевозчика наполовину','Щит открыт · победите перевозчика'],hi:['नाविक का जीवन आधा करें','ढाल खुली · नाविक को हराएँ'],ar:['أنقص صحة الملاح إلى النصف','الدرع مفتوح · اهزم الملاح'],
});
export function ferrymanObjective(locale,final=false){return (phaseCopy[locale]||phaseCopy.en)[final?1:0]}
const volleyCopy=Object.freeze({
 en:['! Volley warning · dodge','× Volley active · keep moving'], 'zh-Hant':['! 箭雨預告 · 閃避','× 箭雨生效 · 持續移動'], 'zh-Hans':['! 箭雨预告 · 闪避','× 箭雨生效 · 持续移动'],
 ja:['! 矢の予告 · 回避','× 矢が発射 · 移動を続ける'],ko:['! 화살 예고 · 피하기','× 화살 발사 · 계속 이동'],es:['! Aviso de flechas · esquiva','× Flechas activas · sigue moviéndote'],
 'pt-BR':['! Aviso de flechas · desvie','× Flechas ativas · continue se movendo'],fr:['! Flèches annoncées · esquivez','× Flèches actives · continuez à bouger'],de:['! Pfeilwarnung · ausweichen','× Pfeile aktiv · bleib in Bewegung'],
 it:['! Frecce in arrivo · schiva','× Frecce attive · continua a muoverti'],ru:['! Залп готовится · уклоняйтесь','× Залп активен · двигайтесь'],hi:['! तीरों की चेतावनी · बचें','× तीर चल रहे हैं · चलते रहें'],ar:['! تحذير سهام · تجنّب','× السهام نشطة · واصل الحركة'],
});
export function ferrymanVolleyStatus(locale,active=false){return (volleyCopy[locale]||volleyCopy.en)[active?1:0]}
