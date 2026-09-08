const keys=['challenge','cleared','next','select','tryAgain','rookCapture','bishopCapture','fork','block','promotion','mate'];
const rows={
 en:['Tactical challenges','Challenge cleared','Next challenge','Choose a challenge','Try a different move','Capture the queen with your rook','Capture the rook with your bishop','Fork the king and queen with your knight','Block the check with your rook','Promote your pawn','Checkmate in one move'],
 'zh-Hant':['戰術挑戰','挑戰完成','下一關','選擇挑戰','換個走法再試一次','用城堡吃掉皇后','用主教吃掉城堡','用騎士同時攻擊國王與皇后','用城堡擋住將軍','讓兵升變','一步將死'],
 'zh-Hans':['战术挑战','挑战完成','下一关','选择挑战','换个走法再试一次','用车吃掉后','用象吃掉车','用马同时攻击国王与后','用车挡住将军','让兵升变','一步将死'],
 ja:['戦術チャレンジ','チャレンジ達成','次のチャレンジ','チャレンジを選択','別の手を試そう','ルークでクイーンを取る','ビショップでルークを取る','ナイトでキングとクイーンを両取りする','ルークでチェックを防ぐ','ポーンを昇格させる','１手でチェックメイト'],
 ko:['전술 도전','도전 완료','다음 도전','도전 선택','다른 수를 시도하세요','룩으로 퀸을 잡으세요','비숍으로 룩을 잡으세요','나이트로 킹과 퀸을 동시에 공격하세요','룩으로 체크를 막으세요','폰을 승격하세요','한 수로 체크메이트'],
 es:['Retos tácticos','Reto superado','Siguiente reto','Elige un reto','Prueba otra jugada','Captura la dama con la torre','Captura la torre con el alfil','Ataca rey y dama a la vez con el caballo','Bloquea el jaque con la torre','Promociona tu peón','Jaque mate en una jugada'],
 'pt-BR':['Desafios táticos','Desafio concluído','Próximo desafio','Escolha um desafio','Tente outra jogada','Capture a dama com a torre','Capture a torre com o bispo','Ataque rei e dama ao mesmo tempo com o cavalo','Bloqueie o xeque com a torre','Promova seu peão','Xeque-mate em uma jogada'],
 fr:['Défis tactiques','Défi réussi','Défi suivant','Choisissez un défi','Essayez un autre coup','Capturez la dame avec la tour','Capturez la tour avec le fou','Attaquez le roi et la dame avec une fourchette du cavalier','Parez l’échec avec la tour','Promouvez votre pion','Mat en un coup'],
 de:['Taktikaufgaben','Aufgabe gelöst','Nächste Aufgabe','Aufgabe wählen','Versuche einen anderen Zug','Schlage die Dame mit dem Turm','Schlage den Turm mit dem Läufer','Greife König und Dame mit einer Springergabel an','Wehre das Schach mit dem Turm ab','Wandle deinen Bauern um','Matt in einem Zug'],
 it:['Sfide tattiche','Sfida completata','Sfida successiva','Scegli una sfida','Prova un’altra mossa','Cattura la donna con la torre','Cattura la torre con l’alfiere','Attacca re e donna con una forchetta di cavallo','Para lo scacco con la torre','Promuovi il pedone','Scacco matto in una mossa'],
 ru:['Тактические задачи','Задача решена','Следующая задача','Выберите задачу','Попробуйте другой ход','Возьмите ферзя ладьёй','Возьмите ладью слоном','Сделайте вилку конём на короля и ферзя','Закройтесь ладьёй от шаха','Превратите пешку','Мат в один ход'],
 hi:['रणनीतिक चुनौतियाँ','चुनौती पूरी','अगली चुनौती','चुनौती चुनें','कोई और चाल आज़माएँ','हाथी से वज़ीर को मारें','ऊँट से हाथी को मारें','घोड़े से राजा और वज़ीर पर एक साथ हमला करें','हाथी से शह रोकें','प्यादे की पदोन्नति करें','एक चाल में शह-मात'],
 ar:['تحديات تكتيكية','اكتمل التحدي','التحدي التالي','اختر تحدياً','جرّب نقلة أخرى','التقط الوزير بالقلعة','التقط القلعة بالفيل','هاجم الملك والوزير معاً بالحصان','صدّ الكش بالقلعة','رقِّ البيدق','كش مات في نقلة واحدة']
};
export const challengeLocales=Object.fromEntries(Object.entries(rows).map(([locale,row])=>{if(row.length!==keys.length)throw Error(`Incomplete challenge locale ${locale}`);return [locale,Object.fromEntries(keys.map((k,i)=>[k,row[i]]))];}));
