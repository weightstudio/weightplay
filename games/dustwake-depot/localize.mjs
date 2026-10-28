import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LOCALES,ROUTES,localizeShell,renderStaticGuide,GAME_ID} from './copy.mjs';
import {extractAuthoredGuide} from '../../scripts/lib/authored-guide-preservation.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2);
if(args.some(arg=>!['--canonical-only','--check'].includes(arg)))throw Error('Usage: localize.mjs [--canonical-only] [--check]');
const canonicalOnly=args.includes('--canonical-only'),check=args.includes('--check');
const targets=[{file:path.join(root,'games',GAME_ID,'index.html'),locale:'en'},...(!canonicalOnly?LOCALES.map((locale,i)=>({file:path.join(root,ROUTES[i],'games',GAME_ID,'index.html'),locale})):[])];
const prepared=targets.map(({file,locale})=>{
  if(!fs.existsSync(file))throw Error(`DUSTWAKE_ROUTE_MISSING:${path.relative(root,file)}:run the scoped shared route generator first`);
  const before=fs.readFileSync(file,'utf8'),guide=extractAuthoredGuide(before);
  if(!guide)throw Error(`DUSTWAKE_GUIDE_SLOT_MISSING:${locale}`);
  let after=localizeShell(before,locale).replace(guide,renderStaticGuide(locale));
  after=after.replace(/(<section\b[^>]*\bid="gameGuide"[^>]*)(>)/i,(_all,opening,end)=>/\bhidden\b/.test(opening)?opening+end:opening+' hidden'+end);
  return {file,locale,before,after};
});
const changed=prepared.filter(item=>item.before!==item.after);
if(check&&changed.length)throw Error(`DUSTWAKE_LOCALIZED_COPY_STALE:${changed.map(item=>item.locale).join(',')}`);
if(!check)for(const item of changed)fs.writeFileSync(item.file,item.after);
console.log(JSON.stringify({gameId:GAME_ID,mode:check?'check':'write',routes:prepared.length,changed:changed.length,scope:'DUSTWAKE_INITIAL_HTML_ONLY',renderedVerification:false}));
