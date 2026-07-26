((root)=>{
  "use strict";
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
    const point=i=>[Math.floor(i/size),i%size];
    const map=([r,c])=>{
      if(kind===1)return[c,size-1-r];
      if(kind===2)return[size-1-r,size-1-c];
      if(kind===3)return[size-1-c,r];
      if(kind===4)return[r,size-1-c];
      if(kind===5)return[size-1-r,c];
      return[r,c];
    };
    return path.map(i=>{const[r,c]=map(point(i));return r*size+c});
  }
  function buildLevel(index){
    const size=index<10?5:index<20?6:7;
    const count=index<10?4:index<20?5:6;
    const base=index%3===2?spiral(size):snake(size,index%3===1);
    let route=transform(base,size,index%6);
    if(index%2)route=route.slice().reverse();
    const lengths=Array(count).fill(Math.floor(route.length/count));
    for(let i=0;i<route.length%count;i++)lengths[(i*2+index)%count]++;
    if(index%4===3&&lengths[0]>3){lengths[0]--;lengths[count-1]++}
    const solution={},ends={};let cursor=0;
    lengths.forEach((length,color)=>{
      solution[color]=route.slice(cursor,cursor+length);
      ends[color]=[solution[color][0],solution[color].at(-1)];
      cursor+=length;
    });
    return{index,size,count,solution,ends};
  }
  const api={levels:Array.from({length:30},(_,i)=>buildLevel(i)),buildLevel};
  root.COLOR_LINK_LEVELS=api;
  if(typeof module!=="undefined")module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
