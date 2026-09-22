// Campaign progress and endless continuation share one authored encounter route.
export class Expedition {
  constructor(stage) {
    this.stage=stage; this.wave=0; this.cleared=0; this.completed=false;
    this.length=24+Math.floor((stage.id-1)/10)*8;
  }
  get progress(){return Math.min(1,this.cleared/this.length);}
  encounter(){
    const sets=this.stage.encounters;
    if(this.wave===this.length-1)return sets[3];
    const segment=Math.min(3,Math.floor(this.wave/(this.length/4)));
    const base=[...sets[this.wave>=this.length?(this.wave-this.length)%3:this.stage.checkpoint&&segment===3?2:segment]];
    const id=this.stage.id;
    if(id>=7&&this.wave%3===1)base[base.length-1]=id>=24?'siphon':id>=18?'brute':id>=12?'frostguard':'emberling';
    const density=id>=21?5:id>=11?4:3;
    if(id>=11){const extras=id>=21?['brute','siphon','emberling']:['frostguard','scout','emberling'];while(base.length<density)base.push(extras[(base.length+this.wave)%extras.length]);}
    return base;
  }
  clear(){
    this.cleared++; const reached=!this.completed&&this.cleared>=this.length;
    if(reached)this.completed=true;
    return reached;
  }
  advance(){this.wave++;}
}
