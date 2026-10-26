import {PLAYBOOKS} from './content.mjs';

function routePreview(book){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 72 42');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  const colors=['#ffe07b','#a4f2f0','#ffb2cf'];
  book.paths.forEach((route,i)=>{
    const points=[[[ -6,0,6][i],0],...route];
    const path=document.createElementNS(svg.namespaceURI,'path');
    path.setAttribute('d',points.map(([x,y],n)=>`${n?'L':'M'}${36+x*3.6},${37-y*1.7}`).join(' '));
    path.setAttribute('fill','none');path.setAttribute('stroke',colors[i]);path.setAttribute('stroke-width','2');
    if(book.delay[i])path.setAttribute('stroke-dasharray','2 2');
    svg.append(path);
  });
  return svg;
}

export function createPlaybookChoices(root,{onChoose,signal}){
  const buttons=PLAYBOOKS.map(book=>{
    const button=document.createElement('button');button.type='button';button.className='play-book';button.dataset.playbook=book.id;
    button.append(routePreview(book),document.createElement('span'));root.append(button);return button;
  });
  root.addEventListener('click',event=>{const button=event.target.closest('button[data-playbook]');if(button&&!button.disabled)onChoose(button.dataset.playbook);},{signal});
  root.addEventListener('keydown',event=>{
    const available=buttons.filter(b=>!b.hidden&&!b.disabled),index=available.indexOf(event.target.closest('button'));
    if(index<0)return;let next;
    const direction=document.documentElement.dir==='rtl'?-1:1;
    if(event.key==='Home')next=0;else if(event.key==='End')next=available.length-1;
    else if(event.key==='ArrowRight')next=(index+direction+available.length)%available.length;
    else if(event.key==='ArrowLeft')next=(index-direction+available.length)%available.length;else return;
    event.preventDefault();event.stopPropagation();available[next]?.focus({preventScroll:true});available[next]?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
  },{signal});
  root.addEventListener('focusin',event=>event.target.closest('button')?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'}),{signal});
  return {
    render({allowed,blocked,required,selected,ready,names,hints,resting}){
      buttons.forEach((button,i)=>{
        const id=button.dataset.playbook;button.hidden=!allowed.includes(id);button.disabled=!ready||id===blocked;
        button.setAttribute('aria-pressed',String(!required&&id===selected));button.dataset.resting=String(id===blocked);
        button.querySelector('span').textContent=names[i];
        const label=id===blocked?resting(names[i]):`${names[i]}. ${hints[i]}`;button.setAttribute('aria-label',label);button.title=label;
      });
    },
    setReady(ready){for(const button of buttons)button.disabled=!ready||button.dataset.resting==='true';},
    focusTarget(){return buttons.find(b=>!b.hidden&&!b.disabled&&b.getAttribute('aria-pressed')==='true')||buttons.find(b=>!b.hidden&&!b.disabled)||null;}
  };
}
