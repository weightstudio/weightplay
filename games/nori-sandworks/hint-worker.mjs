import {searchHint,referenceHint} from './hints.mjs';
self.onmessage=({data:{level,state}})=>{try{self.postMessage({actions:referenceHint(level,state)||searchHint(level,state)});}catch{self.postMessage({actions:null});}};
