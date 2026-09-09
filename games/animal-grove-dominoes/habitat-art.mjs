// One atlas mapping for the Stage preview and the two domino faces.
const tokens=Object.freeze(['den','creek','moss','nest','moon','reef','tide','shell','grove','pine','snow','burrow','pond','meadow']);
export function createHabitatArt(token){
 const position=tokens.indexOf(token);
 if(position<0)throw new Error(`Unknown habitat artwork: ${token}`);
 const art=document.createElement('span');art.className='tile-art';art.setAttribute('aria-hidden','true');
 art.style.backgroundPosition=`${position%5*25}% ${Math.floor(position/5)*50}%`;
 return art;
}
