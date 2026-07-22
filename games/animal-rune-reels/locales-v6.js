(() => {
  "use strict";
  const L=window.RUNE_REELS_LOCALES;
  const copy={
    en:['Health','Team ultimate rune','Skips normal attacks. Every hero uses their own ultimate in order.','Battle Crescendo','Hit every enemy for 1.2× ATK; gain another +0.25× ATK for each wave reached.'],
    'zh-Hant':['生命值','全隊必殺符石','本回合不進行普通攻擊，改由隊伍中每位英雄依序施放自己的專屬必殺技。','越戰鼓舞','對所有敵人造成 1.2× ATK；每推進一波，威力再增加 0.25× ATK。'],
    'zh-Hans':['生命值','全队必杀符石','本回合不进行普通攻击，改由队伍中每位英雄依次施放自己的专属必杀技。','越战鼓舞','对所有敌人造成 1.2× ATK；每推进一波，威力再增加 0.25× ATK。'],
    ja:['生命力','全員必殺ルーン','通常攻撃を行わず、チーム全員が順番に固有必殺技を使います。','戦いのクレッシェンド','全敵に1.2×ATK。到達したウェーブごとにさらに+0.25×ATK。'],
    ko:['생명력','팀 필살 룬','일반 공격 대신 팀의 모든 영웅이 차례로 고유 필살기를 사용합니다.','전투의 고조','모든 적에게 1.2× ATK 피해. 도달한 웨이브마다 +0.25× ATK.'],
    es:['Salud','Runa definitiva de equipo','Omite los ataques normales; cada héroe usa su definitiva en orden.','Crescendo de batalla','Golpea a todos por 1,2× ATK y suma +0,25× ATK por cada oleada alcanzada.'],
    'pt-BR':['Vida','Runa suprema da equipe','Substitui ataques normais; cada herói usa seu supremo em ordem.','Crescendo de batalha','Atinge todos com 1,2× ATK e ganha +0,25× ATK por onda alcançada.'],
    fr:['Vie','Rune ultime d’équipe','Remplace les attaques normales : chaque héros lance son ultime à tour de rôle.','Crescendo de combat','Frappe tous à 1,2× ATK et gagne +0,25× ATK par vague atteinte.'],
    de:['Leben','Team-Ultima-Rune','Ersetzt normale Angriffe; jeder Held nutzt der Reihe nach seine Ultima.','Kampf-Crescendo','Trifft alle mit 1,2× ATK und erhält +0,25× ATK je erreichter Welle.'],
    it:['Salute','Runa suprema di squadra','Sostituisce gli attacchi normali: ogni eroe usa la propria suprema in ordine.','Crescendo di battaglia','Colpisce tutti con 1,2× ATK e ottiene +0,25× ATK per ogni ondata raggiunta.'],
    ru:['Здоровье','Командная руна ульты','Вместо обычных атак каждый герой по очереди применяет свою ульту.','Боевое крещендо','Бьёт всех на 1,2× ATK и получает +0,25× ATK за каждую достигнутую волну.'],
    hi:['जीवन','टीम अल्टिमेट रून','सामान्य हमलों की जगह हर हीरो क्रम से अपना अल्टिमेट चलाता है।','युद्ध आरोह','सभी को 1.2× ATK; हर पहुँची वेव पर +0.25× ATK।'],
    ar:['الصحة','رونة الضربة القاضية للفريق','تستبدل الهجمات العادية؛ يستخدم كل بطل ضربته القاضية بالترتيب.','تصاعد المعركة','يضرب الجميع بقوة 1.2× ATK ويكسب +0.25× ATK لكل موجة تم بلوغها.']
  };
  const weekly={en:'Every week','zh-Hant':'每週','zh-Hans':'每周',ja:'毎週',ko:'매주',es:'Cada semana','pt-BR':'Toda semana',fr:'Chaque semaine',de:'Jede Woche',it:'Ogni settimana',ru:'Каждую неделю',hi:'हर सप्ताह',ar:'كل أسبوع'};
  const cooldown={en:'Cooldown','zh-Hant':'冷卻','zh-Hans':'冷却',ja:'クールダウン',ko:'재사용 대기',es:'Recarga','pt-BR':'Recarga',fr:'Recharge',de:'Abklingzeit',it:'Ricarica',ru:'Перезарядка',hi:'कूलडाउन',ar:'وقت الانتظار'};
  const keys=['hp','runeSpecial','runeSpecialDesc','specialPanda','specialPandaDesc'];
  Object.keys(L).forEach(code=>{const values=copy[code]||copy.en,patch={weekly:weekly[code]||weekly.en,cooldown:cooldown[code]||cooldown.en};keys.forEach((key,index)=>patch[key]=values[index]);Object.assign(L[code],patch)});
  L['zh-Hant'].leaderNyraDesc='必殺符石威力 +20%。';
  L['zh-Hans'].leaderNyraDesc='必杀符石威力 +20%。';
})();
