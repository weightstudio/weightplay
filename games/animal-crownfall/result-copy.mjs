// Completion feedback uses the same effective-move and no-hint rules as badges.
const rows={
 en:['New best: {delta} fewer moves.','Next goal: {par} moves or fewer, without hints.','Next goal: finish without hints.','No hints and move target achieved!'],
 'zh-Hant':['新最佳：減少 {delta} 步。','下次目標：不用提示，{par} 步內通關。','下次目標：不用提示通關。','未用提示，目標步數也達成！'],
 'zh-Hans':['新最佳：减少 {delta} 步。','下次目标：不用提示，{par} 步内通关。','下次目标：不用提示通关。','未用提示，目标步数也达成！'],
 ja:['新記録：{delta} 手短縮。','次の目標：ヒントなしで {par} 手以内。','次の目標：ヒントなしでクリア。','ヒントなし・目標手数を達成！'],
 ko:['새 최고 기록: {delta}회 줄였어요.','다음 목표: 힌트 없이 {par}회 이내에 완료.','다음 목표: 힌트 없이 완료.','힌트 없이 목표 이동 수를 달성했어요!'],
 es:['Nuevo récord: {delta} movimientos menos.','Próxima meta: {par} movimientos o menos, sin pistas.','Próxima meta: terminar sin pistas.','¡Sin pistas y dentro de la meta!'],
 'pt-BR':['Novo recorde: {delta} jogadas a menos.','Próxima meta: até {par} jogadas, sem dicas.','Próxima meta: concluir sem dicas.','Sem dicas e dentro da meta!'],
 fr:['Nouveau record : {delta} coups de moins.','Prochain objectif : {par} coups maximum, sans indice.','Prochain objectif : terminer sans indice.','Sans indice et objectif de coups atteint !'],
 de:['Neuer Bestwert: {delta} Züge weniger.','Nächstes Ziel: höchstens {par} Züge, ohne Tipps.','Nächstes Ziel: ohne Tipps abschließen.','Ohne Tipps und Zugziel erreicht!'],
 it:['Nuovo record: {delta} mosse in meno.','Prossimo obiettivo: massimo {par} mosse, senza indizi.','Prossimo obiettivo: finire senza indizi.','Senza indizi e obiettivo mosse raggiunto!'],
 ru:['Новый рекорд: на {delta} ходов меньше.','Следующая цель: не более {par} ходов без подсказок.','Следующая цель: пройти без подсказок.','Без подсказок и цель по ходам достигнута!'],
 hi:['नया सर्वश्रेष्ठ: {delta} चालें कम।','अगला लक्ष्य: बिना संकेत, {par} चालों या कम में पूरा करें।','अगला लक्ष्य: बिना संकेत पूरा करें।','बिना संकेत और चालों का लक्ष्य पूरा!'],
 ar:['أفضل نتيجة جديدة: أقل بـ {delta} حركة.','الهدف التالي: {par} حركات أو أقل دون تلميحات.','الهدف التالي: الإكمال دون تلميحات.','دون تلميحات وتم بلوغ هدف الحركات!']
};
export function masteryFeedback(locale,{moves,previousBest,par,usedHint,practice=false}){
 const copy=rows[locale]||rows.en;
 const fill=(index,args={})=>copy[index].replace(/\{(\w+)\}/g,(_,key)=>String(args[key]));
 const improved=!practice&&Number.isInteger(previousBest)&&moves<previousBest;
 const goal=moves>par?fill(1,{par}):usedHint?fill(2):fill(3);
 return improved?`${fill(0,{delta:previousBest-moves})} ${goal}`:goal;
}
