((root)=>{
  "use strict";
  const colors=["cyan","magenta","amber","violet","lime","coral","blue","rose","gold"];
  function snake(size,vertical=false){
    const out=[];
    for(let major=0;major<size;major++)for(let minor=0;minor<size;minor++){
      const step=major%2?size-1-minor:minor;
      out.push(vertical?step*size+major:major*size+step);
    }
    return out;
  }
  function spiral(size){
    const out=[];let top=0,left=0,bottom=size-1,right=size-1;
    while(top<=bottom&&left<=right){
      for(let c=left;c<=right;c++)out.push(top*size+c);top++;
      for(let r=top;r<=bottom;r++)out.push(r*size+right);right--;
      if(top<=bottom){for(let c=right;c>=left;c--)out.push(bottom*size+c);bottom--}
      if(left<=right){for(let r=bottom;r>=top;r--)out.push(r*size+left);left++}
    }
    return out;
  }
  function transform(path,size,kind){
    const map=(r,c)=>{
      if(kind===1)return[c,size-1-r];
      if(kind===2)return[size-1-r,size-1-c];
      if(kind===3)return[size-1-c,r];
      if(kind===4)return[r,size-1-c];
      if(kind===5)return[size-1-r,c];
      return[r,c];
    };
    return path.map(index=>{const [r,c]=[Math.floor(index/size),index%size];const [nr,nc]=map(r,c);return nr*size+nc});
  }
  function allocate(total,count,index){
    const lengths=Array(count).fill(Math.floor(total/count));
    for(let i=0;i<total%count;i++)lengths[(i*3+index)%count]++;
    for(let i=0;i<count;i++){
      if(lengths[i]<3){const donor=lengths.findIndex(value=>value>4);if(donor>=0){lengths[donor]--;lengths[i]++}}
    }
    return lengths;
  }
  function buildLevel(index){
    const size=index<8?7:index<17?8:index<25?9:10;
    const count=index<5?5:index<12?6:index<20?7:index<26?8:9;
    let route=index%4===3?spiral(size):snake(size,index%3===1);
    route=transform(route,size,index%6);
    if(index%2)route=route.slice().reverse();
    const lengths=allocate(route.length,count,index);
    const solution={},ends={},gates={};let cursor=0;
    lengths.forEach((length,color)=>{
      const part=route.slice(cursor,cursor+length);
      solution[color]=part;
      ends[color]=[part[0],part.at(-1)];
      if(index>=4&&part.length>=5){
        const gateCount=index>=19&&part.length>=9?2:1;
        for(let g=0;g<gateCount;g++){
          const offset=Math.max(1,Math.min(part.length-2,Math.floor((part.length-1)*(g+1)/(gateCount+1))));
          gates[part[offset]]=color;
        }
      }
      cursor+=length;
    });
    return{index,size,count,colors:colors.slice(0,count),solution,ends,gates,chapter:Math.floor(index/5)+1};
  }
  root.PRISM_GARDEN_LEVELS={levels:Array.from({length:30},(_,index)=>buildLevel(index)),buildLevel,colors};
  if(typeof module!=="undefined")module.exports=root.PRISM_GARDEN_LEVELS;
})(typeof window!=="undefined"?window:globalThis);
