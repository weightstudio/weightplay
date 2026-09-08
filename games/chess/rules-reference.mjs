import {guideLocales} from './guide-locales.mjs';
import {boardLocales} from './board-locales.mjs';
export function renderRulesReference(host,locale){
 const copy=guideLocales[locale],names=boardLocales[locale];
 if(!copy||!names)throw Error('Unsupported chess rules locale: '+locale);
 const element=(tag,text)=>{const node=host.ownerDocument.createElement(tag);if(text)node.textContent=text;return node;};
 const section=(title)=>{const node=element('section');node.append(element('h3',copy[title]));return node;};
 const overview=section('goalTitle');overview.append(element('p',copy.goal));
 const pieces=section('piecesTitle'),list=element('dl');list.className='piece-reference';
 for(const key of ['p','r','bPiece','n','q','k']){const card=element('div');card.dataset.piece=key;card.append(element('dt',names[key]),element('dd',copy[key]));list.append(card);}pieces.append(list);
 const special=section('specialTitle');for(const key of ['castle','enPassant','promotion'])special.append(element('p',copy[key]));
 const endings=section('endTitle');endings.append(element('p',copy.end));
 const controls=section('playTitle');controls.append(element('p',copy.play),element('p',names.keys));
 host.replaceChildren(overview,pieces,special,endings,controls);
 host.lang=locale;host.dir=locale==='ar'?'rtl':'ltr';
}
