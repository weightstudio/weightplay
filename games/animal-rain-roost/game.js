// Keep a finite shared-loader failure path even if an ES-module dependency fails.
import('./main.mjs?v=6').catch(error=>{
  console.error('Rain Roost initialization failed',error);
  window.__weightPlayGameEntryPendingFailure='animal-rain-roost';
  window.WeightPlayGameEntryLoader?.fail(undefined,()=>location.reload());
});
