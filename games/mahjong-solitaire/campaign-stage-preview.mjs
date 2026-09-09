import {campaignBoardGeometry} from './campaign-board.mjs';
import {createFaceElement} from './campaign-faces.mjs';

// Decorative, bounded snapshot of the authored board. No play controller,
// observer, animation, timer or independent state is allocated for previews.
export function createCampaignStagePreview(definition,doc=document) {
 const preview=doc.createElement('span');preview.className='mjc-stage-preview';
 preview.setAttribute('aria-hidden','true');
 const layout=campaignBoardGeometry(definition.tiles),scale=Math.min(164/layout.width,68/layout.height);
 const board=doc.createElement('span');board.className='mjc-stage-miniature';
 board.style.width=`${layout.width*scale}px`;board.style.height=`${layout.height*scale}px`;
 const points=new Map(layout.points.map(p=>[p.id,p]));
 for(const tile of definition.tiles){
  const node=doc.createElement('span'),p=points.get(tile.id);
  node.className='mjc-preview-tile';node.dataset.previewTile=tile.id;
  node.style.left=`${p.x*scale}px`;node.style.top=`${p.y*scale}px`;
  node.style.width=`${72*scale}px`;node.style.height=`${86*scale}px`;
  node.style.zIndex=String(tile.z+1);node.dataset.layer=String(tile.z);
  if(tile.gate)node.dataset.sealed='true';
  node.append(createFaceElement(tile.face,doc));board.append(node);
 }
 preview.append(board);return preview;
}
