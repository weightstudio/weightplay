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
    if(this.wave>=this.length)return sets[(this.wave-this.length)%3];
    const segment=Math.min(3,Math.floor(this.wave/(this.length/4)));
    return sets[this.stage.checkpoint&&segment===3?2:segment];
  }
  clear(){
    this.cleared++; const reached=!this.completed&&this.cleared>=this.length;
    if(reached)this.completed=true;
    return reached;
  }
  advance(){this.wave++;}
}
