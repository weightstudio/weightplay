const rows={
 en:['Pawn race: promote within 3 turns','Convert the fork: capture the queen within 2 turns'],
 'zh-Hant':['兵的競速：三回合內升變','利用雙攻：兩回合內吃掉皇后'],
 'zh-Hans':['兵的竞速：三回合内升变','利用双攻：两回合内吃掉后'],
 ja:['ポーン競争：３手以内に昇格','両取りを活用：２手以内にクイーンを取る'],
 ko:['폰 경주: 3턴 안에 승격','포크 활용: 2턴 안에 퀸 잡기'],
 es:['Carrera del peón: promociona en 3 turnos','Aprovecha el doble ataque: captura la dama en 2 turnos'],
 'pt-BR':['Corrida do peão: promova em 3 turnos','Aproveite o garfo: capture a dama em 2 turnos'],
 fr:['Course du pion : promotion en 3 tours','Exploitez la fourchette : prenez la dame en 2 tours'],
 de:['Bauernrennen: Umwandlung in 3 Zügen','Nutze die Gabel: Schlage die Dame in 2 Zügen'],
 it:['Corsa del pedone: promuovi entro 3 turni','Sfrutta la forchetta: cattura la donna entro 2 turni'],
 ru:['Пешечная гонка: превращение за 3 хода','Используйте вилку: возьмите ферзя за 2 хода'],
 hi:['प्यादे की दौड़: 3 चालों में पदोन्नति','दोहरे हमले का लाभ: 2 चालों में वज़ीर लें'],
 ar:['سباق البيدق: الترقية خلال 3 أدوار','استثمر الشوكة: التقط الوزير خلال دورين']
};
export const campaignLocales=Object.fromEntries(Object.entries(rows).map(([locale,[pawnRace,winQueen]])=>[locale,{pawnRace,winQueen}]));
const combinations={
 en:['Rook ladder: checkmate within 2 turns','Rook skewer: win the queen within 2 turns'],
 'zh-Hant':['雙城堡封鎖：兩回合內將死','城堡串擊：兩回合內贏得皇后'],
 'zh-Hans':['双车封锁：两回合内将死','车串击：两回合内赢得后'],
 ja:['ルークの連携：２手以内にチェックメイト','ルークの串刺し：２手以内にクイーンを取る'],
 ko:['룩 협공: 2턴 안에 체크메이트','룩 스큐어: 2턴 안에 퀸 잡기'],
 es:['Escalera de torres: mate en 2 turnos','Enfilada de torre: gana la dama en 2 turnos'],
 'pt-BR':['Escada de torres: mate em 2 turnos','Espeto de torre: ganhe a dama em 2 turnos'],
 fr:['Escalier de tours : mat en 2 tours','Enfilade de tour : gagnez la dame en 2 tours'],
 de:['Turmleiter: Matt in 2 Zügen','Turmspieß: Gewinne die Dame in 2 Zügen'],
 it:['Matto a scaletta: vinci entro 2 turni','Infilata di torre: vinci la donna entro 2 turni'],
 ru:['Лестница ладей: мат за 2 хода','Сквозной удар ладьи: выиграйте ферзя за 2 хода'],
 hi:['रुखों की सीढ़ी: 2 चालों में मात दें','रुख का आर-पार हमला: 2 चालों में वज़ीर जीतें'],
 ar:['سُلّم الرخين: كش مات خلال دورين','سيخ الرخ: اربح الوزير خلال دورين']
};
for(const [locale,[rookLadder,rookSkewer]] of Object.entries(combinations))Object.assign(campaignLocales[locale],{rookLadder,rookSkewer});
