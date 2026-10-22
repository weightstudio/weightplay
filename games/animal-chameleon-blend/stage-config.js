/* Game records only. Shared Play UI owns all card geometry and input. */
(() => {
  'use strict';
  window.ChameleonStageConfig=Object.freeze({
    create({count,stage}) {
      return {gameId:'animal-chameleon-blend',count,stage,
        poster:'/assets/interface7-redrawn/animal-chameleon-blend.webp',
        background:'/assets/lobby-block-atmosphere.svg'};
    },
  });
})();
