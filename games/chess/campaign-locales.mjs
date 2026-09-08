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
