const keys=['castleKing','takeChecker','enPassant','knightPromotion','discovered','backRank','castleQueen'];
const rows={
 en:['Castle toward the kingside','Escape check: capture the attacking bishop','Use the immediate en passant capture','Promote to a knight: check and attack the queen','Discovered check: take the rook with your bishop and uncover your rook','Deliver back-rank checkmate','Avoid the attacked path: castle queenside'],
 'zh-Hant':['向王翼王車易位','解將：吃掉攻擊國王的主教','把握時機：吃過路兵','升變騎士：同時將軍並攻擊后','閃擊：主教吃車，同時讓城堡將軍','底線將死：封住國王的所有退路','避開攻擊線：向后翼王車易位'],
 'zh-Hans':['向王翼王车易位','解将：吃掉攻击王的象','把握时机：吃过路兵','升变马：同时将军并攻击后','闪击：象吃车，同时让车将军','底线将死：封住王的所有退路','避开攻击线：向后翼王车易位'],
 ja:['キング側へキャスリング','チェック回避：攻撃中のビショップを取る','今だけ使えるアンパッサンで取る','ナイトへ昇格し、チェックとクイーン攻撃','ビショップでルークを取り、自分のルークのチェックを開く','最奥の段でチェックメイト','攻撃された経路を避け、クイーン側へキャスリング'],
 ko:['킹 쪽으로 캐슬링','체크 탈출: 공격하는 비숍 잡기','지금 가능한 앙파상으로 잡기','나이트로 승격해 체크와 퀸 공격','비숍으로 룩을 잡아 아군 룩의 체크 열기','마지막 줄에서 체크메이트','공격받는 길을 피해 퀸 쪽으로 캐슬링'],
 es:['Enroca por el flanco de rey','Escapa del jaque: captura el alfil atacante','Aprovecha ahora la captura al paso','Promociona a caballo: da jaque y ataca la dama','Jaque descubierto: captura la torre con tu alfil y libera tu torre','Da mate en la última fila','Evita la ruta atacada: enroca por el flanco de dama'],
 'pt-BR':['Faça o roque na ala do rei','Saia do xeque: capture o bispo atacante','Aproveite agora a captura en passant','Promova a cavalo: dê xeque e ataque a dama','Xeque descoberto: capture a torre com o bispo e libere sua torre','Dê mate na última fileira','Evite o caminho atacado: faça o roque na ala da dama'],
 fr:['Roquez du côté du roi','Échappez à l’échec : prenez le fou attaquant','Profitez immédiatement de la prise en passant','Promouvez en cavalier : échec et attaque de la dame','Échec à la découverte : prenez la tour avec le fou et libérez votre tour','Faites mat sur la dernière rangée','Évitez la ligne attaquée : roquez du côté de la dame'],
 de:['Rochiere auf der Königsseite','Wehre das Schach ab: Schlage den angreifenden Läufer','Nutze jetzt das Schlagen en passant','Wandle in einen Springer um: Schach und Damenangriff','Abzugsschach: Schlage den Turm mit dem Läufer und öffne die Turmlinie','Setze auf der Grundreihe matt','Meide den angegriffenen Weg: Rochiere auf der Damenseite'],
 it:['Arrocca sul lato di re','Esci dallo scacco: cattura l’alfiere attaccante','Sfrutta subito la cattura en passant','Promuovi a cavallo: dai scacco e attacca la donna','Scacco di scoperta: cattura la torre con l’alfiere e libera la tua torre','Dai matto sull’ultima traversa','Evita il percorso attaccato: arrocca sul lato di donna'],
 ru:['Выполните короткую рокировку','Уйдите от шаха: возьмите атакующего слона','Используйте взятие на проходе прямо сейчас','Превратитесь в коня: шах и нападение на ферзя','Вскрытый шах: возьмите ладью слоном и откройте свою ладью','Поставьте мат на последней горизонтали','Избегайте атакованного пути: выполните длинную рокировку'],
 hi:['राजा की ओर कैसलिंग करें','शह से बचें: हमला करने वाला ऊँट पकड़ें','तुरंत एन पासां का मौका लें','घोड़े में बदलें: शह दें और वज़ीर पर हमला करें','खुला हमला: ऊँट से हाथी लें और अपने हाथी की शह खोलें','अंतिम पंक्ति पर शह-मात दें','हमले वाला रास्ता छोड़ें: वज़ीर की ओर कैसलिंग करें'],
 ar:['بيّت في جناح الملك','اخرج من الكش: أسر الفيل المهاجم','اغتنم الأخذ بالتجاوز فوراً','رقّ إلى حصان: هدد الملك والوزير معاً','كش مكتشف: أسر القلعة بالفيل وافتح خط قلعتك','حقق مات الصف الخلفي','تجنب المسار المهدد: بيّت في جناح الوزير']
};
export const tacticsLocales=Object.fromEntries(Object.entries(rows).map(([locale,row])=>{
 if(row.length!==keys.length||row.some(s=>!s))throw Error('Incomplete tactical challenge locale: '+locale);
 return [locale,Object.fromEntries(keys.map((key,i)=>[key,row[i]]))];
}));
