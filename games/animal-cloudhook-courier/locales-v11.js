(() => {
  const retryCue = {
    en: "On Retry, watch the next ring: hold Tether when it is in range, build your swing, then release toward the next ring.",
    "zh-Hant": "再試一次時先看下一個光環：進入範圍後按住繫繩，累積擺盪，再朝下一個光環放手。",
    "zh-Hans": "再试一次时先看下一个光环：进入范围后按住系绳，积累摆荡，再朝下一个光环放手。",
    ja: "再挑戦では次のリングを見ましょう。近づいたらテザーを長押しし、揺れを作ってから次のリングへ放します。",
    ko: "다시 할 때는 다음 링을 보세요. 범위에 들어오면 테더를 누르고 흔들림을 만든 뒤 다음 링을 향해 놓으세요.",
    es: "Al reintentar, mira el siguiente anillo: mantén el lazo cuando esté al alcance, gana impulso y suéltalo hacia el siguiente.",
    "pt-BR": "Ao tentar de novo, observe o próximo anel: segure a corda quando ele estiver ao alcance, ganhe impulso e solte rumo ao seguinte.",
    fr: "À la prochaine tentative, regardez l’anneau suivant : maintenez le lien à portée, prenez de l’élan, puis lâchez vers le suivant.",
    de: "Beim nächsten Versuch auf den nächsten Ring achten: Halte das Seil in Reichweite, baue Schwung auf und löse zum nächsten Ring.",
    it: "Al prossimo tentativo guarda l’anello successivo: tieni il laccio quando è a portata, accumula slancio e lascia verso il prossimo.",
    ru: "В следующей попытке смотрите на следующее кольцо: удерживайте трос в зоне захвата, наберите раскачку и отпустите к следующему.",
    hi: "फिर प्रयास में अगले रिंग को देखें: पास आने पर टेथर दबाएँ, झूले की गति बनाएँ और अगले रिंग की ओर छोड़ें।",
    ar: "عند المحاولة مجددًا راقب الحلقة التالية: اضغط الحبل عندما تصبح في المدى، واجمع التأرجح، ثم اتركه نحو الحلقة التالية."
  };
  for (const [locale, value] of Object.entries(retryCue)) {
    const target = window.WPCloudhookLocales?.locales?.[locale];
    if (target) target.retryCue = value;
  }
})();
