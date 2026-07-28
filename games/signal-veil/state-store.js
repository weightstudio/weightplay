(function () {
  "use strict";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null") || {}; }
    catch { return {}; }
  }

  function load(key,fresh,validMaps) {
    const saved=read(key);
    const state=Object.assign({},fresh,saved);
    state.talked=new Set(saved.talked||[]);
    state.defeated=new Set(saved.defeated||[]);
    state.chests=new Set(saved.chests||[]);
    state.relays=new Set(saved.relays||[]);
    state.equipment=Object.assign({},fresh.equipment,saved.equipment||{});
    state.equipped=Object.assign({},fresh.equipped,saved.equipped||saved.equipment||{});
    state.enemyHp=Object.assign({},saved.enemyHp||{});
    state.discoveries=Object.assign({},fresh.discoveries,saved.discoveries||{});
    state.checkpoint=Object.assign({},fresh.checkpoint,saved.checkpoint||{});
    if(!validMaps.includes(state.mapId))state.mapId=fresh.mapId;
    if(!validMaps.includes(state.checkpoint.mapId))state.checkpoint.mapId=fresh.checkpoint.mapId;
    return state;
  }

  function serialize(state,trueVision) {
    return {
      ...state,
      trueVision,
      talked:[...state.talked],
      defeated:[...state.defeated],
      chests:[...state.chests],
      relays:[...state.relays],
    };
  }

  function save(key,state,trueVision) {
    try { localStorage.setItem(key,JSON.stringify(serialize(state,trueVision))); }
    catch {}
  }

  function clear(key) {
    try { localStorage.removeItem(key); }
    catch {}
  }

  window.SignalVeilStateStore=Object.freeze({load,serialize,save,clear});
})();
