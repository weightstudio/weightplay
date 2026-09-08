import {guideLocales} from './guide-locales.mjs';
import {boardLocales} from './board-locales.mjs';
export function rulesReferenceSections(locale){
 const copy=guideLocales[locale],names=boardLocales[locale];
 if(!copy||!names)throw Error('Unsupported chess rules locale: '+locale);
 return [
  {title:copy.goalTitle,paragraphs:[copy.goal]},
  {title:copy.piecesTitle,pieces:['p','r','bPiece','n','q','k'].map(key=>({key,name:names[key],description:copy[key]}))},
  {title:copy.specialTitle,paragraphs:['castle','enPassant','promotion'].map(key=>copy[key])},
  {title:copy.endTitle,paragraphs:[copy.end]},
  {title:copy.playTitle,paragraphs:[copy.play,names.keys]},
 ];
}
export function rulesReferenceHtml(locale){
 const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 return rulesReferenceSections(locale).map(section=>`<section class="game-info-section"><h3>${escape(section.title)}</h3>`+
  (section.pieces?`<dl class="piece-reference">${section.pieces.map(piece=>`<div data-piece="${piece.key}"><dt>${escape(piece.name)}</dt><dd>${escape(piece.description)}</dd></div>`).join('')}</dl>`:section.paragraphs.map(text=>`<p>${escape(text)}</p>`).join(''))+'</section>').join('');
}
export function renderRulesReference(host,locale){
 const element=(tag,text)=>{const node=host.ownerDocument.createElement(tag);if(text)node.textContent=text;return node;};
 const sections=rulesReferenceSections(locale).map(copy=>{
  const section=element('section');section.className='game-info-section';section.append(element('h3',copy.title));
  if(copy.pieces){const list=element('dl');list.className='piece-reference';for(const piece of copy.pieces){const card=element('div');card.dataset.piece=piece.key;card.append(element('dt',piece.name),element('dd',piece.description));list.append(card);}section.append(list);}
  else for(const text of copy.paragraphs)section.append(element('p',text));
  return section;
 });
 host.replaceChildren(...sections);
 host.lang=locale;host.dir=locale==='ar'?'rtl':'ltr';
}
