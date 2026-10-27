// Text-first, keyboard-operable Chapter 2 order preparation. It is not an art
// replacement; approved order/actor artwork and rendered review remain pending.
export function createRelayPreparationView({document,host,copy,preview,actors,supplies,labels,choose,confirm,onError}) {
  if(!document||!host||!copy||!preview||!Array.isArray(actors)||!labels||typeof choose!=='function'||typeof confirm!=='function'||typeof onError!=='function')throw new TypeError('relay view dependencies');
  const make=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=String(text);return node};
  const section=make('section');section.className='relay-wave-preparation';section.setAttribute('aria-labelledby','relay-order-heading');
  const heading=make('h2',labels.heading);heading.id='relay-order-heading';section.append(heading);
  const supply=make('p',`${labels.supplies}: ${supplies}`);section.append(supply);
  const summary=make('p',copy.help[0]);section.append(summary);
  const threats=make('ul');threats.className='relay-wave-threats';
  actors.forEach(actor=>{const li=make('li');const name=make('strong',actor.name),detail=make('span',actor.role);li.append(name,detail);threats.append(li)});section.append(threats);
  const field=make('fieldset');field.className='relay-order-options';const legend=make('legend',copy.help[4]);field.append(legend);
  const choices=[{type:'none',target:null,label:labels.none}];
  const actorTarget=actor=>{const target=actors.find(item=>item.id===actor.id);if(!target||!Number.isInteger(target.slot)||target.slot<1||target.slot>6)throw new Error('relay target unavailable');return target;};
  if(preview.orders.includes('ward'))for(const slot of preview.wardTargets)choices.push({type:'ward',target:slot,label:`${copy.orders[0]} · ${labels.slot(slot)}`});
  if(preview.orders.includes('flare'))for(const actor of preview.actors.filter(x=>x.kind==='G')){const target=actorTarget(actor);choices.push({type:'flare',target:actor.id,label:`${copy.orders[1]} · ${target.name||copy.threats[1]} · ${labels.slot(target.slot)}`});}
  if(preview.orders.includes('seal'))for(const actor of preview.actors.filter(x=>['P','B50','B55','B60'].includes(x.kind))){const target=actorTarget(actor);choices.push({type:'seal',target:actor.id,label:`${copy.orders[2]} · ${target.name||copy.threats[2]} · ${labels.slot(target.slot)}`});}
  const status=make('p');status.className='action-notice';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  let current=choices[0],busy=false,disposed=false;const radios=[];
  for(const choice of choices){
    const label=make('label');label.className='relay-order-choice';const radio=make('input');radio.type='radio';radio.name='relay-wave-order';radio.checked=choice.type==='none';radio.disabled=choice.type!=='none'&&supplies<2;
    label.append(radio,make('span',choice.label));field.append(label);radios.push({choice,radio});
    radio.addEventListener('change',()=>{if(!radio.checked||disposed||busy)return;const result=choose(choice.type,choice.target);if(!result?.ok){radios.forEach(item=>{item.radio.checked=item.choice===current});status.textContent=labels.unavailable;return}current=choice;status.textContent=choice.label;});
  }
  section.append(field);
  const help=make('ul');help.className='relay-order-help';copy.help.slice(1,4).forEach(text=>help.append(make('li',text)));section.append(help,status);
  const start=make('button',labels.start);start.type='button';start.className='primary-btn';
  start.addEventListener('click',()=>{if(disposed||busy)return;busy=true;start.disabled=true;try{const result=confirm(current);if(!result?.ok){status.textContent=labels.unavailable;onError(result);busy=false;start.disabled=false;}}catch(error){status.textContent=labels.unavailable;onError(error);busy=false;start.disabled=false;}});
  section.append(start);host.append(section);
  return Object.freeze({element:section,focus(){field.querySelector('input:not(:disabled)')?.focus({preventScroll:true})},destroy(){if(disposed)return;disposed=true;section.remove()}});
}
