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

const endgames={
 en:['Bishop skewer: win the queen within 2 turns','Avoid stalemate: promote to a rook, not a queen','King support: close the escape route and mate within 2 turns'],
 'zh-Hant':['主教串擊：兩回合內贏得皇后','避免逼和：升變城堡，不要升變皇后','國王助攻：封住退路，兩回合內將死'],
 'zh-Hans':['象串击：两回合内赢得后','避免逼和：升变车，不要升变后','王的助攻：封住退路，两回合内将死'],
 ja:['ビショップの串刺し：２手以内にクイーンを取る','ステイルメイトを避け、クイーンではなくルークへ昇格','キングの支援：逃げ道を塞ぎ、２手以内にチェックメイト'],
 ko:['비숍 스큐어: 2턴 안에 퀸 잡기','스테일메이트 방지: 퀸 대신 룩으로 승격','킹의 지원: 탈출로를 막고 2턴 안에 체크메이트'],
 es:['Enfilada de alfil: gana la dama en 2 turnos','Evita el ahogado: promociona a torre, no a dama','Apoyo del rey: cierra la salida y da mate en 2 turnos'],
 'pt-BR':['Espeto de bispo: ganhe a dama em 2 turnos','Evite o afogamento: promova a torre, não a dama','Apoio do rei: feche a saída e dê mate em 2 turnos'],
 fr:['Enfilade de fou : gagnez la dame en 2 tours','Évitez le pat : promouvez en tour, pas en dame','Soutien du roi : fermez la fuite et faites mat en 2 tours'],
 de:['Läuferspieß: Gewinne die Dame in 2 Zügen','Vermeide Patt: Wandle in einen Turm statt in eine Dame um','Königsunterstützung: Sperre den Fluchtweg und setze in 2 Zügen matt'],
 it:['Infilata di alfiere: vinci la donna entro 2 turni','Evita lo stallo: promuovi a torre, non a donna','Sostegno del re: chiudi la fuga e dai matto entro 2 turni'],
 ru:['Сквозной удар слона: выиграйте ферзя за 2 хода','Избегите пата: превратите пешку в ладью, а не в ферзя','Поддержка короля: перекройте отход и поставьте мат за 2 хода'],
 hi:['ऊँट का आर-पार हमला: 2 चालों में वज़ीर जीतें','गतिरोध से बचें: वज़ीर के बजाय हाथी में बदलें','राजा का सहयोग: भागने का रास्ता रोककर 2 चालों में मात दें'],
 ar:['سيخ الفيل: اربح الوزير خلال دورين','تجنب التعادل بالخنق: رقّ إلى رخ لا وزير','دعم الملك: أغلق طريق الهرب وحقق المات خلال دورين']
};
for(const [locale,row] of Object.entries(endgames)){
 if(row.length!==3||row.some(value=>!value))throw Error('Incomplete endgame locale: '+locale);
 const [bishopSkewer,rookPromotion,kingSupport]=row;
 Object.assign(campaignLocales[locale],{bishopSkewer,rookPromotion,kingSupport});
}

const advanced={
 en:['Smothered mate: use the knight to checkmate','Double check: attack the king with two pieces at once','Queen sacrifice: force checkmate within 2 turns','Escort the pawn: promote within 3 turns','Bishop net: close every escape and checkmate','En passant discovery: open a rook check with en passant','Castling attack: castle and deliver checkmate'],
 'zh-Hant':['悶殺：用騎士將死國王','雙將：同時用兩枚棋子將軍','棄后攻王：兩回合內強制將死','護送小兵：三回合內完成升變','雙主教封鎖：封住退路並將死','吃過路兵閃將：打開城堡的將軍線','王車易位進攻：易位並將死'],
 'zh-Hans':['闷杀：用马将死王','双将：同时用两枚棋子将军','弃后攻王：两回合内强制将死','护送小兵：三回合内完成升变','双象封锁：封住退路并将死','吃过路兵闪将：打开车的将军线','王车易位进攻：易位并将死'],
 ja:['窒息メイト：ナイトでチェックメイト','ダブルチェック：２つの駒で同時に王手','クイーンの犠牲：２手以内に強制メイト','ポーンの護衛：３手以内に昇格','ビショップの包囲：逃げ道を塞いでメイト','アンパッサンの開き王手：ルークの攻撃線を開く','キャスリング攻撃：キャスリングでメイト'],
 ko:['스모더드 메이트: 나이트로 체크메이트','더블 체크: 두 기물로 동시에 체크','퀸 희생: 2턴 안에 강제 체크메이트','폰 호위: 3턴 안에 승격','비숍 포위망: 탈출로를 막고 체크메이트','앙파상 디스커버드 체크: 룩의 공격로 열기','캐슬링 공격: 캐슬링으로 체크메이트'],
 es:['Mate de la coz: da mate con el caballo','Jaque doble: ataca al rey con dos piezas a la vez','Sacrificio de dama: fuerza mate en 2 turnos','Escolta al peón: promociona en 3 turnos','Red de alfiles: cierra las salidas y da mate','Jaque descubierto al paso: abre la línea de la torre','Ataque con enroque: enrócate y da mate'],
 'pt-BR':['Mate sufocado: dê mate com o cavalo','Xeque duplo: ataque o rei com duas peças ao mesmo tempo','Sacrifício de dama: force mate em 2 turnos','Escolte o peão: promova em 3 turnos','Rede de bispos: feche as saídas e dê mate','Xeque descoberto en passant: abra a linha da torre','Ataque com roque: faça o roque e dê mate'],
 fr:['Mat à l’étouffée : faites mat avec le cavalier','Échec double : attaquez le roi avec deux pièces à la fois','Sacrifice de dame : forcez le mat en 2 tours','Escorte du pion : promotion en 3 tours','Filet de fous : fermez les issues et faites mat','Échec à la découverte en passant : ouvrez la ligne de la tour','Attaque par le roque : roquez et faites mat'],
 de:['Ersticktes Matt: Setze mit dem Springer matt','Doppelschach: Greife den König mit zwei Figuren zugleich an','Damenopfer: Erzwinge Matt in 2 Zügen','Bauernbegleitung: Wandle in 3 Zügen um','Läufernetz: Sperre alle Fluchtfelder und setze matt','Abzugsschach en passant: Öffne die Turmlinie','Rochadeangriff: Rochiere und setze matt'],
 it:['Matto affogato: dai matto con il cavallo','Scacco doppio: attacca il re con due pezzi insieme','Sacrificio di donna: forza il matto entro 2 turni','Scorta al pedone: promuovi entro 3 turni','Rete degli alfieri: chiudi le fughe e dai matto','Scacco di scoperta en passant: apri la linea della torre','Attacco con arrocco: arrocca e dai matto'],
 ru:['Спёртый мат: поставьте мат конём','Двойной шах: атакуйте короля двумя фигурами сразу','Жертва ферзя: поставьте форсированный мат за 2 хода','Сопровождение пешки: превращение за 3 хода','Сеть слонов: закройте выходы и поставьте мат','Вскрытый шах взятием на проходе: откройте линию ладьи','Атака рокировкой: рокируйте и поставьте мат'],
 hi:['घुटन वाली मात: घोड़े से मात दें','दोहरा शह: दो मोहरों से एक साथ राजा पर हमला करें','वज़ीर का बलिदान: 2 चालों में अनिवार्य मात दें','प्यादे की रक्षा: 3 चालों में पदोन्नति करें','ऊँटों का जाल: सभी रास्ते रोककर मात दें','एन पासां से खुला शह: रुख की हमला रेखा खोलें','कैसलिंग हमला: कैसलिंग करके मात दें'],
 ar:['مات الخنق: حقق المات بالحصان','كش مزدوج: هاجم الملك بقطعتين في آن واحد','تضحية بالوزير: افرض المات خلال دورين','مرافقة البيدق: حقق الترقية خلال 3 أدوار','شبكة الفيلين: أغلق المخارج وحقق المات','كش مكتشف بالأخذ بالتجاوز: افتح خط الرخ','هجوم التبييت: بيّت وحقق المات']
};
for(const [locale,row] of Object.entries(advanced)){
 if(row.length!==7||row.some(value=>!value))throw Error('Incomplete advanced locale: '+locale);
 const [smotheredMate,doubleCheck,queenSacrifice,supportedPawn,bishopNet,enPassantDiscovery,castlingMate]=row;
 Object.assign(campaignLocales[locale],{smotheredMate,doubleCheck,queenSacrifice,supportedPawn,bishopNet,enPassantDiscovery,castlingMate});
}
const hintUnproven={
 en:'No reliable hint found. You can keep playing or undo a turn.',
 'zh-Hant':'尚未找到可靠提示。可以繼續思考，或復原一回合。',
 'zh-Hans':'尚未找到可靠提示。可以继续思考，或撤销一回合。',
 ja:'確実なヒントが見つかりません。続けて考えるか、１手戻せます。',
 ko:'확실한 힌트를 찾지 못했습니다. 계속 생각하거나 한 턴 되돌릴 수 있습니다.',
 es:'No se encontró una pista fiable. Puedes seguir jugando o deshacer un turno.',
 'pt-BR':'Nenhuma dica confiável encontrada. Continue jogando ou desfaça um turno.',
 fr:'Aucun indice fiable trouvé. Vous pouvez continuer ou annuler un tour.',
 de:'Kein verlässlicher Hinweis gefunden. Spiele weiter oder nimm einen Zug zurück.',
 it:'Nessun suggerimento affidabile trovato. Puoi continuare o annullare un turno.',
 ru:'Надёжная подсказка не найдена. Продолжайте играть или отмените ход.',
 hi:'भरोसेमंद संकेत नहीं मिला। खेल जारी रखें या एक चाल वापस लें।',
 ar:'لم يُعثر على تلميح موثوق. يمكنك متابعة اللعب أو التراجع عن دور.'
};
for(const [locale,hint] of Object.entries(hintUnproven))campaignLocales[locale].hintUnproven=hint;
const finale={
 en:['Pawn fork: win either rook with the pawn within 2 turns','Promotion finish: capture the rook, promote and checkmate','Final blockade: force checkmate within 3 turns'],
 'zh-Hant':['小兵雙攻：兩回合內用兵贏得任一城堡','升變終結：吃城堡、升變並將死','最終封鎖：三回合內強制將死'],
 'zh-Hans':['小兵双攻：两回合内用兵赢得任一车','升变终结：吃车、升变并将死','最终封锁：三回合内强制将死'],
 ja:['ポーンの両取り：２手以内にポーンでルークを取る','昇格で決着：ルークを取り、昇格してメイト','最後の包囲：３手以内に強制メイト'],
 ko:['폰 포크: 2턴 안에 폰으로 룩 하나 잡기','승격 마무리: 룩을 잡고 승격하여 체크메이트','최종 봉쇄: 3턴 안에 강제 체크메이트'],
 es:['Doble ataque de peón: gana una torre con el peón en 2 turnos','Final con promoción: captura la torre, promociona y da mate','Bloqueo final: fuerza mate en 3 turnos'],
 'pt-BR':['Garfo de peão: ganhe uma torre com o peão em 2 turnos','Final com promoção: capture a torre, promova e dê mate','Bloqueio final: force mate em 3 turnos'],
 fr:['Fourchette de pion : prenez une tour avec le pion en 2 tours','Final par promotion : prenez la tour, promouvez et faites mat','Blocus final : forcez le mat en 3 tours'],
 de:['Bauerngabel: Gewinne mit dem Bauern einen Turm in 2 Zügen','Umwandlungsfinale: Schlage den Turm, wandle um und setze matt','Letzte Blockade: Erzwinge Matt in 3 Zügen'],
 it:['Forchetta di pedone: vinci una torre col pedone entro 2 turni','Finale con promozione: cattura la torre, promuovi e dai matto','Blocco finale: forza il matto entro 3 turni'],
 ru:['Пешечная вилка: возьмите любую ладью пешкой за 2 хода','Финал с превращением: возьмите ладью, превратитесь и поставьте мат','Последняя блокада: поставьте форсированный мат за 3 хода'],
 hi:['प्यादे का दोहरा हमला: 2 चालों में प्यादे से कोई एक रुख जीतें','पदोन्नति से जीत: रुख लें, पदोन्नति करें और मात दें','अंतिम नाकाबंदी: 3 चालों में अनिवार्य मात दें'],
 ar:['شوكة البيدق: اربح أحد الرخين بالبيدق خلال دورين','نهاية بالترقية: التقط الرخ ثم رقّ وحقق المات','الحصار الأخير: افرض المات خلال 3 أدوار']
};
for(const [locale,[pawnFork,promotionMate,ladderFinale]] of Object.entries(finale))Object.assign(campaignLocales[locale],{pawnFork,promotionMate,ladderFinale});
