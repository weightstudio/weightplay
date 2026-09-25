import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {PAGES} from './page-sources.mjs';
import {COPY,ROUTES} from './locales.mjs';
const root=new URL('../../',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),'utf8');
test('catalog stays planned and exposes only the explicit preview trial',()=>{
 const ctx={window:{}};vm.runInNewContext(read('src/lobby-data.js'),ctx);
 const games=ctx.window.WONDER_LOBBY.games.filter(g=>g.id==='pawflow');
 assert.equal(games.length,1);assert.equal(games[0].status,'planned');
 assert.equal(games[0].internalTrial,'index.html?preview=1');assert.equal(games[0].previewVideo,undefined);
 assert(ctx.window.WONDER_LOBBY.audiences.generalGameIds.includes('pawflow'));
 vm.runInNewContext(read('src/game-title-registry.js'),ctx);
 for(const locale of Object.keys(ROUTES))assert.equal(ctx.window.WEIGHTPLAY_GAME_TITLES.pawflow[locale],COPY[locale].title);
});
for(const [locale,segment]of Object.entries(ROUTES))test(`${locale}: complete native page survives canonical generation`,()=>{
 const page=read(`${segment}/games/pawflow/index.html`);
 assert.equal(page,PAGES[locale]);assert(page.includes(`lang="${locale}"`));
 assert(page.includes('content="noindex,nofollow"'));assert(page.includes('/games/pawflow/preview-gate.js'));
 assert(page.indexOf('/src/weightplay-audio.js')<page.indexOf('/src/site-config.js'));
 assert(!page.includes('/src/sound.js'));assert(page.includes(COPY[locale].title));
 assert(page.includes('flow-related-card'));assert(page.includes('weightplay-game-version" content="4"'));
 assert(page.includes('style.css?v=4'));assert(page.includes('boot.js?v=4'));
 assert(page.includes('id="mainProgress" class="wp-standard-main-progress" data-wp-frame-progress'));
});
test('preview gate cannot enable gameplay through missing or misleading query values',()=>{
 for(const search of ['', '?preview=0','?preview=true','?trial=1','?preview=1']){
  let destination=null;vm.runInNewContext(read('games/pawflow/preview-gate.js'),{URLSearchParams,location:{search,pathname:'/zh-tw/games/pawflow/',replace:value=>destination=value}});
  assert.equal(destination,search==='?preview=1'?null:'/zh-tw/');
 }
});
test('both active screen headers satisfy the shared frame mounting contract',()=>{
 const screens=read('games/pawflow/screens.mjs');
 for(const id of ['stageHeader','battleHeader'])assert.match(screens,new RegExp(`id="${id}"[^]*?<h2 data-wp-frame-title hidden></h2></header>`));
 assert(!read('games/pawflow/game.js').includes('WonderSound'));
});
