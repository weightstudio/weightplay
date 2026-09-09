import {nextCampaignOrder,campaignSeals} from './campaign-engine.mjs';
import {createFaceElement} from './campaign-faces.mjs';
import {campaignCopy,campaignFaceLabel} from './campaign-copy.mjs';

// Read-only cues derived from the same engine as pair legality. They neither
// select a pair nor spend a Hint; Undo naturally restores the matching state.
export function renderCampaignRuleCues(root,state,locale){
 const c=campaignCopy(locale),next=nextCampaignOrder(state),opened=new Set(campaignSeals(state));
 root.replaceChildren();
 const group=(label)=>{const node=root.ownerDocument.createElement('div');node.className='mjc-rule-group';node.setAttribute('role','group');node.setAttribute('aria-label',label);const text=root.ownerDocument.createElement('span');text.className='mjc-rule-label';text.dir='auto';text.textContent=label;node.append(text);root.append(node);return node;};
 const chip=(parent,face,label,status)=>{const node=root.ownerDocument.createElement('span');node.className='mjc-rule-chip';node.dataset.status=status;node.setAttribute('role','img');node.setAttribute('aria-label',label);node.title=label;node.append(createFaceElement(face,root.ownerDocument));const badge=root.ownerDocument.createElement('b');badge.textContent=status==='done'?'✓':status==='next'?'→':'·';badge.setAttribute('aria-hidden','true');node.append(badge);parent.append(node);};
 if(state.rules.order.length){const node=group(c.order);for(const [i,face] of state.rules.order.entries()){
  const done=!state.tiles.some(t=>t.face===face&&!state.removed.includes(t.id)),status=done?'done':face===next?'next':'pending';
  chip(node,face,`${c.order} ${i+1}: ${campaignFaceLabel(locale,face)} · ${done?c.cleared:face===next?c.next:c.locked}`,status);
 }}
 if(Object.keys(state.rules.keys).length){const node=group(c.keys);for(const [face,gates] of Object.entries(state.rules.keys)){
  const done=gates.every(g=>opened.has(g));chip(node,face,`${c.keys}: ${campaignFaceLabel(locale,face)} · ${done?c.cleared:c.locked}`,done?'done':'pending');
 }}
 if(!root.childElementCount){const node=root.ownerDocument.createElement('span');node.className='mjc-rule-basic';node.textContent=c.rule;root.append(node);}
}
