import{searchHint as a,referenceHint as t}from"./hints.mjs";self.onmessage=({data:{level:s,state:e}})=>{try{self.postMessage({actions:t(s,e)||a(s,e)})}catch{self.postMessage({actions:null})}};
