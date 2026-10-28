import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LOCALES,ROUTES,localizeShell,renderStaticGuide,GAME_ID} from './copy.mjs';
import {extractAuthoredGuide} from '../../scripts/lib/authored-guide-preservation.mjs';
import {stripRootLocaleHandoff} from '../../scripts/lib/root-locale-handoff.mjs';
import {shouldGenerateEnglishGameRoute} from '../../scripts/lib/localized-route-preflight.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2);
if(args.some(arg=>!['--canonical-only','--check'].includes(arg)))throw Error('Usage: localize.mjs [--canonical-only] [--check]');
const canonicalOnly=args.includes('--canonical-only'),check=args.includes('--check');
const canonicalFile=path.join(root,'games',GAME_ID,'index.html'),canonical=fs.readFileSync(canonicalFile,'utf8');
if(!canonical.includes('name="weightplay-game-id" content="dustwake-depot"')||!/<meta\b[^>]*name="robots"[^>]*content="noindex,nofollow"/.test(canonical))throw Error('DUSTWAKE_PLANNED_CANONICAL_REQUIRED');
const canonicalGuide=extractAuthoredGuide(canonical);
if(!canonicalGuide)throw Error('DUSTWAKE_GUIDE_SLOT_MISSING:canonical');
// The shared generator deliberately skips a brand-new planned English route.
// This exact-game compiler has the owner's declared 13-route source scope;
// use its supported allowNewEnglishRoute contract without changing catalog state.
if(!shouldGenerateEnglishGameRoute({status:'planned',gameId:GAME_ID,existingEnglishRouteIds:new Set(),sitemapEnglishGameIds:new Set(),allowNewEnglishRoute:true}))throw Error('DUSTWAKE_ENGLISH_PREVIEW_SCOPE_REQUIRED');
const targets=[{file:canonicalFile,locale:'en',canonical:true},...(!canonicalOnly?LOCALES.map((locale,i)=>({file:path.join(root,ROUTES[i],'games',GAME_ID,'index.html'),locale,canonical:false})):[])];
const prepared=targets.map(({file,locale,canonical:isCanonical})=>{
  const before=fs.existsSync(file)?fs.readFileSync(file,'utf8'):null;
  if(before&&!before.includes('name="weightplay-game-id" content="dustwake-depot"'))throw Error(`DUSTWAKE_ROUTE_IDENTITY_COLLISION:${locale}`);
  const template=isCanonical?canonical:stripRootLocaleHandoff(canonical);
  let after=localizeShell(template,locale).replace(canonicalGuide,renderStaticGuide(locale));
  after=after.replace(/(<section\b[^>]*\bid="gameGuide"[^>]*)(>)/i,(_all,opening,end)=>/\bhidden\b/.test(opening)?opening+end:opening+' hidden'+end);
  after=after.replace(/<!-- adsense-static-guide:(?:start|end) -->/g,'');
  const renderedGuide=extractAuthoredGuide(after);
  const guideAt=after.indexOf(renderedGuide);
  after=after.slice(0,guideAt).trimEnd()+`\n<!-- adsense-static-guide:start -->\n${renderedGuide}\n<!-- adsense-static-guide:end -->\n`+after.slice(guideAt+renderedGuide.length).trimStart();
  return {file,locale,before,after};
});
const changed=prepared.filter(item=>item.before!==item.after);
if(check&&changed.length)throw Error(`DUSTWAKE_LOCALIZED_COPY_STALE:${changed.map(item=>item.locale).join(',')}`);
if(!check)for(const item of changed){fs.mkdirSync(path.dirname(item.file),{recursive:true});fs.writeFileSync(item.file,item.after);}
console.log(JSON.stringify({gameId:GAME_ID,mode:check?'check':'write',routes:prepared.length,changed:changed.length,created:changed.filter(item=>item.before===null).length,scope:'DUSTWAKE_CANONICAL_AND_13_PLANNED_PREVIEW_ROUTES',renderedVerification:false}));
