var g=Object.defineProperty;var n=(i,s)=>g(i,"name",{value:s,configurable:!0});const t=n(i=>String(i).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),"escape");export function forestGuide(i,s=[]){const a=n(e=>{if(typeof i?.[e]!="string"||!i[e].trim())throw new Error(`Missing Forest guide copy: ${e}`);return t(i[e])},"text"),r=n((e,o)=>`<${e} data-i18n="${o}">${a(o)}</${e}>`,"field");if(!Array.isArray(i?.tags)||i.tags.length!==3||!Array.isArray(i?.faqs)||i.faqs.length!==6)throw new Error("Incomplete Forest Text Growth 1.4.0 copy");if(s.length!==2||s.some(e=>!e?.id||!e?.name||!e?.href||!e?.description))throw new Error("Incomplete Forest related-game copy");const d=`<div class="game-info-tags" data-wp-gameplay-tags="1.4.0">${i.tags.map(e=>`<span>${t(e)}</span>`).join("")}</div>`,l=i.faqs.map(([e,o])=>`<div><dt>${t(e)}</dt><dd>${t(o)}</dd></div>`).join(""),c=s.map(e=>`<a class="game-info-related-card" href="${t(e.href)}" data-related-game="${t(e.id)}"><strong>${t(e.name)}</strong><span>${t(e.description)}</span></a>`).join("");return`<section id="gameGuide" class="game-page-info game-page-info-static" data-wp-guide-complete="true" data-runtime-localize="off" aria-label="${a("guideLabel")}" data-i18n-aria="guideLabel">
    <div class="game-info-hero"><div class="game-info-title">${r("h2","fullTitle")}${r("p","guideIntro")}</div></div>
    ${d}
    <div class="game-info-sections">
      <div class="game-info-section"><h3>${a("overviewTitle")}</h3><p>${a("overview")}</p></div>
      <div class="game-info-section"><h3>${a("strategyTitle")}</h3><p>${a("strategy")}</p></div>
      <div class="game-info-section"><h3>${a("progressionTitle")}</h3><p>${a("progression")}</p></div>
      <div class="game-info-section"><h3>${a("repeatTitle")}</h3><p>${a("repeat")}</p></div>
      <div class="game-info-section"><h3>${a("faqTitle")}</h3><dl>${l}</dl></div>
      <div class="game-info-section">${r("h3","guideSaveTitle")}${r("p","guideSave")}</div>
      <div class="game-info-section game-info-related-section"><h3>${a("relatedTitle")}</h3><p>${a("relatedIntro")}</p><div class="game-info-related-cards">${c}</div></div>
    </div>
  </section>`}n(forestGuide,"forestGuide");export function replaceForestGuide(i,s,a=[]){const r=/<section\b[^>]*class="game-page-info game-page-info-static"[^>]*>[\s\S]*?<\/section>/;if(!r.test(i))throw new Error("Forest guide slot missing");return i.replace(r,()=>forestGuide(s,a))}n(replaceForestGuide,"replaceForestGuide");
