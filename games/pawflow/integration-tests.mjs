import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {PAGES,normalizePawflowPublicPage} from './page-sources.mjs';
import {COPY,ROUTES} from './locales.mjs';
const root=new URL('../../',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),'utf8');
test('owner-approved public catalog exposes the playable game and truthful preview',()=>{
 const ctx={window:{}};vm.runInNewContext(read('src/lobby-data.js'),ctx);
 const games=ctx.window.WONDER_LOBBY.games.filter(g=>g.id==='pawflow');
 assert.equal(games.length,1);assert.equal(games[0].status,'playable');
 assert.equal(games[0].internalTrial,undefined);assert.equal(games[0].internalOnly,undefined);
 assert.equal(games[0].previewVideo,'assets/previews/pawflow-battle.webm');
 assert(fs.statSync(new URL(games[0].previewVideo,root)).size<=1000000);
 assert(ctx.window.WONDER_LOBBY.audiences.generalGameIds.includes('pawflow'));
 vm.runInNewContext(read('src/game-title-registry.js'),ctx);
 for(const locale of Object.keys(ROUTES))assert.equal(ctx.window.WEIGHTPLAY_GAME_TITLES.pawflow[locale],COPY[locale].title);
});
for(const [locale,segment]of Object.entries(ROUTES))test(`${locale}: generated public page preserves native guide and entry contracts`,()=>{
 const page=read(`${segment}/games/pawflow/index.html`);
 assert(page.includes(`lang="${locale}"`));
 // The shared generator owns cache tags and related-card markup; the game
 // retains every authored heading, paragraph and FAQ answer through that pass.
 const guide=PAGES[locale].slice(PAGES[locale].indexOf('<section id="gameGuide"'),PAGES[locale].indexOf('<section class="game-info-section game-info-related-section"'));
 for(const match of guide.matchAll(/<(?:h2|h3|p)\b[^>]*>([^]*?)<\/(?:h2|h3|p)>/g))assert(page.includes(match[1]),`Missing authored guide content: ${locale}`);
 assert.equal(normalizePawflowPublicPage(page,locale),page);
 assert.equal((page.match(/<base href="\/games\/pawflow\/">/g)||[]).length,1);
 assert.equal((page.match(/<dl><dt><h3>/g)||[]).length,4);
 if(locale==='ja')assert(page.includes('src="/src/i18n-ja.js?v=20260719-ja1"'));
 assert(page.includes('content="index,follow"'));assert(page.includes('/games/pawflow/preview-gate.js'));
 assert(page.indexOf('/src/weightplay-audio.js')<page.indexOf('/src/site-config.js'));
 assert(!page.includes('/src/sound.js'));assert(page.includes(COPY[locale].title));
  assert(page.includes('game-info-related-card'));assert(page.includes('data-wp-guide-related-interface="9"'));assert(page.includes('weightplay-game-version" content="v17"'));
  assert(page.includes('weightplay-interface-version" content="9"'));assert(page.includes('style.css?v=20261021-pawflow-i9'));assert(page.includes('boot.js?v=20261021-pawflow-i9'));
  assert(page.includes('/src/game-play-ui.css?v=20261019-shared-play-motion-reduce1'));
 assert(page.includes('id="mainProgress" class="wp-standard-main-progress" data-wp-frame-progress'));
});
test('public compatibility entry permits direct and legacy preview links',()=>{
 assert(!read('games/pawflow/boot.js').includes("get('preview')"));
 assert(!read('games/pawflow/game.js').includes('location.assign(`/${ROUTES[locale]}/?preview=1`)'));
 for(const search of ['', '?preview=0','?preview=true','?trial=1','?preview=1']){
  let destination=null;vm.runInNewContext(read('games/pawflow/preview-gate.js'),{URLSearchParams,location:{search,pathname:'/zh-tw/games/pawflow/',replace:value=>destination=value}});
  assert.equal(destination,null);
 }
});
test('both active screen headers satisfy the shared frame mounting contract',()=>{
 const screens=read('games/pawflow/screens.mjs');
 for(const id of ['stageHeader','battleHeader'])assert.match(screens,new RegExp(`id="${id}"[^]*?<h2 data-wp-frame-title hidden></h2></header>`));
 assert(!read('games/pawflow/game.js').includes('WonderSound'));
 assert(read('games/pawflow/boot.js').includes("game.js?v=20261021-pawflow-i9"));
 assert(read('games/pawflow/game.js').includes('WeightPlayPlayUI.mountStage'));
 assert(read('games/pawflow/game.js').includes('snapshot:()=>({version:17'));
});
test('local practice is an authenticated, no-save/no-analytics Pawflow adapter',()=>{
 const game=read('games/pawflow/game.js');
 assert(game.includes("import {LocalPractice} from '../../src/game-local-practice.mjs'"));
 assert(game.includes('stageIds:Array.from({length:STAGE_COUNT}'));
 assert(game.includes("LocalPractice.challenge('pawflow',index)"));
 assert(game.includes("startStage:id=>startBattle(getLevel(Number(id)),true,true)"));
 assert(game.includes('if(practicePreviewRequested||practiceMode||practiceRun)return'));
 assert(game.includes('if(state&&level&&!practiceRun)store.checkpoint(state,level)'));
 assert(game.includes('if(!practiceRun){if(won)store.settle(state,level);else store.clearAttempt();}'));
 assert(game.includes('practice:practiceMode||practiceRun'));
});
