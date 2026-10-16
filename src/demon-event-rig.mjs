// Independently authored Pixi rig. No Spine runtime, skeleton JSON or animation imports.
export const duration=10;
export const bones=[
 ['root',null,384,618],['pelvis','root',0,-120],['spine','pelvis',0,-70],['chest','spine',0,-80],['neck','chest',0,-90],['head','neck',4,-25],['eyes','head',13,26],['hornL','head',-65,-65],['hornR','head',65,-65],
 ['shoulderL','chest',-105,-45],['upperL','shoulderL',-25,32],['elbowL','upperL',-28,75],['wristL','elbowL',-45,65],['clawL','wristL',0,40],
 ['shoulderR','chest',105,-45],['upperR','shoulderR',25,32],['elbowR','upperR',28,75],['wristR','elbowR',45,65],['clawR','wristR',0,40]
];
// Fresh 10-second animation curves, locally interpolated with smooth Hermite easing.
const track=(bone,property,values)=>({bone,property,keys:values});
export const channels=[
 track('spine','y',[[0,0],[1.8,-4],[2.6,-5],[4.9,0],[6.6,-3.8],[7.4,-4.8],[10,0]]),
 track('chest','sx',[[0,1],[1.8,1.013],[2.6,1.02],[4.9,1],[6.7,1.014],[7.4,1.019],[10,1]]),
 track('chest','sy',[[0,1],[1.8,1.022],[2.6,1.035],[4.9,1],[6.7,1.025],[7.4,1.032],[10,1]]),
 track('neck','r',[[0,0],[2,-.012],[4.6,.008],[7.2,.018],[10,0]]),track('head','r',[[0,0],[2.2,-.035],[4.8,-.008],[7,.04],[8.7,.017],[10,0]]),
 track('hornL','r',[[0,0],[2.7,-.025],[5,.014],[7.5,.023],[10,0]]),track('hornR','r',[[0,0],[2.8,.02],[5,-.01],[7.7,-.025],[10,0]]),
 track('shoulderL','r',[[0,0],[2,-.025],[4.7,.008],[6.8,-.032],[10,0]]),track('upperL','r',[[0,0],[2.7,.037],[4.7,.01],[7.8,-.04],[10,0]]),
 track('elbowL','r',[[0,0],[2.4,-.067],[5,.015],[7.4,.055],[10,0]]),track('wristL','r',[[0,0],[2.9,.035],[5,-.012],[7.8,-.04],[10,0]]),track('clawL','r',[[0,0],[2.9,.075],[4.6,-.018],[7.8,.06],[10,0]]),
 track('shoulderR','r',[[0,0],[2.1,.028],[5,-.012],[7.3,.022],[10,0]]),track('upperR','r',[[0,0],[2.8,-.04],[5,.014],[8,.036],[10,0]]),
 track('elbowR','r',[[0,0],[2.5,.062],[5,-.012],[7.5,-.052],[10,0]]),track('wristR','r',[[0,0],[3,-.03],[5,.01],[8,.04],[10,0]]),track('clawR','r',[[0,0],[3,-.065],[4.8,.012],[8,-.072],[10,0]])
];
// Only original separate art regions; half/closed eye images are NEVER used.
export const parts=[
 {name:'back-upper',bone:'upperR',cell:7,w:135,h:185,y:30,kind:'arm',joint:'elbowR',nx:9,ny:13},
 {name:'back-hand',bone:'wristR',cell:9,w:175,h:220,x:10,y:-7,kind:'claw',joint:'clawR',nx:11,ny:13},
 {name:'abdomen',bone:'pelvis',cell:2,w:210,h:175,kind:'body',nx:9,ny:9},
 {name:'chest',bone:'chest',cell:1,w:310,h:270,y:5,kind:'chest',nx:13,ny:13},
 {name:'core',bone:'chest',cell:3,w:230,h:210,y:6,kind:'chest',nx:9,ny:9,alpha:.13,add:true},
 {name:'neck',bone:'neck',cell:15,w:110,h:110,y:10,kind:'body',nx:7,ny:7},
 {name:'shoulder-back',bone:'shoulderR',cell:11,w:155,h:145,kind:'body',nx:9,ny:9},
 {name:'shoulder-front',bone:'shoulderL',cell:10,w:175,h:160,x:-4,y:4,kind:'body',nx:9,ny:9},
 {name:'front-upper',bone:'upperL',cell:6,w:155,h:190,y:22,kind:'arm',joint:'elbowL',nx:9,ny:13},
 {name:'front-fist',bone:'wristL',cell:8,w:275,h:275,x:-8,y:-10,kind:'claw',joint:'clawL',nx:13,ny:13},
 {name:'horn-back',bone:'hornR',cell:5,w:115,h:190,x:8,y:-48,kind:'horn',joint:'hornR',nx:9,ny:13},
 {name:'face',bone:'head',cell:0,w:240,h:240,y:5,kind:'head',nx:9,ny:9},
 {name:'horn-front',bone:'hornL',cell:4,w:115,h:190,x:-8,y:-48,kind:'horn',joint:'hornL',nx:9,ny:13},
 {name:'eyes-open-only',bone:'eyes',cell:12,w:165,h:120,kind:'eyes',nx:5,ny:3}
];
export function interpolate(keys,t){let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;const [a,av]=keys[i],[b,bv]=keys[i+1];const u=Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=u*u*(3-2*u);return av+(bv-av)*smooth;}
