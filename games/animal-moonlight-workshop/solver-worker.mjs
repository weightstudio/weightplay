import {solve} from './rules.mjs';
self.onmessage=({data})=>{try{self.postMessage({requestId:data.requestId,route:solve(data.state,data.profile)});}catch(error){self.postMessage({requestId:data.requestId,error:String(error.message)});}};
