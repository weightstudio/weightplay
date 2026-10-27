// Draft copy for an authenticated local-practice slice; translations still
// need native review. Ordinary production play does not import this module.
const rows={
  en:['Beacon Circuit','Defeat the marked enemy, collect its fragment, then hold at the beacon and survive.','Fragment ready','Carry the fragment to the beacon.','Fragment lost','Beacon activated','Practice result; progress and rewards are not saved.','Practice authorization expired. Return and sign in again.'],
  'zh-Hant':['信標迴路','擊敗標記敵人，拾取碎片，在信標內停留啟動後生存。','碎片已就緒','帶著碎片前往信標。','碎片已遺失','信標已啟動','練習結果；進度與獎勵不會保存。','練習授權已失效，請返回並重新登入。'],
  'zh-Hans':['信标回路','击败标记敌人，拾取碎片，在信标内停留启动后生存。','碎片已就绪','带着碎片前往信标。','碎片已丢失','信标已启动','练习结果；进度和奖励不会保存。','练习授权已失效，请返回并重新登录。'],
  ja:['ビーコン回路','印のある敵を倒して欠片を拾い、ビーコン内に留まって起動し、生き残ろう。','欠片を取得','欠片をビーコンへ運ぼう。','欠片を失った','ビーコン起動','練習結果。進行状況と報酬は保存されません。','練習の認証が切れました。戻って再認証してください。'],
  ko:['신호기 회로','표시된 적을 물리치고 조각을 모아 신호기 안에서 머물러 작동시킨 뒤 생존하세요.','조각 획득','조각을 신호기로 가져가세요.','조각을 잃었습니다','신호기 작동','연습 결과이며 진행 상황과 보상은 저장되지 않습니다.','연습 인증이 만료되었습니다. 돌아가 다시 인증하세요.'],
  es:['Circuito de balizas','Derrota al enemigo marcado, recoge el fragmento, permanece en la baliza y sobrevive.','Fragmento listo','Lleva el fragmento a la baliza.','Fragmento perdido','Baliza activada','Resultado de práctica; el progreso y las recompensas no se guardan.','La autorización de práctica caducó. Regresa y vuelve a acceder.'],
  'pt-BR':['Circuito de sinalizadores','Derrote o inimigo marcado, pegue o fragmento, permaneça no sinalizador e sobreviva.','Fragmento pronto','Leve o fragmento ao sinalizador.','Fragmento perdido','Sinalizador ativado','Resultado de treino; progresso e recompensas não são salvos.','A autorização de treino expirou. Volte e entre novamente.'],
  fr:['Circuit des balises','Battez l’ennemi marqué, prenez son fragment, restez dans la balise et survivez.','Fragment prêt','Portez le fragment à la balise.','Fragment perdu','Balise activée','Résultat d’entraînement : progression et récompenses ne sont pas enregistrées.','L’autorisation d’entraînement a expiré. Revenez et reconnectez-vous.'],
  de:['Leuchtfeuer-Rundgang','Besiege den markierten Gegner, sammle das Fragment, bleibe am Leuchtfeuer und überlebe.','Fragment bereit','Bring das Fragment zum Leuchtfeuer.','Fragment verloren','Leuchtfeuer aktiviert','Übungsergebnis: Fortschritt und Belohnungen werden nicht gespeichert.','Die Übungsberechtigung ist abgelaufen. Kehre zurück und melde dich erneut an.'],
  it:['Circuito dei fari','Sconfiggi il nemico segnato, raccogli il frammento, resta nel faro e sopravvivi.','Frammento pronto','Porta il frammento al faro.','Frammento perso','Faro attivato','Risultato di pratica: progressi e premi non vengono salvati.','L’autorizzazione alla pratica è scaduta. Torna indietro e accedi di nuovo.'],
  ru:['Цепь маяков','Победите отмеченного врага, подберите осколок, задержитесь у маяка и выживите.','Осколок готов','Отнесите осколок к маяку.','Осколок потерян','Маяк включён','Результат тренировки: прогресс и награды не сохраняются.','Разрешение на тренировку истекло. Вернитесь и войдите снова.'],
  hi:['बीकन क्रम','चिह्नित शत्रु को हराएँ, टुकड़ा लें, बीकन में रुककर उसे चालू करें और जीवित रहें।','टुकड़ा तैयार','टुकड़ा बीकन तक ले जाएँ।','टुकड़ा खो गया','बीकन चालू','अभ्यास का परिणाम; प्रगति और पुरस्कार सहेजे नहीं जाते।','अभ्यास की अनुमति समाप्त हुई। वापस जाकर फिर प्रवेश करें।'],
  ar:['مسار المنارات','اهزم العدو المحدد، واجمع الشظية، ثم ابقَ عند المنارة لتفعيلها واصمد.','الشظية جاهزة','احمل الشظية إلى المنارة.','فُقدت الشظية','تم تفعيل المنارة','نتيجة تدريب؛ لا يُحفظ التقدم أو المكافآت.','انتهى تصريح التدريب. عد وسجّل الدخول مجددًا.'],
};
export const beaconLocales=Object.freeze(Object.fromEntries(Object.entries(rows).map(([locale,values])=>[locale,Object.freeze(values)])));
export function beaconCopy(locale){return beaconLocales[locale]||beaconLocales.en}

// Stage 32 draft: its marked charger uses the existing charge telegraph.
const secondStage={
  en:['Charger at the Beacon','Dodge the marked charger, collect its fragment, and hold at the right beacon for 1.2 seconds. Then survive.'],
  'zh-Hant':['信標衝刺者','閃避標記衝刺者，拾取碎片，在右側信標停留 1.2 秒後生存。'],
  'zh-Hans':['信标冲刺者','躲避标记冲刺者，拾取碎片，在右侧信标停留 1.2 秒后生存。'],
  ja:['ビーコンの突進兵','印の突進兵を避けて欠片を拾い、右のビーコンに1.2秒留まって生き残ろう。'],
  ko:['신호기의 돌진자','표시된 돌진자를 피하고 조각을 모아 오른쪽 신호기에 1.2초 머문 뒤 생존하세요.'],
  es:['Cargador de la baliza','Esquiva al cargador marcado, recoge el fragmento y permanece 1,2 s en la baliza derecha. Sobrevive.'],
  'pt-BR':['Investida no sinalizador','Desvie do atacante marcado, pegue o fragmento e fique 1,2 s no sinalizador da direita. Sobreviva.'],
  fr:['Chargeur de la balise','Esquivez le chargeur marqué, prenez le fragment et restez 1,2 s à la balise droite. Survivez.'],
  de:['Angreifer am Leuchtfeuer','Weiche dem markierten Angreifer aus, sammle das Fragment und bleibe 1,2 s am rechten Leuchtfeuer. Überlebe.'],
  it:['Assalto al faro','Evita il nemico segnato, raccogli il frammento e resta 1,2 s al faro destro. Sopravvivi.'],
  ru:['Рывок у маяка','Уклонитесь от отмеченного врага, подберите осколок и стойте у правого маяка 1,2 с. Выживите.'],
  hi:['बीकन पर धावा','चिह्नित हमलावर से बचें, टुकड़ा लें और दाएँ बीकन पर 1.2 सेकंड रुकें। जीवित रहें।'],
  ar:['اندفاع عند المنارة','تجنب المهاجم المحدد، واجمع الشظية، وابقَ عند المنارة اليمنى ١٫٢ ثانية، ثم اصمد.'],
};
export function beaconStageCopy(locale,stage){return stage===32?(secondStage[locale]||secondStage.en):beaconCopy(locale).slice(0,2)}

// Short, persistent Battle objectives. These drafts still require native
// language review; the full rule remains on the Stage card.
const objectives={
  en:['Defeat the marked enemy','Collect the fragment','Hold at the beacon for 1.2s','Beacon active · survive'],
  'zh-Hant':['擊敗標記敵人','拾取碎片','在信標停留 1.2 秒','信標已啟動 · 繼續生存'],
  'zh-Hans':['击败标记敌人','拾取碎片','在信标停留 1.2 秒','信标已启动 · 继续生存'],
  ja:['印のある敵を倒す','欠片を拾う','ビーコンに1.2秒留まる','起動済み · 生き残ろう'],
  ko:['표시된 적을 처치','조각을 수집','신호기에 1.2초 머무르기','신호기 작동 · 생존'],
  es:['Derrota al enemigo marcado','Recoge el fragmento','Permanece 1,2 s en la baliza','Baliza activa · sobrevive'],
  'pt-BR':['Derrote o inimigo marcado','Pegue o fragmento','Fique 1,2 s no sinalizador','Sinalizador ativo · sobreviva'],
  fr:['Battez l’ennemi marqué','Prenez le fragment','Restez 1,2 s à la balise','Balise active · survivez'],
  de:['Besiege den markierten Gegner','Sammle das Fragment','Bleibe 1,2 s am Leuchtfeuer','Leuchtfeuer aktiv · überlebe'],
  it:['Sconfiggi il nemico segnato','Raccogli il frammento','Resta 1,2 s al faro','Faro attivo · sopravvivi'],
  ru:['Победите отмеченного врага','Подберите осколок','Оставайтесь у маяка 1,2 с','Маяк включён · выживите'],
  hi:['चिह्नित शत्रु को हराएँ','टुकड़ा उठाएँ','बीकन पर 1.2 सेकंड रुकें','बीकन चालू · जीवित रहें'],
  ar:['اهزم العدو المحدد','اجمع الشظية','ابقَ عند المنارة ١٫٢ ثانية','المنارة مفعّلة · اصمد'],
};
const chargerObjective={en:'Dodge and defeat the marked charger','zh-Hant':'閃避並擊敗標記衝刺者','zh-Hans':'躲避并击败标记冲刺者',ja:'印の突進兵を避けて倒す',ko:'표시된 돌진자를 피하고 처치',es:'Esquiva y derrota al cargador marcado','pt-BR':'Desvie e derrote o atacante marcado',fr:'Esquivez et battez le chargeur marqué',de:'Weiche dem markierten Angreifer aus und besiege ihn',it:'Evita e sconfiggi il nemico segnato',ru:'Уклонитесь и победите отмеченного врага',hi:'चिह्नित हमलावर से बचकर उसे हराएँ',ar:'تجنب المهاجم المحدد واهزمه'};
export function beaconObjective(locale, phase, stage=31){if(stage===32&&phase===0)return chargerObjective[locale]||chargerObjective.en;return (objectives[locale]||objectives.en)[phase]||objectives.en[0]}

const resultLabels={
  en:['Defeated','Level','s','Practice only'], 'zh-Hant':['擊敗','等級','秒','僅供練習'],
  'zh-Hans':['击败','等级','秒','仅供练习'], ja:['撃破','レベル','秒','練習のみ'],
  ko:['처치','레벨','초','연습 전용'], es:['Derrotados','Nivel','s','Solo práctica'],
  'pt-BR':['Derrotados','Nível','s','Somente treino'], fr:['Vaincus','Niveau','s','Entraînement uniquement'],
  de:['Besiegt','Stufe','s','Nur Übung'], it:['Sconfitti','Livello','s','Solo pratica'],
  ru:['Побеждено','Уровень','с','Только тренировка'], hi:['हराए','स्तर','सेकंड','केवल अभ्यास'],
  ar:['هُزم','المستوى','ث','تدريب فقط'],
};
export function beaconResult(locale,calmed,level,seconds){
  const words=resultLabels[locale]||resultLabels.en;
  return {stats:`${words[0]} ${calmed} · ${words[1]} ${level} · ${seconds} ${words[2]}`,label:words[3]};
}
