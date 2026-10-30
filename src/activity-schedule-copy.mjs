// Weekdays use each device's local civil date, shared by lobby and activities.
const rows={
 'zh-Hant':['週一、三、五、日 · 每日一次','週二、四、六、日 · 每日一次','今日未開放','本場已完成，請於下次開放日挑戰。','練習不限次：提供 24 發彈藥，不給鑽石、不占正式挑戰次數，也不解鎖造型。'],
 'zh-Hans':['周一、三、五、日 · 每日一次','周二、四、六、日 · 每日一次','今日未开放','本场已完成，请于下次开放日挑战。','练习不限次：提供 24 发弹药，不给钻石、不占正式挑战次数，也不解锁外观。'],
 en:['Mon, Wed, Fri, Sun · Once daily','Tue, Thu, Sat, Sun · Once daily','Closed today','Run completed. Return on the next open day.','Unlimited practice: 24 ammo, no diamonds, no daily challenge use and no skin unlock.'],
 ja:['月・水・金・日 · 1日1回','火・木・土・日 · 1日1回','本日は開催なし','今回の挑戦は終了しました。次の開催日に挑戦できます。','練習は無制限：弾薬24。ダイヤ獲得・挑戦回数の消費・スキン解放はありません。'],
 ko:['월·수·금·일 · 하루 한 번','화·목·토·일 · 하루 한 번','오늘은 미개방','이번 도전을 마쳤습니다. 다음 개방일에 도전하세요.','연습은 무제한: 탄약 24, 다이아 보상과 스킨 해제 없음. 일일 도전 횟수를 쓰지 않습니다.'],
 es:['Lun, mié, vie, dom · Una vez al día','Mar, jue, sáb, dom · Una vez al día','Cerrado hoy','Partida terminada. Vuelve el próximo día de apertura.','Práctica ilimitada: 24 de munición, sin diamantes ni aspectos y sin gastar el desafío diario.'],
 'pt-BR':['Seg, qua, sex, dom · Uma vez por dia','Ter, qui, sáb, dom · Uma vez por dia','Fechado hoje','Partida concluída. Volte no próximo dia disponível.','Treino ilimitado: 24 munições, sem diamantes nem visuais e sem consumir o desafio diário.'],
 fr:['Lun, mer, ven, dim · Une fois par jour','Mar, jeu, sam, dim · Une fois par jour','Fermé aujourd’hui','Partie terminée. Revenez au prochain jour d’ouverture.','Entraînement illimité : 24 munitions, sans diamants ni apparence, sans utiliser le défi quotidien.'],
 de:['Mo, Mi, Fr, So · Einmal täglich','Di, Do, Sa, So · Einmal täglich','Heute geschlossen','Lauf beendet. Komm am nächsten Öffnungstag wieder.','Unbegrenzt üben: 24 Munition, keine Diamanten oder Skins. Der tägliche Versuch bleibt erhalten.'],
 it:['Lun, mer, ven, dom · Una volta al giorno','Mar, gio, sab, dom · Una volta al giorno','Chiuso oggi','Partita conclusa. Torna nel prossimo giorno di apertura.','Allenamento illimitato: 24 munizioni, niente diamanti o aspetti e nessun consumo della sfida giornaliera.'],
 ru:['Пн, ср, пт, вс · Один раз в день','Вт, чт, сб, вс · Один раз в день','Сегодня закрыто','Бой завершён. Возвращайтесь в следующий день открытия.','Тренировка без ограничений: 24 боеприпаса, без алмазов и обликов. Ежедневная попытка не расходуется.'],
 hi:['सोम, बुध, शुक्र, रवि · रोज़ एक बार','मंगल, गुरु, शनि, रवि · रोज़ एक बार','आज बंद है','खेल पूरा हुआ। अगले खुले दिन लौटें।','असीमित अभ्यास: 24 बारूद, कोई हीरा या रूप नहीं। दैनिक चुनौती की बारी खर्च नहीं होती।'],
 ar:['الاثنين والأربعاء والجمعة والأحد · مرة يومياً','الثلاثاء والخميس والسبت والأحد · مرة يومياً','مغلق اليوم','اكتملت الجولة. عد في يوم الافتتاح التالي.','تدريب بلا حدود: 24 ذخيرة، دون ألماس أو مظاهر ودون استهلاك المحاولة اليومية.'],
};
export function scheduleCopy(locale,activity='meteor-barrage'){
 const r=rows[locale]||rows.en;
 return{schedule:r[activity==='demon-assault'?0:1],closed:r[2],completed:r[3],trainingNote:r[4]};
}
