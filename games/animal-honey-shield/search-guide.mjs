import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

export const TEXT_VERSION = '1.4.0';
export const HONEY_ROUTES = {en:'en','zh-Hant':'zh-tw','zh-Hans':'zh-cn',ja:'ja',ko:'ko',es:'es','pt-BR':'pt-br',fr:'fr',de:'de',it:'it',ru:'ru',hi:'hi',ar:'ar'};
const RELATED_PRISM_DESCRIPTION = {
  "en": "Switch between three lanes to focus automatic fire on incoming monsters and bombs, keeping the crystal safe.",
  "zh-Hant": "在三條路線間切換，把自動火力集中到來襲的怪物或炸彈，守住水晶。",
  "zh-Hans": "在三条路线间切换，把自动火力集中到来袭的怪物或炸弹，守住水晶。",
  "ja": "3本のレーンを切り替えて、迫るモンスターや爆弾に自動射撃を集中させ、クリスタルを守ります。",
  "ko": "세 경로를 오가며 다가오는 몬스터와 폭탄에 자동 사격을 집중해 수정을 지키세요.",
  "es": "Cambia entre tres carriles para concentrar el fuego automático en monstruos y bombas y proteger el cristal.",
  "pt-BR": "Alterne entre três pistas para concentrar o disparo automático em monstros e bombas e proteger o cristal.",
  "fr": "Changez de voie parmi les trois disponibles pour concentrer le tir automatique sur les monstres et les bombes et protéger le cristal.",
  "de": "Wechsle zwischen drei Spuren, richte das automatische Feuer auf anrückende Monster und Bomben und schütze den Kristall.",
  "it": "Passa fra tre corsie per concentrare il fuoco automatico su mostri e bombe e proteggere il cristallo.",
  "ru": "Переключайтесь между тремя полосами, направляйте автоматический огонь на приближающихся монстров и бомбы и защищайте кристалл.",
  "hi": "तीन रास्तों के बीच बदलें, पास आते राक्षसों और बमों पर अपने आप चलने वाली गोलीबारी केंद्रित करें और क्रिस्टल बचाएँ।",
  "ar": "تنقّل بين ثلاثة مسارات لتركيز النيران التلقائية على الوحوش والقنابل القادمة وحماية البلورة."
};
const ID = 'animal-honey-shield';
const BEGIN = '  // BEGIN HONEY TEXT GROWTH 1.4.0 COMPILED COPY';
const END = '  // END HONEY TEXT GROWTH 1.4.0 COMPILED COPY';

// Player copy is based on the shipped first-stroke transition, two-contact
// anchor rule, scoreStars(), loadSave() and six five-stage chapters. This is
// text acceptance, not gameplay QA or permission to change release state.
const COPY = {
  en: {
    how2:'Release your first valid line to start the bees. After that, drawing more lines does not pause the wave.',
    rulesText:'Lines do not break. Bees take any open path to Pip. When every path is blocked, they push and twist loose walls until a gap opens. The same stroke must hook around two separate terrain points to lock and glow gold. A fixed wall can still leave a path around it.',
    progressText:'The 30 stages form six chapters of five. Later chapters change the hive positions, terrain and wind. Survive a stage to unlock the next one; replay an earlier stage to improve its stars.',
    saveText:'Unlocked stages, cleared stages and best stars are saved in this browser. No account is needed. Clearing this site’s browser data removes that progress; another browser or device does not automatically share it.',
    faq1a:'Yes, while nectar remains. Add a short line to block an open path. The bees keep moving while you draw.',
    faq2q:'Why does my line move instead of turning gold?',
    faq2a:'A straight bridge or a loop around one stone is still loose. Wrap or hook the same stroke around two separated terrain points. Simply touching one stone is not enough.',
    faq3q:'Can I lose even with a gold wall?',
    faq3a:'Yes. Gold means the wall is fixed, not that Pip is fully enclosed. Bees use any remaining path around it. Check the gaps before spending your remaining nectar.',
    faq4q:'How are stars awarded?',
    faq4a:'First keep Pip safe until the timer ends. A clear using at most 45 nectar earns three stars; more than 45 and at most 72 earns two; more than 72 earns one. A failed attempt earns no stars.',
    faq5q:'Will replaying erase my best result?',
    faq5a:'No. A clear can improve the saved best stars, but a worse result does not replace them. Unlocked stages also remain available in the same browser.',
    designTitle:'Why line placement matters',
    designText:'A longer wall uses more nectar without necessarily closing the route. The useful decision is where to place two anchors and where bees could go around the line. A short extra barrier can close that gap, but it also counts toward the nectar used for stars.',
    gameplayTags:['Drawing defense','Two-point anchoring','Nectar management']
  },
  'zh-Hant': {
    how2:'放開第一條有效防線後，蜂群才會出發。之後補畫其他線條時，波次不會暫停。',
    rulesText:'線條不會斷裂。只要有路能到皮普身邊，蜜蜂就會沿路繞行；所有路線都被封住時，牠們才會推動、扭轉鬆動的牆，直到出現缺口。同一條線必須勾住兩個分開的地形點，才會固定並變成金色。牆固定了，周圍仍可能留有通路。',
    progressText:'30 個關卡分成六章，每章五關。後面的章節會改變蜂巢位置、地形與風勢。守到倒數結束便能解鎖下一關，也能重玩已解鎖關卡，挑戰更高星級。',
    saveText:'解鎖關卡、過關紀錄與最佳星級保存在這個瀏覽器，不需帳號。清除此網站的瀏覽器資料會移除進度；其他瀏覽器或裝置不會自動共用存檔。',
    faq1a:'可以，只要還有花蜜，就能補畫短線封住通路。補畫時蜜蜂仍會繼續移動。',
    faq2q:'為什麼防線會移動，沒有變成金色？',
    faq2a:'直線架在兩顆石頭之間，或只繞住一顆石頭，防線都還是鬆動的。要用同一條線繞住或勾住兩個分開的地形點；只碰到一顆石頭並不足夠。',
    faq3q:'防線變成金色後，還會失敗嗎？',
    faq3a:'會。金色只表示牆已固定，不代表皮普周圍已完全封住。蜜蜂仍會走剩下的通路；花完花蜜前，先檢查兩側是否留有缺口。',
    faq4q:'星級如何計算？',
    faq4a:'先保護皮普到倒數結束。過關時消耗不超過 45 花蜜可得三星；超過 45、但不超過 72 可得兩星；超過 72 則得一星。失敗的嘗試不會獲得星星。',
    faq5q:'重玩會覆蓋最佳成績嗎？',
    faq5a:'不會。過關可以提高已保存的最佳星級，較差的結果不會取代它。已解鎖關卡也會在同一個瀏覽器中保留。',
    designTitle:'防線的位置為什麼重要',
    designText:'線畫得更長會多花花蜜，卻不一定能封住路。真正要判斷的是兩個固定點的位置，以及蜜蜂能否繞過防線。短短一條補線可能就能堵住缺口，但它也會算進星級評分的花蜜消耗。',
    gameplayTags:['畫線防守','雙點固定','花蜜管理']
  },
  'zh-Hans': {
    how2:'松开第一条有效防线后，蜂群才会出发。之后补画其他线条时，波次不会暂停。',
    rulesText:'线条不会断裂。只要有路能到皮普身边，蜜蜂就会沿路绕行；所有路线都被封住时，它们才会推动、扭转松动的墙，直到出现缺口。同一条线必须钩住两个分开的地形点，才会固定并变成金色。墙固定了，周围仍可能留有通路。',
    progressText:'30 个关卡分成六章，每章五关。后面的章节会改变蜂巢位置、地形与风势。守到倒计时结束就能解锁下一关，也能重玩已解锁关卡，挑战更高星级。',
    saveText:'解锁关卡、通关记录与最佳星级保存在这个浏览器，无需账号。清除此网站的浏览器数据会移除进度；其他浏览器或设备不会自动共用存档。',
    faq1a:'可以，只要还有花蜜，就能补画短线封住通路。补画时蜜蜂仍会继续移动。',
    faq2q:'为什么防线会移动，没有变成金色？',
    faq2a:'直线架在两颗石头之间，或只绕住一颗石头，防线都还是松动的。要用同一条线绕住或钩住两个分开的地形点；只碰到一颗石头并不足够。',
    faq3q:'防线变成金色后，还会失败吗？',
    faq3a:'会。金色只表示墙已固定，不代表皮普周围已完全封住。蜜蜂仍会走剩下的通路；花完花蜜前，先检查两侧是否留有缺口。',
    faq4q:'星级如何计算？',
    faq4a:'先保护皮普到倒计时结束。通关时消耗不超过 45 花蜜可得三星；超过 45、但不超过 72 可得两星；超过 72 则得一星。失败的尝试不会获得星星。',
    faq5q:'重玩会覆盖最佳成绩吗？',
    faq5a:'不会。通关可以提高已保存的最佳星级，较差的结果不会取代它。已解锁关卡也会在同一个浏览器中保留。',
    designTitle:'防线的位置为什么重要',
    designText:'线画得更长会多花花蜜，却不一定能封住路。真正要判断的是两个固定点的位置，以及蜜蜂能否绕过防线。短短一条补线可能就能堵住缺口，但它也会算进星级评分的花蜜消耗。',
    gameplayTags:['画线防守','双点固定','花蜜管理']
  },
  ja: {
    how2:'最初の有効な線を描いて指やマウスを離すと、ハチが動き出します。その後に線を描き足しても、ハチは止まりません。',
    rulesText:'線は切れません。ピップへの道があれば、ハチはそこを通ります。すべての道が塞がれたときだけ、動く壁を押したりねじったりして隙間を開けます。同じ一本の線を離れた二つの地形に引っ掛けると、金色になって固定されます。固定した壁の周りにも通り道は残ることがあります。',
    progressText:'全30ステージは、5ステージずつの6章に分かれています。先の章では巣の位置、地形、風が変わります。時間切れまでピップを守ると次のステージが開き、以前のステージで星を増やすこともできます。',
    saveText:'解放したステージ、クリア記録、最高の星はこのブラウザーに保存されます。アカウントは不要です。このサイトのブラウザーデータを消すと進捗も消え、別のブラウザーや端末には自動で引き継がれません。',
    faq1a:'はい。蜜が残っていれば、短い線を描き足して通り道を塞げます。描いている間もハチは動き続けます。',
    faq2q:'線が金色にならず、動いてしまうのはなぜですか？',
    faq2a:'石の間を直線で結んだだけの壁や、一つの石だけを囲んだ壁は動きます。同じ一本の線を、離れた二つの地形に巻き付けるか引っ掛けてください。一つの石に触れるだけでは固定できません。',
    faq3q:'金色の壁があっても失敗しますか？',
    faq3a:'はい。金色は壁が固定された印で、ピップの周りがすべて塞がった印ではありません。ハチは残った道を通るので、蜜を使い切る前に隙間を確認しましょう。',
    faq4q:'星はどう決まりますか？',
    faq4a:'まずタイマーが終わるまでピップを守ります。クリア時の蜜の消費が45以下なら星3つ、45を超えて72以下なら星2つ、72を超えたら星1つです。失敗した挑戦では星は付きません。',
    faq5q:'再挑戦すると最高記録は消えますか？',
    faq5a:'いいえ。より多くの星を取ると最高記録が更新され、低い結果では上書きされません。解放済みステージも同じブラウザーに残ります。',
    designTitle:'線を置く場所が大切な理由',
    designText:'長い壁は蜜を多く使いますが、必ずしも道を塞げるとは限りません。二つの固定点と、ハチが回り込める場所を見極めましょう。短い追加の線で隙間を閉じられても、その蜜は星の判定に使う消費量に加わります。',
    gameplayTags:['描画防衛','二点固定','蜜の管理']
  },
  ko: {
    how2:'첫 번째 유효한 선을 그린 뒤 손가락이나 마우스를 놓으면 벌이 출발합니다. 이후 선을 더 그려도 벌 떼는 멈추지 않습니다.',
    rulesText:'선은 끊어지지 않습니다. 핍에게 가는 길이 있으면 벌은 그 길을 이용합니다. 모든 길이 막혔을 때만 느슨한 벽을 밀고 비틀어 틈을 엽니다. 같은 선을 서로 떨어진 두 지형에 걸어야 금색으로 고정됩니다. 고정된 벽 옆에도 통로가 남을 수 있습니다.',
    progressText:'30개 스테이지는 다섯 개씩 여섯 장으로 나뉩니다. 뒤의 장에서는 벌집 위치, 지형, 바람이 바뀝니다. 시간이 끝날 때까지 핍을 지키면 다음 스테이지가 열리며, 이전 스테이지에서 별을 더 얻을 수도 있습니다.',
    saveText:'열린 스테이지, 클리어 기록, 최고 별은 이 브라우저에 저장됩니다. 계정은 필요하지 않습니다. 이 사이트의 브라우저 데이터를 지우면 진행도 사라지며, 다른 브라우저나 기기로 자동 공유되지 않습니다.',
    faq1a:'네. 꽃꿀이 남아 있으면 짧은 선을 추가해 통로를 막을 수 있습니다. 그리는 동안에도 벌은 계속 움직입니다.',
    faq2q:'선이 금색이 되지 않고 움직이는 이유는 무엇인가요?',
    faq2a:'두 돌을 직선으로 잇거나 돌 하나만 감싼 벽은 여전히 느슨합니다. 같은 선을 서로 떨어진 두 지형에 감거나 걸어야 합니다. 돌 하나에 닿는 것만으로는 부족합니다.',
    faq3q:'금색 벽이 있어도 실패할 수 있나요?',
    faq3a:'네. 금색은 벽이 고정됐다는 뜻이지, 핍 주변이 완전히 막혔다는 뜻은 아닙니다. 벌은 남은 길을 이용하므로 꽃꿀을 다 쓰기 전에 틈을 확인하세요.',
    faq4q:'별은 어떻게 계산하나요?',
    faq4a:'먼저 시간이 끝날 때까지 핍을 지켜야 합니다. 클리어 시 꽃꿀 사용량이 45 이하면 별 세 개, 45 초과 72 이하면 두 개, 72를 넘으면 한 개입니다. 실패한 시도에서는 별을 얻지 못합니다.',
    faq5q:'다시 플레이하면 최고 기록이 지워지나요?',
    faq5a:'아니요. 더 많은 별을 얻으면 최고 기록이 갱신되지만, 낮은 결과로는 덮어쓰지 않습니다. 열린 스테이지도 같은 브라우저에 유지됩니다.',
    designTitle:'선의 위치가 중요한 이유',
    designText:'벽이 길수록 꽃꿀은 많이 들지만 길이 반드시 막히는 것은 아닙니다. 두 고정점과 벌이 돌아갈 수 있는 곳을 살펴보세요. 짧은 선 하나로 틈을 막을 수 있어도, 그 꽃꿀 역시 별 계산에 포함됩니다.',
    gameplayTags:['그리기 방어','두 지점 고정','꽃꿀 관리']
  },
  es: {
    how2:'Suelta la primera línea válida para poner en marcha a las abejas. Después, dibujar más líneas no detiene la oleada.',
    rulesText:'Las líneas no se rompen. Las abejas usan cualquier camino abierto hasta Pip. Solo cuando todos están cerrados empujan y retuercen los muros sueltos hasta abrir un hueco. El mismo trazo debe engancharse a dos puntos separados del terreno para quedar fijo y dorado. Aun así, puede quedar un camino alrededor.',
    progressText:'Los 30 niveles se reparten en seis capítulos de cinco. Los capítulos posteriores cambian las colmenas, el terreno y el viento. Protege a Pip hasta que termine el tiempo para abrir el siguiente nivel, o repite uno anterior para mejorar sus estrellas.',
    saveText:'Los niveles abiertos, las victorias y las mejores estrellas se guardan en este navegador. No necesitas cuenta. Borrar los datos del sitio elimina ese progreso; otro navegador o dispositivo no lo comparte automáticamente.',
    faq1a:'Sí, mientras quede néctar. Añade una línea corta para cerrar un camino abierto. Las abejas siguen moviéndose mientras dibujas.',
    faq2q:'¿Por qué se mueve mi línea en vez de ponerse dorada?',
    faq2a:'Un puente recto o un círculo alrededor de una sola piedra sigue suelto. Rodea o engancha dos puntos separados del terreno con el mismo trazo. Tocar una sola piedra no basta.',
    faq3q:'¿Puedo perder aunque tenga un muro dorado?',
    faq3a:'Sí. El dorado indica que el muro está fijo, no que Pip esté totalmente rodeado. Las abejas usan cualquier camino restante. Revisa los huecos antes de gastar el néctar que te queda.',
    faq4q:'¿Cómo se consiguen las estrellas?',
    faq4a:'Primero protege a Pip hasta que termine el tiempo. Ganar usando como máximo 45 de néctar da tres estrellas; más de 45 y hasta 72 da dos; más de 72 da una. Un intento fallido no da estrellas.',
    faq5q:'¿Repetir un nivel borra mi mejor resultado?',
    faq5a:'No. Una victoria puede mejorar las estrellas guardadas, pero un resultado inferior no las sustituye. Los niveles abiertos también se conservan en el mismo navegador.',
    designTitle:'Por qué importa dónde trazas la línea',
    designText:'Un muro más largo consume más néctar, pero no siempre cierra el camino. Decide dónde colocar dos anclajes y por dónde podrían rodearlo las abejas. Una barrera corta adicional puede tapar el hueco, aunque su néctar también cuenta para las estrellas.',
    gameplayTags:['Defensa con dibujo','Anclaje en dos puntos','Gestión del néctar']
  },
  'pt-BR': {
    how2:'Solte a primeira linha válida para liberar as abelhas. Depois disso, desenhar outras linhas não pausa a onda.',
    rulesText:'As linhas não se rompem. As abelhas usam qualquer caminho aberto até Pip. Só quando todos estão bloqueados elas empurram e torcem paredes soltas até abrir uma passagem. O mesmo traço precisa se prender a dois pontos separados do terreno para ficar fixo e dourado. Mesmo assim, pode sobrar um caminho ao redor.',
    progressText:'As 30 fases formam seis capítulos de cinco. Nos capítulos seguintes, mudam as colmeias, o terreno e o vento. Proteja Pip até o tempo acabar para abrir a próxima fase, ou repita uma anterior para melhorar as estrelas.',
    saveText:'Fases abertas, vitórias e melhores estrelas ficam salvas neste navegador. Não é preciso ter conta. Limpar os dados do site remove esse progresso; outro navegador ou aparelho não o recebe automaticamente.',
    faq1a:'Sim, enquanto houver néctar. Acrescente uma linha curta para bloquear uma passagem. As abelhas continuam se movendo enquanto você desenha.',
    faq2q:'Por que minha linha se move em vez de ficar dourada?',
    faq2a:'Uma ponte reta ou um círculo ao redor de uma única pedra continua solto. Envolva ou enganche dois pontos separados do terreno com o mesmo traço. Só tocar uma pedra não basta.',
    faq3q:'Posso perder mesmo com uma parede dourada?',
    faq3a:'Sim. Dourado significa que a parede está fixa, não que Pip esteja totalmente cercado. As abelhas usam qualquer caminho restante. Confira as aberturas antes de gastar o resto do néctar.',
    faq4q:'Como as estrelas são calculadas?',
    faq4a:'Primeiro proteja Pip até o fim do tempo. Vencer usando no máximo 45 de néctar rende três estrelas; mais de 45 e até 72 rende duas; mais de 72 rende uma. Tentativas perdidas não dão estrelas.',
    faq5q:'Repetir uma fase apaga meu melhor resultado?',
    faq5a:'Não. Uma vitória pode melhorar as estrelas salvas, mas um resultado pior não as substitui. As fases abertas também continuam disponíveis no mesmo navegador.',
    designTitle:'Por que a posição da linha importa',
    designText:'Uma parede maior gasta mais néctar sem necessariamente fechar o caminho. Observe onde colocar dois apoios e por onde as abelhas podem contornar a linha. Uma barreira curta pode fechar a abertura, mas seu néctar também entra no cálculo das estrelas.',
    gameplayTags:['Defesa com desenho','Fixação em dois pontos','Gestão de néctar']
  },
  fr: {
    how2:'Relâchez votre première ligne valide pour lancer les abeilles. Ensuite, tracer d’autres lignes ne met pas la vague en pause.',
    rulesText:'Les lignes ne cassent pas. Les abeilles empruntent tout passage ouvert vers Pip. Quand tous les chemins sont fermés, elles poussent et tordent les murs libres jusqu’à créer une ouverture. Un même trait doit s’accrocher à deux points distincts du terrain pour se fixer et devenir doré. Un passage peut encore subsister autour du mur.',
    progressText:'Les 30 niveaux forment six chapitres de cinq. Les chapitres suivants changent les ruches, le terrain et le vent. Protégez Pip jusqu’à la fin du compte à rebours pour ouvrir le niveau suivant, ou rejouez un niveau pour améliorer ses étoiles.',
    saveText:'Les niveaux ouverts, les victoires et les meilleures étoiles sont enregistrés dans ce navigateur. Aucun compte n’est nécessaire. Effacer les données du site supprime cette progression ; elle n’est pas partagée automatiquement avec un autre navigateur ou appareil.',
    faq1a:'Oui, tant qu’il reste du nectar. Ajoutez un petit trait pour fermer un passage. Les abeilles continuent de bouger pendant que vous dessinez.',
    faq2q:'Pourquoi ma ligne bouge-t-elle au lieu de devenir dorée ?',
    faq2a:'Un pont droit ou une boucle autour d’une seule pierre reste mobile. Enroulez ou accrochez le même trait autour de deux points distincts du terrain. Toucher une seule pierre ne suffit pas.',
    faq3q:'Puis-je perdre malgré un mur doré ?',
    faq3a:'Oui. La couleur dorée indique que le mur est fixé, pas que Pip est entièrement entouré. Les abeilles empruntent les chemins restants. Vérifiez les ouvertures avant de dépenser tout votre nectar.',
    faq4q:'Comment les étoiles sont-elles attribuées ?',
    faq4a:'Protégez d’abord Pip jusqu’à la fin du compte à rebours. Une victoire coûtant au plus 45 unités de nectar donne trois étoiles ; plus de 45 et au plus 72 en donne deux ; plus de 72 en donne une. Une tentative perdue ne rapporte aucune étoile.',
    faq5q:'Rejouer efface-t-il mon meilleur résultat ?',
    faq5a:'Non. Une victoire peut améliorer les étoiles enregistrées, mais un résultat inférieur ne les remplace pas. Les niveaux ouverts restent aussi disponibles dans le même navigateur.',
    designTitle:'Pourquoi le placement du trait compte',
    designText:'Un mur plus long consomme plus de nectar sans forcément fermer le chemin. Repérez deux points d’ancrage et les endroits où les abeilles pourraient contourner le trait. Une petite barrière supplémentaire peut fermer une ouverture, mais son nectar compte aussi pour les étoiles.',
    gameplayTags:['Défense par dessin','Ancrage en deux points','Gestion du nectar']
  },
  de: {
    how2:'Lass die erste gültige Linie los, um die Bienen zu starten. Danach hält das Zeichnen weiterer Linien die Welle nicht an.',
    rulesText:'Linien reißen nicht. Die Bienen nehmen jeden offenen Weg zu Pip. Erst wenn alle Wege versperrt sind, schieben und verdrehen sie lose Wände, bis eine Lücke entsteht. Derselbe Strich muss sich an zwei getrennten Geländepunkten verhaken, damit er fest und golden wird. Um die feste Wand herum kann trotzdem ein Weg offen bleiben.',
    progressText:'Die 30 Stufen bilden sechs Kapitel mit je fünf Stufen. Spätere Kapitel verändern Bienenstöcke, Gelände und Wind. Halte Pip bis zum Ende des Timers sicher, um die nächste Stufe zu öffnen, oder verbessere beim Wiederholen deine Sterne.',
    saveText:'Freigeschaltete und abgeschlossene Stufen sowie die besten Sterne werden in diesem Browser gespeichert. Ein Konto ist nicht nötig. Das Löschen der Websitedaten entfernt diesen Fortschritt; andere Browser oder Geräte übernehmen ihn nicht automatisch.',
    faq1a:'Ja, solange Nektar übrig ist. Zeichne eine kurze Linie, um einen offenen Weg zu schließen. Die Bienen bewegen sich dabei weiter.',
    faq2q:'Warum bewegt sich meine Linie, statt golden zu werden?',
    faq2a:'Eine gerade Brücke oder eine Schlinge um nur einen Stein bleibt beweglich. Führe denselben Strich um zwei getrennte Geländepunkte oder hake ihn dort ein. Einen einzelnen Stein zu berühren reicht nicht.',
    faq3q:'Kann ich trotz einer goldenen Wand verlieren?',
    faq3a:'Ja. Gold bedeutet, dass die Wand fest ist, nicht dass Pip vollständig eingeschlossen ist. Die Bienen nutzen verbleibende Wege. Suche nach Lücken, bevor du den restlichen Nektar verbrauchst.',
    faq4q:'Wie werden die Sterne vergeben?',
    faq4a:'Schütze Pip zuerst bis zum Ende des Timers. Ein Sieg mit höchstens 45 verbrauchtem Nektar bringt drei Sterne, mit mehr als 45 und höchstens 72 zwei, mit mehr als 72 einen. Ein gescheiterter Versuch bringt keine Sterne.',
    faq5q:'Löscht ein neuer Versuch mein bestes Ergebnis?',
    faq5a:'Nein. Ein Sieg kann die gespeicherten Sterne verbessern, aber ein schlechteres Ergebnis ersetzt sie nicht. Freigeschaltete Stufen bleiben im selben Browser verfügbar.',
    designTitle:'Warum die Lage der Linie zählt',
    designText:'Eine längere Wand verbraucht mehr Nektar, schließt aber nicht unbedingt den Weg. Entscheidend sind zwei Ankerpunkte und mögliche Umwege für die Bienen. Eine kurze zusätzliche Barriere kann die Lücke schließen; ihr Nektar zählt jedoch bei der Sternebewertung mit.',
    gameplayTags:['Zeichenverteidigung','Zweipunkt-Verankerung','Nektarverwaltung']
  },
  it: {
    how2:'Rilascia la prima linea valida per far partire le api. Da quel momento, disegnare altre linee non mette in pausa l’ondata.',
    rulesText:'Le linee non si spezzano. Le api usano qualsiasi percorso aperto verso Pip. Solo quando tutti i percorsi sono chiusi spingono e torcono i muri liberi finché si apre un varco. Lo stesso tratto deve agganciarsi a due punti separati del terreno per fissarsi e diventare dorato. Può comunque restare un passaggio attorno al muro.',
    progressText:'I 30 livelli formano sei capitoli da cinque. Nei capitoli successivi cambiano gli alveari, il terreno e il vento. Proteggi Pip fino alla fine del conto alla rovescia per aprire il livello seguente, oppure ripeti un livello per migliorare le stelle.',
    saveText:'Livelli aperti, vittorie e migliori stelle vengono salvati in questo browser. Non serve un account. Cancellare i dati del sito elimina i progressi, che non passano automaticamente a un altro browser o dispositivo.',
    faq1a:'Sì, finché rimane nettare. Aggiungi una linea corta per chiudere un passaggio. Le api continuano a muoversi mentre disegni.',
    faq2q:'Perché la linea si muove invece di diventare dorata?',
    faq2a:'Un ponte diritto o un anello attorno a una sola pietra resta mobile. Avvolgi o aggancia due punti separati del terreno con lo stesso tratto. Toccare una sola pietra non basta.',
    faq3q:'Posso perdere anche con un muro dorato?',
    faq3a:'Sì. Il colore dorato indica che il muro è fissato, non che Pip sia completamente circondato. Le api usano i percorsi rimasti. Controlla i varchi prima di consumare tutto il nettare.',
    faq4q:'Come vengono assegnate le stelle?',
    faq4a:'Prima proteggi Pip fino alla fine del tempo. Una vittoria con al massimo 45 di nettare consumato dà tre stelle; oltre 45 e fino a 72 dà due stelle; oltre 72 ne dà una. Un tentativo fallito non assegna stelle.',
    faq5q:'Rigiocare cancella il mio miglior risultato?',
    faq5a:'No. Una vittoria può migliorare le stelle salvate, ma un risultato peggiore non le sostituisce. Anche i livelli aperti restano disponibili nello stesso browser.',
    designTitle:'Perché conta dove tracci la linea',
    designText:'Un muro più lungo consuma più nettare senza necessariamente chiudere il percorso. Individua due ancoraggi e i punti da cui le api possono aggirare la linea. Una piccola barriera aggiuntiva può chiudere il varco, ma il suo nettare conta anche per le stelle.',
    gameplayTags:['Difesa con disegno','Ancoraggio a due punti','Gestione del nettare']
  },
  ru: {
    how2:'Отпустите первую допустимую линию, чтобы пчёлы начали двигаться. После этого рисование новых линий не останавливает волну.',
    rulesText:'Линии не рвутся. Пчёлы используют любой открытый путь к Пипу. Только когда все пути перекрыты, они толкают и поворачивают свободные стены, пока не появится проход. Один и тот же штрих нужно зацепить за две разнесённые точки рельефа, чтобы он закрепился и стал золотым. Вокруг закреплённой стены всё ещё может оставаться путь.',
    progressText:'30 этапов разделены на шесть глав по пять. В следующих главах меняются ульи, рельеф и ветер. Защитите Пипа до конца таймера, чтобы открыть следующий этап, или повторите пройденный ради большего числа звёзд.',
    saveText:'Открытые этапы, победы и лучшие звёзды сохраняются в этом браузере. Учётная запись не нужна. Удаление данных сайта стирает прогресс; другой браузер или устройство не получает его автоматически.',
    faq1a:'Да, пока остаётся нектар. Добавьте короткую линию, чтобы перекрыть проход. Во время рисования пчёлы продолжают двигаться.',
    faq2q:'Почему линия двигается, а не становится золотой?',
    faq2a:'Прямой мост или петля вокруг одного камня остаётся подвижной. Обведите или зацепите одним штрихом две разнесённые точки рельефа. Простого касания одного камня недостаточно.',
    faq3q:'Можно ли проиграть с золотой стеной?',
    faq3a:'Да. Золотой цвет означает, что стена закреплена, а не что Пип полностью окружён. Пчёлы используют оставшиеся пути. Проверьте зазоры, прежде чем потратить весь нектар.',
    faq4q:'Как начисляются звёзды?',
    faq4a:'Сначала защитите Пипа до конца таймера. Победа с расходом не более 45 нектара даёт три звезды, более 45 и не более 72 — две, более 72 — одну. Неудачная попытка звёзд не приносит.',
    faq5q:'Повторная игра удалит мой лучший результат?',
    faq5a:'Нет. Победа может повысить сохранённое число звёзд, но худший результат его не заменяет. Открытые этапы тоже остаются доступными в том же браузере.',
    designTitle:'Почему важно расположение линии',
    designText:'Длинная стена расходует больше нектара, но не обязательно перекрывает путь. Выбирайте две опоры и проверяйте, где пчёлы могут облететь линию. Короткая дополнительная преграда способна закрыть проход, однако потраченный на неё нектар тоже влияет на звёзды.',
    gameplayTags:['Защита рисованием','Крепление в двух точках','Управление нектаром']
  },
  hi: {
    how2:'पहली मान्य रेखा पूरी करके उँगली या माउस छोड़ें, तभी मधुमक्खियाँ चलती हैं। इसके बाद नई रेखा बनाते समय झुंड नहीं रुकता।',
    rulesText:'रेखाएँ टूटती नहीं हैं। पिप तक खुला रास्ता हो तो मधुमक्खियाँ उसी से जाती हैं। सभी रास्ते बंद होने पर ही वे ढीली दीवार को धकेलती और मोड़ती हैं, जब तक कोई रास्ता न खुल जाए। एक ही रेखा को भूभाग के दो अलग बिंदुओं पर फँसाने से वह सुनहरी होकर टिकती है। स्थिर दीवार के किनारे से भी रास्ता बच सकता है।',
    progressText:'30 चरण छह अध्यायों में बँटे हैं, हर अध्याय में पाँच चरण हैं। आगे छत्तों की जगह, भूभाग और हवा बदलते हैं। समय समाप्त होने तक पिप को बचाकर अगला चरण खोलें, या पुराने चरण में अपने सितारे बढ़ाएँ।',
    saveText:'खुले चरण, जीत और सबसे अच्छे सितारे इसी ब्राउज़र में सहेजे जाते हैं। खाते की जरूरत नहीं है। इस साइट का ब्राउज़र डेटा मिटाने से प्रगति भी मिटती है; दूसरे ब्राउज़र या उपकरण पर यह अपने आप नहीं पहुँचती।',
    faq1a:'हाँ, जब तक मकरंद बचा है। खुला रास्ता बंद करने के लिए छोटी रेखा जोड़ें। आपके रेखा बनाते समय भी मधुमक्खियाँ चलती रहती हैं।',
    faq2q:'मेरी रेखा सुनहरी होने के बजाय हिलती क्यों है?',
    faq2a:'सीधा पुल या केवल एक पत्थर के चारों ओर बना घेरा ढीला रहता है। एक ही रेखा को भूभाग के दो अलग बिंदुओं के चारों ओर लपेटें या फँसाएँ। केवल एक पत्थर को छूना पर्याप्त नहीं है।',
    faq3q:'क्या सुनहरी दीवार होने पर भी हार सकता हूँ?',
    faq3a:'हाँ। सुनहरा रंग बताता है कि दीवार स्थिर है, यह नहीं कि पिप चारों ओर से सुरक्षित है। मधुमक्खियाँ बचे हुए रास्ते से निकलती हैं। सारा मकरंद खर्च करने से पहले खाली जगह देखें।',
    faq4q:'सितारे कैसे मिलते हैं?',
    faq4a:'पहले समय समाप्त होने तक पिप को बचाएँ। जीत में 45 या कम मकरंद खर्च हो तो तीन सितारे, 45 से अधिक और 72 तक खर्च हो तो दो, और 72 से अधिक हो तो एक सितारा मिलता है। असफल प्रयास में सितारे नहीं मिलते।',
    faq5q:'दोबारा खेलने से मेरा सबसे अच्छा परिणाम मिट जाएगा?',
    faq5a:'नहीं। जीत से सहेजे गए सितारे बढ़ सकते हैं, लेकिन कम सितारों वाला परिणाम उन्हें बदलता नहीं है। खुले चरण भी इसी ब्राउज़र में उपलब्ध रहते हैं।',
    designTitle:'रेखा की जगह क्यों मायने रखती है',
    designText:'लंबी दीवार अधिक मकरंद लेती है, पर जरूरी नहीं कि रास्ता बंद करे। दो सहारों की जगह और मधुमक्खियों के घूमकर निकलने का रास्ता देखें। छोटी अतिरिक्त रेखा खाली जगह बंद कर सकती है, लेकिन उसका मकरंद भी सितारों की गणना में जुड़ता है।',
    gameplayTags:['रेखा बनाकर रक्षा','दो बिंदुओं पर पकड़','मकरंद प्रबंधन']
  },
  ar: {
    how2:'أفلت أول خط صالح لتبدأ النحلات بالحركة. بعد ذلك، لا يوقف رسم خطوط إضافية الموجة.',
    rulesText:'الخطوط لا تنكسر. تسلك النحلات أي طريق مفتوح إلى بيب. وعندما تنسد جميع الطرق، تدفع الجدران الحرة وتلفها حتى تظهر فجوة. يجب أن يتعلق الخط نفسه بنقطتين متباعدتين من التضاريس كي يثبت ويصبح ذهبياً. وقد يبقى طريق مفتوح حول الجدار الثابت.',
    progressText:'تتوزع المراحل الثلاثون على ستة فصول، في كل منها خمس مراحل. تغيّر الفصول اللاحقة مواقع الخلايا والتضاريس والرياح. احمِ بيب حتى انتهاء الوقت لفتح المرحلة التالية، أو أعد مرحلة سابقة لتحسين نجومها.',
    saveText:'تُحفظ المراحل المفتوحة والانتصارات وأفضل النجوم في هذا المتصفح. لا يلزم حساب. مسح بيانات الموقع من المتصفح يمحو التقدم، ولا ينتقل تلقائياً إلى متصفح أو جهاز آخر.',
    faq1a:'نعم، ما دام الرحيق متاحاً. أضف خطاً قصيراً لإغلاق طريق مفتوح. تواصل النحلات الحركة أثناء الرسم.',
    faq2q:'لماذا يتحرك خطي بدلاً من أن يصبح ذهبياً؟',
    faq2a:'يبقى الجسر المستقيم أو الالتفاف حول حجر واحد قابلاً للحركة. لفّ الخط نفسه أو علّقه بنقطتين متباعدتين من التضاريس. مجرد ملامسة حجر واحد لا يكفي.',
    faq3q:'هل يمكن أن أخسر رغم وجود جدار ذهبي؟',
    faq3a:'نعم. يعني اللون الذهبي أن الجدار ثابت، لا أن بيب محاط تماماً. تستخدم النحلات أي طريق متبقٍ. افحص الفجوات قبل إنفاق بقية الرحيق.',
    faq4q:'كيف تُمنح النجوم؟',
    faq4a:'احمِ بيب أولاً حتى ينتهي الوقت. يمنحك الفوز مع إنفاق 45 من الرحيق أو أقل ثلاث نجوم، وأكثر من 45 وحتى 72 نجمتين، وأكثر من 72 نجمة واحدة. لا تمنح المحاولة الخاسرة نجوماً.',
    faq5q:'هل تمحو إعادة اللعب أفضل نتيجة لي؟',
    faq5a:'لا. قد يرفع الفوز عدد النجوم المحفوظة، لكن النتيجة الأضعف لا تستبدلها. وتبقى المراحل المفتوحة متاحة في المتصفح نفسه.',
    designTitle:'لماذا يهم موضع الخط',
    designText:'يستهلك الجدار الأطول رحيقاً أكثر، لكنه لا يغلق الطريق بالضرورة. حدّد نقطتي تثبيت وانتبه إلى الأماكن التي قد تلتف منها النحلات. قد يغلق حاجز قصير إضافي الفجوة، لكن رحيقه يدخل أيضاً في حساب النجوم.',
    gameplayTags:['دفاع بالرسم','تثبيت بنقطتين','إدارة الرحيق']
  }
};

const escapeHtml = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const decodeHtml = value => String(value).replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(amp|lt|gt|quot|apos);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[n]));
const plain = value => decodeHtml(String(value).replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
const read = file => fs.readFileSync(file,'utf8');
const routeFile = (root,segment,id=ID) => path.join(root,segment,'games',id,'index.html');
const h1 = file => {
  const match=read(file).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  assert(match,`Missing approved H1: ${file}`);
  return plain(match[1]);
};
function expectedCopy(root) {
  return Object.fromEntries(Object.entries(HONEY_ROUTES).map(([locale,segment])=>[locale,{
    ...COPY[locale],
    relatedPrismDescription:RELATED_PRISM_DESCRIPTION[locale],
    title:h1(routeFile(root,segment)),
    relatedPrismTitle:h1(routeFile(root,segment,'animal-prism-battalion')),
    relatedBeastTitle:h1(routeFile(root,segment,'beast-tactician'))
  }]));
}
export function readHoneyDictionary(root) {
  const sandbox={window:{}};
  vm.runInNewContext(read(path.join(root,'games',ID,'locales.js')),sandbox,{timeout:1000});
  return JSON.parse(JSON.stringify(sandbox.window.ANIMAL_HONEY_SHIELD_LOCALES));
}
export function compileHoneyCopy(root) {
  const file=path.join(root,'games',ID,'locales.js');
  let source=read(file);
  const block=`${BEGIN}\n  const honeyTextGrowthCopy=${JSON.stringify(expectedCopy(root),null,2)};\n  for(const [language,copy] of Object.entries(honeyTextGrowthCopy)) Object.assign(window.ANIMAL_HONEY_SHIELD_LOCALES[language],copy);\n${END}\n`;
  if(source.includes(BEGIN)) {
    const start=source.indexOf(BEGIN),finish=source.indexOf(END,start);
    assert(finish>=0,'Unterminated generated Honey copy');
    source=source.slice(0,start)+source.slice(finish+END.length).replace(/^\r?\n/,'');
  }
  const end=source.lastIndexOf('})();');
  assert(end>=0 && source.includes('window.ANIMAL_HONEY_SHIELD_LOCALES='),'Unknown Honey locale source contract');
  source=source.slice(0,end)+block+source.slice(end);
  if(source!==read(file))fs.writeFileSync(file,source);
}

export function applyHoneyShieldText(html,locale,dictionary,{canonical=false}={}) {
  const copy=dictionary[locale];
  assert(copy && HONEY_ROUTES[locale],`Missing Honey locale ${locale}`);
  let titleCount=0;
  html=html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi,title=>{
    if(titleCount++)return '';
    // Keep the established localized primary title. The root's sole legacy
    // Animal-prefixed title is an identity mismatch, not a new search target.
    return canonical?title.replace('Animal Honey Shield | WeightPlay',`${escapeHtml(copy.title)} | WeightPlay`):title;
  });
  assert(titleCount>=1,'Missing primary title');
  const faq=/(<h3\b[^>]*\bdata-i18n=["']faqTitle["'][^>]*>[\s\S]*?<\/h3>\s*<dl>)([\s\S]*?)(<\/dl>)/i;
  assert(faq.test(html),'Missing owned FAQ container');
  html=html.replace(faq,(_,open,body,close)=>{
    for(let i=3;i<=5;i++)if(!new RegExp(`data-i18n=["']faq${i}q["']`).test(body))body+=`\n          <div><dt data-i18n="faq${i}q"></dt><dd data-i18n="faq${i}a"></dd></div>`;
    return open+body+close;
  });
  if(!html.includes('data-wp-honey-design-note')) {
    const anchor=/<article\b[^>]*>\s*<h3\b[^>]*\bdata-i18n=["']saveTitle["']/i;
    assert(anchor.test(html),'Missing owned save section');
    html=html.replace(anchor,match=>`<article class="game-info-section" data-wp-honey-design-note><h3 data-i18n="designTitle"></h3><p data-i18n="designText"></p></article>\n        ${match}`);
  }
  html=html.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-i18n=["']([^"']+)["'][^>]*>)([^<]*)(<\/\2>)/gi,(whole,open,tag,key,text,close)=>{
    if(tag.toLowerCase()==='h1')return whole;
    assert(Object.hasOwn(copy,key),`${locale}: missing key ${key}`);
    return typeof copy[key]==='string'?`${open}${escapeHtml(copy[key])}${close}`:whole;
  });
  let tagBlocks=0;
  html=html.replace(/(<div\b[^>]*\bdata-wp-gameplay-tags=["'][^"']*["'][^>]*>)[\s\S]*?<\/div>/gi,(_,open)=>{
    tagBlocks++;
    return open.replace(/data-wp-gameplay-tags=["'][^"']*["']/,'data-wp-gameplay-tags="1.4.0"')+copy.gameplayTags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')+'</div>';
  });
  assert.equal(tagBlocks,1,`${locale}: gameplay-tag container count`);
  html=html.replace(/<[a-z][\w-]*\b[^>]*>/gi,tag=>{
    if(/\bclass=["'][^"']*\bmain-poster\b/i.test(tag) && /data-i18n-alt=/.test(tag))tag=tag.replace(/data-i18n-alt=["'][^"']*["']/,'data-i18n-alt="posterAlt"');
    for(const [binding,attribute] of [['data-i18n-aria','aria-label'],['data-i18n-alt','alt']]){
      const key=tag.match(new RegExp(`\\b${binding}=["']([^"']+)["']`,'i'))?.[1];
      if(!key)continue;
      assert(typeof copy[key]==='string',`${locale}: invalid ${binding} ${key}`);
      const attr=new RegExp(`(\\s)${attribute}=["'][^"']*["']`,'i');
      tag=attr.test(tag)?tag.replace(attr,`$1${attribute}="${escapeHtml(copy[key])}"`):tag.replace(/\s*\/?>$/,match=>` ${attribute}="${escapeHtml(copy[key])}"${match}`);
    }
    const related=tag.match(/data-wp-related-id=["']([^"']+)["']/)?.[1];
    if(related && ['animal-prism-battalion','beast-tactician'].includes(related))tag=tag.replace(/(\s)href=["'][^"']*["']/i,`$1href="/${HONEY_ROUTES[locale]}/games/${related}/"`);
    if(/^<script\b/i.test(tag))tag=tag.replace(/(\ssrc=["'])([^"']*(?:locales|game)\.js)([^"']*)(["'])/i,(_,prefix,base,query,quote)=>{
      query=query.replace(/(?:&amp;|&)wp-text=[^&"']*/g,'');
      return `${prefix}${base}${query}${query?'&amp;':'?'}wp-text=20260929-honey140-final${quote}`;
    });
    return tag;
  });
  // Honey currently has no FAQ JSON-LD. Do not silently leave stale answers if
  // a later source adds it; that source change needs an explicit schema review.
  assert(!/"@type"\s*:\s*"FAQPage"/.test(html),'New FAQ schema needs matching-answer review');
  return html.replace(/^[ \t]+$/gm,'');
}

export function refreshHoneyShieldTextRoutes(root=process.cwd()) {
  compileHoneyCopy(root);
  const dictionaries=readHoneyDictionary(root);
  for(const [locale,segment] of [['en',''],...Object.entries(HONEY_ROUTES)]) {
    const file=routeFile(root,segment);
    assert(fs.existsSync(file),`Do not generate a missing Honey route: ${file}`);
    const before=read(file),after=applyHoneyShieldText(before,locale,dictionaries,{canonical:!segment});
    if(before!==after)fs.writeFileSync(file,after);
  }
}

export function auditHoneyShieldText(root=process.cwd()) {
  const dictionaries=readHoneyDictionary(root),expected=expectedCopy(root),reports=[];
  const baseKeys=Object.keys(dictionaries.en).sort();
  const variables=value=>[...JSON.stringify(value).matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
  for(const [locale,copy] of Object.entries(dictionaries)) {
    assert.deepEqual(Object.keys(copy).sort(),baseKeys,`${locale}: runtime keys`);
    for(const [key,value] of Object.entries(copy)) {
      assert.deepEqual(variables(value),variables(dictionaries.en[key]),`${locale}/${key}: placeholders`);
      assert(!/\uFFFD|\?\?\?|\bundefined\b/.test(JSON.stringify(value)),`${locale}/${key}: damaged text`);
    }
    for(const [key,value] of Object.entries(expected[locale]))assert.deepEqual(copy[key],value,`${locale}/${key}: owned source parity`);
  }
  assert.deepEqual(Object.keys(dictionaries).sort(),Object.keys(HONEY_ROUTES).sort(),'13 required locales');
  for(const [locale,segment] of [['en',''],...Object.entries(HONEY_ROUTES)]) {
    const file=routeFile(root,segment),html=read(file),copy=dictionaries[locale];
    assert.equal(applyHoneyShieldText(html,locale,dictionaries,{canonical:!segment}),html,`${file}: non-idempotent or stale output`);
    assert.equal((html.match(/<title\b/gi)||[]).length,1,`${file}: title count`);
    assert.equal((html.match(/data-wp-gameplay-tags=["']1\.4\.0["']/g)||[]).length,1,`${file}: tags version`);
    assert.equal(copy.gameplayTags.length,3,`${file}: three gameplay tags`);
    assert(/name=["']robots["'][^>]*content=["']index,follow["']/i.test(html),`${file}: indexability`);
    if(locale==='ar')assert(/<html\b[^>]*\bdir=["']rtl["']/i.test(html),`${file}: Arabic RTL`);
    assert(!/Save the Doggy|TapNation|tap-nation\.io|data-wp-reference|comparison-loader|comparison\.js/i.test(html),`${file}: public third-party material`);
    for(let i=1;i<=5;i++) {
      assert.equal((html.match(new RegExp(`data-i18n=["']faq${i}q["']`,'g'))||[]).length,1,`${file}: FAQ ${i}`);
      assert(copy[`faq${i}q`] && copy[`faq${i}a`],`${file}: FAQ source ${i}`);
    }
    const related=[...html.matchAll(/<a\b[^>]*data-wp-related-id=["']([^"']+)["'][^>]*>/g)];
    assert.equal(related.length,2,`${file}: related count`);
    for(const match of related) {
      const id=match[1],href=match[0].match(/\shref=["']([^"']+)/)?.[1];
      assert.equal(href,`/${HONEY_ROUTES[locale]}/games/${id}/`,`${file}: related route`);
      const target=routeFile(root,HONEY_ROUTES[locale],id);
      assert(fs.existsSync(target),`${file}: missing related target`);
      assert(/name=["']robots["'][^>]*content=["']index,follow["']/i.test(read(target)),`${file}: related not public/indexable`);
    }
    const leaf=/(<([a-z][\w-]*)\b[^>]*\bdata-i18n=["']([^"']+)["'][^>]*>)([^<]*)(<\/\2>)/gi;
    for(const match of html.matchAll(leaf))if(typeof copy[match[3]]==='string')assert.equal(plain(match[4]),plain(copy[match[3]]),`${file}: ${match[3]} initial/runtime text`);
    reports.push({locale:segment?locale:'canonical-en',keys:baseKeys.length,faq:5,tags:3,related:2,result:'PASS'});
  }
  return reports;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv.includes('--write'))refreshHoneyShieldTextRoutes();
  console.log(JSON.stringify({game:ID,version:TEXT_VERSION,mode:'static-text-only',routes:auditHoneyShieldText()},null,2));
}
