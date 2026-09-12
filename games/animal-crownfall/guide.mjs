// Authored guide presentation; stage names and campaign data remain unchanged.
import {COPY} from './locales.mjs';
import {upgradeText} from './upgrade-copy.mjs';
// Each locale describes this game's actual removal/absorption rules. These
// compact paragraphs are also consumed by the static route generator.
const rules={
 en:['Tap connected matching blocks to remove the whole group; blocks do not fall or refill. Your fox falls, then approaches the nearest guard on the same platform (left on a tie). Greater power wins and absorbs the guard’s power; equal or lower loses.','Keys open gates; runes remove shields. Defeat flag bearers to remove their bonuses. Avoid spikes and meet the boss conditions before taking the crown.','Progress and an unfinished puzzle stay in this browser. Retry preserves unlocked stages.'],
 'zh-Hant':['點相連的同色方塊，整群消除；方塊不會下落或補入。狐狸落地後會走向同平台最近的守衛，同距離先往左。戰力較高才能獲勝並吸收敵方戰力；相等也會輸。','鑰匙開門、符文解除護盾。先擊敗旗手可消除敵方加成；避開尖刺，完成首領條件再取皇冠。','進度與未完成的棋局儲存在此瀏覽器；重玩不會清除已解鎖關卡。'],
 'zh-Hans':['点相连的同色方块，整群消除；方块不会下落或补入。狐狸落地后会走向同平台最近的守卫，同距离先往左。战力较高才能获胜并吸收敌方战力；相等也会输。','钥匙开门、符文解除护盾。先击败旗手可消除敌方加成；避开尖刺，完成首领条件再取皇冠。','进度与未完成的棋局保存在此浏览器；重玩不会清除已解锁关卡。'],
 ja:['つながった同色ブロックをタップしてまとめて消します。ブロックは落下も補充もしません。キツネは着地後、同じ足場の最寄りの敵へ（同距離なら左へ）。戦力が上回れば勝って吸収し、同じか下なら負けます。','鍵で扉、ルーンで盾を解除。旗持ちを倒すと敵の強化が消えます。針を避け、ボスの条件を満たして王冠を取りましょう。','進行状況と中断した盤面はこのブラウザに保存。再挑戦しても解放済みステージは残ります。'],
 ko:['연결된 같은 색 블록을 눌러 묶음째 없애세요. 블록은 떨어지거나 채워지지 않습니다. 여우는 착지 후 같은 발판의 가장 가까운 적에게 갑니다(동률이면 왼쪽). 전투력이 높아야 이기고 적의 힘을 흡수하며, 같아도 집니다.','열쇠는 문을, 룬은 방패를 해제합니다. 기수를 쓰러뜨리면 적의 강화가 사라집니다. 가시를 피하고 보스 조건을 충족한 뒤 왕관을 얻으세요.','진행도와 미완성 퍼즐은 이 브라우저에 저장됩니다. 재도전해도 열린 단계는 유지됩니다.'],
 es:['Toca bloques iguales conectados para quitar el grupo; no caen ni se reponen. El zorro aterriza y va al guardia más cercano de la misma plataforma (izquierda si empatan). Más poder gana y absorbe al rival; igual o menos pierde.','Las llaves abren puertas y las runas quitan escudos. Derrota a los abanderados para eliminar sus bonificaciones. Evita pinchos y cumple las condiciones del jefe antes de tomar la corona.','El progreso y el puzle pendiente se guardan en este navegador. Reiniciar conserva los niveles abiertos.'],
 'pt-BR':['Toque blocos iguais conectados para remover o grupo; eles não caem nem são repostos. A raposa pousa e vai ao guarda mais próximo na mesma plataforma (à esquerda no empate). Poder maior vence e absorve o rival; igual ou menor perde.','Chaves abrem portas; runas removem escudos. Derrote porta-bandeiras para tirar seus bônus. Evite espinhos e cumpra as condições do chefe antes de pegar a coroa.','O progresso e o quebra-cabeça em andamento ficam neste navegador. Reiniciar preserva as fases abertas.'],
 fr:['Touchez les blocs identiques reliés pour retirer le groupe ; ils ne tombent pas et ne sont pas remplacés. Le renard rejoint ensuite le garde le plus proche sur sa plateforme (à gauche en cas d’égalité). Une puissance supérieure gagne et absorbe celle du garde ; sinon, c’est perdu.','Clés : portes. Runes : boucliers. Éliminez les porte-drapeaux pour retirer leurs bonus. Évitez les pointes et remplissez les conditions du boss avant de prendre la couronne.','La progression et la partie inachevée restent dans ce navigateur. Recommencer conserve les niveaux ouverts.'],
 de:['Tippe verbundene gleichfarbige Blöcke an: Die Gruppe verschwindet, ohne Nachfallen oder Auffüllen. Der Fuchs fällt und geht zum nächsten Wächter auf seiner Plattform (bei Gleichstand links). Mehr Stärke gewinnt und absorbiert den Gegner; gleich viel oder weniger verliert.','Schlüssel öffnen Tore, Runen entfernen Schilde. Besiege Fahnenträger gegen ihre Boni. Meide Stacheln und erfülle die Bossbedingungen, bevor du die Krone nimmst.','Fortschritt und das offene Rätsel bleiben in diesem Browser. Neustart erhält freigeschaltete Stufen.'],
 it:['Tocca blocchi uguali collegati per rimuovere il gruppo; non cadono né si rigenerano. La volpe atterra e raggiunge la guardia più vicina sulla stessa piattaforma (a sinistra in parità). Più forza vince e assorbe il rivale; uguale o minore perde.','Le chiavi aprono porte e le rune tolgono scudi. Sconfiggi gli alfieri per rimuovere i bonus. Evita le punte e soddisfa le condizioni del boss prima di prendere la corona.','Progressi ed enigma in corso restano in questo browser. Ricominciare conserva i livelli aperti.'],
 ru:['Нажмите на связанные блоки одного цвета: группа исчезнет без падения и пополнения блоков. Лис приземлится и пойдёт к ближайшему стражу на своей платформе (при равенстве — влево). Большая сила побеждает и поглощает силу врага; равная или меньшая проигрывает.','Ключи открывают ворота, руны снимают щиты. Победите знаменосцев, чтобы убрать их усиления. Избегайте шипов и выполните условия босса до взятия короны.','Прогресс и незавершённая задача сохраняются в этом браузере. Перезапуск не закрывает открытые уровни.'],
 hi:['जुड़े समान रंग के ब्लॉक दबाकर पूरा समूह हटाएँ; ब्लॉक गिरते या फिर भरते नहीं हैं। लोमड़ी उतरकर उसी मंच के निकटतम रक्षक की ओर जाती है (बराबरी पर बाएँ)। अधिक शक्ति होने पर जीतकर दुश्मन की शक्ति मिलती है; बराबर या कम पर हार होती है।','चाबियाँ द्वार खोलती हैं, रून्स ढाल हटाते हैं। ध्वजवाहकों को हराकर उनका बोनस हटाएँ। काँटों से बचें और ताज लेने से पहले मुखिया की शर्तें पूरी करें।','प्रगति और अधूरी पहेली इसी ब्राउज़र में रहती हैं। दोबारा खेलने पर खुले स्तर सुरक्षित रहते हैं।'],
 ar:['اضغط كتلًا متصلة من اللون نفسه لإزالة المجموعة؛ الكتل لا تسقط ولا تتجدد. يهبط الثعلب ثم يتجه لأقرب حارس على المنصة نفسها (يسارًا عند التعادل). القوة الأعلى تفوز وتمتص قوة الخصم؛ التعادل أو الأقل يعني الخسارة.','المفاتيح تفتح الأبواب والرون يزيل الدروع. اهزم حاملي الرايات لإزالة تعزيزاتهم. تجنب الأشواك وأكمل شروط الزعيم قبل أخذ التاج.','التقدم واللغز غير المكتمل محفوظان في هذا المتصفح. الإعادة تحتفظ بالمراحل المفتوحة.'],
};
const stageLabels={en:'Stage','zh-Hant':'關卡','zh-Hans':'关卡',ja:'ステージ',ko:'단계',es:'Nivel','pt-BR':'Fase',fr:'Niveau',de:'Stufe',it:'Livello',ru:'Этап',hi:'स्तर',ar:'المرحلة'};
const progression={
 en:['Campaign','Clear a puzzle to unlock the next. Try new routes around hazards and boss conditions; replay for no-hint and move-target badges. Undo restores the last action.'],
 'zh-Hant':['挑戰進程','過關解鎖下一關，依地形與首領條件安排路線。重玩可挑戰不用提示或目標步數徽章；撤銷可還原上一步。'],
 'zh-Hans':['挑战进程','过关解锁下一关，依地形与首领条件安排路线。重玩可挑战不用提示或目标步数徽章；撤销可还原上一步。'],
 ja:['挑戦の進め方','クリアすると次のステージが開きます。地形やボスの条件に合わせて道を選び、再挑戦でヒントなし・目標手数のバッジを狙いましょう。一手を戻すこともできます。'],
 ko:['도전 진행','퍼즐을 풀면 다음 단계가 열립니다. 지형과 보스 조건에 맞춰 경로를 고르세요. 다시 도전해 무힌트·목표 이동 수 배지를 얻고, 되돌리기로 마지막 행동을 취소할 수 있습니다.'],
 es:['Progresión','Resuelve un puzle para abrir el siguiente. Adapta la ruta a los peligros y al jefe. Repite para lograr insignias sin pistas o dentro del límite de movimientos; deshacer restaura la última acción.'],
 'pt-BR':['Progressão','Resolva um quebra-cabeça para abrir o próximo. Adapte a rota aos perigos e ao chefe. Jogue novamente pelas medalhas sem dicas e de meta de movimentos; desfazer restaura a última ação.'],
 fr:['Progression','Résolvez une énigme pour ouvrir la suivante. Adaptez le trajet aux dangers et au boss. Rejouez pour les badges sans indice et avec un nombre limité de coups ; annuler restaure la dernière action.'],
 de:['Fortschritt','Löse ein Rätsel, um das nächste freizuschalten. Passe den Weg an Gefahren und Bossregeln an. Wiederhole es für Abzeichen ohne Hinweise oder mit Zugziel. Rückgängig stellt die letzte Aktion wieder her.'],
 it:['Progressione','Risolvi un enigma per aprire il successivo. Adatta il percorso ai pericoli e al boss. Rigioca per i distintivi senza indizi e con obiettivo di mosse; annulla ripristina l’ultima azione.'],
 ru:['Прохождение','Решите головоломку, чтобы открыть следующую. Учитывайте ловушки и условия босса. Повторяйте ради значков без подсказок и за число ходов. Отмена восстанавливает последнее действие.'],
 hi:['चुनौती की प्रगति','पहेली पूरी करने पर अगला स्तर खुलता है। खतरों और मुखिया की शर्तों के अनुसार रास्ता चुनें। बिना संकेत और लक्ष्य चालों के पदक पाने के लिए फिर खेलें। वापसी आखिरी कार्रवाई बहाल करती है।'],
 ar:['التقدم','حل اللغز لفتح التالي واختر طريقًا يناسب المخاطر وشروط الزعيم. أعد اللعب لشارات بلا تلميحات وهدف الحركات. التراجع يعيد الإجراء الأخير.'],
};
export const DETAILS=Object.fromEntries(Object.entries(rules).map(([locale,parts])=>{
 const [heading,body]=progression[locale];
 COPY[locale].campaign=heading;
 COPY[locale].stage=stageLabels[locale];
 return [locale,[parts[0],parts[1],body,parts[2]]];
}));

// The upgraded campaign's rules are shared by the guide and native routes.
const combat={
 en:'Life cost is 40% of enemy power (60% for bosses), rounded up, minus armor; minimum 1. Life must remain above zero. A stronger sword or armor replaces the old one; it does not stack. After an upgrade, unlocked stages and clears remain; an unfinished puzzle restarts and mastery badges are earned again.',
 'zh-Hant':'戰鬥消耗敵方戰力的 40%（首領 60%），無條件進位後扣除護甲，至少扣 1 生命；剩餘生命必須大於零。較強武器與護甲會替換舊裝備，不會疊加。改版保留解鎖與通關，未完成棋局會重開，熟練徽章需重新挑戰。',
 'zh-Hans':'战斗消耗敌方战力的 40%（首领 60%），向上取整后扣除护甲，至少扣 1 生命；剩余生命必须大于零。较强武器与护甲会替换旧装备，不会叠加。改版保留解锁与通关，未完成棋局会重开，熟练徽章需重新挑战。',
 ja:'消費する命は敵戦力の40%（ボス60%）を切り上げ、鎧を引いた値で最低1。命を0より多く残す必要があります。強い装備は交換で、加算されません。更新後も解放とクリアは残りますが、中断パズルと熟練バッジは再挑戦です。',
 ko:'생명 소모는 적 전투력의 40%(보스 60%)를 올림한 뒤 갑옷을 빼며 최소 1입니다. 생명이 0보다 높아야 해요. 강한 장비로 교체하며 중첩되지 않아요. 업데이트 후 해금과 클리어는 유지되고 미완성 퍼즐과 숙련 배지는 다시 도전해요.',
 es:'El coste de vida es el 40% del poder enemigo (60% en jefes), redondeado arriba, menos armadura; mínimo 1. Debe quedar vida. El equipo más fuerte reemplaza al anterior. La actualización conserva niveles y victorias; reinicia el intento pendiente y las medallas de dominio.',
 'pt-BR':'O custo de vida é 40% do poder inimigo (60% nos chefes), arredondado para cima, menos armadura; mínimo 1. Deve sobrar vida. Equipamento mais forte substitui o anterior. A atualização mantém fases e vitórias; reinicia a tentativa pendente e as medalhas de domínio.',
 fr:'Le coût en vie est de 40% de la puissance ennemie (60% pour les boss), arrondi au supérieur, moins l’armure ; minimum 1. Il doit rester de la vie. L’équipement plus fort remplace l’ancien. La mise à jour garde déblocages et victoires ; l’essai en cours et les badges de maîtrise recommencent.',
 de:'Lebenskosten: 40% der Gegnerstärke (Bosse 60%), aufgerundet, minus Rüstung; mindestens 1. Leben muss übrig bleiben. Stärkere Ausrüstung ersetzt die alte. Das Update erhält Freischaltungen und Siege; laufende Rätsel und Meisterabzeichen beginnen neu.',
 it:'Costo vita: 40% della potenza nemica (60% per i boss), arrotondato in alto, meno armatura; minimo 1. Deve restare vita. L’equipaggiamento più forte sostituisce il vecchio. L’aggiornamento conserva sblocchi e vittorie; tentativi in corso e medaglie di maestria ricominciano.',
 ru:'Расход жизни: 40% силы врага (боссы 60%), округление вверх, минус броня; минимум 1. Жизнь должна остаться. Сильное снаряжение заменяет старое. Обновление сохраняет открытые этапы и победы; текущая попытка и значки мастерства начинаются заново.',
 hi:'जीवन लागत दुश्मन की शक्ति का 40% (मुखिया 60%), ऊपर पूर्णांक करके, कवच घटाकर; कम से कम 1। जीवन शून्य से अधिक बचना चाहिए। बेहतर उपकरण पुराने को बदलते हैं, जुड़ते नहीं। अपडेट में खुले स्तर और जीत बचते हैं; अधूरा प्रयास और महारत बैज फिर शुरू होते हैं।',
 ar:'تكلفة الحياة 40% من قوة العدو (60% للزعيم)، مقربة للأعلى ناقص الدرع؛ بحد أدنى 1. يجب أن تبقى حياة. المعدات الأقوى تستبدل القديمة ولا تتراكم. يحفظ التحديث المراحل المفتوحة والانتصارات؛ تبدأ المحاولة المعلقة وشارات الإتقان من جديد.'
};
for(const [locale,parts] of Object.entries(DETAILS)){
 parts[0]=`${upgradeText(locale,'previewHelp')} ${parts[0]} ${combat[locale]}`;
 parts[1]+=` ${['blade','life','multiply','defense','charge'].map(key=>upgradeText(locale,key)).join(' ')}`;
 parts[2]+=` ${['order','multiply','gate','runeLesson','charge','finale'].map(key=>upgradeText(locale,key)).join(' ')}`;
}
