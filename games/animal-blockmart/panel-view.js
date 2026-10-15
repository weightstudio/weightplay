// Game-owned keyed rendering. Reuse visible nodes/images and refresh only our
// listeners, so retained controls never call stale purchase/claim closures.
const listeners=Symbol('blockmartPanelListeners');
export function panelElement(tag){
  const node=document.createElement(tag),add=node.addEventListener.bind(node);node[listeners]=[];
  node.addEventListener=(type,handler,options)=>{node[listeners].push({type,handler,options});add(type,handler,options);};
  return node;
}
function key(node,index){
  if(node.nodeType!==1)return '#'+index;
  const named=node.id||['catalogKey','fixtureId','employeeId','achievementId','growthCategory','businessUpgrade','claimReward','restockProduct','productId','growthGoal','productSlot'].map(name=>node.dataset[name]===undefined?'':name+':'+node.dataset[name]).find(Boolean);
  return node.nodeName+':'+(named||node.className+':'+index);
}
function patch(old,next){
  if(old.nodeType===3){if(old.data!==next.data)old.data=next.data;return;}
  if(old.nodeType!==1)return;
  const value='value' in next?next.value:null;
  for(const attr of [...old.attributes])if(!next.hasAttribute(attr.name))old.removeAttribute(attr.name);
  for(const attr of next.attributes)if(old.getAttribute(attr.name)!==attr.value)old.setAttribute(attr.name,attr.value);
  for(const binding of old[listeners]||[])old.removeEventListener(binding.type,binding.handler,binding.options);
  old[listeners]=(next[listeners]||[]).map(binding=>({...binding,handler:function(event){
    // Fresh render closures may read their select/input directly. Mirror the
    // native live value before calling them; the visible element stays stable.
    if('value' in old&&'value' in next)next.value=old.value;
    if('checked' in old&&'checked' in next)next.checked=old.checked;
    return typeof binding.handler==='function'?binding.handler.call(old,event):binding.handler.handleEvent(event);
  }}));
  for(const binding of old[listeners])EventTarget.prototype.addEventListener.call(old,binding.type,binding.handler,binding.options);
  reconcilePanel(old,next);
  if(value!==null&&old.value!==value)old.value=value;
}
export function reconcilePanel(live,draft){
  const previous=[...live.childNodes],available=new Map(previous.map((node,index)=>[key(node,index),node])),used=new Set();
  [...draft.childNodes].forEach((next,index)=>{
    let node=available.get(key(next,index));
    if(node&&node.nodeType===next.nodeType&&node.nodeName===next.nodeName){patch(node,next);used.add(node);}else node=next;
    if(live.childNodes[index]!==node)live.insertBefore(node,live.childNodes[index]||null);
  });
  for(const node of previous)if(!used.has(node)&&node.parentNode===live)node.remove();
}
