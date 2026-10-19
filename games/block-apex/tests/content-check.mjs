// Run inside the repository's supervised Codex work environment.
// A clean result is static evidence only, never a localization/visual release gate.
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {CATALOG,LOCALE_ORDER,translate} from '../locales.mjs';
import {renderGuide} from '../guide.mjs';
import {RACE_SOUNDS} from '../audio.mjs';
import {STAGES,GAME_RELEASE_VERSION,INTERFACE_VERSION} from '../data.mjs';
import {STAGE_CONFIG} from '../stage-config.mjs';
if(!process.env.CODEX_THREAD_ID)throw new Error('Use the real bound Codex thread; do not invent an identity.');
const game=new URL('../',import.meta.url);
const modules=['data.mjs','stage-config.mjs','physics.mjs','store.mjs','input.mjs','audio.mjs','renderer.mjs','locales.mjs','guide.mjs','game.mjs'];
for(const name of modules){
  const path=new URL(name,game);assert.ok(existsSync(path),`Missing module: ${name}`);
  execFileSync(process.execPath,['--check',fileURLToPath(path)],{stdio:'pipe'});
}
const html=readFileSync(new URL('index.html',game),'utf8');
assert.match(html,/name="robots" content="noindex,nofollow"/);
assert.match(html,/name="weightplay-game-version" content="v16"/);
assert.match(html,/name="weightplay-interface-version" content="9"/);
assert.match(html,/data-wp-game-version="v16"[^>]*data-wp-interface-version="9"/);
assert.match(html,/weightplay-audio\.js/);assert.doesNotMatch(html,/src\/sound\.js/);
assert.match(html,/stage-rail-i9\.js/);assert.match(html,/game-play-ui\.js/);assert.match(html,/game-play-ui\.css/);
assert.match(html,/data-wp-frame-nav[^>]*data-wp-frame-stage-nav/);
assert.doesNotMatch(html,/stage-selector-standard|stage-virtualization-standard|WeightPlayStageV6|data-wp-stage-settle|[?&]trial(?:=|&|#)|URLSearchParams/);
assert.equal(GAME_RELEASE_VERSION,'v16');assert.equal(INTERFACE_VERSION,9);
assert.equal(STAGES.length,30);assert.equal(STAGE_CONFIG.entries.length,STAGES.length);
assert.equal(STAGE_CONFIG.poster,'/assets/block-apex-poster.webp');
assert.equal(STAGE_CONFIG.background,'/assets/lobby-block-atmosphere.svg');
assert.ok(existsSync(new URL('../../assets/block-apex-poster.webp',game)));
assert.ok(existsSync(new URL('../../assets/lobby-block-atmosphere.svg',game)));
assert.deepEqual(STAGE_CONFIG.entries.map(item=>item.id),STAGES.map(stage=>stage.id));
for(const localeRoute of ['zh-cn','zh-tw','ja','ko','es','pt-br','fr','de','it','ru','hi','ar']){
  const route=readFileSync(new URL('../../../'+localeRoute+'/games/block-apex/index.html',import.meta.url),'utf8');
  assert.match(route,/name="weightplay-game-version" content="v16"/,localeRoute+' game version');
  assert.match(route,/name="weightplay-interface-version" content="9"/,localeRoute+' interface version');
  assert.match(route,/stage-rail-i9\.js/);assert.match(route,/game-play-ui\.js/);assert.match(route,/game-play-ui\.css/);
  assert.doesNotMatch(route,/stage-selector-standard|stage-virtualization-standard|WeightPlayStageV6|[?&]trial(?:=|&|#)|URLSearchParams/);
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
for(const [,path]of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  if(path.startsWith('/')||/^[a-z]+:/i.test(path))continue;
  const target=new URL(path,game);target.search='';target.hash='';assert.ok(existsSync(target),`Missing entry dependency: ${path}`);
}
for(const name of ['three.module.min.js','three.core.min.js','LICENSE'])assert.ok(existsSync(new URL(`vendor/three/${name}`,game)),`Missing vendor: ${name}`);
const contentKeys=[...html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)].map(match=>match[1]);
assert.equal(LOCALE_ORDER.length,13);
class Element {
  constructor(tag){this.tagName=tag;this.children=[];this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=[...nodes];}
}
const previous=globalThis.document;
try{
  globalThis.document={createElement:tag=>new Element(tag)};
  for(const locale of LOCALE_ORDER){
    const catalog=CATALOG[locale];assert.equal(catalog.names.length,12);
    for(const key of contentKeys)assert.ok(translate(locale,key).trim(),`${locale}:${key}`);
    for(const [key,value]of Object.entries(catalog))if(typeof value==='string'){
      assert.ok(value.trim(),`Empty ${locale}:${key}`);
      assert.doesNotMatch(translate(locale,key,{n:3,rank:2,time:35,stars:1}),/\{\w+\}/);
    }
    const root=new Element('article');renderGuide(root,locale,(key,values)=>translate(locale,key,values));
    assert.equal(root.children.length,3);assert.equal(root.children[1].children.length,7);
    for(const section of root.children[1].children)assert.ok(section.children.length>=2,`Empty guide section: ${locale}`);
    const related=root.children[2];assert.equal(related.className,'game-info-section game-info-related-section');
    assert.equal(related.children.length,3);assert.equal(related.children[2].children.length,2);
    for(const card of related.children[2].children){
      assert.match(card.href,/^\/games\/(?:snake|space-rocks)\/$/);
      assert.equal(card.children[0].children.length,2);
      assert.ok(card.children[0].children.every(child=>child.textContent.trim()),`Incomplete related card: ${locale}`);
    }
  }
}finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
const catalogText=readFileSync(new URL('../../docs/audio-catalog.md',game),'utf8');
for(const id of new Set(Object.values(RACE_SOUNDS)))assert.ok(catalogText.includes('`'+id+'`'),`Unregistered SFX: ${id}`);
const audioSource=readFileSync(new URL('audio.mjs',game),'utf8');
assert.doesNotMatch(audioSource,/new\s+(?:window\.)?(?:AudioContext|Audio)\s*\(|createOscillator\s*\(|WonderSound/);
console.log(JSON.stringify({modules:modules.length,locales:LOCALE_ORDER.length,stages:STAGES.length,interfaceVersion:INTERFACE_VERSION,guideSectionsPerLocale:7,relatedCardsPerLocale:2,status:'static-only',formalAcceptance:false}));
