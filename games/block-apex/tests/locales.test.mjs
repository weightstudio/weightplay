import assert from 'node:assert/strict';
import test from 'node:test';
import {detectLocale} from '../locales.mjs';

test('locale comes from the route or saved preference, never a query parameter',()=>{
  const previous=new Map(['location','localStorage','document'].map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  const define=(name,value)=>Object.defineProperty(globalThis,name,{configurable:true,value});
  try{
    define('location',{pathname:'/zh-tw/games/block-apex/',search:'?lang=de'});
    define('localStorage',{getItem:()=> 'ja'});
    define('document',{documentElement:{lang:'en'}});
    assert.equal(detectLocale(),'zh-Hant');

    location.pathname='/games/block-apex/';
    assert.equal(detectLocale(),'ja');

    localStorage.getItem=()=>null;
    assert.equal(detectLocale(),'en');
  }finally{
    for(const [name,descriptor]of previous){
      if(descriptor)Object.defineProperty(globalThis,name,descriptor);
      else delete globalThis[name];
    }
  }
});
