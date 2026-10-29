window.WPPopularArcade?.mount("tic-tac-toe"),(()=>{"use strict";document.body.dataset.gameVersion="v39",document.body.dataset.wpGameVersion="v39",document.body.dataset.wpInterfaceVersion="9";const w={en:{lobby:"Back to WeightPlay",battle:"Back to main",settings:"Settings"},"zh-Hant":{lobby:"返回 WeightPlay",battle:"返回主頁",settings:"設定"},"zh-Hans":{lobby:"返回 WeightPlay",battle:"返回主页",settings:"设置"},ja:{lobby:"WeightPlayへ戻る",battle:"メインへ戻る",settings:"設定"},ko:{lobby:"WeightPlay로 돌아가기",battle:"메인으로",settings:"설정"},es:{lobby:"Volver a WeightPlay",battle:"Volver al inicio",settings:"Configuración"},"pt-BR":{lobby:"Voltar ao WeightPlay",battle:"Voltar ao início",settings:"Configurações"},fr:{lobby:"Retour à WeightPlay",battle:"Retour à l’accueil",settings:"Paramètres"},de:{lobby:"Zurück zu WeightPlay",battle:"Zur Startseite",settings:"Einstellungen"},it:{lobby:"Torna a WeightPlay",battle:"Torna alla home",settings:"Impostazioni"},ru:{lobby:"Вернуться в WeightPlay",battle:"На главную",settings:"Настройки"},hi:{lobby:"WeightPlay पर वापस जाएँ",battle:"मुख्य पृष्ठ",settings:"सेटिंग्स"},ar:{lobby:"العودة إلى WeightPlay",battle:"العودة إلى الرئيسية",settings:"الإعدادات"}},C=document.querySelector("#popularArcade"),u=document.querySelector(".arcade-header"),b=document.querySelector("#mainScreen"),x={en:"Read the full guide","zh-Hant":"閱讀完整指南","zh-Hans":"阅读完整指南",ja:"詳しいガイドを読む",ko:"전체 가이드 보기",es:"Leer la guía completa","pt-BR":"Ler o guia completo",fr:"Lire le guide complet",de:"Vollständige Anleitung lesen",it:"Leggi la guida completa",ru:"Открыть полное руководство",hi:"पूरी गाइड पढ़ें",ar:"اقرأ الدليل الكامل"},S={en:"Place X, read O's reply, and make three in a row.","zh-Hant":"放下 X，讀懂 O 的回應，連成三格。","zh-Hans":"放下 X，读懂 O 的回应，连成三格。",ja:"Xを置き、Oの応手を読み、先に3つ並べましょう。",ko:"X를 놓고 O의 응수를 읽어 세 칸을 먼저 이으세요.",es:"Coloca X, lee la respuesta de O y alinea tres.","pt-BR":"Coloque X, leia a resposta de O e alinhe três.",fr:"Placez X, lisez la réponse de O et alignez trois symboles.",de:"Setze X, lies Os Antwort und bringe drei in eine Reihe.",it:"Posiziona X, leggi la risposta di O e allineane tre.",ru:"Ставьте X, читайте ответ O и выстройте три в ряд.",hi:"X रखें, O की चाल पढ़ें और तीन को एक पंक्ति में जोड़ें।",ar:"ضع X، اقرأ رد O واجمع ثلاث علامات في صف واحد."},g={en:{live:"Try the highlighted empty square. No mark was placed.",suggested:"suggested move"},"zh-Hant":{live:"試試看亮起的空格；這次提示沒有放下棋子。",suggested:"建議落子"},"zh-Hans":{live:"试试亮起的空格；这次提示没有放下棋子。",suggested:"建议落子"},ja:{live:"光っている空きマスを試してください。マークは置いていません。",suggested:"おすすめの手"},ko:{live:"강조된 빈 칸에 놓아 보세요. 이번 힌트로 표시는 놓이지 않았습니다.",suggested:"추천 수"},es:{live:"Prueba la casilla vacía resaltada. No se colocó ninguna marca.",suggested:"jugada sugerida"},"pt-BR":{live:"Tente a casa vazia destacada. Nenhuma marca foi colocada.",suggested:"jogada sugerida"},fr:{live:"Essayez la case vide mise en évidence. Aucun symbole n’a été placé.",suggested:"coup suggéré"},de:{live:"Probiere das hervorgehobene freie Feld aus. Es wurde kein Zeichen gesetzt.",suggested:"empfohlener Zug"},it:{live:"Prova la casella vuota evidenziata. Non è stato posizionato alcun simbolo.",suggested:"mossa suggerita"},ru:{live:"Попробуйте выделенную пустую клетку. Знак не был поставлен.",suggested:"рекомендуемый ход"},hi:{live:"उभरे हुए खाली खाने में चाल चलें। संकेत से कोई निशान नहीं लगाया गया।",suggested:"सुझाई गई चाल"},ar:{live:"جرّب المربع الفارغ المميز. لم توضع أي علامة.",suggested:"الحركة المقترحة"}},r=document.querySelector("#board"),p=document.querySelector("#gameMessage"),z=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],E=[4,0,2,6,8,1,3,5,7];let m=null;const c=()=>{m=null,r?.querySelectorAll(".tic-cell[data-hint-target='true']").forEach(e=>{e.classList.remove("hint-target"),delete e.dataset.hintTarget,e.dataset.hintBaseLabel!==void 0&&(e.dataset.hintBaseLabel&&e.setAttribute("aria-label",e.dataset.hintBaseLabel),delete e.dataset.hintBaseLabel)})},P=()=>{if(document.body.dataset.screen!=="battle"||m===null)return!1;const e=r?.querySelector(`.tic-cell[data-value="${m}"]`);if(!e||e.disabled||e.textContent.trim())return c(),!1;if(e.dataset.hintTarget!=="true"){const t=document.documentElement.lang||"en",a=g[t]||g.en,n=e.getAttribute("aria-label")||"";e.dataset.hintBaseLabel=n,e.setAttribute("aria-label",`${n}, ${a.suggested}`),e.dataset.hintTarget="true",e.classList.add("hint-target")}return!0},k=()=>{const e=[...r?.querySelectorAll(".tic-cell")||[]],t=e.map(o=>o.textContent.trim());if(t.length!==9)return null;const a=o=>{for(const O of z){const B=O.filter(v=>t[v]===o).length,T=O.filter(v=>t[v]==="");if(B===2&&T.length===1)return T[0]}return null},n=o=>t[o]===""&&!e[o]?.disabled,l=a("X");if(l!==null&&n(l))return l;const d=a("O");return d!==null&&n(d)?d:E.find(n)??null},A=e=>{if(!e.target?.closest?.("#hintBtn, [data-action='hint']")||document.body.dataset.screen!=="battle")return;const a=k();if(c(),a===null)return;m=a,P();const n=document.documentElement.lang||"en";p.textContent=(g[n]||g.en).live,p.dataset.tone="warn",p.dataset.messageKey="ticHintTarget"};r?.addEventListener("click",e=>{e.target?.closest?.(".tic-cell[data-action='cell']")&&c()},!0),document.addEventListener("click",A),document.addEventListener("click",e=>{e.target?.closest?.("#restartBtn, #retryBtn, #homeBtn, .tic-battle-return, .tic-main-return")&&c()},!0);const q=new MutationObserver(P);r&&q.observe(r,{childList:!0}),new MutationObserver(()=>{document.body.dataset.screen!=="battle"&&c()}).observe(document.body,{attributes:!0,attributeFilter:["data-screen"]});const h=e=>{if(!e)return;const t=document.body.dataset.screen==="main";e.hidden=!t,e.inert=!t,e.setAttribute("aria-hidden",String(!t));const a=e.querySelector(".game-info-related-section a[href], .guide-related a[href]")?"cards":"empty";if(e.dataset.wpGuideRelatedState!==a&&(e.dataset.wpGuideRelatedState=a),e.dataset.wpGuideRelatedInterface!=="9"&&(e.dataset.wpGuideRelatedInterface="9"),!t||e.dataset.ticTacToeGuideCompact==="true")return;e.dataset.ticTacToeGuideCompact="true",e.classList.add("tic-tac-toe-guide-compact");const n=document.createElement("details");n.className="tic-tac-toe-guide-details";const l=document.createElement("summary"),d=document.documentElement.lang||"en";for(l.textContent=x[d]||x.en,n.append(l);e.firstChild;)n.append(e.firstChild);e.append(n)};window.WeightPlayTicGuide=Object.freeze({refresh:()=>document.querySelectorAll(".game-page-info").forEach(h)}),new MutationObserver(()=>{document.querySelectorAll(".game-page-info").forEach(h)}).observe(document.body,{childList:!0}),document.querySelectorAll(".game-page-info").forEach(h),u&&b&&!b.contains(u)&&b.prepend(u);const W=document.querySelector("#battleScreen .battle-top"),y=document.querySelector("#battleScreen .board-wrap");y?.setAttribute("role","region"),y?.setAttribute("tabindex","0"),y?.setAttribute("aria-labelledby","gameTitle");const s=document.createElement("a");s.className="tic-main-return",s.href="/",s.dataset.wpReturn="main",s.innerHTML='<span aria-hidden="true">←</span><img src="../../assets/weightplay-logo.png" alt="" width="32" height="32">',u?.prepend(s);const i=document.createElement("button");i.className="tic-battle-return",i.type="button",i.dataset.wpReturn="battle",i.textContent="←",W?.prepend(i),i.addEventListener("click",()=>window.WeightPlayTicFrame?.back());const L=()=>{const e=document.documentElement.lang||"en",t=w[e]||w.en;s.setAttribute("aria-label",t.lobby),i.setAttribute("aria-label",t.battle);const a=document.querySelector("#gameTagline");a&&(a.textContent=S[e]||S.en)};L(),document.querySelector("#localeSelect")?.addEventListener("change",L);const f=document.createElement("style");f.dataset.ticTacToeV19="true",f.textContent=`
    .tic-tac-toe-guide-compact {
      width: min(1040px, calc(100% - 24px));
      margin: 12px auto calc(24px + env(safe-area-inset-bottom));
      padding: 12px;
      border: 1px solid rgba(184, 211, 244, .32);
      border-radius: 14px;
      background: rgba(248, 250, 252, .96);
      box-shadow: 0 8px 20px rgba(8, 17, 31, .12);
    }
    .tic-tac-toe-guide-details {
      border: 0;
      border-radius: 0;
      background: transparent;
      color: var(--wp-ui-text);
      box-shadow: none;
    }
    .tic-tac-toe-guide-details > summary {
      min-height: 48px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      cursor: pointer;
      font-weight: 800;
      list-style-position: inside;
    }
    .tic-tac-toe-guide-details > summary::after {
      content: "＋";
      font-size: 1.2rem;
      line-height: 1;
    }
    .tic-tac-toe-guide-details[open] > summary::after { content: "−"; }
    .tic-tac-toe-guide-details > :not(summary) {
      margin-inline: 0;
    }
    .tic-tac-toe-guide-details .game-info-hero,
    .tic-tac-toe-guide-details .game-info-sections {
      margin-inline: 12px;
    }
    @media (max-width: 720px) {
      .tic-tac-toe-guide-compact {
        width: min(100% - 16px, 1040px);
        margin-top: 8px;
        padding: 12px;
      }
      .tic-tac-toe-guide-details > summary { padding: 10px 12px; }
    }
  `,document.head.append(f)})();
