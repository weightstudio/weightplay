// Unconnected Stage 51 practice draft. Native-language and rendered review
// remain required; these strings do not enable or certify the stage.
// Order: title, rule, collect, warning, charge, ready, waves.
export const interceptorCopy=Object.freeze({
  en:['Intercept Run','Collect a fragment. Dodge or defeat the marked interceptor, then hold B and clear three waves. Damage loses the fragment.','Collect a fragment','Warning · dodge or defeat','Charging · dodge','Hold at B','Clear the waves'],
  'zh-Hant':['攔截突襲','取得碎片後躲開或擊敗標記的攔截者，再停留於 B 啟動站台並清完三波；受傷會失去碎片。','取得碎片','預警中 · 躲開或擊敗','衝刺中 · 閃避','在 B 停留','清完敵人'],
  'zh-Hans':['拦截突袭','取得碎片后躲开或击败标记的拦截者，再停留于 B 启动站台并清完三波；受伤会失去碎片。','取得碎片','预警中 · 躲开或击败','冲刺中 · 闪避','在 B 停留','清完敌人'],
  ja:['迎撃をかわす','欠片を拾い、印の付いた迎撃者を避けるか倒してから B に留まり、3 波を突破する。被弾すると欠片を失う。','欠片を拾う','予告中 · 回避または撃破','突進中 · 回避','B に留まる','敵を倒す'],
  ko:['요격 피하기','조각을 얻은 뒤 표시된 요격자를 피하거나 처치하고 B에 머문 다음 세 무리를 물리치세요. 피해를 받으면 조각을 잃습니다.','조각 획득','예고 중 · 회피 또는 처치','돌진 중 · 회피','B에 머무르기','적 물리치기'],
  es:['Carrera de intercepción','Recoge un fragmento. Esquiva o derrota al interceptor marcado, permanece en B y supera tres oleadas. El daño hace perder el fragmento.','Recoge un fragmento','Aviso · esquiva o derrota','Carga · esquiva','Permanece en B','Supera las oleadas'],
  'pt-BR':['Corrida de interceptação','Pegue um fragmento. Desvie ou derrote o interceptador marcado, fique em B e vença três ondas. Dano faz perder o fragmento.','Pegue um fragmento','Aviso · desvie ou derrote','Investida · desvie','Fique em B','Vença as ondas'],
  fr:['Course d’interception','Ramassez un fragment. Évitez ou battez l’intercepteur marqué, restez sur B et terminez trois vagues. Un coup fait perdre le fragment.','Ramassez un fragment','Alerte · évitez ou battez','Charge · évitez','Restez sur B','Terminez les vagues'],
  de:['Abfanglauf','Sammle ein Fragment. Weiche dem markierten Abfänger aus oder besiege ihn, bleibe dann bei B und überstehe drei Wellen. Schaden lässt das Fragment fallen.','Fragment sammeln','Warnung · ausweichen oder besiegen','Ansturm · ausweichen','Bei B bleiben','Wellen überstehen'],
  it:['Corsa d’intercettazione','Raccogli un frammento. Schiva o sconfiggi l’intercettatore segnato, resta su B e supera tre ondate. I danni fanno perdere il frammento.','Raccogli un frammento','Avviso · schiva o sconfiggi','Carica · schiva','Resta su B','Supera le ondate'],
  ru:['Перехват','Соберите осколок. Уклонитесь от отмеченного перехватчика или победите его, затем стойте у B и пройдите три волны. Урон лишает осколка.','Соберите осколок','Предупреждение · уклонитесь или победите','Рывок · уклонитесь','Стойте у B','Пройдите волны'],
  hi:['अवरोध से बचें','टुकड़ा लें। चिह्नित अवरोधक से बचें या उसे हराएँ, फिर B पर रुकें और तीन लहरें पार करें। चोट से टुकड़ा खोता है।','टुकड़ा लें','चेतावनी · बचें या हराएँ','धावा · बचें','B पर रुकें','लहरें पार करें'],
  ar:['تجاوز المعترض','اجمع شظية. تفادَ المعترض المحدد أو اهزمه، ثم ابقَ عند B واجتز ثلاث موجات. الإصابة تفقدك الشظية.','اجمع شظية','تحذير · تفادَ أو اهزم','اندفاع · تفادَ','ابقَ عند B','اجتز الموجات'],
});

export function interceptorStatus(locale,round){
  const copy=interceptorCopy[locale]||interceptorCopy.en;
  if(round?.beacon?.completed>0)return copy[6];
  if(!(round?.beacon?.charge>0))return copy[2];
  if(round.cue?.phase==='active')return copy[4];
  if(round.cue || !round.cleared)return copy[3];
  return copy[5];
}
