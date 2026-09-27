// Run inside the repository's supervised Codex work environment.
// A clean result is static evidence only, never a localization/visual release gate.
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {CATALOG,LOCALE_ORDER,translate} from '../locales.mjs';
import {renderGuide} from '../guide.mjs';
import {RACE_SOUNDS} from '../audio.mjs';
if(!process.env.CODEX_THREAD_ID)throw new Error('Use the real bound Codex thread; do not invent an identity.');
const game=new URL('../',import.meta.url);
const modules=['data.mjs','physics.mjs','store.mjs','input.mjs','audio.mjs','renderer.mjs','locales.mjs','guide.mjs','game.mjs'];
for(const name of modules){
  const path=new URL(name,game);assert.ok(existsSync(path),`Missing module: ${name}`);
  execFileSync(process.execPath,['--check',fileURLToPath(path)],{stdio:'pipe'});
}
const html=readFileSync(new URL('index.html',game),'utf8');
assert.match(html,/name="robots" content="noindex,nofollow"/);
assert.match(html,/weightplay-audio\.js/);assert.doesNotMatch(html,/src\/sound\.js/);
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
    assert.equal(root.children.length,2);assert.equal(root.children[1].children.length,7);
    for(const section of root.children[1].children)assert.ok(section.children.length>=2,`Empty guide section: ${locale}`);
  }
}finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
const catalogText=readFileSync(new URL('../../docs/audio-catalog.md',game),'utf8');
for(const id of new Set(Object.values(RACE_SOUNDS)))assert.ok(catalogText.includes('`'+id+'`'),`Unregistered SFX: ${id}`);
const audioSource=readFileSync(new URL('audio.mjs',game),'utf8');
assert.doesNotMatch(audioSource,/new\s+(?:window\.)?(?:AudioContext|Audio)\s*\(|createOscillator\s*\(|WonderSound/);
console.log(JSON.stringify({modules:modules.length,locales:LOCALE_ORDER.length,guideSectionsPerLocale:7,status:'static-only',formalAcceptance:false}));
