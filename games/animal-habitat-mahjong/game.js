(() => {
  const LOGICAL_W = 390, LOGICAL_H = 788, saveKey = "weightplay_habitat_mahjong_v1";
  const canonicalLocaleKey = "weightPlayLocale", legacyLocaleKey = "weightplayLocale";
  const canonicalSavedLocale = localStorage.getItem(canonicalLocaleKey), legacySavedLocale = localStorage.getItem(legacyLocaleKey);
  if (!canonicalSavedLocale && ["en", "zh-Hant", "zh-Hans"].includes(legacySavedLocale)) window.WonderI18n?.setLocale?.(legacySavedLocale);
  const $ = (id) => document.getElementById(id);
  const nodes = Object.fromEntries(["mainScreen","stageScreen","battleScreen","battleLive","resultScreen","loadingScreen","localeSelect","startBtn","stageRail","stageStatus","stagePreview","stageName","stageDescription","stageProgress","board","movesValue","pairsValue","battleStageName","objectiveText","feedback","hintBtn","undoBtn","shuffleBtn","retryBtn","nextBtn","stagesBtn","resultTitle","resultStats","resultBest","resultReport","progressSummary","stageSlot","battleSlot"].map((id) => [id, $(id)]));
  const copy = {
    en: { language:"Language", internalPreview:"Internal preview", title:"Animal Habitat Mahjong", mainHint:"Match two free tiles to open every animal habitat.", startGame:"Start Game", howTitle:"How to play", guide:"A tile is free when nothing covers it and at least one side is open. Match two identical free tiles to clear the board.", parentNote:"A calm local puzzle for focus, logic, and problem solving. Progress stays on this device.", progress:"Unlocked {count}/3 habitats · Best {best} pairs", stageTitle:"Choose a habitat", railHint:"Drag to browse habitats. Tap an unlocked card to begin.", locked:"Locked", moves:"Moves", pairs:"Pairs", objective:"Clear every free pair", hint:"Hint", undo:"Undo", shuffle:"Shuffle", choosePair:"Choose two matching free tiles.", blocked:"That tile is covered or blocked on both sides.", noMatch:"Find a matching free tile.", matched:"Great match!", noUndo:"Nothing to undo yet.", hintText:"A free matching pair is glowing.", noMoves:"No free pair. Use Shuffle to refresh the board.", habitatCleared:"Habitat cleared", skillReport:"Skill Report", result:"You cleared {pairs} pairs in {moves} moves. Great planning and focus.", retry:"Retry", nextStage:"Next Stage", stages:"Stages", tile:"Tile {number}", back:"Back", backToLobby:"Back to lobby", stageScreen:"Stage selection", stageRail:"Habitat stages", battleScreen:"Mahjong play", resultScreen:"Result", forest:"Forest Canopy", safari:"Safari Trail", ocean:"Coral Shelf", forestDesc:"Open leafy paths and learn the free-tile rule.", safariDesc:"Plan around a raised center and wide open sides.", oceanDesc:"Use every match to uncover the calm coral shelf." },
    "zh-Hant": { language:"\u8a9e\u8a00", internalPreview:"\u5167\u90e8\u9810\u89bd", title:"\u52d5\u7269\u68f2\u5730\u9ebb\u5c07", mainHint:"\u914d\u5c0d\u5169\u5f35\u53ef\u7528\u724c\uff0c\u958b\u555f\u6bcf\u500b\u52d5\u7269\u68f2\u5730\u3002", startGame:"\u958b\u59cb\u904a\u6232", howTitle:"\u73a9\u6cd5", guide:"\u724c\u9762\u4e0a\u6c92\u6709\u88ab\u8986\u84cb\uff0c\u4e14\u5de6\u53f3\u81f3\u5c11\u4e00\u908a\u958b\u653e\u6642\uff0c\u5c31\u662f\u53ef\u7528\u724c\u3002\u914d\u5c0d\u5169\u5f35\u76f8\u540c\u53ef\u7528\u724c\u4f86\u6e05\u7a7a\u724c\u5c40\u3002", parentNote:"\u9019\u662f\u7df4\u7fd2\u5c08\u6ce8\u3001\u908f\u8f2f\u8207\u89e3\u6c7a\u554f\u984c\u7684\u5be7\u975c\u672c\u6a5f\u904a\u6232\u3002\u9032\u5ea6\u53ea\u5132\u5b58\u65bc\u6b64\u88dd\u7f6e\u3002", progress:"\u5df2\u89e3\u9396 {count}/3 \u500b\u68f2\u5730 \u00b7 \u6700\u4f73 {best} \u5c0d", stageTitle:"\u9078\u64c7\u68f2\u5730", railHint:"\u5de6\u53f3\u62d6\u66f3\u700f\u89bd\u68f2\u5730\uff0c\u9ede\u64ca\u5df2\u89e3\u9396\u5361\u724c\u958b\u59cb\u3002", locked:"\u672a\u89e3\u9396", moves:"\u6b65\u6578", pairs:"\u914d\u5c0d", objective:"\u6e05\u9664\u6240\u6709\u53ef\u7528\u724c", hint:"\u63d0\u793a", undo:"\u5fa9\u539f", shuffle:"\u6d17\u724c", choosePair:"\u9078\u64c7\u5169\u5f35\u76f8\u540c\u7684\u53ef\u7528\u724c\u3002", blocked:"\u9019\u5f35\u724c\u88ab\u8986\u84cb\u6216\u88ab\u5169\u5074\u5361\u4f4f\u3002", noMatch:"\u8acb\u627e\u4e00\u5f35\u76f8\u540c\u7684\u53ef\u7528\u724c\u3002", matched:"\u914d\u5c0d\u6210\u529f\uff01", noUndo:"\u9084\u6c92\u6709\u53ef\u5fa9\u539f\u7684\u914d\u5c0d\u3002", hintText:"\u4e00\u5c0d\u53ef\u7528\u724c\u6b63\u5728\u767c\u4eae\u3002", noMoves:"\u6c92\u6709\u53ef\u914d\u5c0d\u724c\uff0c\u4f7f\u7528\u6d17\u724c\u91cd\u65b0\u6574\u7406\u3002", habitatCleared:"\u68f2\u5730\u5df2\u6e05\u7a7a", skillReport:"\u80fd\u529b\u5831\u544a", result:"\u4f60\u7528 {moves} \u6b65\u6e05\u9664 {pairs} \u5c0d\u724c\uff0c\u5f88\u597d\u5730\u7df4\u7fd2\u4e86\u898f\u5283\u8207\u5c08\u6ce8\u3002", retry:"\u518d\u8a66\u4e00\u6b21", nextStage:"\u4e0b\u4e00\u95dc", stages:"\u95dc\u5361", tile:"\u724c {number}", back:"\u8fd4\u56de", backToLobby:"\u8fd4\u56de\u5927\u5ef3", stageScreen:"\u95dc\u5361\u9078\u64c7", stageRail:"\u68f2\u5730\u95dc\u5361", battleScreen:"\u9ebb\u5c07\u904a\u73a9", resultScreen:"\u7d50\u679c", forest:"\u68ee\u6797\u6a39\u51a0", safari:"\u8349\u539f\u8db3\u8de1", ocean:"\u73ca\u745a\u68da", forestDesc:"\u958b\u555f\u6a39\u8449\u8def\u5f91\uff0c\u5b78\u7fd2\u53ef\u7528\u724c\u898f\u5247\u3002", safariDesc:"\u570d\u7e5e\u62ac\u9ad8\u7684\u4e2d\u5fc3\u724c\u89c0\u5bdf\u5bec\u655e\u958b\u53e3\u3002", oceanDesc:"\u7528\u6bcf\u4e00\u6b21\u914d\u5c0d\u6253\u958b\u5be7\u975c\u73ca\u745a\u68da\u3002" },
    es: { language:"Idioma", internalPreview:"Vista previa interna", title:"Mahjong de Hábitats Animales", mainHint:"Empareja dos fichas libres para abrir cada hábitat animal.", startGame:"Empezar", howTitle:"Cómo jugar", guide:"Una ficha está libre cuando no tiene otra encima y al menos uno de sus lados está abierto. Empareja dos fichas libres idénticas para vaciar el tablero.", parentNote:"Un rompecabezas local y tranquilo para practicar atención, lógica y resolución de problemas. El progreso se guarda en este dispositivo.", progress:"Hábitats desbloqueados: {count}/3 · Mejor marca: {best} parejas", stageTitle:"Elige un hábitat", railHint:"Arrastra para explorar los hábitats. Toca una tarjeta desbloqueada para empezar.", locked:"Bloqueado", moves:"Movimientos", pairs:"Parejas", objective:"Retira todas las parejas libres", hint:"Pista", undo:"Deshacer", shuffle:"Mezclar", choosePair:"Elige dos fichas libres iguales.", blocked:"Esta ficha está cubierta o bloqueada por ambos lados.", noMatch:"Busca otra ficha libre igual.", matched:"¡Buena pareja!", noUndo:"Todavía no hay nada que deshacer.", hintText:"Una pareja libre está brillando.", noMoves:"No hay parejas libres. Usa Mezclar para renovar el tablero.", habitatCleared:"Hábitat completado", skillReport:"Informe de habilidades", result:"Retiraste {pairs} parejas en {moves} movimientos. ¡Muy buena planificación y atención!", retry:"Reintentar", nextStage:"Siguiente nivel", stages:"Niveles", tile:"Ficha {number}", back:"Volver", backToLobby:"Volver a la sala", stageScreen:"Selección de nivel", stageRail:"Niveles de hábitat", battleScreen:"Partida de mahjong", resultScreen:"Resultado", forest:"Dosel del bosque", safari:"Sendero de sabana", ocean:"Arrecife de coral", forestDesc:"Abre caminos entre las hojas y aprende la regla de las fichas libres.", safariDesc:"Planifica alrededor del centro elevado y de los lados abiertos.", oceanDesc:"Cada pareja revela un poco más del tranquilo arrecife." }
  };
  Object.assign(copy.en, { boardName:"{habitat} Board {number}", arctic:"Arctic Glow", arcticDesc:"Use the top layers to reveal a clear snowy route." });
  Object.assign(copy["zh-Hant"], { boardName:"{habitat} \u7b2c {number} \u95dc", arctic:"\u6975\u5730\u6975\u5149", arcticDesc:"\u5148\u6253\u958b\u4e0a\u5c64\u724c\uff0c\u627e\u51fa\u6e05\u6670\u7684\u96ea\u5730\u8def\u7dda\u3002" });
  Object.assign(copy.es, { boardName:"{habitat}: tablero {number}", arctic:"Brillo ártico", arcticDesc:"Abre primero las capas superiores para revelar una ruta clara por la nieve." });
  Object.assign(copy.en, { gameType:"Mahjong solitaire puzzle" });
  Object.assign(copy["zh-Hant"], { gameType:"\u9ebb\u5c07\u724c\u914d\u5c0d\u89e3\u8b0e" });
  Object.assign(copy.es, { gameType:"Rompecabezas de mahjong solitario" });
  Object.assign(copy.en, { lockedFeedback:"{stage} is still locked. Clear the previous board first." });
  Object.assign(copy["zh-Hant"], { lockedFeedback:"{stage} \u5c1a\u672a\u89e3\u9396\uff0c\u8acb\u5148\u5b8c\u6210\u524d\u4e00\u95dc\u3002" });
  Object.assign(copy.es, { lockedFeedback:"{stage} sigue bloqueado. Completa primero el tablero anterior." });
  Object.assign(copy.en, { loading:"Preparing habitats...", progress:"Unlocked {count}/{total} boards \u00b7 Cleared {cleared}/{total}", resultStats:"{score} pts \u00b7 {moves} moves \u00b7 {time}", personalBest:"Best: {score} pts \u00b7 {moves} moves \u00b7 {time}", newBest:"New best: {score} pts \u00b7 {moves} moves \u00b7 {time}" });
  Object.assign(copy["zh-Hant"], { loading:"\u6b63\u5728\u6e96\u5099\u68f2\u5730...", progress:"\u5df2\u89e3\u9396 {count}/{total} \u95dc \u00b7 \u5df2\u5b8c\u6210 {cleared}/{total}", resultStats:"{score} \u5206 \u00b7 {moves} \u6b65 \u00b7 {time}", personalBest:"\u6700\u4f73\uff1a{score} \u5206 \u00b7 {moves} \u6b65 \u00b7 {time}", newBest:"\u65b0\u7d00\u9304\uff1a{score} \u5206 \u00b7 {moves} \u6b65 \u00b7 {time}" });
  Object.assign(copy.es, { loading:"Preparando hábitats...", progress:"Desbloqueados {count}/{total} · Completados {cleared}/{total}", resultStats:"{score} pts · {moves} movimientos · {time}", personalBest:"Mejor: {score} pts · {moves} movimientos · {time}", newBest:"Nuevo récord: {score} pts · {moves} movimientos · {time}" });
  Object.assign(copy.en, {
    habitatFinale:"Habitat Finale", classicRule:"Open Path: use the standard free-tile rule.", sealRule:"Trail Seal: clear the diamond key pair to open sealed tiles.", rescueRule:"Family Rescue: uncover and match the two starred animal families.", narrowRule:"Patrol Trail: available pairs alternate between trail A and trail B.", dualRule:"Ranger Trial: open the seal and rescue both starred families.", grandRule:"Grand Reserve: seals, rescues, and alternating patrol trails work together.", objectiveClassic:"Clear every free pair", objectiveSeal:"Clear the diamond key to open sealed tiles", objectiveRescue:"Rescue starred families {rescued}/{total}", objectiveNarrow:"Follow patrol trail {trail}", objectiveDual:"Open the seal and rescue {rescued}/{total} families", objectiveGrand:"Master seals, rescues, and patrol trail {trail}", sealBlocked:"This tile is sealed. Clear the diamond key pair first."
  });
  Object.assign(copy["zh-Hant"], {
    habitatFinale:"\u68f2\u5730\u7d42\u5c40", classicRule:"\u958b\u653e\u8def\u5f91\uff1a\u4f7f\u7528\u6a19\u6e96\u53ef\u7528\u724c\u898f\u5247\u3002", sealRule:"\u8def\u5f91\u5c01\u5370\uff1a\u5148\u6e05\u9664\u83f1\u5f62\u9470\u5319\u724c\uff0c\u624d\u80fd\u6253\u958b\u5c01\u5370\u724c\u3002", rescueRule:"\u5bb6\u65cf\u6551\u63f4\uff1a\u627e\u51fa\u4e26\u914d\u5c0d\u5169\u7d44\u661f\u865f\u52d5\u7269\u5bb6\u65cf\u3002", narrowRule:"\u5de1\u5b88\u5c0f\u5f91\uff1a\u53ef\u914d\u5c0d\u724c\u6703\u5728 A \u8207 B \u8def\u5f91\u4e4b\u9593\u4ea4\u66ff\u3002", dualRule:"\u5de1\u5b88\u8a66\u7149\uff1a\u89e3\u958b\u5c01\u5370\uff0c\u4e26\u6551\u51fa\u5169\u7d44\u661f\u865f\u5bb6\u65cf\u3002", grandRule:"\u5927\u68f2\u5730\uff1a\u540c\u6642\u5224\u65b7\u5c01\u5370\u3001\u6551\u63f4\u8207\u4ea4\u66ff\u5de1\u5b88\u8def\u5f91\u3002", objectiveClassic:"\u6e05\u9664\u6240\u6709\u53ef\u7528\u724c", objectiveSeal:"\u6e05\u9664\u83f1\u5f62\u9470\u5319\uff0c\u6253\u958b\u5c01\u5370\u724c", objectiveRescue:"\u6551\u63f4\u661f\u865f\u5bb6\u65cf {rescued}/{total}", objectiveNarrow:"\u8ddf\u96a8 {trail} \u5de1\u5b88\u8def\u5f91", objectiveDual:"\u89e3\u958b\u5c01\u5370\u4e26\u6551\u63f4 {rescued}/{total} \u7d44\u5bb6\u65cf", objectiveGrand:"\u638c\u63e1\u5c01\u5370\u3001\u6551\u63f4\u8207 {trail} \u5de1\u5b88\u8def\u5f91", sealBlocked:"\u9019\u5f35\u724c\u5c1a\u5728\u5c01\u5370\u4e2d\uff0c\u8acb\u5148\u6e05\u9664\u83f1\u5f62\u9470\u5319\u724c\u3002"
  });
  Object.assign(copy.es, {
    habitatFinale:"Final del hábitat", classicRule:"Camino abierto: usa la regla normal de fichas libres.", sealRule:"Sello del sendero: retira la pareja de llaves con rombo para abrir las fichas selladas.", rescueRule:"Rescate familiar: descubre y empareja las dos familias de animales con estrella.", narrowRule:"Ruta de patrulla: las parejas disponibles alternan entre el sendero A y el B.", dualRule:"Prueba del guardabosques: abre el sello y rescata las dos familias con estrella.", grandRule:"Gran reserva: combina sellos, rescates y rutas de patrulla alternas.", objectiveClassic:"Retira todas las parejas libres", objectiveSeal:"Retira la llave con rombo para abrir las fichas selladas", objectiveRescue:"Rescata familias con estrella {rescued}/{total}", objectiveNarrow:"Sigue la ruta de patrulla {trail}", objectiveDual:"Abre el sello y rescata {rescued}/{total} familias", objectiveGrand:"Domina los sellos, los rescates y la ruta {trail}", sealBlocked:"Esta ficha está sellada. Retira primero la pareja de llaves con rombo."
  });
  const layouts = {
    grid: [[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]],
    diamond: [[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]],[[1,4,0],[2,4,0]]],
    terrace: [[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[1,3,0],[2,3,0]],[[0,4,0],[3,4,0]],[[1,4,0],[2,4,0]]],
    stack: [[[1,1,1],[2,1,1]],[[1,2,1],[2,2,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]],
    crown: [[[1,0,1],[2,0,1]],[[1,1,1],[2,1,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]],[[1,4,0],[2,4,0]]],
    bridge: [[[1,2,1],[2,2,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]],
    wings: [[[1,1,1],[2,1,1]],[[1,3,1],[2,3,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]],
    pyramid: [[[1,0,1],[2,0,1]],[[1,1,1],[2,1,1]],[[1,2,1],[2,2,1]],[[1,3,1],[2,3,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]],
    towers: [[[0,1,1],[3,1,1]],[[0,3,1],[3,3,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]],
    sanctuary: [[[1,2,2],[2,2,2]],[[1,0,1],[2,0,1]],[[1,1,1],[2,1,1]],[[1,2,1],[2,2,1]],[[0,0,0],[3,0,0]],[[1,0,0],[2,0,0]],[[0,1,0],[3,1,0]],[[1,1,0],[2,1,0]],[[0,2,0],[3,2,0]],[[1,2,0],[2,2,0]],[[0,3,0],[3,3,0]],[[1,3,0],[2,3,0]]]
  };
  const habitatData = (bg, template, rule, options = {}) => ({ id:bg, bg, title:bg, desc:`${bg}Desc`, template, rule, checkpoint:false, noMove:false, ...options });
  const habitats = [
    habitatData("forest","grid","classic"), habitatData("forest","diamond","classic"), habitatData("forest","terrace","classic"), habitatData("forest","bridge","classic"), habitatData("forest","stack","classic",{ checkpoint:true }),
    habitatData("safari","diamond","seal",{ sealedPairs:[2,4] }), habitatData("safari","bridge","seal",{ sealedPairs:[3,6] }), habitatData("safari","wings","seal",{ sealedPairs:[4,7] }), habitatData("safari","stack","seal",{ sealedPairs:[6,8] }), habitatData("safari","crown","seal",{ sealedPairs:[7,9], checkpoint:true }),
    habitatData("ocean","grid","rescue",{ rescuePairs:[4,7] }), habitatData("ocean","terrace","rescue",{ rescuePairs:[5,7] }), habitatData("ocean","bridge","rescue",{ rescuePairs:[6,8] }), habitatData("ocean","wings","rescue",{ rescuePairs:[7,9] }), habitatData("ocean","grid","rescue",{ rescuePairs:[6,7], noMove:true, checkpoint:true }),
    habitatData("arctic","diamond","narrow"), habitatData("arctic","terrace","narrow"), habitatData("arctic","stack","narrow"), habitatData("arctic","pyramid","narrow"), habitatData("arctic","sanctuary","narrow",{ checkpoint:true }),
    habitatData("forest","bridge","dual",{ sealedPairs:[4,7], rescuePairs:[6,8] }), habitatData("safari","wings","dual",{ sealedPairs:[5,8], rescuePairs:[6,9] }), habitatData("ocean","crown","dual",{ sealedPairs:[6,9], rescuePairs:[8,10] }), habitatData("arctic","pyramid","dual",{ sealedPairs:[7,10], rescuePairs:[9,11] }), habitatData("forest","sanctuary","dual",{ sealedPairs:[7,10], rescuePairs:[9,11], checkpoint:true }),
    habitatData("safari","towers","grand",{ sealedPairs:[4,7], rescuePairs:[6,9] }), habitatData("ocean","pyramid","grand",{ sealedPairs:[7,10], rescuePairs:[9,11] }), habitatData("arctic","sanctuary","grand",{ sealedPairs:[7,10], rescuePairs:[9,11] }), habitatData("forest","pyramid","grand",{ sealedPairs:[6,9], rescuePairs:[10,11] }), habitatData("ocean","sanctuary","grand",{ sealedPairs:[7,10], rescuePairs:[9,11], checkpoint:true })
  ];
  let locale = window.WonderI18n?.locale?.() || localStorage.getItem("weightPlayLocale") || "en", save = loadSave(), stageIndex = 0, selected = null, state = null;
  const t = (key, values = {}) => Object.entries(values).reduce((out, [name, value]) => out.replaceAll(`{${name}}`, value), (copy[locale] || copy.en)[key] || copy.en[key] || key);
  function loadSave() { try { return { unlocked:1, bestPairs:0, playCount:0, bestByStage:{}, ...JSON.parse(localStorage.getItem(saveKey) || "{}") }; } catch { return { unlocked:1, bestPairs:0, playCount:0, bestByStage:{} }; } }
  const persist = () => localStorage.setItem(saveKey, JSON.stringify(save));
  function applyLocale() { document.documentElement.lang = locale; document.title = `${t("title")} - WeightPlay`; document.querySelectorAll("[data-ui]").forEach((el) => { el.textContent = t(el.dataset.ui); }); document.querySelectorAll("[data-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.aria)); }); nodes.localeSelect.value = locale; renderMain(); renderStage(); if (state) renderBattle(); window.dispatchEvent(new CustomEvent("wonder:locale-change", { detail:{ locale } })); }
  function setScreen(name) { const result = name === "result"; nodes.mainScreen.classList.toggle("hidden", name !== "main"); nodes.stageScreen.classList.toggle("hidden", name !== "stage"); nodes.battleScreen.classList.toggle("hidden", name !== "battle" && !result); nodes.resultScreen.classList.toggle("hidden", !result); nodes.battleLive.classList.toggle("hidden", result); nodes.battleLive.inert = result; if (result) nodes.battleLive.setAttribute("aria-hidden", "true"); else nodes.battleLive.removeAttribute("aria-hidden"); document.body.classList.toggle("playing", name !== "main"); document.body.classList.toggle("habitat-result", result); if (name !== "main") fitCanvases(); }
  function fitCanvases() { const viewportWidth = Math.max(1, visualViewport?.width || innerWidth); const viewportHeight = Math.max(1, visualViewport?.height || innerHeight); const scale = Math.min(viewportWidth / LOGICAL_W, viewportHeight / LOGICAL_H); const logicalWidth = viewportWidth / scale; const logicalHeight = viewportHeight / scale; document.documentElement.style.setProperty("--scale", scale); document.documentElement.style.setProperty("--slot-w", `${viewportWidth}px`); document.documentElement.style.setProperty("--slot-h", `${viewportHeight}px`); document.documentElement.style.setProperty("--logical-w", `${logicalWidth}px`); document.documentElement.style.setProperty("--logical-h", `${logicalHeight}px`); }
  const stageLabel = (habitat, index = stageIndex) => t("boardName", { habitat:t(habitat.title), number:index + 1 });
  const ruleKey = (habitat) => `${habitat.rule || "classic"}Rule`;
  const stageDescriptionText = (habitat) => `${t(habitat.desc)} ${t(ruleKey(habitat))}`;
  function renderMain() { nodes.progressSummary.textContent = t("progress", { count:Math.min(habitats.length, save.unlocked), cleared:Object.keys(save.bestByStage || {}).length, total:habitats.length }); }
  function syncStageSelection(index) { if (!Number.isInteger(index) || index < 0 || index >= habitats.length) return; stageIndex = index; nodes.stageRail.dataset.wpSnapTarget = String(index * 276); const habitat = habitats[index]; nodes.stagePreview.src = `../../assets/animal-habitat-mahjong-album-${habitat.id}.webp`; nodes.stageName.textContent = stageLabel(habitat); nodes.stageDescription.textContent = stageDescriptionText(habitat); nodes.stageRail.querySelectorAll(".stage-card").forEach((card) => card.classList.toggle("selected", Number(card.dataset.index) === index)); }
  function rejectLockedStage(index) { const card = nodes.stageRail.querySelector(`.stage-card[data-index="${index}"]`); syncStageSelection(index); nodes.stageStatus.textContent = t("lockedFeedback", { stage:stageLabel(habitats[index], index) }); requestAnimationFrame(() => card?.focus({ preventScroll:true })); }
  function renderStage() { nodes.stageProgress.textContent = `${Math.min(save.unlocked, habitats.length)}/${habitats.length}`; nodes.stageStatus.textContent = ""; nodes.stageRail.replaceChildren(...habitats.map((item, index) => { const button = document.createElement("button"); const unlocked = index < save.unlocked; button.className = `stage-card${index === stageIndex ? " selected" : ""}${unlocked ? "" : " locked"}${item.checkpoint ? " checkpoint" : ""}`; button.dataset.index = index; button.dataset.stage = index + 1; button.setAttribute("aria-disabled", String(!unlocked)); button.setAttribute("aria-label", unlocked ? stageLabel(item, index) : `${stageLabel(item, index)}. ${t("locked")}`); button.innerHTML = `<b>${stageLabel(item, index)}</b><span>${stageDescriptionText(item)}</span><small>${item.checkpoint ? t("habitatFinale") : unlocked ? t("startGame") : t("locked")}</small>`; return button; })); syncStageSelection(stageIndex); requestAnimationFrame(() => { nodes.stageRail.scrollLeft = stageIndex * 276; }); }
  const usesSeal = (habitat) => ["seal","dual","grand"].includes(habitat.rule);
  const usesRescue = (habitat) => ["rescue","dual","grand"].includes(habitat.rule);
  const usesNarrow = (habitat) => ["narrow","grand"].includes(habitat.rule);
  function makeTiles(habitat, index = stageIndex) {
    let id = 0;
    const pairCount=layouts[habitat.template].length;
    const rescueValues=new Set(habitat.noMove
      ? (habitat.rescuePairs || []).map((_, rescueIndex, source) => (index * 5 + pairCount - source.length + rescueIndex) % 24)
      : (habitat.rescuePairs || []).map((pairIndex) => (index * 5 + pairIndex) % 24));
    return layouts[habitat.template].flatMap((pair, pairIndex) => pair.map(([x,y,layer], memberIndex) => {
      const value=habitat.noMove ? (index * 5 + y * 2 + (x >= 2 ? 1 : 0)) % 24 : (index * 5 + pairIndex) % 24;
      return { id:id++, pairIndex, value, x, y, layer, sealed:usesSeal(habitat) && (habitat.sealedPairs || []).includes(pairIndex), rescue:usesRescue(habitat) && rescueValues.has(value), key:usesSeal(habitat) && pairIndex === 0, removed:false };
    }));
  }
  function startStage(index = stageIndex) { stageIndex = index; const habitat = habitats[index], tiles = makeTiles(habitat, index); state = { tiles, totalPairs:tiles.length / 2, moves:0, removedPairs:0, history:[], hinted:[], selected:null, keyUnlocked:!usesSeal(habitat), rescuedPairs:0, rescueTotal:(habitat.rescuePairs || []).length, trailPhase:0, initialTrailPhase:0, startedAt:Date.now(), pausedAt:document.hidden ? Date.now() : null }; syncTrailPhase(); state.initialTrailPhase=state.trailPhase; save.playCount += 1; persist(); setScreen("battle"); const firstFree=state.tiles.find(isFree)?.id; renderBattle(availablePairs().length ? "" : t("noMoves"), firstFree); }
  function suspendBattleClock() { if (!state || nodes.battleScreen.classList.contains("hidden") || !nodes.resultScreen.classList.contains("hidden") || state.pausedAt !== null) return; state.pausedAt = Date.now(); }
  function resumeBattleClock() { if (!state || state.pausedAt === null) return; state.startedAt += Math.max(0, Date.now() - state.pausedAt); state.pausedAt = null; }
  function isPhysicallyFree(tile) { if (tile.removed || (tile.sealed && !state.keyUnlocked)) return false; const active = state.tiles.filter((item) => !item.removed); const covered = active.some((item) => item.layer > tile.layer && item.x === tile.x && item.y === tile.y); const left = active.some((item) => item.layer === tile.layer && item.y === tile.y && item.x === tile.x - 1); const right = active.some((item) => item.layer === tile.layer && item.y === tile.y && item.x === tile.x + 1); return !covered && (!left || !right); }
  function physicalPairs(phase = null) { const free=state.tiles.filter((tile) => isPhysicallyFree(tile) && (phase === null || tile.pairIndex % 2 === phase)); const groups=new Map(); free.forEach((tile)=>groups.set(tile.value,[...(groups.get(tile.value)||[]),tile])); return [...groups.values()].filter((items)=>items.length>1); }
  function syncTrailPhase(preferAlternate = false) { if (!state || !usesNarrow(habitats[stageIndex])) return; const desired=preferAlternate ? 1-state.trailPhase : state.trailPhase; if (physicalPairs(desired).length) state.trailPhase=desired; else if (physicalPairs(1-desired).length) state.trailPhase=1-desired; }
  function isFree(tile) { return isPhysicallyFree(tile) && (!usesNarrow(habitats[stageIndex]) || tile.pairIndex % 2 === state.trailPhase); }
  function availablePairs() { const free = state.tiles.filter(isFree); const groups = new Map(); free.forEach((tile) => groups.set(tile.value, [...(groups.get(tile.value) || []), tile])); return [...groups.values()].filter((items) => items.length > 1); }
  function objectiveText(habitat = habitats[stageIndex]) { const key = `objective${habitat.rule[0].toUpperCase()}${habitat.rule.slice(1)}`; return t(key, { rescued:state.rescuedPairs, total:state.rescueTotal, trail:state.trailPhase ? "B" : "A" }); }
  function renderBattle(message = "", focusId = null) {
    const habitat = habitats[stageIndex];
    const patrolActive = usesNarrow(habitat);
    nodes.battleStageName.textContent = stageLabel(habitat);
    nodes.objectiveText.textContent = objectiveText(habitat);
    nodes.movesValue.textContent = state.moves;
    nodes.pairsValue.textContent = `${state.removedPairs}/${state.totalPairs}`;
    nodes.feedback.textContent = message || t("choosePair");
    nodes.shuffleBtn.disabled = availablePairs().length > 0;
    nodes.board.style.backgroundImage = `linear-gradient(#06223799,#06223799),url(../../assets/animal-habitat-mahjong-bg-${habitat.bg}.webp)`;
    nodes.board.replaceChildren(...state.tiles.filter((tile) => !tile.removed).map((tile) => {
      const free = isFree(tile);
      const trail = tile.pairIndex % 2;
      const button = document.createElement("button");
      button.className = `tile${free ? " free" : " blocked"}${tile.sealed && !state.keyUnlocked ? " sealed" : ""}${tile.rescue ? " rescue" : ""}${tile.key ? " key" : ""}${patrolActive ? ` trail-${trail ? "b" : "a"}${trail === state.trailPhase ? " trail-active" : " trail-waiting"}` : ""}${state.selected?.id === tile.id ? " selected" : ""}${state.hinted.includes(tile.id) ? " hinted" : ""}`;
      button.style.left = `${14 + tile.x * 82 + tile.layer * 7}px`;
      button.style.top = `${52 + tile.y * 84 - tile.layer * 7}px`;
      button.style.zIndex = String(2 + tile.layer);
      button.dataset.tile = tile.id;
      button.dataset.trail = patrolActive ? (trail ? "B" : "A") : "";
      button.tabIndex = free ? 0 : -1;
      button.setAttribute("aria-label", `${t("tile", { number: tile.value + 1 })}${patrolActive ? `, trail ${trail ? "B" : "A"}` : ""}${tile.key ? ", key" : ""}${tile.rescue ? ", rescue" : ""}`);
      const img = document.createElement("img");
      img.src = `../../assets/animal-habitat-mahjong-tile-${String(tile.value).padStart(2,"0")}.webp`;
      img.alt = "";
      button.append(img);
      if (patrolActive) {
        const trailBadge = document.createElement("span");
        trailBadge.className = "trail-badge";
        trailBadge.textContent = trail ? "B" : "A";
        button.append(trailBadge);
      }
      if (tile.key || tile.rescue || (tile.sealed && !state.keyUnlocked)) {
        const badge = document.createElement("span");
        badge.className = "tile-badge";
        badge.textContent = tile.key ? "◆" : tile.rescue ? "★" : "×";
        button.append(badge);
      }
      return button;
    }));
    if (focusId !== null) requestAnimationFrame(() => {
      const target = nodes.board.querySelector(`.tile.free[data-tile="${focusId}"]`) || nodes.board.querySelector(".tile.free");
      target?.focus({ preventScroll:true });
    });
  }
  function chooseTile(id) { const tile = state.tiles.find((item) => item.id === id); if (!tile || !isFree(tile)) return renderBattle(tile?.sealed && !state.keyUnlocked ? t("sealBlocked") : t("blocked"), id); if (!state.selected) { state.selected = tile; return renderBattle(t("choosePair"), id); } if (state.selected.id === tile.id) { state.selected = null; return renderBattle("", id); } if (state.selected.value !== tile.value) { state.selected = tile; return renderBattle(t("noMatch"), id); } const first = state.selected; first.removed = tile.removed = true; if (first.key && tile.key) state.keyUnlocked = true; if (first.rescue && tile.rescue) state.rescuedPairs += 1; state.selected = null; state.moves += 1; state.removedPairs += 1; state.hinted = []; syncTrailPhase(true); state.history.push({ ids:[first.id, tile.id], keyUnlocked:state.keyUnlocked, rescuedPairs:state.rescuedPairs, trailPhase:state.trailPhase }); save.bestPairs = Math.max(save.bestPairs, state.removedPairs); persist(); if (state.removedPairs === state.totalPairs) return finishStage(); renderBattle(availablePairs().length ? t("matched") : t("noMoves"), state.tiles.find(isFree)?.id); }
  function hint() { const pair = availablePairs()[0]; if (!pair) return renderBattle(t("noMoves")); state.hinted = pair.map((tile) => tile.id); renderBattle(t("hintText"), pair[0].id); }
  function undo() { const entry = state.history.pop(); if (!entry) return renderBattle(t("noUndo")); const previous = state.history.at(-1); entry.ids.forEach((id) => { state.tiles.find((tile) => tile.id === id).removed = false; }); state.keyUnlocked = previous?.keyUnlocked ?? !usesSeal(habitats[stageIndex]); state.rescuedPairs = previous?.rescuedPairs ?? 0; state.trailPhase = previous?.trailPhase ?? state.initialTrailPhase; syncTrailPhase(); state.removedPairs -= 1; state.moves = Math.max(0, state.moves - 1); state.selected = null; renderBattle("", entry.ids[0]); }
  function shuffle() { const visible = state.tiles.filter((tile) => !tile.removed); const movable = visible.filter((tile) => state.keyUnlocked || (!tile.key && !tile.sealed)); const tokens = movable.map((tile) => ({ value:tile.value, rescue:tile.rescue, key:tile.key })).sort(() => Math.random() - .5); movable.forEach((tile, index) => Object.assign(tile, tokens[index])); syncTrailPhase(); let free = visible.filter(isFree); if (!availablePairs().length && free.length > 1) { const first = free[0], second = free[1], firstMate = visible.find((tile) => tile.id !== first.id && tile.value === first.value); if (firstMate) { const secondToken={ value:second.value, rescue:second.rescue, key:second.key }; const mateToken={ value:firstMate.value, rescue:firstMate.rescue, key:firstMate.key }; Object.assign(second, mateToken); Object.assign(firstMate, secondToken); } } state.selected = null; state.moves += 1; renderBattle(t("matched"), state.tiles.find(isFree)?.id); }
  function formatTime(totalSeconds) { const seconds = Math.max(0, Math.floor(totalSeconds)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }
  function finishStage() {
    const seconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
    const score = Math.max(0, state.totalPairs * 100 - Math.max(0, state.moves - state.totalPairs) * 25 - seconds);
    const key = String(stageIndex);
    const previous = save.bestByStage?.[key];
    const record = {
      score: previous ? Math.max(previous.score || 0, score) : score,
      moves: previous ? Math.min(previous.moves, state.moves) : state.moves,
      seconds: previous ? Math.min(previous.seconds, seconds) : seconds,
    };
    const improved = !previous || record.score > (previous.score || 0) || record.moves < previous.moves || record.seconds < previous.seconds;
    save.bestByStage = { ...(save.bestByStage || {}), [key]:record };
    save.unlocked = Math.max(save.unlocked, Math.min(habitats.length, stageIndex + 2));
    persist();
    nodes.resultTitle.textContent = stageLabel(habitats[stageIndex]);
    nodes.resultStats.textContent = t("resultStats", { score, moves:state.moves, time:formatTime(seconds) });
    nodes.resultBest.textContent = t(improved ? "newBest" : "personalBest", { score:record.score, moves:record.moves, time:formatTime(record.seconds) });
    nodes.resultBest.classList.toggle("new-best", improved);
    nodes.resultReport.textContent = t("result", { pairs:state.removedPairs, moves:state.moves });
    nodes.nextBtn.classList.toggle("hidden", stageIndex >= habitats.length - 1);
    setScreen("result");
    requestAnimationFrame(() => (nodes.nextBtn.classList.contains("hidden") ? nodes.retryBtn : nodes.nextBtn).focus({ preventScroll:true }));
  }
  function openStageFromMain() {
    nodes.loadingScreen.classList.remove("hidden");
    nodes.startBtn.disabled = true;
    window.setTimeout(() => {
      stageIndex = Math.max(0, Math.min(habitats.length, save.unlocked) - 1);
      setScreen("stage");
      renderStage();
      nodes.loadingScreen.classList.add("hidden");
      nodes.startBtn.disabled = false;
      focusCurrentStage();
    }, 220);
  }
  const rejectRepeatedActivation = (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
  };
  const focusCurrentStage = () => requestAnimationFrame(() => nodes.stageRail.querySelector(`.stage-card[data-index="${stageIndex}"]`)?.focus({ preventScroll:true }));
  nodes.localeSelect.addEventListener("change", (event) => { const requested = event.target.value; window.WonderI18n?.setLocale?.(requested); locale = window.WonderI18n?.locale?.() || requested; localStorage.setItem("weightPlayLocale", requested); applyLocale(); });
  nodes.startBtn.addEventListener("keydown", rejectRepeatedActivation);
  nodes.stageRail.addEventListener("keydown", (event) => { if (event.target.closest(".stage-card")) rejectRepeatedActivation(event); });
  nodes.startBtn.addEventListener("click", openStageFromMain);
  document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => {
    const target = button.dataset.back;
    if (target === "stage") renderStage();
    setScreen(target);
    if (target === "stage") focusCurrentStage();
    if (target === "main") requestAnimationFrame(() => nodes.startBtn.focus({ preventScroll:true }));
  }));
  const stageCardAtPoint = (x, y) => [...nodes.stageRail.querySelectorAll(".stage-card")].find((card) => { const rect = card.getBoundingClientRect(); return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom; });
  nodes.stageRail.addEventListener("wonder:stage-snap", (event) => syncStageSelection(Number(event.detail?.index)));
  nodes.stageRail.addEventListener("click", (event) => { const card = event.target.closest?.(".stage-card") || stageCardAtPoint(event.clientX, event.clientY); if (!card) return; const index = Number(card.dataset.index); if (index < save.unlocked) startStage(index); else rejectLockedStage(index); });
  nodes.board.addEventListener("click", (event) => { const tile = event.target.closest(".tile"); if (tile) chooseTile(Number(tile.dataset.tile)); }); nodes.hintBtn.addEventListener("click", hint); nodes.undoBtn.addEventListener("keydown", (event) => { if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault(); }); nodes.undoBtn.addEventListener("click", undo); nodes.shuffleBtn.addEventListener("click", shuffle); nodes.retryBtn.addEventListener("click", () => startStage(stageIndex)); nodes.nextBtn.addEventListener("click", () => startStage(Math.min(habitats.length - 1, stageIndex + 1))); nodes.stagesBtn.addEventListener("click", () => { stageIndex = Math.max(0, Math.min(habitats.length, save.unlocked) - 1); setScreen("stage"); renderStage(); focusCurrentStage(); });
  window.addEventListener("pagehide", suspendBattleClock);
  window.addEventListener("pageshow", resumeBattleClock);
  document.addEventListener("visibilitychange", () => { if (document.hidden) suspendBattleClock(); else resumeBattleClock(); });
  if (new URLSearchParams(location.search).has("smoke")) {
    window.__ANIMAL_HABITAT_MAHJONG_TEST__ = {
      definitions: () => habitats.map((habitat, index) => ({ stage:index + 1, bg:habitat.bg, template:habitat.template, rule:habitat.rule, checkpoint:habitat.checkpoint, noMove:habitat.noMove, pairCount:layouts[habitat.template].length, sealedPairs:[...(habitat.sealedPairs || [])], rescuePairs:[...(habitat.rescuePairs || [])] })),
      restoreSave: (snapshot = {}) => { save = { unlocked:1, bestPairs:0, playCount:0, bestByStage:{}, ...snapshot }; persist(); renderMain(); renderStage(); return structuredClone(save); },
      readSave: () => structuredClone(save),
      startStage: (number) => { startStage(Math.max(0, Math.min(habitats.length - 1, Number(number) - 1))); return window.__ANIMAL_HABITAT_MAHJONG_TEST__.state(); },
      state: () => state ? { stage:stageIndex + 1, rule:habitats[stageIndex].rule, tileCount:state.tiles.filter((tile) => !tile.removed).length, totalPairs:state.totalPairs, removedPairs:state.removedPairs, moves:state.moves, keyUnlocked:state.keyUnlocked, rescuedPairs:state.rescuedPairs, rescueTotal:state.rescueTotal, trailPhase:state.trailPhase, physicalPairCount:physicalPairs().length, freeIds:state.tiles.filter(isFree).map((tile) => tile.id), availablePairs:availablePairs().map((pair) => pair.slice(0,2).map((tile) => tile.id)), resultVisible:!nodes.resultScreen.classList.contains("hidden") } : null,
      choosePair: (ids) => { (ids || []).slice(0,2).forEach((id) => chooseTile(Number(id))); return window.__ANIMAL_HABITAT_MAHJONG_TEST__.state(); },
      shuffle: () => { shuffle(); return window.__ANIMAL_HABITAT_MAHJONG_TEST__.state(); }
    };
  }
  window.addEventListener("resize", fitCanvases, { passive:true }); window.visualViewport?.addEventListener("resize", fitCanvases, { passive:true }); applyLocale(); renderMain(); fitCanvases();
})();
