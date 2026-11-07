(() => {
  const copy = {
    en:['Replay tutorial','Turn the outlined shutter once.','Choose the outlined tray.','Press Weigh to record the comparison.','Choose the outlined glyph.','Plant the selected glyph.','Turn the outer ring clockwise.','Put the outlined stone on the scale.','Open valve A by one step.'],
    'zh-Hant':['重玩教學','轉動框出的窗板一次。','選取框出的托盤。','按下秤重，記錄比較結果。','選取框出的圖紋。','種下選取的圖紋。','順時針轉動外環。','把框出的石頭放上秤。','把 A 閥開大一格。'],
    'zh-Hans':['重玩教学','转动框出的窗板一次。','选取框出的托盘。','按下称重，记录比较结果。','选取框出的图纹。','种下选取的图纹。','顺时针转动外环。','把框出的石头放上秤。','把 A 阀开大一格。'],
    ja:['チュートリアルを再プレイ','枠で囲まれた雨戸を一度回します。','枠で囲まれた皿を選びます。','計量して比較結果を記録します。','枠で囲まれた模様を選びます。','選んだ模様を植えます。','外側の輪を時計回りに回します。','枠で囲まれた石をはかりに載せます。','バルブ A を一段開きます。'],
    ko:['튜토리얼 다시 하기','표시된 덧문을 한 번 돌리세요.','표시된 쟁반을 고르세요.','무게를 재서 비교 결과를 기록하세요.','표시된 문양을 고르세요.','고른 문양을 심으세요.','바깥 고리를 시계 방향으로 돌리세요.','표시된 돌을 저울에 올리세요.','A 밸브를 한 칸 여세요.'],
    es:['Repetir tutorial','Gira una vez la contraventana marcada.','Elige la bandeja marcada.','Pesa las piezas para registrar la comparación.','Elige el glifo marcado.','Planta el glifo elegido.','Gira el anillo exterior en sentido horario.','Pon la piedra marcada en la balanza.','Abre la válvula A un paso.'],
    'pt-BR':['Repetir tutorial','Gire uma vez a veneziana marcada.','Escolha a bandeja marcada.','Pese as peças para registrar a comparação.','Escolha o símbolo marcado.','Plante o símbolo escolhido.','Gire o anel externo no sentido horário.','Ponha a pedra marcada na balança.','Abra a válvula A em um nível.'],
    fr:['Rejouer le tutoriel','Tournez une fois le volet encadré.','Choisissez le plateau encadré.','Pesez les pièces pour enregistrer la comparaison.','Choisissez le glyphe encadré.','Plantez le glyphe choisi.','Tournez l’anneau extérieur dans le sens horaire.','Posez la pierre encadrée sur la balance.','Ouvrez la vanne A d’un cran.'],
    de:['Anleitung wiederholen','Drehe den markierten Laden einmal.','Wähle die markierte Schale.','Wiege die Teile und halte den Vergleich fest.','Wähle das markierte Zeichen.','Pflanze das gewählte Zeichen.','Drehe den äußeren Ring im Uhrzeigersinn.','Lege den markierten Stein auf die Waage.','Öffne Ventil A um eine Stufe.'],
    it:['Ripeti tutorial','Gira una volta l’imposta evidenziata.','Scegli il vassoio evidenziato.','Pesa i pezzi per registrare il confronto.','Scegli il glifo evidenziato.','Pianta il glifo scelto.','Gira l’anello esterno in senso orario.','Metti la pietra evidenziata sulla bilancia.','Apri la valvola A di un livello.'],
    ru:['Повторить обучение','Поверните выделенную ставню один раз.','Выберите выделенный лоток.','Взвесьте предметы, чтобы записать сравнение.','Выберите выделенный символ.','Посадите выбранный символ.','Поверните внешнее кольцо по часовой стрелке.','Положите выделенный камень на весы.','Откройте клапан A на одно деление.'],
    hi:['ट्यूटोरियल फिर खेलें','घेरे वाले शटर को एक बार घुमाएँ।','घेरे वाली ट्रे चुनें।','वज़न करके तुलना दर्ज करें।','घेरे वाला चिह्न चुनें।','चुना हुआ चिह्न लगाएँ।','बाहरी छल्ले को घड़ी की दिशा में घुमाएँ।','घेरे वाले पत्थर को तराज़ू पर रखें।','वाल्व A को एक स्तर खोलें।'],
    ar:['إعادة التدريب','أدر المصراع المحدد مرة واحدة.','اختر الصينية المحددة.','زِن القطعتين لتسجيل المقارنة.','اختر الرمز المحدد.','ازرع الرمز المختار.','أدر الحلقة الخارجية مع عقارب الساعة.','ضع الحجر المحدد على الميزان.','افتح الصمام A درجة واحدة.'],
  };
  function mount({gameId,status,locale,steps,canPersist}) {
    const host=document.createElement('div');host.className='wp-compact-puzzle-lesson';status.after(host);
    const words=()=>copy[locale()]||copy.en;
    const guide=window.WeightPlayTutorial.createActionGuide({gameId,revision:1,host,canPersist,steps:steps.map(step=>({...step,instruction:()=>words()[step.line]}))});
    const replay=[];
    return {
      guide,
      refresh(){for(const button of replay)button.textContent=words()[0];guide.refresh();},
      addReplay(anchor,callback,{inDialog=false}={}){
        const button=document.createElement('button');button.type='button';button.className='wp-compact-puzzle-replay';button.dataset.runtimeLocalize='off';
        button.id=inDialog?'battleActionReplay':'mainActionReplay';button.textContent=words()[0];button.onclick=callback;anchor.after(button);replay.push(button);return button;
      },
    };
  }
  window.WeightPlayStagePuzzleGuide=Object.freeze({mount});
})();
