// Keep the bar over its actor while reserving enough room for its full width.
export function placeLabel(anchor,viewport){
 if(!viewport||!(viewport.width>0)||!(viewport.height>0))return {x:anchor.x,y:anchor.y};
 const margin=viewport.margin??4,width=viewport.width,height=viewport.height;
 const halfWidth=Math.min((viewport.labelWidth??76)/2,Math.max(0,(width-margin*2)/2));
 const minX=margin+halfWidth,maxX=width-margin-halfWidth;
 const minY=Math.min(height-margin,(viewport.labelHeight??38)+margin);
 return {x:Math.max(minX,Math.min(maxX,anchor.x)),y:Math.max(minY,Math.min(height-margin,anchor.y))};
}
