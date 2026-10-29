import('./game.mjs?v=3').catch(error=>{console.error('Bramble Rapids bootstrap',error);window.WeightPlayGameEntryLoader?.fail?.(error.message,()=>location.reload());});
