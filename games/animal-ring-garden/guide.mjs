import {NEW_COPY} from './copy.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export function renderConservatoryGuide(locale){
  const c=NEW_COPY[locale]||NEW_COPY.en;
  return '<section id="gameGuide" class="game-page-info game-page-info-static" data-screen="main" data-wp-game-guide data-wp-preserve-static-guide data-wp-game-owned-guide="true" data-runtime-localize="off" aria-label="'+escape(c.help)+'"><div class="game-info-title"><span class="game-info-kicker">'+escape(c.world)+'</span><h2>'+escape(c.help)+'</h2><p>'+escape(c.summary)+'</p></div><div class="game-info-sections"><div class="game-info-section"><p>'+escape(c.how)+'</p><p>'+escape(c.keyboard)+'</p></div><div class="game-info-section"><h3>'+escape(c.collection)+'</h3><p>'+escape(c.jade)+': '+escape(c.earn)+'</p><p>'+escape(c.moonstone)+': '+escape(c.buy)+'. '+escape(c.permanent)+'</p></div></div></section>';
}
