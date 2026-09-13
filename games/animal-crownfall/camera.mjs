// Camera bounds are independent of gameplay and authored map dimensions.
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function frameSize(aspect,columns,rows,overview=false){
 const height=overview?Math.max(rows+2.5,(columns+2.3)/aspect):Math.min(7.8,8.4/aspect);
 return {width:height*aspect,height};
}
export function boundView(x,y,width,height,columns,rows){
 const left=-1.15,right=columns+.15,top=1.65,bottom=-rows+.1;
 return {x:width>=right-left?(columns-1)/2:clamp(x,left+width/2,right-width/2),
 y:height>=top-bottom?(top+bottom)/2:clamp(y,bottom+height/2,top-height/2),width,height};
}
// Short landscape windows need head/tag room before downward look-ahead.
export const followView=(hero,width,height,columns,rows)=>boundView(hero.x,hero.y-Math.min(1.35,Math.max(0,height/2-1.4)),width,height,columns,rows);
