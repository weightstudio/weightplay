import { gear } from './campaign.js';
export const SAVE_KEY='pawaxeSaveV2';
export const STARTER=['trail-axe','trail-hood','scout-vest','trail-gloves','trail-boots','nut-charm','copper-ring'];
const finite=(v,fallback=0)=>typeof v==='number'&&Number.isFinite(v)?v:fallback;
export function normalizeSave(raw={}){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};
  const cleared=[...new Set((Array.isArray(raw.cleared)?raw.cleared:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=30))];
  const unlocked=Math.min(30,Math.max(1,Math.floor(finite(raw.unlocked,1)),...cleared.map(n=>n+1)));
  const loadout=STARTER.map(id=>{
    const slot=gear.find(g=>g.id===id).slot;
    return (Array.isArray(raw.loadout)?raw.loadout:[]).find(x=>gear.some(g=>g.id===x&&g.slot===slot&&(!g.unlock||cleared.includes(g.unlock))))||id;
  });
  const upgrades=Object.fromEntries(['axe','head','body','hands','feet','charm','ring'].map(s=>[s,Math.max(0,Math.min(3,Math.floor(finite(raw.upgrades?.[s]))))]));
  return {unlocked,cleared,loadout,upgrades,coins:Math.max(0,Math.min(999999,Math.floor(finite(raw.coins)))),mode:raw.mode==='guard'?'guard':'break',locale:typeof raw.locale==='string'?raw.locale:'zh-Hant',tutorial:raw.tutorial===true,bests:raw.bests&&typeof raw.bests==='object'?raw.bests:{}};
}
export function loadSave(){try{return normalizeSave(JSON.parse(localStorage.getItem(SAVE_KEY)||'{}'));}catch{return normalizeSave();}}
export function storeSave(save){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));return true;}catch{return false;}}
