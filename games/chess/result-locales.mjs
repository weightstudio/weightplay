const keys=['moves','captures','lastMove','stages','replay','position','checkmate','stalemate','repetition','material','fifty'];
const rows={
 en:['Your moves','Your captures','Last move','Challenges','Replay','Final position','Checkmate','Stalemate','Threefold repetition','Insufficient mating material','Fifty-move rule'],
 'zh-Hant':['你的步數','你的吃子','最後一步','關卡','再玩一次','最終棋局','將死','無子可動，和棋','同一局面出現三次，和棋','子力不足以將死，和棋','五十步規則，和棋'],
 'zh-Hans':['你的步数','你的吃子','最后一步','关卡','再玩一次','最终棋局','将死','无子可动，和棋','同一局面出现三次，和棋','子力不足以将死，和棋','五十步规则，和棋'],
 ja:['自分の手数','取った駒','最後の手','チャレンジ','もう一度','最終局面','チェックメイト','ステイルメイト','同一局面が３回出現','メイトに必要な駒が不足','５０手ルール'],
 ko:['내 수','잡은 기물','마지막 수','도전','다시 하기','최종 배치','체크메이트','스테일메이트','같은 배치가 세 번 반복됨','체크메이트에 필요한 기물 부족','50수 규칙'],
 es:['Tus jugadas','Tus capturas','Última jugada','Retos','Repetir','Posición final','Jaque mate','Ahogado','Triple repetición','Material insuficiente para dar mate','Regla de los cincuenta movimientos'],
 'pt-BR':['Suas jogadas','Suas capturas','Última jogada','Desafios','Jogar de novo','Posição final','Xeque-mate','Afogamento','Repetição tripla','Material insuficiente para dar mate','Regra dos cinquenta lances'],
 fr:['Vos coups','Vos prises','Dernier coup','Défis','Rejouer','Position finale','Échec et mat','Pat','Triple répétition','Matériel insuffisant pour mater','Règle des cinquante coups'],
 de:['Deine Züge','Deine Schlagzüge','Letzter Zug','Aufgaben','Erneut spielen','Endstellung','Schachmatt','Patt','Dreifache Stellungswiederholung','Unzureichendes Material zum Mattsetzen','Fünfzig-Züge-Regel'],
 it:['Le tue mosse','Le tue catture','Ultima mossa','Sfide','Rigioca','Posizione finale','Scacco matto','Stallo','Triplice ripetizione','Materiale insufficiente per dare matto','Regola delle cinquanta mosse'],
 ru:['Ваши ходы','Ваши взятия','Последний ход','Задачи','Ещё раз','Итоговая позиция','Мат','Пат','Троекратное повторение позиции','Недостаточно фигур для мата','Правило пятидесяти ходов'],
 hi:['आपकी चालें','आपने पकड़े मोहरे','आखिरी चाल','चुनौतियाँ','फिर खेलें','अंतिम स्थिति','शह और मात','कोई वैध चाल नहीं: बराबरी','एक ही स्थिति तीन बार बनी','मात देने के लिए पर्याप्त मोहरे नहीं','पचास चालों का नियम'],
 ar:['نقلاتك','قطعك المأسورة من الخصم','النقلة الأخيرة','التحديات','إعادة اللعب','الوضع النهائي','كش مات','تعادل بسبب انعدام النقلات القانونية','تكرار الوضع ثلاث مرات','قطع غير كافية لتحقيق كش مات','قاعدة الخمسين نقلة']
};
export const resultLocales=Object.fromEntries(Object.entries(rows).map(([locale,row])=>[locale,Object.fromEntries(keys.map((key,i)=>[key,row[i]]))]));
