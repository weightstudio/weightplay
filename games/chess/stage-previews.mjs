import {ChessBoard3D} from './board-3d.mjs';
import {ChessSession} from './full-rules.mjs';

// Bounded, session-only thumbnails. Never retain a live renderer on Stage.
const cache=new Map(),capacity=32;
export function clearStagePreviews(){cache.clear();}
export function stagePreviewStats(){return {count:cache.size,encodedBytes:[...cache.values()].reduce((sum,url)=>sum+url.length,0)};}
export function stagePreviews(challenges){
 const missing=challenges.filter(c=>!cache.has(c.fen));if(!missing.length)return cache;
 const host=document.createElement('div');host.setAttribute('aria-hidden','true');host.dataset.chessPreviewHost='';host.style.cssText='position:fixed;left:-10000px;top:0;width:256px;height:256px;pointer-events:none';document.body.append(host);let view;
 try{
  view=new ChessBoard3D(host);view.renderer.setPixelRatio(1);view.resize();
  for(const challenge of missing){
   const session=new ChessSession();session.game.load(challenge.fen);view.setPosition(session.game.board());
   const url=view.renderer.domElement.toDataURL('image/png');if(url==='data:,')throw Error('EMPTY_STAGE_PREVIEW');
   while(cache.size>=capacity)cache.delete(cache.keys().next().value);cache.set(challenge.fen,url);
  }
  return cache;
 }finally{view?.dispose();host.remove();}
}
